import { css, html, LitElement } from 'lit-element';

export class CcIcon extends LitElement {

  static provider = null;

  static getProvider() {
    return CcIcon.provider;
  }
  static setProvider(provider) {
    CcIcon.provider = provider;
  }

  static get properties () {
    return {
      name: { type: String, reflect: true },
      size: { type: String, reflect: true },
    };
  }

  constructor () {
    super();

    this.name = null;
    this.size = 'md';
  }

  connectedCallback() {
    super.connectedCallback();
    this._renderIcon();
  }

  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);

    if (changedProperties.has('name')) {
      this._renderIcon();
    }
  }

  _renderIcon() {
    if (this.name != null && this.name != '') {
      const iconModel = CcIcon.provider?.getIcon(this.name);
      this.innerHTML = iconModel.value || '';
    }
  }

  render () {
    return html`
      <span class="container">
        <slot></slot>
      </span>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: inline-flex;
        }
        
        :host([size="xs"]) {
          --size: 8px;
        }
        :host([size="sm"]) {
          --size: 12px;
        }
        :host([size="md"]) {
          --size: 16px;
        }
        :host([size="lg"]) {
          --size: 24px;
        }
        :host([size="xl"]) {
          --size: 36px;
        }
        
        .container {
          display: inline-flex;
          height: var(--size, 16px);
          width: var(--size, 16px);
        }
        
        ::slotted(svg) {
          height: 100%;
          width: 100%;
          fill: var(--color, currentColor);
        }
      `
    ]
  }
}

window.customElements.define('cc-icon', CcIcon);
