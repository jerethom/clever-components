import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { validateEmailAddress } from '../lib/email.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { fakeString } from '../lib/fake-strings.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';
import '../atoms/cc-flex-gap.js';
import '../atoms/cc-button.js';
import '../atoms/cc-input-text.js';
import '../molecules/cc-error.js';
import '../molecules/cc-block.js';
import '../molecules/cc-block-section.js';

const mailSvg = new URL('../assets/mail-line.svg', import.meta.url).href;
const mailStarSvg = new URL('../assets/mail-star-line.svg', import.meta.url).href;
const trashSvg = new URL('../assets/trash-red.svg', import.meta.url).href;
const verifiedSvg = new URL('../assets/checkbox-circle-fill.svg', import.meta.url).href;
const unverifiedSvg = new URL('../assets/spam-2-fill.svg', import.meta.url).href;
const blankSvg = new URL('../assets/blank.svg', import.meta.url).href;

/**
 * @typedef {import('./types.js').CcEmailState} CcEmailState
 * @typedef {import('./types.js').PrimaryEmailAddress} PrimaryEmailAddress
 * @typedef {import('./types.js').SecondaryEmailAddresses} SecondaryEmailAddresses
 */

/**
 * A component displaying the e-mail addresses associated with a user account.
 *
 * ## Details
 *
 * The component gives the ability to:
 *
 * * Resend the confirmation e-mail on the primary address (if it has not been verified yet)
 * * Add a secondary e-mail address
 * * Delete a secondary e-mail address
 * * Promote a secondary e-mail address to primary.
 *
 * ## secondary e-mail address input validation
 *
 * * The component is responsible for validating the secondary e-mail address entered by the user.
 * * This validation is triggered whenever the add button is clicked.
 * * If the validation doesn't succeed, an error message is displayed bellow the text input. Otherwise, the custom event `cc-email:add` is fired.
 * * The validation handles only two cases:
 *   - the input is empty
 *   - the input is not a valid e-mail address.
 * * For the other error cases, you'll need to use the `_addAddressInputError` property manually.
 *
 * ## Marking as primary
 *
 * * Unlike secondary email address deletion, marking as primary is exclusive: Only one email address can be marked as primary at a time.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent} cc-email:add - Fires whenever the add button is clicked. If the validation doesn't succeed, the event is not fired.
 * @event {CustomEvent} cc-email:send-confirmation-email - Fires whenever the send confirmation email link is clicked.
 * @event {CustomEvent} cc-email:delete - Fires whenever the delete button is clicked.
 * @event {CustomEvent} cc-email:mark-as-primary - Fires whenever the 'mark as primary' button is clicked.
 */
export class CcEmail extends LitElement {

  constructor () {
    super();

    /** @type {CcEmailState} state of the component. */
    this.state = { type: 'loading' };

    /** @type {string} The value currently set on the add address text input. */
    this._addAddressInputValue = '';

    /**
     * @type {'empty'|'invalid'|'already-defined'|'used'|null}
     * The code of the error message displayed bellow the address text input.
     *  | code |  |
     *  | --- | --- |
     *  | `empty` | the text input is empty |
     *  | `invalid` | the text input is not a valid e-mail address |
     *  | `already-defined` | the e-mail address is already defined as primary or secondary |
     *  | `used` | the e-mail address is already owned by another user account |
     */
    this._addAddressInputError = null;
  }

  static get properties () {
    return {
      state: { type: String },
      data: { type: Object },
      _addAddressInputValue: { type: String },
      _addAddressInputError: { type: String },
    };
  }

  updated (_changedProperties) {
    if (this._addAddressInputError) {
      this._focusAddressInput();
    }

    super.updated(_changedProperties);
  }

  /**
   * @return {CcEmailData | null}
   */
  get data () {
    return this.state?.type === 'loaded' ? this.state.data : null;
  }

  _isLoading () {
    return this.state?.type === 'loading';
  }

  _isError () {
    return this.state?.type === 'error';
  }

  _getVerifiedTagLabel () {
    const verifiedLabel = i18n('cc-email.primary.email.verified');

    if (this._isLoading()) {
      return fakeString(verifiedLabel.length);
    }
    return this.data?.primary?.address?.verified ? verifiedLabel : i18n('cc-email.primary.email.unverified');
  }

  _getInputError () {
    if (this._addAddressInputError === 'empty') {
      return i18n(`cc-email.secondary.address-input.error.empty`);
    }
    if (this._addAddressInputError === 'used') {
      return i18n(`cc-email.secondary.address-input.error.used`);
    }
    if (this._addAddressInputError === 'invalid') {
      return i18n(`cc-email.secondary.address-input.error.invalid`);
    }
    if (this._addAddressInputError === 'already-defined') {
      return i18n(`cc-email.secondary.address-input.error.already-defined`);
    }
  }

  _focusAddressInput () {
    this.shadowRoot.querySelector('cc-input-text').focus();
  }

  _onDelete (address) {
    dispatchCustomEvent(this, 'delete', address);
  }

  _onMarkAsPrimary (address) {
    dispatchCustomEvent(this, 'mark-as-primary', address);
  }

  _onInput ({ detail: value }) {
    this._addAddressInputValue = value;
  }

  _onAdd () {
    this._addAddressInputError = validateEmailAddress(this._addAddressInputValue);

    if (!this._addAddressInputError) {
      dispatchCustomEvent(this, 'add', this._addAddressInputValue);
    }
    else {
      this._focusAddressInput();
    }
  }

  _onSendConfirmationEmail () {
    dispatchCustomEvent(this, 'send-confirmation-email', this.data.primary.address.value);
  }

  resetForm () {
    this._addAddressInputError = null;
    this._addAddressInputValue = '';
  }

  reset () {
    this.state = { type: 'loading' };
    this.resetForm();
  }

  render () {
    return html`
      <cc-block>
        <div slot="title">${i18n('cc-email.title')}</div>

        ${this._isError() ? html`
          <cc-error>${i18n('cc-email.loading.error')}</cc-error>
        ` : ''}

        ${!this._isError() ? html`
          ${this._renderPrimarySection()}
          ${this._renderSecondarySection()}
        ` : ''}
      </cc-block>
    `;
  }

  _renderPrimarySection () {
    const skeleton = this._isLoading();
    const address = skeleton ? fakeString(35) : this.data?.primary?.address?.value;
    const verified = this.data?.primary?.address?.verified;
    const shouldDisplayResendConfirmationEmail = !skeleton && !verified;

    const badgeIntent = skeleton ? 'neutral' : verified ? 'success' : 'danger';
    const badgeWeight = skeleton ? 'dimmed' : 'outlined';
    const badgeIcon = skeleton ? blankSvg : verified ? verifiedSvg : unverifiedSvg;

    return html`
      <cc-block-section>
        <div slot="title">${i18n('cc-email.primary.title')}</div>
        <div slot="info">${i18n('cc-email.primary.description')}</div>
        
        <cc-flex-gap class="address-line primary">
          <div class="address">
            <div class="icon"><img src="${mailStarSvg}" alt=""/></div>
            <span class="${classMap({ skeleton: skeleton })}">${address}</span>  
          </div>
          <cc-badge
            class="${classMap({ skeleton: skeleton })}"
            intent="${badgeIntent}"
            weight="${badgeWeight}"
            icon-src="${badgeIcon}"
            icon-alt=""
          >${this._getVerifiedTagLabel()}</cc-badge>
        </cc-flex-gap>
        <cc-flex-gap>
          ${shouldDisplayResendConfirmationEmail ? html`
            <cc-button
                @cc-button:click=${this._onSendConfirmationEmail}
                ?waiting=${this.data?.primary?.state === 'sending-confirmation-email'}
                link
            >
              ${i18n('cc-email.primary.action.resend-confirmation-email')}
            </cc-button>
          ` : ''}
        </cc-flex-gap>
      </cc-block-section>
    `;
  }

  _renderSecondarySection () {
    /** @type {SecondaryEmailAddress[]} */
    const addresses = [...(this._isLoading() ? [] : (this.data?.secondary?.addresses || []))]
      .sort((a1, a2) => a1.address.value.localeCompare(a2.address.value));
    const markingAsPrimary = addresses.some((item) => item.state === 'marking-as-primary');

    return html`
      <cc-block-section>
        <div slot="title">${i18n('cc-email.secondary.title')}</div>
        <div slot="info">${i18n('cc-email.secondary.description')}</div>

        ${addresses.map((item) => {
          const busy = item.state === 'marking-as-primary' || item.state === 'deleting';
          const markingAsPrimaryDisabled = this.data?.primary.address.verified === false;

          return html`
            <cc-flex-gap class="address-line secondary">
              <div class="address ${classMap({ loading: item.state })}">
                <div class="icon"><img src="${mailSvg}" alt=""/></div>
                <span>${item.address.value}</span>
              </div>
              <cc-flex-gap class="buttons">
                <cc-button
                    @cc-button:click=${() => this._onMarkAsPrimary(item.address.value)}
                    ?waiting="${item.state === 'marking-as-primary'}"
                    ?disabled="${markingAsPrimary || busy || markingAsPrimaryDisabled}"
                >
                  ${i18n('cc-email.secondary.action.mark-as-primary')}
                </cc-button>
                <cc-button
                    danger
                    outlined
                    image=${trashSvg}
                    @cc-button:click=${() => this._onDelete(item.address.value)}
                    ?waiting="${item.state === 'deleting'}"
                    ?disabled="${busy}"
                >
                  ${i18n('cc-email.secondary.action.delete')}
                </cc-button>
              </cc-flex-gap>
            </cc-flex-gap>
          `;
        })}
        
        <form>
          <cc-input-text
            label="${i18n('cc-email.secondary.address-input.label')}"
            required
            value="${this._addAddressInputValue}"
            ?disabled=${this.data?.secondary?.state === 'adding'}
            @cc-input-text:input=${this._onInput}
            @cc-input-text:requestimplicitsubmit=${this._onAdd}
        >
          ${this._addAddressInputError ? html`
            <p slot="error">
              ${this._getInputError()}
            </p>
          ` : ''}
          <p slot="help">
            ${i18n('cc-email.secondary.address-input.format')}
          </p>
        </cc-input-text>
        <cc-button
            primary
            ?waiting=${this.data?.secondary?.state === 'adding'}
            @cc-button:click=${this._onAdd}
        >
          ${i18n('cc-email.secondary.action.add')}
        </cc-button>
      </form>
      </cc-block-section>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        cc-flex-gap {
          --cc-gap: 1em;
          --cc-align-items: center;
        }

        /*region ADDRESS*/
        
        .address-line .address.loading {
          opacity: 0.5;
        }
        
        .address-line .address .icon {
          display: flex;
        }

        .address-line .address span {
          min-width: 150px;
          word-break: break-all;
        }

        .address-line .address {
          align-items: center;
          display: flex;
          flex-wrap: nowrap;
          gap: 1em;
        }

        .address-line.secondary {
          margin-bottom: 0.8em;
        }

        .address-line.secondary .address {
          flex: 1 1 0;
        }

        /*endregion*/

        /*region FORM*/
        form {
          align-items: start;
          display: flex;
          gap: 1em;
        }
        
        form > cc-input-text {
          flex: 1 1 0;
        }

        form > cc-button {
          align-self: start;
          grid-area: button;
          margin-top: var(--cc-margin-top-btn-horizontal-form);
        }

        form > cc-error {
          align-self: stretch;
          grid-area: error;
        }

        /*endregion*/

        .skeleton {
          background-color: #bbb;
          color: transparent !important;
        }

        .skeleton > img {
          visibility: hidden;
        }
      `,
    ];
  }
}

window.customElements.define('cc-email', CcEmail);
