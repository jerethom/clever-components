import '../src/overview/cc-tile-consumption.js';
import { css, html, LitElement } from 'lit-element';
import { fetchAppConsumption } from '../src/lib/data-helpers.js';

/**
 *
 */
export class CcTileConsumptionSmartWrap extends LitElement {

  static get properties () {
    return {
      orgaId: { type: String, reflect: true },
      appId: { type: String, reflect: true },
      _consumption: { type: Object },
    };
  }

  get orgaId () {
    return this._orgaId;
  }

  get appId () {
    return this._appId;
  }

  set orgaId (newVal) {
    const oldVal = this._orgaId;
    this._orgaId = newVal;
    this.requestUpdate('orgaId', oldVal);
    this._fetchData();
  }

  set appId (newVal) {
    const oldVal = this._appId;
    this._appId = newVal;
    this.requestUpdate('appId', oldVal);
    this._fetchData();
  }

  _fetchData () {
    if (this.orgaId != null && this.appId != null) {
      this._consumption = null;
      fetchAppConsumption(this.orgaId, this.appId).then((consumption) => {
        return this._consumption = consumption;
      });
    }
  }

  createRenderRoot () {
    return this;
  }

  render () {
    return html`
      <cc-tile-consumption .consumption=${this._consumption}></cc-tile-consumption>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: contents;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tile-consumption-smart-wrap', CcTileConsumptionSmartWrap);
