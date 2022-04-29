import '../atoms/cc-button.js';
import '../atoms/cc-img.js';
import '../atoms/cc-input-text.js';
import '../molecules/cc-block.js';
import '../molecules/cc-block-section.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { fakeString } from '../lib/fake-strings.js';
import { i18n } from '../lib/i18n.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { skeletonStyles } from '../styles/skeleton.js';

const deleteSvg = new URL('../assets/trash-red.svg', import.meta.url).href;
const importSvg = new URL('../assets/import-blue.svg', import.meta.url).href;
const keySvg = new URL('../assets/key-reverse.svg', import.meta.url).href;

/**
 * @typedef {import('./types.js').SSHKey} SSHKey
 * @typedef {import('./types.js').ErrorType} ErrorType
 * @typedef {import('./types.js').ClientErrorType} ClientErrorType
 */

/**
 * A component that displays a list of SSH keys associated with your account and allows to add new ones.
 *
 * ## Details
 *
 * * The component displays a form to associate a new SSH key with your account.
 * * Then displays the list of personal keys currently associated with your account.
 * * Finally, displays the list of keys available from third parties (GitHub for example) that you can associate with your account.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<SSHKey>} cc-ssh-key-list:create - Fires when clicking the creation form submit button.
 * @event {CustomEvent<SSHKey>} cc-ssh-key-list:delete - Fires when clicking a personal key deletion button.
 * @event {CustomEvent<SSHKey>} cc-ssh-key-list:import - Fires when clicking a third party key import button.
 */

export class CcSshKeyList extends LitElement {

  static get properties () {
    return {
      keys: { type: Array },
      keysThirdParties: { type: Array, attribute: 'keys-third-parties' },
      newKey: { type: Object, attribute: 'new-key' },
      adding: { type: Boolean },
      deleting: { type: String },
      importing: { type: Boolean },
      listing: { type: Boolean },
      listingThirdParties: { type: Boolean, attribute: 'listing-third-parties' },
      unlinked: { type: Boolean },
      error: { type: String },
      _clientError: { type: String, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {SSHKey[]|null} Sets list of personal SSH keys. */
    this.keys = null;

    /** @type {SSHKey[]|null} Sets list of third parties SSH keys. */
    this.keysThirdParties = null;

    /** @type {SSHKey|null} Contains SSH key being created, meaning data currently in the related form. */
    this.newKey = {
      name: '',
      key: '',
    };

    /** @type {Boolean} Displays UI state when adding a new key. */
    this.adding = false;

    /** @type {String|null} Displays UI state when deleting a personal key, value is the key name (which must be unique). */
    this.deleting = null;

    /** @type {String|null} Displays UI state when importing a third parties key, value is the key name (which must be unique). */
    this.importing = null;

    /** @type {Boolean} Displays UI state when listing personal keys. */
    this.listing = false;

    /** @type {Boolean} Displays UI state when listing third parties keys. */
    this.listingThirdParties = false;

    /** @type {Boolean} Displays UI state when no third party account is linked to the main account. */
    this.unlinked = false;

    /** @type {ErrorType} Displays error states. */
    this.error = null;

    /** @type {ClientErrorType} Stores current error state triggered from client. */
    this._clientError = null;
  }

  _onCreateKey (key) {
    this._refreshErrorState();

    switch (this._clientError) {
      case 'emptyName':
        this.shadowRoot.querySelector('.create-form__name')?.focus();
        break;

      case 'emptyPublicKey':
        this.shadowRoot.querySelector('.create-form__public-key')?.focus();
        break;

      default:
        dispatchCustomEvent(this, 'create', { key });
    }
  }

  _onDeleteKey (key) {
    dispatchCustomEvent(this, 'delete', { key });
  }

  _onImportKey (key) {
    dispatchCustomEvent(this, 'import', { key });
  }

  _onInputName ({ detail: value }) {
    this.newKey.name = value;
  }

  _onInputPublicKey ({ detail: value }) {
    this.newKey.key = value;
  }

  _refreshErrorState () {
    if (this.newKey.name === '') {
      this._clientError = 'emptyName';
    }
    else if (this.newKey.key === '') {
      this._clientError = 'emptyPublicKey';
    }
    else {
      this._clientError = null;
    }
  }

  render () {
    return html`
      <cc-block>
        <div slot="title">
          ${i18n('cc-ssh-key-list.title')}
        </div>

        <!-- creation form -->
        <cc-block-section>
          <div slot="title">
            ${i18n('cc-ssh-key-list.add.title')}
          </div>

          <div slot="info">
            ${i18n('cc-ssh-key-list.add.info')}
          </div>

          ${this._renderFormCreate()}
        </cc-block-section>

        <!-- personal keys -->
        <cc-block-section>
          <div slot="title">
            <span>${i18n('cc-ssh-key-list.personal.title')}</span>
            <span>${this._renderKeyCountBadge(this.keys)}</span>
          </div>

          <div slot="info">
            ${i18n('cc-ssh-key-list.personal.info')}
          </div>

          ${
            this.error === 'loading'
            ? html`<cc-error>${i18n('cc-ssh-key-list.error.loading')}</cc-error>`
            : html`<div class="key-list">
              ${
                this.listing
                  ? this._renderKeyItemSkeleton()
                  : this.keys && this.keys.length > 0
                    ? html`${this.keys?.map((key, index) => html`
                      ${this._renderKeyItem(key, {
                        keyId: 'key-id-' + index,
                        disabled: this.deleting === key.name,
                        isPersonal: true,
                      })}
                    `)}`
                    : html`<span class="info-msg">${i18n('cc-ssh-key-list.personal.empty')}</span>`
              }
            </div>`
          }
        </cc-block-section>

        <!-- third parties keys -->
        <cc-block-section>
          <div slot="title">
            <span>${i18n('cc-ssh-key-list.third-parties.title')}</span>
            <span>${this._renderKeyCountBadge(this.keysThirdParties)}</span>
          </div>

          <div slot="info">
            ${i18n('cc-ssh-key-list.third-parties.info')}
          </div>

          ${
            this.unlinked
              ? html`<span class="info-msg">${i18n('cc-ssh-key-list.third-parties.unlinked')}</span>`
              : this.error === 'loading-third-parties'
                ? html`<cc-error>${i18n('cc-ssh-key-list.error.loading-third-parties')}</cc-error>`
                : html`<div class="key-list">
                  ${
                    this.listingThirdParties
                      ? this._renderKeyItemSkeleton()
                      : this.keysThirdParties && this.keysThirdParties.length > 0
                        ? html`${this.keysThirdParties?.map((key, index) => html`
                          ${this._renderKeyItem(key, {
                            keyId: 'key-tp-id-' + index,
                            disabled: this.importing === key.name,
                            isThirdParty: true,
                          })}
                        `)}`
                        : html`<span class="info-msg">${i18n('cc-ssh-key-list.third-parties.empty')}</span>`
                  }
                </div>`
          }
        </cc-block-section>

        <!-- documentation link -->
        <cc-block-section>
          <div slot="info">
            ${i18n('cc-ssh-key-list.doc.info')}
          </div>
        </cc-block-section>
      </cc-block>
    `;
  }

  _renderFormCreate () {
    return html`
      <div class="create-form">
        <cc-input-text
          @cc-input-text:input=${this._onInputName}
          class="create-form__name"
          ?disabled=${this.adding}
          label=${i18n('cc-ssh-key-list.add.name')}
          required
          value="${this.newKey.name}"
        >
          ${
            this._clientError === 'emptyName'
              ? html`<p slot="error">${i18n('cc-ssh-key-list.error.empty.name')}</p>`
              : ''
          }
        </cc-input-text>
        <cc-input-text
          @cc-input-text:input=${this._onInputPublicKey}
          class="create-form__public-key"
          ?disabled=${this.adding}
          label=${i18n('cc-ssh-key-list.add.public-key')}
          required
          value="${this.newKey.key}"
        >
          ${
            this._clientError === 'emptyPublicKey'
              ? html`<p slot="error">${i18n('cc-ssh-key-list.error.empty.public-key')}</p>`
              : ''
          }
        </cc-input-text>
        <div class="create-form__footer">
          ${
            this.error === 'adding'
              ? html`<cc-error class="create-form__error">${i18n('cc-ssh-key-list.error.adding')}</cc-error>`
              : ''
          }
          <cc-button
            @cc-button:click=${() => this._onCreateKey(this.newKey)}
            class="create-form__add-btn"
            success
            ?waiting=${this.adding}
          >
            ${i18n('cc-ssh-key-list.add.btn')}
          </cc-button>
        </div>
      </div>
    `;
  }

  _renderKeyCountBadge (keys) {
    if (keys?.length > 2) {
      return html`(${keys?.length})`;
    }
    return html``;
  }

  _renderKeyItem (key, details) {
    return html`
      <div class="key ${classMap({ 'is-disabled': details.disabled })}">
        <div class="key__content">
          <div class="key__name">
            <cc-img class="key__icon" src=${keySvg}></cc-img>
            <span id=${key.keyId}>${key.name}</span>
          </div>
          <div class="key__fingerprint">${key.fingerprint}</div>
        </div>
        ${
          details.isPersonal
          ? html`<cc-button @cc-button:click=${() => this._onDeleteKey(key)} aria-describedby=${details.keyId} circle class="key__circle-btn" ?disabled=${details.disabled} danger image=${deleteSvg} hide-text outlined ?waiting=${details.disabled}>${i18n('cc-ssh-key-list.personal.delete')}</cc-button>`
          : null
        }
        ${
          details.isThirdParty
            ? html`<cc-button @cc-button:click=${() => this._onImportKey(key)} aria-describedby=${details.keyId} circle class="key__circle-btn" ?disabled=${details.disabled} image=${importSvg} hide-text ?waiting=${details.disabled}>${i18n('cc-ssh-key-list.third-parties.import')}</cc-button>`
            : null
        }
      </div>
    `;
  }

  _renderKeyItemSkeleton () {
    return html`
      <div class="key">
        <div class="key__content">
          <div class="key__name">
            <span class="skeleton">${fakeString(32)}</span>
          </div>
          <div class="key__fingerprint skeleton">${fakeString(32)}</div>
        </div>
        <cc-button
            circle
            class="key__circle-btn"
            image=${deleteSvg}
            hide-text
            skeleton
        ></cc-button>
      </div>
    `;
  }

  static get styles () {
    return [
      defaultThemeStyles,
      skeletonStyles,
      css`
        // language=CSS
        /* global */
        :host {
          display: block;
        }

        /* new key creation form */
        .create-form {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        .create-form__footer {
          align-items: baseline;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }
        .create-form__error {
          flex: 1 1 auto;
          text-align: end;
        }
        .create-form__add-btn {
          flex: none;
          margin-left: auto;
        }

        /* key list */
        .key-list {
          align-items: stretch;
          display: flex;
          flex-direction: column;
        }

        /* key item */
        .key {
          align-items: center;
          display: flex;
          gap: 2em;
        }
        .key:not(:last-child) {
          margin-bottom: 2.5em;
        }
        .key.is-disabled {
          cursor: default;
          opacity: 0.5;
        }

        .key__circle-btn,
        .key__icon {
          flex: none;
        }
        .key__content {
          flex:1 1 auto;
        }

        .key__icon {
          height: 1.25em;
          margin-bottom: 0.125em;
          width: 1.25em;
        }

        .key__name {
          align-items: center;
          display: flex;
          font-size: 1.125em;
          gap: 0.25em;
          margin-bottom: 0.5em;
          word-break: break-word;
        }

        .key__fingerprint {
          background-color: var(--color-grey-10);
          border-radius: 0.125em;
          font-family: var(--cc-ff-monospace);
          line-height: 1.5;
          padding: 0.75em 1em;
          word-break: break-word;
        }

        .key__circle-btn {
          font-size: 1.25em;
        }

        /* misc */
        [slot=info] code {
          background-color: var(--color-grey-10);
          border: 1px solid var(--color-grey-20);
          border-radius: 0.25em;
          padding: 0.25em 0.4em;
        }

        .skeleton {
          background-color: var(--color-bg-neutral-disabled);
        }

        .info-msg {
          color: var(--color-text-light);
          font-style: italic;
          line-height: 1.5;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ssh-key-list', CcSshKeyList);
