import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';
import '../atoms/cc-img.js';
import { withResizeObserver } from '../mixins/with-resize-observer.js';

const addSvg = new URL('../assets/circle.svg', import.meta.url).href;
const chevronSvg = new URL('../assets/chevron-down.svg', import.meta.url).href;

/**
 * A component displaying produccts information in a table
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/pricing/cc-pricing-table.js)
 *
 * ## Type definitions
 *
 * ```js
 * interface Item {
 *   name: string,
 *   price: number,
 *   features: feature[],
 * }
 * ```
 *
 * ```js
 * interface Feature {
 *   code: string,
 *   typeSlug: String,
 *   featureValue?: number|string,
 * }
 * ```
 * ## Images
 *
 * | | |
 * |-------|------|
 * | <img src="../assets/circle.svg" style="height: 1.5rem; vertical-align: middle"> | <code>circle.svg</code>
 * | <img src="../assets/chevron-down.svg" style="height: 1.5rem; vertical-align: middle"> | <code>chevron-down.svg</code>
 *
 * @prop { Array<Feature> } features - Sets the feature needed for the table (Act as columns).
 * @prop { Array<Item> } items - Sets the data needed for the content of the table.
 * @prop { String } currency - Sets the currency needed (e.g: 'EUR').
 *
 * @event {CustomEvent<Item>} cc-pricing-table:add-item - TODO: Fires XXX whenever YYY.
 */
export class CcPricingTable extends withResizeObserver(LitElement) {

  static get properties () {
    return {
      currency: { type: String },
      features: { type: Array },
      items: { type: Array },
      _items: { type: Array },
      _size: { type: String },
    };
  }

  constructor () {
    super();
    this.currency = 'EUR';
  }

  onResize ({ width }) {
    this._size = width;
  }

  _getFeatureName (featureCode) {
    switch (featureCode) {
      case 'backup':
        return i18n('cc-pricing-table.feature.backup');
      case 'connection-limit':
        return i18n('cc-pricing-table.feature.connection-limit');
      case 'cpu':
        return i18n('cc-pricing-table.feature.cpu');
      case 'database':
        return i18n('cc-pricing-table.feature.database');
      case 'disk-size':
        return i18n('cc-pricing-table.feature.disk-size');
      case 'encryption':
        return i18n('cc-pricing-table.feature.encryption');
      case 'isolation':
        return i18n('cc-pricing-table.feature.isolation');
      case 'logs':
        return i18n('cc-pricing-table.feature.logs');
      case 'max-db-size':
        return i18n('cc-pricing-table.feature.max-db-size');
      case 'memory':
        return i18n('cc-pricing-table.feature.memory');
      case 'metrics':
        return i18n('cc-pricing-table.feature.metrics');
      case 'migration':
        return i18n('cc-pricing-table.feature.migration');
      case 'mount':
        return i18n('cc-pricing-table.feature.mount');
      case 'node':
        return i18n('cc-pricing-table.feature.node');
      case 'postgis':
        return i18n('cc-pricing-table.feature.postgis');
      case 'type-shared':
        return i18n('cc-pricing-table.feature.type-shared');
      case 'mongo-version':
        return i18n('cc-pricing-table.feature.mongo-version');
    }
  }

  _getTypeFormat (typeSlug, value) {
    switch (typeSlug) {
      case 'number':
        return i18n('cc-pricing-table.type.number', { number: value });
      case 'bytes':
        return i18n('cc-pricing-table.type.bytes', { bytes: value });
      case 'boolean':
        return i18n('cc-pricing-table.type.boolean', { boolean: value });
      case 'boolean-shared':
        return i18n('cc-pricing-table.type.boolean-shared', { booleanShared: value });
      case 'mount':
        return i18n('cc-pricing-table.type.mount');
      case 'mongo-version':
        return i18n('cc-pricing-table.type.mongo-version');
      case 'object':
        return 'test-backup';
    }
  }

  _renderSmallItems () {

    return html`
      <div class="container">
        ${this._items.map((item) => html`
          <div class="plan" id=${item.id} data-state=${item.state}>
            <div class="head-separator"></div>
            <div class="add-item">
              <button class="add-item-btn"  @click=${() => this._onAddItem(item)}>
                <img src=${addSvg} alt="">
              </button>
            </div>
            <div class="plan-name">${item.name}</div>
            <div class="set-data-state">
              <button @click=${() => this._onToggleState(item)}>
                <img src=${chevronSvg} alt="">
              </button>
            </div>
            <div class="bottom-separator"></div>
            <div class="plan-infos">
              ${this._renderSmallItemFeatures(item.features)}
              <div class="feature">
                <div class="name">${i18n('cc-pricing-table.priceNameDaily')}</div>
                <div class="number-align">${i18n('cc-pricing-table.price', { price: item.price.daily, code: this.currency })}</div>
              </div>
              <div class="feature">
                <div class="name">${i18n('cc-pricing-table.priceNameMonthly')}</div>
                <div class="number-align">${i18n('cc-pricing-table.price', { price: item.price.monthly, code: this.currency })}</div>
              </div>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  _renderSmallItemFeatures (itemFeatures) {
    return this.features.map((feature) => {
      const currentFeature = itemFeatures.find((itemFeature) => feature.code === itemFeature.code);
      return html`
        <div class="feature">
          <div class="name">${this._getFeatureName(currentFeature.code)}</div>
          <div class="value">${this._getTypeFormat(currentFeature.typeSlug, currentFeature.featureValue)}</div>
        </div>
      `;
    });
  }

  /**
   * Format every items into a table row with their properties transformed into table data
   * @returns {Array<TemplateResult>} returns a formatted array with all the items and their features associated
   */
  _renderBigItems () {

    return html`
      <table>
        <tr>
          <th></th>
          <th>Plan</th>
          ${this.features.map((feature) => {
            return html`<th>${this._getFeatureName(feature.code)}</th>`;
    })}
          <th>${i18n('cc-pricing-table.priceNameDaily')}</th>
          <th>${i18n('cc-pricing-table.priceNameMonthly')}</th>
        </tr>
        ${this._items.map((item) => html`
          <tr>
            <td>
              <button class="add-item-btn" @click=${() => this._onAddItem(item)}>
                <img src=${addSvg} alt="">
              </button>
            </td>
            <td>${item.name}</td>
            ${this._renderBigItemFeatures(item.features)}
            <td class="number-align">${i18n('cc-pricing-table.price', { price: item.price.daily, code: this.currency })}</td>
            <td class="number-align">${i18n('cc-pricing-table.price', { price: item.price.monthly, code: this.currency })}</td>
          </tr>
        `)}
      </table>
    `;
  }

  /**
   * Loop through every global feature and put the feature that we have in the item at the correct place
   * (this step is mandatory because the order of the global features can be in a different order than the one that
   * we have in the features for an item)
   * @returns {Array<html>} returns for an item all the features formatted and in the correct order
   */
  _renderBigItemFeatures (itemFeatures) {
    return this.features.map((feature) => {
      const currentFeature = itemFeatures.find((itemFeature) => feature.code === itemFeature.code);
      const classes = this._getAlignment(currentFeature.typeSlug);
      return html`<td class=${classMap(classes)}>${this._getTypeFormat(currentFeature.typeSlug, currentFeature.featureValue)}</td>`;
    });
  }

  _getAlignment (typeSlug) {
    return (typeSlug === 'number' || typeSlug === 'bytes')
      ? { 'number-align': true }
      : { 'number-align': false };
  }

  _onAddItem (item) {
    dispatchCustomEvent(this, 'add-item', item);
  }

  _onToggleState (newItem) {
    this._items = this._items.map((item) => {
      return (item === newItem)
        ? { ...item, state: (item.state === 'closed') ? 'opened' : 'closed' }
        : item;
    });
  }

  update (changedProperties) {

    if (changedProperties.has('items') && Array.isArray(this.items)) {
      this._items = this.items
        .map((item) => {
          return { ...item, state: 'closed' };
        })
        .sort((i1, i2) => i1.price.daily - i2.price.daily);
    }
    super.update(changedProperties);
  }

  render () {
    // TODO: why 550 ?
    // table overlapping is not triggering the resize properly
    return (this._size > 550)
      ? this._renderBigItems()
      : this._renderSmallItems();
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        /* Table properties for big screen size */

        table {
          border-collapse: collapse;
          border-spacing: 0;
          width: 100%;
        }

        th {
          height: 4rem;
        }

        th {
          background-color: #f6f6fb;
          text-shadow: 1px 1px 1px #fff;
        }

        tr:nth-child(n+3) {
          border-top: 0.1rem solid #e5e5e5;
        }

        td {
          padding: 1rem;
        }

        /* Properties for small screen size */

        .plan {
          display: grid;
          grid-gap: 0.25rem;
          grid-template-areas:
            "h-separator h-separator h-separator"
            "add-btn plan-name state-btn"
            "b-separator b-separator b-separator"
            "txt txt txt";
          padding: 0.25rem;
        }

        .add-item {
          align-self: start;
          grid-area: add-btn;
          justify-self: start;
        }

        .set-data-state {
          align-self: center;
          grid-area: state-btn;
          justify-self: right;
        }

        .set-data-state button {
          background: transparent;
          cursor: pointer;
          border: none;
          height: 1.5rem;
          width: 1.5rem;
        }

        .plan[data-state="closed"] {
          display: grid;
          grid-gap: 0.25rem;
          padding: 0.25rem;
          grid-template-areas:
            "h-separator h-separator h-separator"
            "add-btn plan-name state-btn"
            "b-separator b-separator b-separator"
            "x txt txt";
       }

        .plan[data-state="closed"] .plan-infos {
          display: flex;
          flex-wrap: wrap;
        }

        .plan-name {
          align-self: center;
          font-style: italic;
          font-weight: bold;
          grid-area: plan-name;
          justify-self: center;
        }
        
        .plan[data-state="closed"] .plan-name {
          justify-self: start;
        }
        
        .plan-infos {
          grid-area: txt;
          padding: 0.5rem;
        }

        .feature {
          display: flex;
          justify-content: space-between;
        }

        .head-separator {
          border-bottom: 0.10rem solid #e5e5e5;
          grid-area: h-separator;
        }

        .bottom-separator {
          border-bottom: 0.10rem solid #e5e5e5;
          grid-area: b-separator;
        }

        .feature:not(:first-child) {
          border-top: 1px solid #e5e5e5;
        }

        .plan[data-state="closed"] .feature {
          border: none;
          display: contents;
        }

        .name {
          font-weight: bold;
        }

        .plan[data-state="closed"] .name {
          flex-wrap: wrap;
          font-weight: normal;
        }

        .plan[data-state="closed"] .name::after {
          content: ':';
          padding-right: 0.25rem;
        }

        .plan[data-state="closed"] .feature:not(:last-child) .value::after {
          content: ',';
          padding-right: 0.5rem;
        }

        .plan-add {
          margin-bottom: 0.25rem;
          padding: 0.25rem;
        }

        /* Global properties */

        .number-align {
          text-align: right;
        }

        .add-item-btn {
          background: transparent;
          border: none;
        }

        .add-item-btn img {
          filter: brightness(100%);
          height: 1.5rem;
          width: 1.5rem;
        }

        .add-item-btn img:hover {
          cursor: pointer;
          filter: brightness(50%);
          transition: all 0.75s ease;
        }

      `,
    ];
  }
}

window.customElements.define('cc-pricing-table', CcPricingTable);
