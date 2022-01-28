import { Chart, registerables } from 'chart.js';
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

  static get properties () {
    return {
      cpuData: { type: Array },
      error: { type: Boolean, reflect: true },
      ramData: { type: Array },
      _skeleton: { type: Boolean, attribute: false },
      _empty: { type: Boolean, attribute: false },
      _docs: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();
    this.cpuData = [];
    // Triggers setter (init _backgroundColor, _chartLabels, _data, _empty, _labels and _skeleton)
    this.error = null;
    this.ramData = [];
    this.statusCodes = null;
    this._docs = false;
  }

  // DOCS: 2. Constructor

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
            // external: this._externalTooltipHandler,
            // callbacks: {
            //   label: function (tooltipItem, data) {
            //     return tooltipItem.raw;
            //   },
          },
        },
      },
    });
  }

  _externalTooltipHandler (context) {

    const getOrCreateTooltip = (chart) => {
      let tooltipEl = chart.canvas.parentNode.querySelector('div');

      if (!tooltipEl) {
        // Tooltip box style
        tooltipEl = document.createElement('div');
        tooltipEl.style.background = 'rgba(0, 0, 0, 1)';
        tooltipEl.style.borderRadius = '3px';
        tooltipEl.style.color = 'white';
        tooltipEl.style.opacity = 0;
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'translate(5%, -50%)';
        tooltipEl.style.transition = 'all .1s ease';

        const table = document.createElement('table');

        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
      }

      return tooltipEl;
    };
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map((b) => b.lines);

      const tableHead = document.createElement('thead');

      titleLines.forEach((title) => {
        const tr = document.createElement('tr');
        tr.style.borderWidth = 0;

        const th = document.createElement('th');
        th.style.borderWidth = 0;
        const text = document.createTextNode(i18n('cc-tile-metrics.tooltip.datetime', { timestamp: parseInt(title) }));

        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });

      const tableBody = document.createElement('tbody');
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];

        const span = document.createElement('span');
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.borderWidth = '2px';
        span.style.marginRight = '10px';
        // Percent cube color
        span.style.height = '10px';
        span.style.width = '10px';
        span.style.display = 'inline-block';

        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = 0;
        const parsed = parseFloat(body[0]);
        const td = document.createElement('td');
        td.style.borderWidth = 0;
        const text = (parsed < 1)
          ? document.createTextNode(i18n('cc-tile-metrics.percent', { percent: parsed }))
          : document.createTextNode(Math.floor(parsed / 10000).toString());

        td.appendChild(span);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });

      const tableRoot = tooltipEl.querySelector('table');

      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }

      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

    // Display, position, and set styles for font for the box
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY - 25 + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
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

    // this._skeleton = (this.cpuUsed == null || this.ramUsed == null);

    if (changedProperties.has('cpuData')) {

      const colors = [];
      const labels = this.cpuData.map((item) => item.timestamp);
      const values = this.cpuData.map((item) => {
        if (item.usedPercent > 0.8) {
          colors.push('rgb(204, 36, 61)');
        }
        else {
          colors.push('rgb(71, 99, 188)');
        }
        return item.usedPercent;
      });
      const totalValues = this.cpuData.map((item) => item.totalValue);

      this._cpuChart.data = {
        labels,
        datasets: [
          {
            fill: 'origin',
            data: values,
            backgroundColor: colors,
            borderColor: 'rgb(45, 66, 135)',
          },
          {
            fill: 'origin',
            data: totalValues,
          },
        ],
      };

      this._cpuChart.update();
      this._cpuChart.resize();
    }

    if (changedProperties.has('ramData')) {

      const colors = [];
      const labels = this.ramData.map((item) => item.timestamp);
      const values = this.ramData.map((item) => {
        if (item.usedPercent > 0.8) {
          colors.push('rgb(204, 36, 61)');
        }
        else {
          colors.push('rgb(71, 99, 188)');
        }
        return item.usedPercent;
      });
      const totalValues = this.ramData.map((item) => item.totalValue);

      // console.log(labels, values, totalValues);
      this._ramChart.data = {
        labels,
        datasets: [
          {
            fill: 'origin',
            data: values,
            backgroundColor: colors,
            borderColor: 'rgb(45, 66, 135)',
          },
          {
            fill: 'origin',
            data: totalValues,
          },
        ],
      };

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
          <div class="category-title ${classMap({ skeleton: this._skeleton })}">${i18n('cc-tile-metrics.cpu')}</div>
          <div class="foobar-wrapper">
            <div class="chart-container ${classMap({ skeleton: this._skeleton })}">
              <canvas id="cpu_chart"></canvas>
            </div>
          </div>
          ${this.cpuData != null ? html`
            <div class="current-percentage">${i18n('cc-tile-metrics.percent', { percent: this.cpuData[this.cpuData.length - 1].usedPercent })}</div>
          ` : ''}
        </div>
        
        <div class="category">
          <div class="category-title ${classMap({ skeleton: this._skeleton })}">${i18n('cc-tile-metrics.ram')}</div>
          <div class="foobar-wrapper">
            <div class="chart-container ${classMap({ skeleton: this._skeleton })}">
              <canvas id="ram_chart"></canvas>
            </div>
          </div>
          ${this.ramData != null ? html`
            <div class="current-percentage">${i18n('cc-tile-metrics.percent', { percent: this.ramData[this.ramData.length - 1].usedPercent })}</div>
          ` : ''}
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
              color: #2d4287;
              display: contents;
          }

          /*.category-title {*/
          /*    font-weight: bold;*/
          /*}*/

          .current-percentage {
              font-size: 1.25em;
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

          .foobar-wrapper {
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
