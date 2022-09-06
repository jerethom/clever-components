export class MediaQueryController {

  /**
   * @param {ReactiveControllerHost} host
   * @param {string} mediaQuery
   */
  constructor (host, mediaQuery) {
    host.addController(this);
    this.mediaQuery = window.matchMedia(mediaQuery);

    this._refresh();
  }

  _refresh () {
    this.matches = this.mediaQuery != null && this.mediaQuery.matches;
  }

  hostConnected () {
    const onMediaQueryChanged = () => {
      this._refresh();
    };
    this.mediaQuery.addEventListener('change', onMediaQueryChanged);
    this._cleanup = () => this.mediaQuery.removeEventListener('change', onMediaQueryChanged);
  }

  hostDisconnected () {
    this._cleanup?.();
  }
}
