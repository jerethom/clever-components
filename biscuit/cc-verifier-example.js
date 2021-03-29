import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../src/lib/events.js';
import init, {execute} from "@clevercloud/biscuit-component-wasm"
import './cc-verifier-editor.js';
import './cc-verifier-result.js';
import './cc-verifier-content.js';

/**
 * TODO DOCS
 */
export class CcVerifierExample extends LitElement {

  static get properties () {
    return {
      code: { type: String },
      defaultAllow: { type: Boolean },
      started: { tyope: Boolean },
    };
  }

  constructor () {
    super();
    if(this.children[0] != undefined) {
      this.code = this.children[0].innerText;
    } else {
      this.code = "";
    }

    this.defaultAllow = false;
    this.started = false;
  }

  _onUpdatedCode(code) {
    this.code = code;
    dispatchCustomEvent(this, 'update', {code: code});
  }

  firstUpdated(changedProperties) {
    init().then(() => this.started = true);
  }

  update (changedProperties) {
    super.update(changedProperties);
  }

  render () {
    var parseErrors = [];
    var markers = [];
    var verifier_result = "";
    var verifier_world = [];

    var code = this.code;
    if(this.defaultAllow) {
      code += "\n\nallow if true;";
    }

    if(this.started) {
      var state = {
        token_blocks:[],
        verifier_code: code,
        query: "",
      };
      var result = execute(state);

      verifier_result = result.verifier_result;
      verifier_world = result.verifier_world;

      if(result.verifier_editor != null) {

        for(let error of result.verifier_editor.errors) {
          parseErrors.push({
            message: error.message,
            severity: "error",
            from: CodeMirror.Pos(error.position.line_start, error.position.column_start),
            to: CodeMirror.Pos(error.position.line_end, error.position.column_end),
          });
        }

        for(let marker of result.verifier_editor.markers) {
          var css;
          if(marker.ok) {
            css = "background: #c1f1c1;";
          } else {
            css = "background: #ffa2a2;";
          }

          markers.push({
            from: {
              line: marker.position.line_start,
              ch: marker.position.column_start,
            },
            to: {
              line: marker.position.line_end,
              ch: marker.position.column_end,
            },
            options: { css: css},
          });
        }
      }
    }

    return html`
      <cc-verifier-editor
        code='${this.code}'
        parseErrors='${JSON.stringify(parseErrors)}'
        markers='${JSON.stringify(markers)}'
        @cc-verifier-editor:update="${(e) => { this._onUpdatedCode(e.detail.code) }}"}>
      </cc-verifier-editor>
      <em>Execution result</em>
      <cc-verifier-result content='${JSON.stringify(verifier_result)}'></cc-verifier-result>
      <details>
        <summary>Facts</summary>
        <cc-verifier-content content='${JSON.stringify(verifier_world)}'></cc-verifier-content>
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

window.customElements.define('cc-verifier-example', CcVerifierExample);
