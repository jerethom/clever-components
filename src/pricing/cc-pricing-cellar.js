import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n';

/**
 * A component doing X and Y (one liner description of your component).
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/dir/cc-example-component.js)
 *
 * ## Details
 *
 * * Details about bla.
 * * Details about bla bla.
 * * Details about bla bla bla.
 *
 * ## Technical details
 *
 * * Technical details about foo.
 * * Technical details about bar.
 * * Technical details about baz.
 *
 * ## Type definitions
 *
 * ```js
 * interface ExampleInterface {
 *   one: string,
 *   two: number,
 *   three: boolean,
 * }
 * ```
 *
 * ## Images
 *
 * | | |
 * |-------|------|
 * | <img src="/src/assets/warning.svg" style="height: 1.5rem; vertical-align: middle"> | <code>warning.svg</code>
 * | <img src="/src/assets/redirection-off.svg" style="height: 1.5rem; vertical-align: middle"> | <code>redirection-off.svg</code>
 *
 * @prop {String} one - Description for one.
 * @prop {Boolean} two - Description for two.
 * @prop {ExampleInterface[]} three - Description for three.
 *
 * @event {CustomEvent<ExampleInterface>} example-component:event-name - Fires XXX whenever YYY.
 *
 * @slot - The content of the button (text or HTML). If you want an image, please look at the `image` attribute.
 *
 * @cssprop {Color} --cc-loader-color - The color of the animated circle (defaults: `#2653af`).
 */
export class CcPricingCellar extends LitElement {

  // DOCS: 1. LitElement's properties descriptor

  static get properties () {
    return {
      _cellarInfos: { type: Object },
      _totalPrice: { type: Number },
    };
  }

  // DOCS: 2. Constructor

  constructor () {
    super();
    this._totalPrice = 0;
    // One possibility is to have an object like below to render and check our "quota" in a generic way
    // min max are TiB
    // price is the price per GiB per month
    this._cellarInfos = {
      storage: [
        {
          minRange: 0,
          maxRange: 1048576,
          minRangeDisplay: 0,
          maxRangeDisplay: 1099511627776,
          price: 0.02,
          highlighted: false,
          totalPrice: {
            price: 0,
            visible: false,
          },
        },
        {
          minRange: 1048576,
          maxRange: 26214400,
          minRangeDisplay: 1099511627776,
          maxRangeDisplay: 27487790694400,
          price: 0.015,
          highlighted: false,
          totalPrice: {
            price: 0,
            visible: false,
          },
        },
        {
          minRange: 26214400,
          // -1 to represent infinity
          maxRange: -1,
          minRangeDisplay: 27487790694400,
          maxRangeDisplay: '∞',
          price: 0.01,
          highlighted: false,
          totalPrice: {
            price: 0,
            hidden: false,
          },
        },
      ],
      traffic: [
        {
          minRange: 0,
          maxRange: 10485760,
          minRangeDisplay: 0,
          maxRangeDisplay: 10995116277760,
          price: 0.09,
          highlighted: false,
          totalPrice: {
            price: 0,
            visible: false,
          },
        },
        {
          minRange: 10485760,
          // -1 to represent infinity
          maxRange: -1,
          minRangeDisplay: 10995116277760,
          maxRangeDisplay: '∞',
          price: 0.07,
          highlighted: false,
          totalPrice: {
            price: 0,
            visible: false,
          },
        },
      ],
    };
  }

  // DOCS: 3. Property getters

  // DOCS: 5. Public methods

  // DOCS: 6. Private methods

  // Might need to refactor later Can't we use reduce ???
  _getTotal () {
    const totalStorage = Object.values(this._cellarInfos.storage).find((elem) => elem.totalPrice.price !== 0);
    const trafficStorage = Object.values(this._cellarInfos.traffic).find((elem) => elem.totalPrice.price !== 0);
    return (totalStorage?.totalPrice.price ?? 0) + (trafficStorage?.totalPrice.price ?? 0);
  }

  _renderInfos (placeholder, infos) {
    return infos.map((info) => {
      return html`
        <div class="${placeholder}-infos">
          <div class="info">
            <span class=${classMap({ highlighted: info.highlighted })}>
              ${(info.maxRange !== -1)
                ? html`${i18n('cc-pricing-cellar.bytes', { bytes: info.minRangeDisplay })} <= ${placeholder} < ${i18n('cc-pricing-cellar.bytes', { bytes: info.maxRangeDisplay })}`
                : html`${i18n('cc-pricing-cellar.bytes', { bytes: info.minRangeDisplay })}<= ${placeholder} < ${info.maxRangeDisplay}`
                  }
                </span>
              </div>
              <div class="price">
                ${i18n('cc-pricing-cellar.format-price', { price: info.price })}/ GiB / ${i18n('cc-pricing-cellar.per-month-text')}
              </div>
          <div class=${classMap({ price_estimation: true, visible: info.totalPrice.visible })}>
          Price
            ${i18n('cc-pricing-cellar.format-price', { price: info.totalPrice.price.toFixed(2) })}
          </div>
      `;
    });
  }

  // DOCS: 7. Event handlers

  // Shouldn't we use one function that the event handlers will use as they're doing basically the same ?

  _onStorageChanged (e) {
    const quantity = parseInt(e.target.value);
    const newStorage = this._cellarInfos.storage.map((info) => {
      if (info.maxRange !== -1) {
        info.highlighted = quantity >= info.minRange && quantity < info.maxRange;
        info.totalPrice.visible = info.highlighted;
        info.totalPrice.price = (info.totalPrice.visible)
          ? ((quantity / 1000) * info.price)
          : 0;
      }
      else {
        info.highlighted = quantity >= info.minRange;
        info.totalPrice.visible = info.highlighted;
        info.totalPrice.price = (info.totalPrice.visible)
          ? ((quantity / 1000) * info.price)
          : 0;
      }
      return info;
    });
    this._cellarInfos = { storage: newStorage, ...this._cellarInfos };
    this._totalPrice = this._getTotal();
  }

  _onTrafficChanged (e) {
    const storage = parseInt(e.target.value);

    const newTraffic = this._cellarInfos.traffic.map((info) => {
      if (info.maxRange !== -1) {
        info.highlighted = storage >= info.minRange && storage < info.maxRange;
        info.totalPrice.visible = info.highlighted;
        info.totalPrice.price = (info.totalPrice.visible)
          ? ((storage / 1000) * info.price)
          : 0;
      }
      else {
        info.highlighted = storage >= info.minRange;
        info.totalPrice.visible = info.highlighted;
        info.totalPrice.price = (info.totalPrice.visible)
          ? ((storage / 1000) * info.price)
          : 0;
      }
      return info;
    });
    this._cellarInfos = { ...this._cellarInfos, traffic: newTraffic };
    this._totalPrice = this._getTotal();
  }

  // DOCS: 10. LitElement's render method

  render () {
    return html`
            <div class="cellar-recap">
                bla bla bla
            </div>

            <div class="title">Estimate your cellar cost</div>

            <div class="title-storage">Storage</div>

            <input type="number" @change=${this._onStorageChanged}> MiB
            
            ${this._renderInfos('storage', this._cellarInfos.storage)}
            
            <div class="title-traffic">Outbound Traffic</div>

            <input type="number" @change=${this._onTrafficChanged}> MiB
            
            ${this._renderInfos('outbound traffic', this._cellarInfos.traffic)}
            
            <div class="total-recap">
                Total
            <div class="estimated-monthly">
              ${i18n('cc-pricing-cellar.format-price', { price: this._totalPrice.toFixed(2) })}
            </div>
            </div>
        `;
  }

  connectedCallback () {
    super.connectedCallback();
  }

  static get styles () {
    return [
      // language=CSS
      css`
                :host {
                    /* You may use another display type but you need to define one. */
                    display: block;
                }
                
                .price_estimation {
                    display: none;
                }
                
                .visible {
                  display: block;
                }
                
                .highlighted {
                  background-color:#FFFF00;
                }
                
            `,
    ];
  }
}

window.customElements.define('cc-pricing-cellar', CcPricingCellar);
