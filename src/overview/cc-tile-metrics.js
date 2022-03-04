import { Chart, registerables } from 'chart.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { i18n } from '../lib/i18n.js';
import { tileStyles } from '../styles/info-tiles.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { linkStyles } from '../templates/cc-link.js';

const closeSvg = new URL('../assets/close.svg', import.meta.url).href;
const infoSvg = new URL('../assets/info.svg', import.meta.url).href;
const grafanaSvg = new URL('../assets/grafana.svg', import.meta.url).href;

const TOP = 'rgb(237, 52, 97)';
const MIDDLE = 'rgb(78, 100, 234)';
const BOTTOM = 'rgb(100, 146, 234)';

const EIGHTY_PERCENT = 0.8;
const TWENTY_PERCENT = 0.2;

const NUMBER_OF_POINTS = 24;

const SKELETON_REQUESTS = Array
  .from(new Array(NUMBER_OF_POINTS))
  .map((_, index) => {
    const startTs = new Date().getTime();
    return { usedPercent: Math.random(), totalValue: 1, timestamp: startTs + index * 3600 };
  });

/**
 * @typedef {import('./types.js').Metric} Metric
 */

/**
 * A "tile" component to display CPU and RAM metrics in a bar chart.
 *
 * ## Details
 *
 * * When `cpuData` nor `ramData` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 * * A short doc is available when the (i) button is clicked.
 *
 *
 * @cssdisplay grid
 */

export class CcTileMetrics extends LitElement {

  static get properties () {
    return {
      cpuData: { type: Array },
      error: { type: Boolean, reflect: true },
      grafanaBaseLink: { type: String },
      metricsBaseLink: { type: String },
      ramData: { type: Array },
      _docs: { type: Boolean, attribute: false },
      _empty: { type: Boolean, attribute: false },
      _skeleton: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {Metric[]|null} Sets CPU data with 24 points with the timestamp and the used percent. */
    this.cpuData = null;

    /** @type {boolean|null} Displays an error message. */
    this.error = null;

    /** @type {string} Sets the link to the grafana. */
    this.grafanaBaseLink = '';

    /** @type {string} Sets the link to the metrics. */
    this.metricsBaseLink = '';

    /** @type {Metric[]|null} Sets CPU data with 24 points with the timestamp and the used percent. */
    this.ramData = null;

    /** @type {boolean} */
    this._docs = false;

    /** @type {boolean} */
    this._empty = false;

    /** @type {boolean} */
    this._skeleton = false;
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

  _getColor (percent) {
    if (percent > EIGHTY_PERCENT) {
      return TOP;
    }
    else if (percent > TWENTY_PERCENT) {
      return MIDDLE;
    }
    return BOTTOM;
  }

  _getChartData (inputData) {

    const data = this._skeleton ? SKELETON_REQUESTS : inputData;
    const labels = data.map((item) => item.timestamp);
    const values = data.map((item) => item.usedPercent);
    const totalValues = Array
      .from(new Array(NUMBER_OF_POINTS))
      .map((_) => 1);

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
    this._skeleton = (this.cpuData == null || this.ramData == null);
    this._empty = !this._skeleton && (this.cpuData.length === 0 || this.ramData.length === 0);

    const displayDocs = (this._docs);
    const displayError = (this.error && !this._docs);
    const displayChart = (!this.error && !this._empty && !this._docs);
    const displayEmpty = (this._empty && !this._docs);

    const cpuPercent = (!this._skeleton && !this._empty) ? this.cpuData[this.cpuData.length - 1].usedPercent : 0;
    const ramPercent = (!this._skeleton && !this._empty) ? this.ramData[this.ramData.length - 1].usedPercent : 0;

    const cpuColorType = (this._skeleton || this._empty) ? '#bbb' : this._getColor(cpuPercent);
    const ramColorType = (this._skeleton || this._empty) ? '#bbb' : this._getColor(ramPercent);

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
      // language=CSS
      css`
        .category {
          display: contents;
        }

        .category-title {
          color: #5D5D5D;
        }

        .current-percentage {
          font-size: 1.25em;
        }

        .current-percentage.skeleton {
          background-color: #bbb;
          color: #000;
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
