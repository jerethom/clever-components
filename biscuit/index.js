import './cc-token-editor.js';
import './cc-token-content.js';
import './cc-verifier-editor.js';
import './cc-verifier-result.js';
import './cc-verifier-content.js';
import init, {execute} from "./wasm.js"


var state = {
  token_blocks: [],
  verifier_code: "",
  query: "",
}

async function setup() {
  await init();

  document
    .querySelector('cc-token-editor')
    .addEventListener('cc-token-editor:update', ({ detail: blocks }) => {
      var token_blocks = [];

      for(let block of blocks.blocks) {
        token_blocks.push(block.code);
      }

      state.token_blocks = token_blocks;

      update();
     });

  document
    .querySelector('cc-verifier-editor')
    .addEventListener('cc-verifier-editor:update', ({ detail: code }) => {
      state.verifier_code = code.code;

      update();
     });

  for(const child of Array.from(document.querySelector('cc-token-editor').children)) {
    state.token_blocks.push(child.innerText);
  }

  const child = document
    .querySelector('cc-verifier-editor').children[0];
  if(child != undefined) {
    state.verifier_code = child.innerText;
  }

  update();
}

function update() {
      var result = execute(state);

      document
        .querySelector('cc-token-content')
         .content = result.token_content;

      var tokenErrors = [];
      var tokenMarkers = [];
      for(let editor of result.token_blocks) {
        var parseErrors = [];

        for(let error of editor.errors) {
          parseErrors.push({
            message: error.message,
            severity: "error",
            from: CodeMirror.Pos(error.position.line_start, error.position.column_start),
            to: CodeMirror.Pos(error.position.line_end, error.position.column_end),
          });
        }
        tokenErrors.push(parseErrors);

        var markers = [];
        for(let marker of editor.markers) {
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
        tokenMarkers.push(markers);
      }
      document
        .querySelector('cc-token-editor')
        .parseErrors = tokenErrors;
      document
        .querySelector('cc-token-editor')
        .markers = tokenMarkers;

      if(result.verifier_editor != null) {
        var parseErrors = [];

        for(let error of result.verifier_editor.errors) {
          parseErrors.push({
            message: error.message,
            severity: "error",
            from: CodeMirror.Pos(error.position.line_start, error.position.column_start),
            to: CodeMirror.Pos(error.position.line_end, error.position.column_end),
          });
        }

        document
          .querySelector('cc-verifier-editor')
          .parseErrors = parseErrors;

        var markers = [];
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
        document
          .querySelector('cc-verifier-editor')
          .markers = markers;
      }

      document
        .querySelector('cc-verifier-result')
         .content = result.verifier_result;

      document
        .querySelector('cc-verifier-content')
         .content = result.verifier_world;
}

setup();
