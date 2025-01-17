import '../cc-error/cc-error.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { i18n } from '../../lib/i18n.js';
import { instanceDetailsStyles, tileStyles } from '../../styles/info-tiles.js';
import { skeletonStyles } from '../../styles/skeleton.js';

/** @type {Scalability} */
const SKELETON_SCALABILITY = {
  minFlavor: { name: '??' },
  maxFlavor: { name: '?' },
  minInstances: 0,
  maxInstances: 0,
};

/**
 * @typedef {import('./cc-tile-scalability.types.js').Scalability} Scalability
 */

/**
 * A "tile" component to display the current config of scalability for a given app.
 *
 * ## Details
 *
 * * When `scalability` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 *
 * @cssdisplay grid
 */
export class CcTileScalability extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean, reflect: true },
      scalability: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Displays an error message. */
    this.error = false;

    /** @type {Scalability|null} Sets the scalability config of an app with details about flavors and number of instances. */
    this.scalability = null;
  }

  _getFlavorDetails (flavor) {
    if (flavor.cpus == null) {
      return;
    }
    return i18n('cc-tile-scalability.flavor-info', { ...flavor });
  }

  // For now, we strip the ML_ prefix from ML VMs, this may change in the future
  _formatFlavorName (name) {
    return name.replace(/^ML_/, '');
  }

  render () {

    const skeleton = (this.scalability == null);
    const { minFlavor, maxFlavor, minInstances, maxInstances } = skeleton ? SKELETON_SCALABILITY : this.scalability;

    return html`
      <div class="tile_title">${i18n('cc-tile-scalability.title')}</div>

      ${!this.error ? html`
        <div class="tile_body">
          <div class="label">${i18n('cc-tile-scalability.size')}</div>
          <div class="info">
            <div class="size-label ${classMap({ skeleton })}"
              title=${ifDefined(this._getFlavorDetails(minFlavor))}
            >${this._formatFlavorName(minFlavor.name)}</div>
            <div class="separator"></div>
            <div class="size-label ${classMap({ skeleton })}"
              title=${ifDefined(this._getFlavorDetails(maxFlavor))}
            >${this._formatFlavorName(maxFlavor.name)}</div>
          </div>
          <div class="label">${i18n('cc-tile-scalability.number')}</div>
          <div class="info">
            <div class="count-bubble ${classMap({ skeleton })}">${minInstances}</div>
            <div class="separator"></div>
            <div class="count-bubble ${classMap({ skeleton })}">${maxInstances}</div>
          </div>
        </div>
      ` : ''}

      ${this.error ? html`
        <cc-error class="tile_message">${i18n('cc-tile-scalability.error')}</cc-error>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      tileStyles,
      instanceDetailsStyles,
      skeletonStyles,
      // language=CSS
      css`
        .tile_body {
          align-items: center;
          grid-column-gap: 2em;
          grid-row-gap: 1em;
          grid-template-columns: auto 1fr;
        }

        .info {
          align-items: center;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .separator {
          border-top: 1px dashed #8C8C8C;
          flex: 1 1 0;
          width: 1.5em;
        }

        [title] {
          cursor: help;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tile-scalability', CcTileScalability);
