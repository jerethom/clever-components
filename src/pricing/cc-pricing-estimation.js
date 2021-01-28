import '../atoms/cc-button.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';

/**
 * A component doing X and Y (one liner description of your component).
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/pricing/cc-pricing-estimation.js)
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
 * ```js
 * interface Product {
 *     productName: string,
 *     item: Item
 * }
 * ```
 *
 * ```js
 * interface Item {
 *   name: string,
 *   pricing: number,
 *   features: feature[],
 * }
 * ```
 *
 * ```js
 * interface Feature {
 *   code: string,
 *   value: string|number|boolean,
 * }
 * ``
 *
 * ## Images
 *
 * | | |
 * |-------|------|
 * | <img src="/src/assets/circle.svg" style="height: 1.5rem"> | <code>circle.svg</code>
 * | <img src="/src/assets/minus.svg" style="height: 1.5rem"> | <code>minus.svg</code>
 *
 * @prop {Zone} selectedZone - Sets the zone selected for the items.
 * @prop {Array<Zone>} zones - Sets all the zone.
 * @prop {Array<Product>} selectedProducts - Sets the products selected from the user in the page.
 * @prop {String} currency - Sets the current currency code.
 *
 * @event {CustomEvent<ExampleInterface>} cc-pricing-estimation:change-quantity - Fires XXX whenever YYY.
 *
 */
export class CcPricingEstimation extends withResizeObserver(LitElement) {

  // DOCS: 1. LitElement's properties descriptor

  static get properties () {
    return {
      selectedProducts: { type: Object },
      currency: { type: String },
    };
  }

  // DOCS: 2. Constructor

  constructor () {
    super();
    this.selectedProducts = {};
    this._totalPrice = 0;
    this.breakpoints = {
      width: [600],
    };
    this.currency = 'EUR';
  }

  _renderSelProducts () {
    return Object.values(this.selectedProducts).map((p) => {
      return (p != null)
        ? html`
          <tr>
            <td>
              <button class="change-qt-btn"  @click=${() => this._onChangeQuantity(p, 'add')}>
                <img src=${new URL('../assets/circle.svg', import.meta.url).href} />
              </button>
              <button class="change-qt-btn"  @click=${() => this._onChangeQuantity(p, 'remove')}>
                <img src=${new URL('../assets/minus.svg', import.meta.url).href} />
              </button>

            </td>
            <td>${p.productName}</td>
            <td>${p.item.name}</td>
            <td>${p.quantity}</td>
            <td class="price-item">${i18n('cc-pricing-table.price', { price: p.item.price * p.quantity, code: this.currency })}</td>
          </tr>`
        : '';

    });
  }

  // TODO: put this in a separate lib
  _getTotalPrice () {
    let totalPrice = 0;
    for (const p of Object.values(this.selectedProducts)) {
      if (p != null) totalPrice += p.item.price * p.quantity;
    }
    return totalPrice;
  }

  _onChangeQuantity (product, action) {
    if (action === 'remove') {
      dispatchCustomEvent(this, 'change-quantity', { ...product, quantity: product.quantity - 1 });
    }
    else if (action === 'add') {
      dispatchCustomEvent(this, 'change-quantity', { ...product, quantity: product.quantity + 1 });
    }
  }

  render () {
    return html`

      <table>
        ${this._getTotalPrice() > 0
            ? html`
          <tr>
            <th></th>
            <th>${i18n('cc-pricing-estimation.product')}</th>
            <th>${i18n('cc-pricing-estimation.size')}</th>
            <th>${i18n('cc-pricing-estimation.quantity')}</th>
            <th>${i18n('cc-pricing-estimation.priceName')}</th>
          </tr>`
            : ''
        }
        ${this._renderSelProducts()}
      </table>

      <div class="recap">
        <div class="monthly-est">${i18n('cc-pricing-estimation.monthly-est')}:</div>
        <div class="cost-price"> ${i18n('cc-pricing-estimation.price', { price: this._getTotalPrice(), code: this.currency })} </div>
        <div class="recap-buttons">
          <button class="contact-sales">${i18n('cc-pricing-estimation.sales')}</button>
          <button class="sign-up">${i18n('cc-pricing-estimation.sign-up')}</button>
        </div>
      </div>
    `;
  }

  // DOCS: 11. LitElement's styles descriptor

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
        
        table {
          border-collapse: collapse;
          border-spacing: 0;
          font-family: arial, sans-serif;
          width: 100%;
        }

        th {
          background-color: #f6f6fb;
          font-size: 1.25rem;
          padding: 10px;
          text-align: left;
          text-shadow: 1px 1px 1px #fff;
        }

        table  th:first-child {
          border-radius: 10px 0 0 10px;
        }

        table th:last-child {
          border-radius: 0 10px 10px 0;
        }

        tr:nth-child(n+3) {
          border-top: 0.10rem solid #e5e5e5;
        }

        td {
          padding: 0.25rem;
        }

        .recap {
          background-color: #3a3771;
          border-radius: 0.2rem;
          color: white;
          display: grid;
          gap: 1rem;
          grid-template-areas: 
                "txt price"
                "btn btn";
          margin-top: 1rem;
          padding: 1rem 0 1rem 1rem;
        }

        :host([w-gte-600]) .recap {
          grid-template-areas: 
                "txt btn"
                "price btn";
        }

        :host([w-gte-600]) .recap-buttons {
          justify-self: right;
        }

        .monthly-est {
          align-self: center;
          grid-area: txt;
          justify-self: center;

        }

        .cost-price {
          align-self: center;
          font-size: 2rem;
          grid-area: price;
          justify-self: center;
        }

        .recap-buttons {
          align-self: center;
          display: flex;
          gap: 1.5rem;
          grid-area: btn;
          justify-self: center;
          margin-right: 1.5rem; 
        }

        .contact-sales {
          border-color: transparent;
          border-radius: 0.25rem;
          color: #3a3871;
          padding: 0.75rem 2.5rem 0.75rem 2.5rem; 
        }
        
        .contact-sales:hover {
          cursor: pointer;
        }
        
        .sign-up {
          background-color: transparent;
          border-color: #cccccc;
          border-radius: 0.25rem;
          border-style: solid;
          color: #ffffff;
          padding: 0.75rem;
        }
        
        .sign-up:hover {
          background-color: rgba(255, 255, 255, 0.1);
          cursor: pointer;
        }
        
        .price-item {
          text-align: right;
        }


        .change-qt-btn {
          background: transparent;
          border: none;
        }

        .change-qt-btn img {
          filter: brightness(100%);
          height: 32px;
          width: 32px;
        }

        .change-qt-btn img:hover {
          cursor: pointer;
          filter: brightness(50%);
          -moz-transition: all 0.75s ease;
          -o-transition: all 0.75s ease;
          -ms-transition: all 0.75s ease;
          transition: all 0.75s ease;
          transition: all 0.75s ease;
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-estimation', CcPricingEstimation);
