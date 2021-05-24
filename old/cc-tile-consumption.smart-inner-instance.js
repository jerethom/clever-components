import { css, LitElement } from 'lit-element';
import { fetchAppConsumption } from '../src/lib/data-helpers.js';
import { CcTileConsumption } from '../src/overview/cc-tile-consumption.js';

/**
 *
 */
export class CcTileConsumptionSmartInnerInstance extends LitElement {

  static get properties () {
    return {
      orgaId: { type: String, reflect: true },
      appId: { type: String, reflect: true },
      _consumption: { type: Object },
    };
  }

  constructor () {
    super();
    this._uiComponent = new CcTileConsumption();
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
        this._uiComponent.consumption = consumption;
        this.requestUpdate();
      });
    }
  }

  render () {
    return this._uiComponent.render();
  }

  static get styles () {
    return CcTileConsumption.styles;
  }
}

window.customElements.define('cc-tile-consumption-smart-inner-instance', CcTileConsumptionSmartInnerInstance);
