import { css, html, LitElement } from 'lit-element';
import 'codemirror/lib/codemirror.js';
import 'codemirror/addon/mode/simple.js';
import { codemirrorStyles } from './codemirror.css.js';
import { codemirrorLinkStyles } from './lint.css.js';
import { getVerifier } from './wasm-biscuit.js';
import { dispatchCustomEvent } from '../src/lib/events.js';

/**
 * TODO DOCS
 */
export class CcVerifierEditor extends LitElement {

  static get properties () {
    return {
      code: { type: String },
      parseErrors: { type: Array },
      markers: { type: Array },
    };
  }

  constructor () {
    super();
    if(this.children[0] !=undefined) {
      this.code = this.children[0].innerText;
    } else {
      this.code = "";
    }
    this.parseErrors = [];
    this.markers = [];
  }

  _onUpdatedCode(code) {
    console.log("cc-verifier-editor._onUpdatedCode: "+code);
    this.code = code;
    dispatchCustomEvent(this, 'update', {code: code});
  }

  update (changedProperties) {
    console.log("cc-verifier-editor update");
    console.log(changedProperties);
    super.update(changedProperties);
  }

  render () {
    console.log("cc-verifier-editor.render");
    console.log(this.parseErrors);
    return html`
      <cc-datalog-editor
        datalog=${this.code}
        parseErrors='${JSON.stringify(this.parseErrors)}'
        markers='${JSON.stringify(this.markers)}'
        @cc-datalog-editor:update="${(e) => { this._onUpdatedCode(e.detail.code) }}"}>
      </cc-datalog-editor>
    `;
  }

  static get styles () {
    return [
      codemirrorStyles,
      codemirrorLinkStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

window.customElements.define('cc-verifier-editor', CcVerifierEditor);
