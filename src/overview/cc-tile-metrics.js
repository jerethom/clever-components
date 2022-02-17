import { Chart, registerables } from 'chart.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { tileStyles } from '../styles/info-tiles.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { linkStyles } from '../templates/cc-link.js';

const closeSvg = new URL('../assets/close.svg', import.meta.url).href;
const infoSvg = new URL('../assets/info.svg', import.meta.url).href;
const grafanaSvg = new URL('../assets/grafana.svg', import.meta.url).href;

// TODO: split in constants
const [TOP, MIDDLE, BOTTOM] = ['rgb(237, 52, 97)', 'rgb(100, 146, 234)', 'rgb(78, 100, 234)'];
const EIGHTY_PERCENT = 0.8;
const TWENTY_PERCENT = 0.2;

const SKELETON_REQUESTS = Array
  .from(new Array(24))
  .map((_, index) => {
    const startTs = new Date().getTime();
    return { usedPercent: Math.random(), totalValue: 1, timestamp: startTs + index * 3600 };
  });


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

  static get properties () {
    return {
      cpuData: { type: Array },
      error: { type: Boolean, reflect: true },
      metricsBaseLink: { type: String },
      grafanaBaseLink: { type: String },
      ramData: { type: Array },
      _cpuData: { type: Array },
      _ramData: { type: Array },
      _skeleton: { type: Boolean, attribute: false },
      _empty: { type: Boolean, attribute: false },
      _docs: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();
    this.cpuData = null;
    // Triggers setter (init _backgroundColor, _chartLabels, _data, _empty, _labels and _skeleton)
    this.error = null;
    this.metricsBaseLink = '';
    this.grafanaBaseLink = '';
    this.ramData = null;
    this.statusCodes = null;
    this._docs = false;
    this._cpuData = null;
    this._ramData = null;
    this._skeleton = false;
  }

  _getColor (percent) {
    if (percent > EIGHTY_PERCENT) {
      return TOP;
    }
    else if (percent > TWENTY_PERCENT) {
      return MIDDLE;
    }
    return BOTTOM;
  }

  _createChart (chartElement) {
    return new Chart(chartElement, {
      type: 'bar',
      options: {
        maintainAspectRatio: false,
        radius: 0,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: false,
            stacked: true,
          },
          y: {
            display: false,
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });
  }

  _getChartData (inputData) {

    const data = this._skeleton ? SKELETON_REQUESTS : inputData;
    const labels = data.map((item) => item.timestamp);
    const values = data.map((item) => item.usedPercent);
    const totalValues = data.map((item) => item.totalValue);
    const colors = this._skeleton
      ? values.map((_) => '#bbb')
      : values.map((percent) => this._getColor(percent));

    return {
      labels,
      datasets: [
        {
          fill: 'origin',
          data: values,
          backgroundColor: colors,
        },
        {
          fill: 'origin',
          data: totalValues,
        },
      ],
    };
  }

  _onToggleDocs () {
    this._docs = !this._docs;
  }

  firstUpdated () {
    Chart.register(...registerables);

    this._cpuCtx = this.renderRoot.getElementById('cpu_chart');
    this._ramCtx = this.renderRoot.getElementById('ram_chart');

    this._cpuChart = this._createChart(this._cpuCtx);
    this._ramChart = this._createChart(this._ramCtx);

  }

  // updated and not update because we need this._chart before
  updated (changedProperties) {

    if (changedProperties.has('cpuData')) {
      this._cpuChart.data = this._getChartData(this.cpuData);
      this._cpuChart.update();
      this._cpuChart.resize();
    }

    if (changedProperties.has('ramData')) {
      this._ramChart.data = this._getChartData(this.ramData);
      this._ramChart.update();
      this._ramChart.resize();
    }

    super.updated(changedProperties);
  }

  render () {
    const displayChart = (!this.error && !this._empty && !this._docs);
    const displayError = (this.error && !this._docs);
    const displayEmpty = (this._empty && !this._docs);
    const displayDocs = (this._docs);
    this._skeleton = (this.cpuData == null || this.ramData == null);


    const cpuPercent = this._skeleton
      ? 0
      : this.cpuData[this.cpuData.length - 1].usedPercent;
    const cpuColorType = this._skeleton ? '#bbb' : this._getColor(cpuPercent);
    const ramPercent = this._skeleton
      ? 0
      : this.ramData[this.ramData.length - 1].usedPercent;
    const ramColorType = this._skeleton ? '#bbb' : this._getColor(ramPercent);

    return html`
      <div class="tile_title tile_title--image">
        ${i18n('cc-tile-metrics.title')}
        <div class="docs-buttons">
          <a class="cc-link" href="https://example.com" title=${i18n('cc-tile-metrics.link-to-grafana')}>
            <img class="grafana-logo" src=${grafanaSvg} alt="">
          </a>
          <cc-button
            class="docs-toggle"
            image=${displayDocs ? closeSvg : infoSvg}
            hide-text
            @cc-button:click=${this._onToggleDocs}
          >${this._docs ? i18n('cc-tile-metrics.close-btn') : i18n('cc-tile-metrics.about-btn')}
          </cc-button>
        </div>
      </div>

      <div class="tile_body ${classMap({ 'tile--hidden': !displayChart })}">

        <div class="category">
          <div class="category-title">${i18n('cc-tile-metrics.cpu')}</div>
          <div class="chart-wrapper">
            <div class="chart-container ${classMap({ skeleton: this._skeleton })}">
              <canvas id="cpu_chart"></canvas>
            </div>
          </div>
            <div class="current-percentage ${classMap({ skeleton: this._skeleton })}" style=${`color: ${cpuColorType}`}>${i18n('cc-tile-metrics.percent', { percent: cpuPercent })}</div>
        </div>
        
        <div class="category">
          <div class="category-title">${i18n('cc-tile-metrics.ram')}</div>
          <div class="chart-wrapper">
            <div class="chart-container ${classMap({ skeleton: this._skeleton })}">
              <canvas id="ram_chart"></canvas>
            </div>
          </div>
            <div class="current-percentage ${classMap({ skeleton: this._skeleton })}" style=${`color: ${ramColorType}`}>${i18n('cc-tile-metrics.percent', { percent: ramPercent })}</div>
        </div>

      </div>

      <div class="tile_message ${classMap({ 'tile--hidden': !displayEmpty })}">${i18n('cc-tile-metrics.empty')}</div>

      <cc-error class="tile_message ${classMap({ 'tile--hidden': !displayError })}">${i18n('cc-tile-metrics.error')}</cc-error>

      <div class="tile_docs ${classMap({ 'tile--hidden': !displayDocs })}">
        <p>${i18n('cc-tile-metrics.docs.msg', { grafanaLink: this.grafanaBaseLink, metricsLink: this.metricsBaseLink })}</p>
      </div>
    `;

  }

  static get styles () {
    return [
      linkStyles,
      tileStyles,
      skeletonStyles,
      defaultThemeStyles,
      // language=CSS
      css`

        :host {
          /* Custom colors properties used in JavaScript for Chart.js bar colors */
          --chart-color-bottom: #37a9d3;
          --chart-color-middle: var(--cc-chart-color-blue);
          --chart-color-top: var(--cc-chart-color-red);
        }

          .category {
              display: contents;
          }

          .category-title {
            color: #5D5D5D;
          }

          .current-percentage {
              font-size: 1.25em;
              /*font-weight: bold;*/
          }

        .current-percentage.skeleton {
          background-color: #bbb;
          color: #000;
          /*font-weight: bold;*/
        }

        
          .tile_title {
              align-items: center;
              display: flex;
              justify-content: space-between;
          }


          .docs-toggle,
          .docs-grafana-btn {
              font-size: 1rem;
              margin: 0 0 0 1rem;
          }

          .docs-buttons {
            align-items: center;
            display: flex;
          }

          .chart-wrapper {
            /* TODO : find a way to resize width properly */
              /*width: 100%;*/
              /* Change chart height size */
              height: 2em;
              position: relative;
          }

          .chart-container {
              /*We need this because: https://github.com/chartjs/Chart.js/issues/4156 */
              height: 100%;
              min-width: 0;
              position: absolute;
              width: 100%;
          }

          .grafana-logo {
            display: block;
            height: 1em;
            width: 1em;
          }

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
              align-items: center;
              gap: 1em;
              grid-template-columns: min-content 1fr min-content;
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
