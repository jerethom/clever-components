import { css, html, LitElement } from 'lit-element';
import 'codemirror/lib/codemirror.js';
import 'codemirror/addon/mode/simple.js';
import { codemirrorStyles } from './codemirror.css.js';
import { codemirrorLinkStyles } from './lint.css.js';
import { getBlocks } from './wasm-biscuit.js';

/**
 * TODO DOCS
 */
export class CcTokenEditor extends LitElement {

  static get properties () {
    return {
      biscuit: { type: String },
      _blocks: { type: Array },
    };
  }

  constructor () {
    super();
    this._blocks = [];
  }

  _onAddBlock () {
    this._blocks = [...this._blocks, { code: 'new block' }];
  }

  _onRemoveBlock (block) {
    this._blocks = this._blocks.filter((b) => b !== block);
  }

  update (changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has('biscuit')) {
      this._blocks = getBlocks(this.biscuit);
    }
  }

  render () {
    return html`
      <div>
        <button @click=${this._onAddBlock}>add block</button>
      </div>
      ${this._blocks.map((block) => html`
        <button @click=${() => this._onRemoveBlock(block)}>remove this block</button>
        <cc-datalog-editor datalog=${block.code}></cc-datalog-editor>
      `)}
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

window.customElements.define('cc-token-editor', CcTokenEditor);
