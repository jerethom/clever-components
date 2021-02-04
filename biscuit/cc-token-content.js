import { css, html, LitElement } from 'lit-element';

/**
 * TODO DOCS
 */
export class CcTokenContent extends LitElement {

  static get properties () {
    return {
      content: { type: Object },
    };
  }

  constructor () {
    super();
  }

  render () {
    const content = (this.content == null) ? 'no content yet' : this.content;
    return html`
      <div><strong>The Content:</strong></div>
      <div>${content.ast}</div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

window.customElements.define('cc-token-content', CcTokenContent);
