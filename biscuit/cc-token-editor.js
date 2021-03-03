import { css, html, LitElement } from 'lit-element';
import 'codemirror/lib/codemirror.js';
import 'codemirror/addon/mode/simple.js';
import { codemirrorStyles } from './codemirror.css.js';
import { codemirrorLinkStyles } from './lint.css.js';
import { getBlocks } from './wasm-biscuit.js';
import { dispatchCustomEvent } from '../src/lib/events.js';

/**
 * TODO DOCS
 */
export class CcTokenEditor extends LitElement {

  static get properties () {
    return {
      biscuit: { type: String },
      _blocks: { type: Array },
      parseErrors: { type: Array },
      markers: { type: Array },
    };
  }

  constructor () {
    super();
    this._blocks = [];
    for(const child of Array.from(this.children)) {
      this._blocks.push({ code: child.innerText });
    }

    this.parseErrors = [];
    this.markers = [];
  }

  _onAddBlock () {
    this._blocks = [...this._blocks, { code: '' }];
  }

  _onRemoveBlock (block) {
    this._blocks = this._blocks.filter((b) => b !== block);
  }

  _onUpdatedCode(block, code) {
    block.code = code;
    console.log("updating blocks:");
    console.log(this._blocks);
    dispatchCustomEvent(this, 'update', {blocks: this._blocks});
  }

  update (changedProperties) {
    console.log("cc-token-editor update");
    console.log(changedProperties);
    super.update(changedProperties);
    /*if (changedProperties.has('biscuit')) {
      this._blocks = getBlocks(this.biscuit);
    }*/
  }

  render () {
    return html`
      <div>
        <button @click=${this._onAddBlock}>add block</button>
      </div>
      ${this._blocks.map((block, index) => html`
        <button @click=${() => this._onRemoveBlock(block)}>remove this block</button>
        <cc-datalog-editor
          datalog=${block.code}
          parseErrors='${JSON.stringify(this.parseErrors[index])}'
          markers='${JSON.stringify(this.markers[index])}'
          @cc-datalog-editor:update="${(e) => { this._onUpdatedCode(block, e.detail.code) }}"}>
        </cc-datalog-editor>
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
