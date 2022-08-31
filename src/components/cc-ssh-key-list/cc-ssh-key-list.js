import '../cc-button/cc-button.js';
import '../cc-img/cc-img.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-block/cc-block.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-error/cc-error.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { fakeString } from '../../lib/fake-strings.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';

const deleteSvg = new URL('../../assets/trash-red.svg', import.meta.url).href;
const importSvg = new URL('../../assets/add-circle-fill-blue.svg', import.meta.url).href;
const keySvg = new URL('../../assets/key-reverse.svg', import.meta.url).href;

/**
 * @typedef {import('./cc-ssh-key-list.types.d.ts').CreateFormModel} CreateFormModel
 * @typedef {import('./cc-ssh-key-list.types.d.ts').PersonalKeysModel} PersonalKeysModel
 * @typedef {import('./cc-ssh-key-list.types.d.ts').GithubKeysModel} GithubKeysModel
 * @typedef {import('./cc-ssh-key-list.types.d.ts').SSHKey} SSHKey
 */

/**
 * A component that displays a list of SSH keys associated with your account and allows to add new ones.
 *
 * ## Details
 *
 * * The component displays a form to associate a new SSH key with your account.
 * * Then displays the list of personal keys currently associated with your account.
 * * Finally, displays the list of keys available from GitHub that you can associate with your account.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<SSHKey>} cc-ssh-key-list:create - Fires when clicking the creation form submit button.
 * @event {CustomEvent<SSHKey>} cc-ssh-key-list:delete - Fires when clicking a personal key deletion button.
 * @event {CustomEvent<SSHKey>} cc-ssh-key-list:import - Fires when clicking a GitHub key import button.
 */

export class CcSshKeyList extends LitElement {

  static get properties () {
    return {
      createFormModel: { type: Object, attribute: 'create-form-model' },
      githubKeysModel: { type: Object, attribute: 'github-keys-model' },
      personalKeysModel: { type: Object, attribute: 'personal-keys-model' },
    };
  }

  constructor () {
    super();

    this.resetCreateForm();
    this.resetPersonalKeys();
    this.resetGithubKeys();
  }

  resetCreateForm () {
    /**
     * @type {CreateFormModel} creation form model.
     */
    this.createFormModel = {
      inputName: {
        value: '',
        error: 'none',
      },
      inputKey: {
        value: '',
        error: 'none',
      },
      state: 'ready',
    };
  }

  resetGithubKeys () {
    /**
     * @type {GithubKeysModel} github key list model.
     */
    this.githubKeysModel = {
      keys: null,
      state: 'loading',
    };
  }

  resetPersonalKeys () {
    /**
     * @type {PersonalKeysModel} personal key list model.
     */
    this.personalKeysModel = {
      keys: null,
      state: 'loading',
    };
  }

  _onCreateKey () {
    // TODO refactor in smart?
    this.createFormModel.inputName.error = this.createFormModel.inputName.value === ''
      ? 'required'
      : 'none';
    this.createFormModel.inputKey.error = this.createFormModel.inputKey.value === ''
      ? 'required'
      : 'none';

    // TODO or spread affectation?
    this.requestUpdate();

    if (this.createFormModel.inputName.error === 'required') {
      this.shadowRoot.querySelector('.create-form__name')?.focus();
    }
    else if (this.createFormModel.inputKey.error === 'required') {
      this.shadowRoot.querySelector('.create-form__public-key')?.focus();
    }
    else {
      dispatchCustomEvent(this, 'create', {
        name: this.createFormModel.inputName.value,
        key: this.createFormModel.inputKey.value,
      });
    }
  }

  _onDeleteKey (key) {
    dispatchCustomEvent(this, 'delete', key);
  }

  _onImportKey (key) {
    dispatchCustomEvent(this, 'import', key);
  }

  _onInputName ({ detail: value }) {
    this.createFormModel.inputName.value = value;
  }

  _onInputPublicKey ({ detail: value }) {
    this.createFormModel.inputKey.value = value;
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
            <span>${this._renderKeyCountBadge(this.personalKeysModel.keys)}</span>
          </div>

          <div slot="info">
            ${i18n('cc-ssh-key-list.personal.info')}
          </div>

          ${
            this.personalKeysModel.state === 'error'
            ? html`<cc-error>${i18n('cc-ssh-key-list.error.loading')}</cc-error>`
            : html`<div class="key-list">
              ${
                this.personalKeysModel.state === 'loading'
                  ? this._renderKeyItemSkeleton()
                  : this.personalKeysModel.keys && this.personalKeysModel.keys.length > 0
                    ? html`${this.personalKeysModel.keys.map((key) => html`
                      ${this._renderKeyItem(key, {
                        isDisabled: key.processing,
                        isPersonal: true,
                      })}
                    `)}`
                    : html`<span class="info-msg">${i18n('cc-ssh-key-list.personal.empty')}</span>`
              }
            </div>`
          }
        </cc-block-section>

        <!-- GitHub keys -->
        <cc-block-section>
          <div slot="title">
            <span>${i18n('cc-ssh-key-list.github.title')}</span>
            <span>${this._renderKeyCountBadge(this.githubKeysModel.keys)}</span>
          </div>

          <div slot="info">
            ${i18n('cc-ssh-key-list.github.info')}
          </div>

          ${
            this.githubKeysModel.state === 'unlinked'
              ? html`<span class="info-msg">${i18n('cc-ssh-key-list.github.unlinked')}</span>`
              : this.githubKeysModel.state === 'error'
                ? html`<cc-error>${i18n('cc-ssh-key-list.error.loading-github')}</cc-error>`
                : html`<div class="key-list">
                  ${
                    this.githubKeysModel.state === 'loading'
                      ? this._renderKeyItemSkeleton()
                      : this.githubKeysModel.keys && this.githubKeysModel.keys.length > 0
                        ? html`${this.githubKeysModel.keys.map((key) => html`
                          ${this._renderKeyItem(key, {
                            isDisabled: key.processing,
                            isGithub: true,
                          })}
                        `)}`
                        : html`<span class="info-msg">${i18n('cc-ssh-key-list.github.empty')}</span>`
                  }
                </div>`
          }
        </cc-block-section>

        <!-- documentation link -->
        <cc-block-section>
          <div class="align-end">
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
          ?disabled=${this.createFormModel.state === 'saving'}
          label=${i18n('cc-ssh-key-list.add.name')}
          required
          value="${this.createFormModel.inputName.value}"
        >
          ${
            this.createFormModel.inputName.error === 'required'
              ? html`<p slot="error">${i18n('cc-ssh-key-list.error.empty.name')}</p>`
              : ''
          }
        </cc-input-text>
        <cc-input-text
          @cc-input-text:input=${this._onInputPublicKey}
          class="create-form__public-key"
          ?disabled=${this.createFormModel.state === 'saving'}
          label=${i18n('cc-ssh-key-list.add.public-key')}
          required
          value="${this.createFormModel.inputKey.value}"
        >
          ${
            this.createFormModel.inputKey.error === 'required'
              ? html`<p slot="error">${i18n('cc-ssh-key-list.error.empty.public-key')}</p>`
              : ''
          }
        </cc-input-text>
        <div class="create-form__footer">
          ${
            // TODO remove 'error' when wiring to toast
            this.createFormModel.state === 'error'
              ? html`<cc-error class="create-form__error">${i18n('cc-ssh-key-list.error.adding')}</cc-error>`
              : ''
          }
          <cc-button
            @cc-button:click=${() => this._onCreateKey()}
            class="create-form__add-btn"
            primary
            ?waiting=${this.createFormModel.state === 'saving'}
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
      <div class="key ${classMap({ 'is-disabled': details.isDisabled })}">
        <cc-img class="key__icon" src=${keySvg}></cc-img>
        <div class="key__name">${key.name}</div>
        <div class="key__form">
          <div class="key__fingerprint">${key.fingerprint}</div>
          ${
            details.isPersonal
            ? html`<cc-button
              @cc-button:click=${() => this._onDeleteKey(key)}
              class="key__button"
              ?disabled=${details.isDisabled}
              danger
              image=${deleteSvg}
              outlined
              ?waiting=${details.isDisabled}>
                ${i18n('cc-ssh-key-list.personal.delete')}
              </cc-button>`
            : null
          }
          ${
            details.isGithub
              ? html`<cc-button
                @cc-button:click=${() => this._onImportKey(key)}
                class="key__button"
                ?disabled=${details.isDisabled}
                image=${importSvg}
                ?waiting=${details.isDisabled}>
                  ${i18n('cc-ssh-key-list.github.import')}
                </cc-button>`
              : null
          }
        </div>
      </div>
    `;
  }

  _renderKeyItemSkeleton () {
    return html`
      <div class="key key--skeleton">
        <cc-img class="key__icon" skeleton></cc-img>
        <div class="key__name">
          <span class="skeleton">${fakeString(32)}</span>
        </div>
        <div class="key__form">
          <div class="key__fingerprint skeleton">${fakeString(32)}</div>
          <cc-button
            class="key__button"
            image=${deleteSvg}
            skeleton
          >
            ${fakeString(10)}
          </cc-button>
        </div>
      </div>
    `;
  }

  static get styles () {
    return [
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
          margin-inline-start: auto;
        }

        /* key list */
        .key-list {
          align-items: stretch;
          display: flex;
          flex-direction: column;
        }

        /* key item */
        .key {
          display: grid;
          gap: 0.5em 0.75em;
          grid-template-areas:
            "key-icon key-name"
            ". key-form";
          grid-template-columns: min-content 1fr;
        }
        .key:not(:last-child) {
          margin-bottom: 2.5em;
        }
        .key.is-disabled {
          cursor: default;
          opacity: 0.5;
        }

        .key__icon {
          grid-area: key-icon;
          height: 1.25em;
          width: 1.25em;
        }

        .key__name {
          font-size: 1.125em;
          font-weight: bold;
          grid-area: key-name;
          word-break: break-word;
        }

        .key__form {
          --modifier: calc(32rem - 100%);
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          grid-area: key-form;
          justify-content: flex-end;
        }

        .key__fingerprint {
          background-color: var(--color-grey-10);
          border-inline-start: 5px solid var(--color-grey-40);
          border-radius: 0.125em;
          flex-basis: calc(var(--modifier) * 999);
          flex-grow: 1;
          font-family: var(--cc-ff-monospace);
          line-height: 1.5;
          padding: 0.5em 0.75em;
          word-break: break-word;
        }

        .key__button {
          align-self: center;
        }

        /* misc */
        [slot=info] code {
          background-color: var(--color-grey-10);
          border: 1px solid var(--color-grey-20);
          border-radius: 0.25em;
          display: inline-block;
          line-height: 2;
          padding: 0.25em 0.4em;
          white-space: pre-wrap;
        }

        .key--skeleton .skeleton {
          background-color: var(--cc-color-bg-neutral);
        }

        .info-msg {
          color: var(--cc-color-text-weak);
          font-style: italic;
          line-height: 1.5;
        }

        .align-end {
          text-align: end;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ssh-key-list', CcSshKeyList);
