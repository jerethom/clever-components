import { css, html } from 'lit-element';
import { fetchAppConsumption } from '../src/lib/data-helpers.js';
import { CcTileConsumption } from '../src/overview/cc-tile-consumption.js';

/**
 *
 */
export class CcTileConsumptionSmartWrap extends CcTileConsumption {

  static get properties () {
    return {
      ...CcTileConsumption.properties,
      orgaId: { type: String, reflect: true },
      appId: { type: String, reflect: true },
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
      this.consumption = null;
      fetchAppConsumption(this.orgaId, this.appId).then((consumption) => {
        this.consumption = consumption;
      });
    }
  }

  // createRenderRoot () {
  //   return this;
  // }
}

window.customElements.define('cc-tile-consumption-smart-subclass', CcTileConsumptionSmartWrap);
