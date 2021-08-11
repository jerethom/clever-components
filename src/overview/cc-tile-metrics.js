import { Chart, TimeSeriesScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n.js';
import { tileStyles } from '../styles/info-tiles.js';
import { skeletonStyles } from '../styles/skeleton.js';

const closeSvg = new URL('../assets/close.svg', import.meta.url).href;
const infoSvg = new URL('../assets/info.svg', import.meta.url).href;

/**
 * A component doing X and Y (one liner description of your component).
 *
 * ## Details
 *
 * * Details about bla.
 * * Details about bla bla.
 * * Details about bla bla bla.
 *
 * ## Technical details
 *
 * * Technical details about foo.
 * * Technical details about bar.
 * * Technical details about baz.
 *
 * ## Type definitions
 *
 * ```js
 * interface ExampleInterface {
 *   one: string,
 *   two: number,
 *   three: boolean,
 * }
 * ```
 *
 * @cssdisplay block
 *
 * @prop {String} one - Description for one.
 * @prop {Boolean} two - Description for two.
 * @prop {ExampleInterface[]} three - Description for three.
 *
 * @event {CustomEvent<ExampleInterface>} example-component:event-name - Fires XXX whenever YYY.
 *
 * @slot - The content of the button (text or HTML). If you want an image, please look at the `image` attribute.
 *
 * @cssprop {Color} --cc-loader-color - The color of the animated circle (defaults: `#2653af`).
 */
export class CcTileMetrics extends LitElement {

  // DOCS: 1. LitElement's properties descriptor

  static get properties () {
    return {
      cpuData: { type: Array },
      error: { type: Boolean, reflect: true },
      ramData: { type: Object },
      _skeleton: { type: Boolean, attribute: false },
      _empty: { type: Boolean, attribute: false },
      _docs: { type: Boolean, attribute: false },
    };
  }

  // DOCS: 2. Constructor

  constructor () {
    super();
    this.cpuData = [];
    // Triggers setter (init _backgroundColor, _chartLabels, _data, _empty, _labels and _skeleton)
    this.error = null;
    this.statusCodes = null;
    this._docs = false;
  }

  _onToggleDocs () {
    this._docs = !this._docs;
  }

  firstUpdated () {
    Chart.register(TimeSeriesScale);
    this._ctx = this.renderRoot.getElementById('cpu_chart');
    this._chart = new Chart(this._ctx, {
      plugins: [ChartDataLabels],
      type: 'line',
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: {
            display: true,
            type: 'time',
            time: {
              unit: 'hour',
            },
          },
          y: {
            display: true,
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  // updated and not update because we need this._chart before
  updated (changedProperties) {
    if (changedProperties.has('cpuData')) {

      this._chart.data = {
        labels: [1628516642000000,
          1628516582000000,
          1628516522000000,
          1628516462000000,
          1628516402000000,
          1628516342000000,
          1628516282000000],
        datasets: [{ label: 'cpu', data: this.cpuData }],
      };

    }
    super.updated(changedProperties);
  }

  render () {
    const displayChart = (!this.error && !this._empty && !this._docs);
    const displayError = (this.error && !this._docs);
    const displayEmpty = (this._empty && !this._docs);
    const displayDocs = (this._docs);

    return html`
      <div class="tile_title tile_title--image">
        ${i18n('cc-tile-metrics.title')}
        <cc-button
          class="docs-toggle"
          image=${displayDocs ? closeSvg : infoSvg}
          hide-text
          @cc-button:click=${this._onToggleDocs}
        >${this._docs ? i18n('cc-tile-requests.close-btn') : i18n('cc-tile-requests.about-btn')}
        </cc-button>
      </div>

      <div class="tile_body ${classMap({ 'tile--hidden': !displayChart })}">
        <div class="category">
          <div class="category-title">${i18n('cc-tile-metrics.cpu')}</div>
          <div class="chart-container ${classMap({ skeleton: this._skeleton })}">
            <canvas id="cpu_chart"></canvas>
          </div>
          <div class="current-percentage">90%</div>
        </div>
        <div class="category">
          <div class="category-title">${i18n('cc-tile-metrics.ram')}</div>
          <div class="chart-container ${classMap({ skeleton: this._skeleton })}">
            <canvas id="ram_chart"></canvas>
          </div>
          <div class="current-percentage">90%</div>
        </div>

      </div>

      <div class="tile_message ${classMap({ 'tile--hidden': !displayEmpty })}">${i18n('cc-tile-metrics.empty')}</div>

      <cc-error class="tile_message ${classMap({ 'tile--hidden': !displayError })}">${i18n('cc-tile-metrics.error')}</cc-error>

      <div class="tile_docs ${classMap({ 'tile--hidden': !displayDocs })}">
        <p>${i18n('cc-tile-metrics.docs.msg')}</p>
      </div>
    `;
  }

  static get styles () {
    return [
      tileStyles,
      skeletonStyles,
      // language=CSS
      css`

          .category {
              display: flex;
              justify-content: space-between;
              color: #2d4287;
              padding: 0.5em;
          }

          .category-title {
              font-weight: bold;
          }

          .tile_title {
              align-items: center;
              display: flex;
              justify-content: space-between;
          }

          .docs-toggle {
              font-size: 1rem;
              margin: 0 0 0 1rem;
          }

          /*.chart-container {*/
              /* We need this because: https://github.com/chartjs/Chart.js/issues/4156 */
              /*height: 100%;*/
              /*min-width: 0;*/
              /*position: absolute;*/
              /*width: 100%;*/
          /*}*/

          /*
            body, message and docs are placed in the same area (on top of each other)
            this way, we can just hide the docs
            and let the tile take at least the height of the docs text content
           */
          .tile_body,
          .tile_message,
          .tile_docs {
              grid-area: 2 / 1 / 2 / 1;
          }

          /* See above why we hide instead of display:none */
          .tile--hidden {
              visibility: hidden;
          }

          .tile_body {
              min-height: 140px;
              position: relative;
          }

          .tile_docs {
              align-self: center;
              font-size: 0.9rem;
              font-style: italic;
          }

          .tile_docs_link {
              color: #2b96fd;
              text-decoration: underline;
          }
      `,
    ];
  }
}

window.customElements.define('cc-tile-metrics', CcTileMetrics);
