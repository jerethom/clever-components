import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';

/**
 * @typedef {import('./cc-select.types.js').Option} Option
 */

/**
 * A component wrapping native select element and its label.
 *
 * @cssdisplay inline-block
 *
 * @event {CustomEvent<string>} cc-select:input - Fires the `value` whenever the `value` changes.
 *
 * @slot error - The error message to be displayed below the `<select>` element or below the help text. Please use a `<p>` tag.
 * @slot help - The help message to be displayed right below the `<select>` element. Please use a `<p>` tag.
 */
export class CcSelect extends LitElement {
  static get properties () {
    return {
      disabled: { type: Boolean, reflect: true },
      inline: { type: Boolean, reflect: true },
      /** @required */
      label: { type: String },
      name: { type: String, reflect: true },
      options: { type: Array },
      placeholder: { type: String },
      required: { type: Boolean },
      value: { type: String },
      _uniqueErrorId: { type: String, state: true },
      _uniqueHelpId: { type: String, state: true },
      _uniqueInputId: { type: String, state: true },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Sets `disabled` attribute on inner native `<select>` element. */
    this.disabled = false;

    /** @type {boolean} Sets the `<label>` on the left of the `<select>` element.
     * Only use this if your form contains 1 or 2 fields and your labels are short.
     */
    this.inline = false;

    /** @type {string|null} Sets `name` attribute on inner native `<select>` element. */
    this.name = null;

    /** @type {string|null} Sets label for the input. Mandatory but can be hidden if necessary. */
    this.label = null;

    /** @type {Option[]|[]} Sets the list of options displayed inside the select element. */
    this.options = [];

    /** @type {string|null} Sets a default option with empty value. */
    this.placeholder = null;

    /** @type {boolean} Sets the "required" text inside the label */
    this.required = false;

    /** @type {string|null} Sets the selected value of the element. */
    this.value = null;

    // use this unique id for isolation (Safari seems to have a bug)
    /** @type {string} used by the aria-describedby attribute on the `<select>` element and the `id` attribute on the error slot container */
    this._uniqueErrorId = Math.random().toString(36).slice(2);

    // use this unique id for isolation (Safari seems to have a bug)
    /** @type {string} used by the `aria-describedby` attribute on the `<select>` element and the `id` attribute on the help text container */
    this._uniqueHelpId = Math.random().toString(36).slice(2);

    // use this unique name for isolation (Safari seems to have a bug)
    /** @type {string} used by the for/id relation between `<label>` and `<select>` */
    this._uniqueInputId = Math.random().toString(36).slice(2);
  }

  /**
   * Triggers focus on the inner `<select>` element.
   */
  focus () {
    this.shadowRoot.querySelector('select').focus();
  }

  _onSelectInput (e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  render () {
    return html`
      <label for=${this._uniqueInputId}>
        <span>${this.label}</span>
        ${this.required ? html`
          <span class="required">${i18n('cc-select.required')}</span>
        ` : ''}
      </label>
      <div class="selectWrapper ${classMap({ disabled: this.disabled })}">
        <select
          id=${this._uniqueInputId}
          ?disabled=${this.disabled}
          aria-describedby="${this._uniqueHelpId} ${this._uniqueErrorId}"
          @input=${this._onSelectInput}
        >
          ${this.placeholder != null && this.placeholder !== '' ? html`
            <option value="" disabled selected>${this.placeholder}</option>
          ` : ''}
          ${this.options.map((option) => html`
            <option
              value=${option.value}
              ?selected=${option.value === this.value}
            >
              ${option.label}
            </option>
          `)}
        </select>
      </div>

      <div class="help-container" id=${this._uniqueHelpId}>
        <slot name="help"></slot>
      </div>

      <div class="error-container" id=${this._uniqueErrorId}>
        <slot name="error"></slot>
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: inline-block;
        }

        /*region Common to cc-input-* & cc-select*/
        :host([inline]) {
          display: inline-grid;
          gap: 0 1em;
          grid-template-areas: "label input"
                              ". help"
                              ". error";
          grid-template-columns: auto 1fr;
        }

        .help-container {
          grid-area: help;
        }

        .error-container {
          grid-area: error;
        }

        label {
          align-items: flex-end;
          cursor: pointer;
          display: flex;
          gap: 2em;
          justify-content: space-between;
          line-height: 1.25em;
          padding-bottom: 0.35em;
        }

        :host([inline]) label {
          flex-direction: column;
          gap: 0;
          grid-area: label;
          justify-content: center;
          line-height: normal;
          padding: 0;
        }

        .required {
          color: var(--cc-color-text-weak);
          font-size: 0.9em;
          font-variant: small-caps;
        }

        :host([inline]) .required {
          font-size: 0.8em;
        }

        slot[name='help']::slotted(*) {
          color: var(--cc-color-text-weak);
          font-size: 0.9em;
          margin: 0.3em 0 0 0;
        }
        
        slot[name='error']::slotted(*) {
          color: var(--cc-color-text-danger);
          margin: 0.5em 0 0 0;
        }
        /*endregion*/

        /* RESET */
        select {
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          background: none;
          border: none;
          color: inherit;
          cursor: inherit;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          margin: 0;
          padding: 0;
          width: 100%;
        }

        select {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid #aaa;
          border-radius: 0.25em;
          box-sizing: border-box;
          grid-area: input;
          height: 2em;
          padding: 0 3em 0 0.5em;
        }

        select:hover {
          border-color: #777;
          cursor: pointer;
        }

        select:focus {
          border-color: #777;
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
          outline: 0;
        }

        .selectWrapper {
          display: inline-flex;
          position: relative;
          vertical-align: top;
          width: 100%;
        }

        .selectWrapper::after {
          background-color: var(--cc-color-bg-primary, #000000);
          clip-path: polygon(100% 0%, 0 0%, 50% 100%);
          content: '';
          height: 0.5em;
          position: absolute;
          right: 0.5em;
          top: 50%;
          transform: translateY(-50%);
          width: 0.8em;
        }

        .disabled::after {
          background-color: hsl(0, 0%, 62%);
        }

        select[disabled] {
          background: var(--cc-color-bg-neutral-disabled);
          border-color: var(--cc-color-bg-neutral-disabled);
          color: var(--cc-color-text-weak);
          opacity: 1;
          pointer-events: none;
        }
      `,
    ];
  }
}

window.customElements.define('cc-select', CcSelect);
