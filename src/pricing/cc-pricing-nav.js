// DOCS: Don't add a 'use strict', no need for them in modern JS modules.
// DOCS: Put all imports here.
// DOCS: Always keep the ".js" at the end when you reference a file directly [error in ESLint].
// DOCS: We enforce import order [fixed by ESLint].
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';

/**
 * A component doing X and Y (one liner description of your component).
 *
 * * 🎨 default css display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/pricing/cc-pricing-nav.js)
 *
  * Technical details about baz.
 *
 * ## Type definitions
 *
 * ```js
 * interface navItem {
 *   icon: string,
 *   name: string,
 * }
 * ```
 *
 *
 * @prop {Array<navItem>} navItems - Sets the nav items to render
 *
 * @event {CustomEvent<navItem>} cc-pricing-nav:select-item - Fires XXX whenever YYY.
 *
 */
export class CcPricingNav extends LitElement {

  // DOCS: 1. LitElement's properties descriptor

  static get properties () {
    return {
      navItems: { type: Array },
      selected: { type: String },
    };
  }

  // DOCS: 2. Constructor

  constructor () {
    super();
    this.navItems = [];
  }

  // DOCS: 7. Event handlers

  _onItemSelected (itemName) {
    this.selected = itemName;
    dispatchCustomEvent(this, 'select-item', itemName);
  }

  firstUpdated () {
    this.navItems.map((item) => {
      item.selected = false;
      return item;
    });
  }

  render () {

    return html`
        <ul>
          ${this.navItems.map((item) => html`
              <li>
              <button 
                  class=${classMap({ selected: item.selected, btn_nav: true })}
                  @click=${() => this._onItemSelected(item.name)}>
                <img class="icon" src=${item.icon} alt="Nav icon" />
                ${item.name.toUpperCase()}
              </button>
          </li>
        `)}
        </ul>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
        
        .icon {
          height: 1.5rem;
          width: 1.5rem;
        }
       
        ul {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        li .btn_nav img {
          vertical-align: middle;
        }
        
        li {
          list-style-type: none;
        } 
        
        .btn_nav  {
          border: none;
          color: black;
          opacity: 0.5; 
        }
        
        .btn_nav:hover {
          background-color: transparent;
          opacity: 1;
        }
        
        .selected {
          opacity: 1;
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-nav', CcPricingNav);
