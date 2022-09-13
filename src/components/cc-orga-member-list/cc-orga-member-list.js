import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';

import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';

import '../cc-block/cc-block.js';
import '../cc-orga-member-card/cc-orga-member-card.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-button/cc-button.js';
import '../cc-badge/cc-badge.js';
import '../cc-error/cc-error.js';
import '../cc-select/cc-select.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';

const DEFAULT_ROLE = 'DEVELOPER';
/**
 * @typedef {import('./cc-orga-member-list.types.js').StateMemberList} StateMemberList
 * @typedef {import('./cc-orga-member-list.types.js').StateMemberInvite} StateMemberInvite
 */

/**
 * A component displaying the list of members from an organisation.
 * The list can be filtered by name or email. One can also choose to display only users with Tfa disabled.
 *
 * @event {CustomEvent<InviteMemberPayload>} cc-orga-member-list:invite - Fires the `email` and `role` information inside an object whenever the invite button is clicked.
 *
 * @cssdisplay block
 */

export class CcOrgaMemberList extends LitElement {
  static get properties () {
    return {
      stateMemberInvite: { type: Object },
      stateMemberList: { type: Object },
      _filterIdentity: { type: String, attribute: false },
      _showDisabledTfaOnly: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {StateMemberInvite} Sets the state of the member invite form. */
    this.stateMemberInvite = {
      state: 'idle',
      email: {
        state: 'idle',
        value: '',
      },
      role: {
        state: 'idle',
        value: '',
      },
    };

    /** @type {StateMemberList} Sets the state of the member list. */
    this.stateMemberList = { state: 'loading' };

    /** @type {string} Sets the name/email criterion to filter the member list. */
    this._filterIdentity = '';

    /** @type {boolean} Toggles the filter to display only members with disabled TFA or all members. */
    this._showDisabledTfaOnly = false;
  }

  _getRoles () {
    return [
      {
        label: i18n('cc-orga-member-list.invite.role-admin'),
        value: 'ADMIN',
      },
      {
        label: i18n('cc-orga-member-list.invite.role-developer'),
        value: 'DEVELOPER',
      },
      {
        label: i18n('cc-orga-member-list.invite.role-accounting'),
        value: 'ACCOUNTING',
      },
      {
        label: i18n('cc-orga-member-list.invite.role-manager'),
        value: 'MANAGER',
      },
    ];
  }

  _onEmailInput ({ detail: value }) {
    this.stateMemberInvite.email.value = value;
  }

  _onRoleInput ({ detail: value }) {
    this.stateMemberInvite.role.value = value;
  }

  _onSubmit () {
    dispatchCustomEvent(this, 'invite', {
      email: this.stateMemberInvite.email.value,
      role: this.stateMemberInvite.role.value,
    });
  }

  _getFilteredMemberList () {
    if (this.stateMemberList.state !== 'loaded') {
      return;
    }

    const filteredMemberList = this.stateMemberList.value.filter(({ value: member }) => {

      const matchIdentity = this._filterIdentity === ''
        || member.name?.toLowerCase().includes(this._filterIdentity)
        || member.email.toLowerCase().includes(this._filterIdentity);

      const matchTfaDisabled = !this._showDisabledTfaOnly || !member.mfa;

      return matchIdentity && matchTfaDisabled;
    });

    return filteredMemberList;
  }

  _onFilterIdentity ({ detail: value }) {
    this._filterIdentity = value?.trim().toLowerCase();
  }

  _onFilterTfa () {
    this._showDisabledTfaOnly = !this._showDisabledTfaOnly;
  }

  _toggleCardEditing ({ detail: { memberId, isEditing } }) {
    this.stateMemberList = isEditing
      ? {
          ...this.stateMemberList,
          memberInEditing: memberId,
        }
      : {
          ...this.stateMemberList,
          memberInEditing: null,
        };
  }

  _getEmailErrorType () {
    switch (this.stateMemberInvite.email.errorType) {
      case 'empty':
        return i18n('cc-orga-member-list.invite.email-error-empty');
      case 'format':
        return i18n('cc-orga-member-list.invite.email-error-format');
      case 'duplicate':
        return i18n('cc-orga-member-list.invite.email-error-duplicate');
    }
  }

  resetInviteForm () {
    this.stateMemberInvite.email.value = '';
    this.stateMemberInvite.role.value = DEFAULT_ROLE;
    this.inviteErrrorMessage = '';
  }

  render () {
    /* TODO since stateMemberList has no value when loading, these break unless we use conditional chaining */
    const containsAtLeast2Members = this.stateMemberList?.value?.length >= 2;
    const containsDisabledTfa = this.stateMemberList?.value?.some(({ member }) => !member.value.mfa);
    const filteredMemberList = this._getFilteredMemberList();
    return html`
      <cc-block>
        <div slot="title">${i18n('cc-orga-member-list.invite.heading')}</div>
        <p class="info">${i18n('cc-orga-member-list.invite.info')}</p>
        <form class="invite-form">
          <cc-input-text
            ?disabled=${this.stateMemberInvite.state === 'waiting'}
            label=${i18n('cc-orga-member-list.invite.email-label')}
            required
            .value=${this.stateMemberInvite.email.value}
            @cc-input-text:input=${this._onEmailInput}
            @cc-input-text:requestimplicitsubmit=${this._onSubmit}
          > 
            <p slot="help">${i18n('cc-orga-member-list.invite.email-format')}</p>
            ${this.stateMemberInvite.email.state === 'error' ? html`
              <p slot="error">${this._getEmailErrorType()}</p>
            ` : ''}
          </cc-input-text>
          <cc-select
            ?disabled=${this.stateMemberInvite.state === 'waiting'}
            label=${i18n('cc-orga-member-list.invite.role-label')}
            .options=${this._getRoles()}
            required
            .value=${this.stateMemberInvite.role.value}
            @cc-select:input=${this._onRoleInput}
          >
            ${this.stateMemberInvite.role.state === 'error' ? html`
              <p slot="error">${i18n('cc-orga-member-list.invite.role-error-empty')}</p>
            ` : ''}
          </cc-select>
          <div class="submit">
            <cc-button primary ?waiting=${this.stateMemberInvite.state === 'waiting'} @cc-button:click=${this._onSubmit}>
              ${i18n('cc-orga-member-list.invite.submit')}
            </cc-button>
          </div>
        </form>
      </cc-block>

      <cc-block>
        <div slot="title">
          ${i18n('cc-orga-member-list.heading')}
          ${this.stateMemberList.state === 'loaded' ? html`
            <cc-badge class="member-count" weight="dimmed" intent="neutral" circle>${this.stateMemberList.value.length}</cc-badge>
          ` : ''}
        </div>
          ${containsAtLeast2Members ? html`
            <div class="filters">
              <cc-input-text
                label=${i18n('cc-orga-member-list.filter-name')}
                @cc-input-text:input=${this._onFilterIdentity}
              ></cc-input-text>
              ${containsDisabledTfa ? html`<label class="filters__mfa" for="filter-mfa">
                <input id="filter-mfa" type="checkbox" @change=${this._onFilterTfa} .checked=${this._showDisabledTfaOnly}>
                ${i18n('cc-orga-member-list.mfa-label')}
              </label>` : ''}
            </div>
          ` : ''}
          <div class="member-list">
            ${this.stateMemberList.state === 'loading' ? html`<cc-loader></cc-loader>` : ''}

            ${this.stateMemberList.state === 'error' ? html`<cc-error>${i18n('cc-orga-member-list.error')}</cc-error>` : ''}
              
            ${this.stateMemberList.state === 'loaded' ? repeat(filteredMemberList, ({ member }) => member.value.id, ({ isEditing, errorMessage, member }) => html`
              <cc-orga-member-card
                .member=${member}
                error-message="${ifDefined(errorMessage ?? undefined)}"
                ?is-editing=${member.value.id === this.stateMemberList.memberInEditing}
                @cc-orga-member-card:update-editing=${this._toggleCardEditing}
              ></cc-orga-member-card>
            `) : ''}
          </div>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      linkStyles,
      // language=CSS
      css`
        :host {
          display: flex;
          flex-direction: column;
          gap: 2em;
        }
        
        .member-count {
          font-size: 0.8em;
          margin-left: 0.2em;
          padding: 0.1em;
        }

        /*region invite form */
        .invite-form {
          align-items: flex-start;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .field-group {
          display: flex;
          flex-flow: row wrap;
          gap: 1em;
          margin-bottom: 1em;
        }

        .info {
          font-style: italic;
          margin: 0.5em 0;
        }

        .invite-form cc-input-text {
          flex: 100 1 18em;
        }

        .invite-form cc-select {
          flex: 1 1 max-content;
        }

        .submit {
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }
        
        .filters__mfa {
          align-items: center;
          display: flex;
          gap: 0.3em;
        }
        
        .filters__mfa input {
          height: 0.9em;
          width: 0.9em;
        }
        /*endregion */

        /*region member list  */
        cc-badge {
          font-size: 0.7em;
          vertical-align: middle;
        }

        .member-list {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        .filters cc-input-text {
          width: min(100%, 25em);
        }
        
        .filters {
            align-items: end;
            display: flex;
            flex-wrap: wrap;
            gap: 1em 0.5em;
            justify-content: space-between;
            margin-bottom: 0.25em;
            position: relative;
        }
        
        label input {
          margin: 0;
        }

        cc-orga-member-card[is-editing] {
          background-color: var(--cc-color-bg-neutral);
          box-shadow: 0px 0px 0px 1em var(--cc-color-bg-neutral);
        }
        
        .error {
            align-items: center;
            display: flex;
            gap: 1em;
            justify-content: center;
        }
        
        .error img {
            height: 1.5em;
            width: 1.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-orga-member-list', CcOrgaMemberList);
