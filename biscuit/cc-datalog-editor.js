import { css, html, LitElement } from 'lit-element';
import { getDatalog, parse } from './wasm-biscuit.js';
import { dispatchCustomEvent } from '../src/lib/events.js';
import { codemirrorStyles } from './codemirror.css.js';
import { codemirrorLinkStyles } from './lint.css.js';

// déso
const { CodeMirror } = globalThis;

function defineSimpleMode () {
  CodeMirror.defineSimpleMode('biscuit', {
    // The start state contains the rules that are initially used
    start: [
      {
        regex: /(allow if|deny if|check if|or|and|<-)\b/,
        token: 'keyword',
      },
      { regex: /\/\/.*/, token: 'comment' },
      { regex: /\/\*/, token: 'comment', next: 'comment' },

      // predicate name
      { regex: /([A-Za-z_][\w]*)/, token: 'keyword', next: 'terms' },

      { regex: /,/, token: 'operator' },
      { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: 'string' },
      { regex: /\$[A-Za-z_][\w]*/, token: 'variable' },
      { regex: /#[A-Za-z_][\w]*/, token: 'symbol' },
      { regex: /true|false/, token: 'atom' },
      // RFC 3339 date
      {
        regex: /(\d+)-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d|60)(\.\d+)?(([Zz])|([\+|\-]([01]\d|2[0-3]):([0-5]\d)))/,
        token: 'atom',
      },
      { regex: /[-+]?\d+/i, token: 'number' },

      // A next property will cause the mode to move to a different state
      { regex: /[-+\/*=<>!]+/, token: 'operator' },
      { regex: /&&|\|\|/, token: 'operator' },
      // indent and dedent properties guide autoindentation
      { regex: /[\{\[\(]/, indent: true },
      { regex: /[\}\]\)]/, dedent: true },
    ],
    // The multi-line comment state.
    comment: [
      { regex: /.*?\*\//, token: 'comment', next: 'start' },
      { regex: /.*/, token: 'comment' },
    ],
    terms: [
      { regex: /,/, token: 'operator' },
      // The regex matches the token, the token property contains the type
      { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: 'string' },
      { regex: /\$[A-Za-z_][\w]*/, token: 'variable' },
      { regex: /#[A-Za-z_][\w]*/, token: 'symbol' },
      { regex: /true|false/, token: 'atom' },
      // RFC 3339 date
      {
        regex: /(\d+)-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d|60)(\.\d+)?(([Zz])|([\+|\-]([01]\d|2[0-3]):([0-5]\d)))/,
        token: 'atom',
      },
      { regex: /[-+]?\d+/i, token: 'number' },
      { regex: /\)/, next: 'start' },
    ],
    // The meta property contains global information about the mode. It
    // can contain properties like lineComment, which are supported by
    // all modes, and also directives like dontIndentStates, which are
    // specific to simple modes.
    meta: {
      dontIndentStates: ['comment'],
      lineComment: '//',
    },
  });
}

defineSimpleMode();

/**
 * TODO DOCS
 */
export class CcDatalogEditor extends LitElement {

  static get properties () {
    return {
      datalog: { type: String },
    };
  }

  constructor () {
    super();
  }

  _onText (code) {
    const parsedResult = parse(code);
    dispatchCustomEvent(this, 'update', parsedResult);
  }

  firstUpdated () {
    const textarea = this.shadowRoot.querySelector('textarea');
    this._cm = new CodeMirror.fromTextArea(textarea, {
      mode: 'biscuit',
      autoCloseTags: true,
      lineNumbers: true,
      gutters: ['CodeMirror-lint-markers'],
      lintOnChange: false,
      // lint: {
      //   getAnnotations: get_editor_lints,
      // },
    });

    this._cm.on('change', () => this._onText(this._cm.getValue()));
  }

  updated (changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('datalog')) {
      this._cm.setValue(this.datalog);
    }
  }

  render () {
    return html`
      <textarea></textarea>
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

window.customElements.define('cc-datalog-editor', CcDatalogEditor);
