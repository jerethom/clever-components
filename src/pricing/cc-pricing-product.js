import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import '../atoms/cc-img.js';
import './cc-pricing-table.js';
import {i18n} from "../lib/i18n";

/**
 * A component doing X and Y (one liner description of your component).
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/pricing/cc-pricing-product.js)
 *
*
 * ## Type definitions
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
 * ```
 *
 * ```js
 * interface ProductIcon {
 *     url: string,
 *     alt: string,
 * }
 * ```
 *
 * @prop {Array<Item>} items - Sets the items of the product.
 * @prop {Array<Feature>} features - Sets the features of the product
 * @prop {String} name  - Sets the title of the product.
 * @prop {String} description - Sets the description of the product.
 * @prop {String} icon - Sets the url of the product image.
 * @prop {string} currency - Sets the current currency used when displaying the price.
 * @prop {Array<ProductIcon>} icons - Sets the Icon for a runtime product
 *
 * @event {CustomEvent<Product>} cc-pricing-product:add-product - Fires a product add event whenever we add a product from the button.
 *
 */
export class CcPricingProduct extends LitElement {

  static get properties () {
    return {
      icon: { type: String },
      title: { type: String },
      description: { type: String },
      items: { type: Array },
      features: { type: Array },
      currency: { type: String },
      icons: { type: Array },
    };
  }

  constructor () {
    super();
    this.currency = 'EUR';
    this.icons = [];
  }

  // DOCS: 7. Event handlers

  _onAddProduct ({ detail: item }) {
    const product = this.title;
    dispatchCustomEvent(this, 'add-product', { productName: product, item });
  }

  render () {

    return html`
      <div class="product-icons">
        ${this.icons !== undefined
        ? this.icons.map((i) => html`
          <cc-img src=${i.url} alt=${i.alt}>
          </cc-img>
        `)
        : []
        }
      </div>
     <div class="head">
        <cc-img 
            src="${this.icon}" 
            alt="${this.title}-logo"
            style="--cc-img-fit: contain;"
        ></cc-img>
        <div class="title">${this.title}</div>
     </div>
      <div class="description">${this.description}</div>
     <cc-pricing-table 
     .items=${this.items}
     .features=${this.features}
     currency=${this.currency}
     @cc-pricing-table:add-item=${this._onAddProduct}
     ></cc-pricing-table>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          box-shadow: 0 0 0.5rem #aaa;
          display: grid;
          gap: 1rem;
        } 
        
        .head {
          align-items: center;
          display: flex;
          padding: 1rem 1rem 0 1rem;
        }
        
        .title {
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .description {
          padding: 0 1rem;
        }
        
        cc-img {
          border-radius: 0.25rem;
          height: 3rem;
          margin-right: 1rem;
          width: 3rem;
        }
        
      `,
    ];
  }
}

window.customElements.define('cc-pricing-product', CcPricingProduct);
