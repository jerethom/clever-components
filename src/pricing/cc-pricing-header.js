import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';

/**
 * A component doing X and Y (one liner description of your component).
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/pricing/cc-pricing-header.js)
 *
 * ## Type definitions
 *
 * ```js
 * interface Zone {
 *   name: string,          // Unique code/identifier for the zone
 *   lat: number,           // Latitude
 *   lon: number,           // Longitude
 *   countryCode: string,   // ISO 3166-1 alpha-2 code of the country (2 letters): "FR", "CA", "US"...
 *   city: string,          // Name of the city in english: "Paris", "Montreal", "New York City"...
 *   country: string,       // Name of the country in english: "France", "Canada", "United States"...
 *   displayName?: string,  // Optional display name for private zones (instead of displaying city + country): "ACME (dedicated)"...
 *   tags: string[],        // Array of strings for semantic tags: ["region:eu", "infra:clever-cloud"], ["scope:private"]...
 * }
 * ```
 *
 * @prop {Zone} selectedZone - the hosting zone selected for the items
 * @prop {Array<Zone>} zones - Sets  all the zone for the select
 * @prop {Array<Item>} items  - Sets all the products selected to calculate the price
 * @prop {String} pricingCurrency - Sets the current pricing currency
 *
 * @event {CustomEvent<ExampleInterface>} cc-pricing-header:change-currency - Fires XXX whenever YYY.
 * @event {CustomEvent<ExampleInterface>} cc-pricing-header:change-zone - Fires XXX whenever YYY.
 *
 *
 */
export class CcPricingHeader extends LitElement {

  static get properties () {
    return {
      _currencies: { type: Array },
      pricingCurrency: { type: String },
      selectedProducts: { type: Object },
      currency: { type: String },
      zones: { type: Array },
    };
  }

  constructor () {
    super();
    /** We use an object with the codes that we choose to support as we use the ```Intl.Numberformat()``` function
         * to format the prices which use the code so we don't need the symbol
         */
    this._currencies = [
      { code: 'EUR', displayValue: '€ EUR' },
      { code: 'GBP', displayValue: '£ GBP' },
      { code: 'USD', displayValue: '$ USD' },
    ];
    this.currency = 'EUR';
    this.selectedProducts = {};
    // TODO: Temp to change default array
    this.zones = [
      {
        name: 'PAR',
        country: 'France',
        countryCode: 'FR',
        city: 'Paris',
        lat: 48.87,
        lon: 2.33,
        tags: ['infra:clever-cloud', 'region:eu'],
      },
      {
        name: 'RBX',
        country: 'France',
        countryCode: 'FR',
        city: 'Roubaix',
        lat: 50.69,
        lon: 3.17,
        tags: ['region:eu', 'infra:ovh'],
      },
      {
        name: 'WAR',
        country: 'Poland',
        countryCode: 'PL',
        city: 'Warsaw',
        lat: 52.23,
        lon: 21.01,
        tags: ['region:eu', 'infra:ovh'],
      },
    ];
  }

  _getTotalPrice () {
    let totalPrice = 0;
    for (const p of Object.values(this.selectedProducts)) {
      if (p != null) totalPrice += p.item.price * p.quantity;
    }
    return totalPrice;
  }

  _onCurrencyChange (e) {
    dispatchCustomEvent(this, 'change-currency', e.target.value);
  }

  _onZoneInput ({ detail: zoneName }) {
    dispatchCustomEvent(this, 'change-zone', zoneName);
  }

  render () {

    return html`
            <div class="header">
                <div class="select-currency">
                   ${i18n('cc-pricing-header.currency-text')}:
                    <select @change=${this._onCurrencyChange}>
                        ${this._currencies.map((c) => html`
                            <option value=${c.code}>${c.displayValue}</option>`)}
                    </select>
                </div>
                <div class="zones">
                  <cc-zone-input
                    .zones=${this.zones}
                    @cc-zone-input:input=${this._onZoneInput}
                    selected=PAR
                  >
                  </cc-zone-input>
                </div>
                <div class="est-cost">
                  ${i18n('cc-pricing-header.est-cost')}:
                    ${i18n('cc-pricing-header.price', { price: this._getTotalPrice(), code: this.currency })}
                </div>
            </div>
        `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
                :host {
                    background-color: #FFFAFA;
                    box-shadow: 0 0 0.5rem #aaa;
                    display: block;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    wdith: 100%;
                }

                .zones {
                    max-width: 550px;
                }

                .header {
                    align-items: center;
                    display: flex;
                    justify-content: space-between;
                }
            `,
    ];
  }
}

window.customElements.define('cc-pricing-header', CcPricingHeader);
