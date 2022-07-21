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
 * @typedef {import('./cc-orga-member-list.types.js').Member} Member
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
      emailField: { type: String, attribute: 'email-field' },
      inviteErrorMessage: { type: String, attribute: 'invite-error-message' },
      memberList: { type: Array, attribute: 'member-list' },
      memberInEditing: { type: Boolean, attribute: false },
      roleField: { type: String, attribute: 'role-field' },
      stateMemberInvite: { type: String },
      stateMemberList: { type: String },
      _filterIdentity: { type: String, attribute: false },
      _showDisabledTfaOnly: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {string} Sets the `cc-input-text` value. */
    this.emailField = '';

    /** @type {string} Sets the error message below the email address field */
    this.inviteErrorMessage = '';

    /* TODO rename this prop */
    /** @type {string} Sets the card of the member being edited in edit mode */
    this.memberInEditing = '';

    /** @type {Member[]} Sets the list of members. This list may be filtered with user criteria. */
    this.memberList = [];

    /** @type {string} Sets the `cc-select` value. */
    this.roleField = DEFAULT_ROLE;

    /** @type {StateMemberInvite} Sets the state of the member invite form. */
    this.stateMemberInvite = 'loaded';

    /** @type {StateMemberList} Sets the state of the member list. */
    this.stateMemberList = 'loading';

    /** @type {string} Sets the name/email criterion to filter the member list. */
    this._filterIdentity = '';

    /** @type {boolean} Toggles the filter to display only members with disabled TFA or all members. */
    this._showDisabledTfaOnly = false;
  }

  _getRoles () {
    return [
      {
        label: i18n('cc-orga-member-list.invite-role-admin'),
        value: 'ADMIN',
      },
      {
        label: i18n('cc-orga-member-list.invite-role-developer'),
        value: 'DEVELOPER',
      },
      {
        label: i18n('cc-orga-member-list.invite-role-accounting'),
        value: 'ACCOUNTING',
      },
      {
        label: i18n('cc-orga-member-list.invite-role-manager'),
        value: 'MANAGER',
      },
    ];
  }

  _onEmailInput ({ detail: value }) {
    this.emailField = value;
  }

  _onRoleInput ({ detail: value }) {
    this.roleField = value;
  }

  _onSubmit () {
    dispatchCustomEvent(this, 'invite', {
      email: this.emailField,
      role: this.roleField,
    });
  }

  _getFilteredMemberList () {
    const filteredMemberList = this.memberList.filter((member) => {

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

  _toggleCardEditing ({ detail: cardInfo }) {
    this.memberInEditing = cardInfo.isEditing ? cardInfo.memberId : null;
  }

  resetInviteForm () {
    this.emailField = '';
    this.roleField = DEFAULT_ROLE;
    this.inviteErrrorMessage = '';
  }

  render () {
    const containsAtLeast2Members = this.memberList.length >= 2;
    const containsDisabledTfa = this.memberList.some((member) => !member.mfa);
    const filteredMemberList = this._getFilteredMemberList();

    return html`
      <cc-block>
        <div slot="title">${i18n('cc-orga-member-list.invite-heading')}</div>
        <p class="info">${i18n('cc-orga-member-list.invite-info')}</p>
        <form class="invite-form">
          <cc-input-text
            ?disabled=${this.waiting}
            label=${i18n('cc-orga-member-list.invite-label-email')}
            required
            .value=${this.emailField}
            @cc-input-text:input=${this._onEmailInput}
            @cc-input-text:requestimplicitsubmit=${this._onSubmit}
          > 
            <p slot="help">${i18n('cc-orga-member-list.invite-format-email')}</p>
            ${this.inviteErrorMessage !== '' ? html`
              <p slot="error">${this.inviteErrorMessage}</p>
            ` : ''}
          </cc-input-text>
          <cc-select
            ?disabled=${this.waiting}
            label=${i18n('cc-orga-member-list.invite-label-role')}
            .options=${this._getRoles()}
            required
            .value=${this.roleField}
            @cc-select:input=${this._onRoleInput}
          >
          </cc-select>
          <div class="submit">
            <cc-button primary ?waiting=${this.stateMemberInvite === 'waiting'} @cc-button:click=${this._onSubmit}>
              ${i18n('cc-orga-member-list.invite-submit')}
            </cc-button>
          </div>
        </form>
      </cc-block>

      <cc-block>
        <div slot="title">
          ${i18n('cc-orga-member-list.heading')}
          ${this.stateMemberList === 'loaded' ? html`
            <cc-badge class="member-count" weight="dimmed" intent="neutral" circle>${this.memberList.length}</cc-badge>
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
            ${this.stateMemberList === 'loading' ? html`<cc-loader></cc-loader>` : ''}

            ${this.stateMemberList === 'error' ? html`<cc-error>${i18n('cc-orga-member-list.error')}</cc-error>` : ''}
            
            <!-- TODO check ifDefined, also, should this be a oneliner ? -->
            ${this.stateMemberList === 'loaded' ? repeat(filteredMemberList, (member) => member.id, (member) => html`
              <cc-orga-member-card
                id=${member.id}
                email=${member.email}
                job-title=${ifDefined(member.jobTitle ?? undefined)}
                name=${ifDefined(member.name ?? undefined)}
                avatar=${ifDefined(member.avatar ?? undefined)}
                role=${member.role}
                state=${member.state}
                error-message="${ifDefined(member.errorMessage ?? undefined)}"
                ?is-current-user=${member.isCurrentUser}
                ?is-last-admin=${member.isLastAdmin}
                ?is-editing=${member.id === this.memberInEditing}
                ?mfa=${member.mfa}
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
