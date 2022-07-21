import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { withResizeObserver } from '../../mixins/with-resize-observer/with-resize-observer.js';

import '../cc-button/cc-button.js';
import '../cc-img/cc-img.js';
import '../cc-badge/cc-badge.js';
import '../cc-select/cc-select.js';

const tickSvg = new URL('../../assets/tick.svg', import.meta.url).href;
const tickBlueSvg = new URL('../../assets/tick-blue.svg', import.meta.url).href;
const closeSvg = new URL('../../assets/delete-neutral.svg', import.meta.url).href;
const trashSvg = new URL('../../assets/trash-red.svg', import.meta.url).href;
const errorSvg = new URL('../../assets/error.svg', import.meta.url).href;
const penSvg = new URL('../../assets/pen.svg', import.meta.url).href;
const profileSvg = new URL('../../assets/profile.svg', import.meta.url).href;

const BREAKPOINT_MEDIUM = 740;
const BREAKPOINT_SMALL = 580;
const BREAKPOINT_TINY = 350;

/**
 * @typedef {import('./cc-orga-member-card.js').MemberCardState} MemberCardState
 * @typedef {import('./cc-orga-member-card.js').EditMemberPayload} EditMemberPayload
 */

/**
 * A component displaying information about a member from a given organisation.
 * This component also provides a way to edit the role of the member.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<EditMemberPayload>} cc-orga-member-card:edit - Fires the `id` of the member and the new `role` to be updated.
 * @event {CustomEvent<string>} cc-orga-member-card:remove - Fires the `id` of the member to be removed from the org.
 * @event {CustomEvent} cc-orga-member-card:update-editing - Fires the `id` of the member related to the card and `isEditing` boolean to specify when card is in edit mode or not. This allows the list component to close
 * all other cards in edit mode to leave only one pending edition at once.
 *
 */
export class CcOrgaMemberCard extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      avatar: { type: String },
      email: { type: String },
      errorMessage: { type: String, attribute: 'error-message' },
      id: { type: String },
      isEditing: { type: Boolean, reflect: true, attribute: 'is-editing' },
      isCurrentUser: { type: Boolean, attribute: 'is-current-user' },
      isLastAdmin: { type: Boolean, attribute: 'is-last-admin' },
      jobTitle: { type: String, attribute: 'job-title' },
      mfa: { type: Boolean },
      name: { type: String },
      role: { type: String },
      state: { type: String },
      _newRole: { type: String, attribute: false },
      _size: { type: String, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {string} Sets the user avatar displayed in the card. If not provided, a fallback icon is displayed. */
    this.avatar = '';

    /** @type {string} Sets the email address displayed in the card. */
    this.email = '';

    /** @type {string} Sets the error message displayed in case one tries to edit or remove the last admin of the org. */
    this.errorMessage = '';

    /** @type {string} Sets the member `id`, not visible but used in the remove and update editing event payloads. */
    this.id = '';

    /** @type {boolean} Changes the remove button into a leave button and adds a small text to see that this card represents the current user. */
    this.isCurrentUser = false;

    /** @type {boolean} Sets the card in edit mode. If true, displays a form to edit the role of the user. This property is controlled by `cc-orga-member-list` so that only one card can be in edit mode at a time. */
    this.isEditing = false;

    /** @type {boolean} Prevents from role updates or user deletion. Displays an error message if user tries to delete or edit. */
    this.isLastAdmin = false;

    /** @type {string} Sets the job title displayed when hovering the username or email. */
    this.jobTitle = '';

    /** @type {string} Sets the name of the member displayed in the card. */
    this.name = '';

    /** @type {boolean} Sets the Two-Factor Auth status displayed in the card. */
    this.mfa = false;

    /** @type {string} Sets the role displayed in the card. */
    this.role = '';

    /** @type {MemberCardState} Sets the state of the component. */
    this.state = 'loaded';

    /** @type {string} Synced with the `<cc-select>` value. This value is used in the edit member payload event. */
    this._newRole = '';

    /** @type {number|null} Reflects the size of the component. Set by the resizeObserver and used to toggle different styles for buttons (img, imgOnly, text only...). */
    this._size = null;

    /** @protected */
    this.breakpoints = {
      // used to switch to buttons wrapping below when component width < 740 and vertical card layout when < 580
      width: [BREAKPOINT_TINY, BREAKPOINT_SMALL, BREAKPOINT_MEDIUM],
    };
  }

  updated (changedProperties) {
    if (changedProperties.has('role') || changedProperties.has('isEditing')) {
      // Set or reset the default value of the `<cc-select>`.
      this._newRole = this.role;
    }

    super.updated(changedProperties);
  }

  _getRoleOptions () {
    return [{
      label: i18n('cc-orga-member-card.role-admin'), value: 'ADMIN',
    }, {
      label: i18n('cc-orga-member-card.role-developer'), value: 'DEVELOPER',
    }, {
      label: i18n('cc-orga-member-card.role-accounting'), value: 'ACCOUNTING',
    }, {
      label: i18n('cc-orga-member-card.role-manager'), value: 'MANAGER',
    }];
  }

  onResize ({ width }) {
    this._size = width;
  }

  _onRemoveMember () {
    if (this.isLastAdmin) {
      // We don't disable btns by default but if one tries to remove last admin, we display an error message and disable btns.
      this.errorMessage = i18n('cc-orga-member-card.error-remove');
      return;
    }

    dispatchCustomEvent(this, 'remove', {
      memberId: this.id,
      memberIdentity: this.name !== '' ? this.name : this.email,
    });
  }

  _onRoleInput ({ detail: value }) {
    this._newRole = value;
  }

  _onToggleEdit () {
    // edit toggling is managed by `cc-orga-member-list` so that only one card can be edited at a time.
    dispatchCustomEvent(this, 'update-editing', {
      memberId: this.id,
      isEditing: !this.isEditing,
    });
  }

  _onRoleSubmit () {
    dispatchCustomEvent(this, 'edit', {
      memberId: this.id,
      role: this._newRole,
      memberIdentity: this.name !== '' ? this.name : this.email,
    });
  }

  render () {
    const avatar = (this.avatar !== '')
      ? this.avatar
      : profileSvg;

    return html`
      <cc-img class="avatar" src=${avatar}></cc-img>
      <div
        class="identity ${classMap({ waiting: this.state === 'waiting' })}"
        title="${ifDefined(this.jobTitle ?? undefined)}"
      >
        ${this.name !== '' ? html`<p class="name">
          <strong>${this.name}</strong>
          ${this.isCurrentUser ? html`<cc-badge>${i18n('cc-orga-member-card.current-user')}</cc-badge>` : ''}
        </p>` : ''}
        <p class="email">${this.email}</p>
      </div>

      <div class="status ${classMap({ waiting: this.state === 'waiting' })}">
        ${this._renderStatusBadges()}
        <cc-select
          label="${i18n('cc-orga-member-card.label-role')}"
          .options=${this._getRoleOptions()}
          .value=${this._newRole}
          ?inline=${this._size > BREAKPOINT_TINY}
          ?disabled=${this.state === 'waiting' || this.errorMessage !== ''}
          @cc-select:input=${this._onRoleInput}
        >
        </cc-select>
      </div>

      <div class="actions">
        <!-- TODO move ?disabled test in variable. internal prop or 2 local render variables ? -->
        ${this._renderActionBtns()}
      </div>
      <div class="error-wrapper ${classMap({ 'out-of-flow': this.errorMessage === '' })}" aria-live="polite" aria-atomic="true">
        ${this.errorMessage !== '' ? this._renderLastAdminError() : ''}
      </div>
    `;
  }

  _renderStatusBadges () {
    return html`
      <cc-badge class="status__role ${classMap({ visible: this.role === 'ADMIN' })}" intent="info" weight="dimmed">${i18n('cc-orga-member-card.role-admin')}</cc-badge>
      <cc-badge class="status__role ${classMap({ visible: this.role === 'ACCOUNTING' })}" intent="info" weight="dimmed">${i18n('cc-orga-member-card.role-accounting')}</cc-badge>
      <cc-badge class="status__role ${classMap({ visible: this.role === 'DEVELOPER' })}" intent="info" weight="dimmed">${i18n('cc-orga-member-card.role-developer')}</cc-badge>
      <cc-badge class="status__role ${classMap({ visible: this.role === 'MANAGER' })}" intent="info" weight="dimmed">${i18n('cc-orga-member-card.role-manager')}</cc-badge>
      <cc-badge class="status__mfa ${classMap({ visible: this.mfa })}" intent="success" weight="outlined" icon-src="${tickSvg}">
          ${i18n('cc-orga-member-card.mfa-label')}
          ${i18n('cc-orga-member-card.mfa-enabled')}
      </cc-badge>
      <cc-badge class="status__mfa ${classMap({ visible: !this.mfa })}" intent="danger" weight="outlined" icon-src="${errorSvg}">
          ${i18n('cc-orga-member-card.mfa-label')}
          ${i18n('cc-orga-member-card.mfa-disabled')}
      </cc-badge>
    `;
  }

  _renderActionBtns () {
    const isBtnImgOnly = (this._size > BREAKPOINT_MEDIUM);
    return html`
        <!-- TODO handle focus switch -->
        <!--region actions not editing-->
        <cc-button
          class="actions__first ${classMap({ visible: !this.isEditing })}"
          primary
          outlined
          image=${penSvg}
          ?circle=${isBtnImgOnly}
          ?disabled=${this.state === 'waiting' || this.errorMessage !== ''}
          ?hide-text=${isBtnImgOnly}
          @cc-button:click=${this._onToggleEdit}
        >
          ${i18n('cc-orga-member-card.btn-edit')}
        </cc-button>
        <cc-button
          class="actions__second ${classMap({ visible: !this.isEditing && !this.isCurrentUser })}"
          danger
          outlined
          image=${trashSvg}
          ?disabled=${this.errorMessage !== ''}
          ?circle=${isBtnImgOnly}
          ?hide-text=${isBtnImgOnly}
          ?waiting=${this.state === 'waiting'}
          @cc-button:click=${this._onRemoveMember}
        >
          ${i18n('cc-orga-member-card.btn-remove')}
        </cc-button>
        <cc-button
          class="actions__second ${classMap({ visible: !this.isEditing && this.isCurrentUser })}"
          danger
          outlined
          image=${trashSvg}
          ?disabled=${this.errorMessage !== ''}
          ?circle=${isBtnImgOnly}
          ?hide-text=${isBtnImgOnly}
          ?waiting=${this.state === 'waiting'}
          @cc-button:click=${this._onRemoveMember}
        >
          ${i18n('cc-orga-member-card.btn-leave')}
        </cc-button>
        <!--endregion-->
        
        <!--region actions editing-->
        <cc-button
          class="actions__first ${classMap({ visible: this.isEditing })}"
          outlined
          image=${closeSvg}
          ?circle=${isBtnImgOnly}
          ?disabled=${this.state === 'waiting' || this.errorMessage !== ''}
          ?hide-text=${isBtnImgOnly}
          @cc-button:click=${this._onToggleEdit}
        >
          ${i18n('cc-orga-member-card.btn-cancel')}
        </cc-button>
        <cc-button
          class="actions__second ${classMap({ visible: this.isEditing })}"
          primary
          outlined
          image=${tickBlueSvg}
          ?disabled=${this.errorMessage !== ''}
          ?circle=${isBtnImgOnly}
          ?hide-text=${isBtnImgOnly}
          ?waiting=${this.state === 'waiting'}
          @cc-button:click=${this._onRoleSubmit}
        >
          ${i18n('cc-orga-member-card.btn-validate')}
        </cc-button>
        <!--endregion-->
    `;
  }

  _renderLastAdminError () {
    return html`
      <p>${this.errorMessage}</p>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        /*region big & common (> 740) */
        :host {
          align-items: center;
          display: grid;
          gap: 1em;
          grid-auto-flow: row;
          grid-template-areas: "avatar identity status actions";
          grid-template-columns: max-content 1fr max-content max-content;
        }

        .status__role {
            grid-area: 1 / 1 / 1 / 2;
            visibility: hidden;
        }

        .status__mfa {
            grid-area: 1 / 2 / 1 / 3;
            visibility: hidden;
        }

        .status__role.visible,
        .status__mfa.visible {
            visibility: visible;
        }

        .waiting {
            opacity: 0.5;
        }

        .avatar {
            border-radius: 100%;
            grid-area: avatar;
            height: 2.5em;
            width: 2.5em;
        }

        .identity {
            display: flex;
            flex-direction: column;
            gap: 0.3em;
            grid-area: identity;
            justify-content: center;
            word-break: break-all;
        }

        .status {
            align-items: center;
            display: grid;
            gap: 0.5em;
            grid-area: status;
            grid-template-columns: min-content max-content;
            justify-items: center;
        }

        .actions {
            display: grid;
            gap: 0.5em;
            grid-area: actions;
            grid-template-columns: max-content max-content;
        }
        
        .actions cc-button {
            visibility: hidden;
        }
        
        .actions__first {
            grid-area: 1 / 1 / 1 / 1;    
        }

        .actions__second {
            grid-area: 1 / 2 / 1 / 2;
        }
        
        .actions cc-button.visible {
            visibility: visible;
        }

        p {
            margin: 0;
        }

        cc-badge {
            width: max-content;
        }

        cc-select {
            grid-area: 1 / 1 / 1 / 3;
            visibility: hidden;
        }

        .error-wrapper {
            display: flex;
            grid-area: unset;
            grid-column: 2 / -1;
            justify-content: end;
        }

        .error-wrapper.out-of-flow {
            grid-area: avatar / actions;
        }
        
        .error-wrapper p {
            background-color: var(--cc-color-bg-danger-weaker);
            border: 1px solid var(--cc-color-bg-danger);
            border-radius: 0.4em;
            padding: 0.5em 1em;
        }
        /*endregion */
        
        /*region medium (< 740) */
        :host([w-lt-740]) {
          grid-template-areas: "avatar identity status"
                               ". . actions";
          grid-template-columns: max-content 1fr max-content;
        }

        :host([w-lt-740]) .status,
        :host([w-lt-740]) .actions {
          justify-self: end;
        }
        /*endregion */

        /*region small (< 580) */
        :host([w-lt-580]) {
          grid-template-areas: "avatar identity"
                               ". status"
                               ". actions";
          grid-template-columns: max-content 1fr;
        }

        :host([w-lt-580]) .status {
          justify-items: start;
          justify-self: start;
        }
        
        :host([w-lt-580]) .actions {
          justify-self: start;
        }

        :host([w-lt-580]) .status__role {
            display: none;
        }

        :host([w-lt-580]) .status__role.visible {
            display: block;
        }
        /*endregion */
        
        /*region tiny (< 350)*/
        :host([w-lt-350]) .status {
          grid-template-columns: 1fr;
        }

        :host([w-lt-350]) .actions {
          grid-template-columns: 1fr;
          justify-self: stretch;
        }

        :host([w-lt-350]) .actions__first {
            grid-area: 1 / 1 / 1 / 1;
        }
        
        :host([w-lt-350]) .actions__second {
            grid-area: 2 / 1 / 3 / 1;
        }

        :host([w-lt-350]) .status__role {
          grid-area: 1 / 1 / 1 / 1;
        }

        :host([w-lt-350]) .status__mfa {
          grid-area: 2 / 1 / 3 / 1;
        }

        :host([w-lt-350]) cc-select {
          grid-area: 1 / 1 / 3 / 1;
        }
        /*endregion */

        /*region is-editing */
        :host([is-editing]) .status__role,
        :host([is-editing]) .status__mfa {
          visibility: hidden;
        }

        :host([is-editing]) cc-select {
          visibility: visible;
        }
        /*endregion */
      `];
  }
}

window.customElements.define('cc-orga-member-card', CcOrgaMemberCard);
