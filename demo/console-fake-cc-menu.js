import '../src/smart/cc-smart-container.js';
import { defineComponent, objectEquals } from '../src/smart/smart-manager.js';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  fromEvent,
  LastPromise,
  map,
  unsubscribeWithSignal,
} from '../src/lib/observables.js';
import { getSummary } from '@clevercloud/client/esm/api/v2/user.js';
import { sendToApi } from '../src/lib/data-helpers.js';
// import '../src/lib/event-api-to-bus.js';

defineComponent({
  selector: 'cc-menu',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  onConnect: (container, component, context$, disconnectSignal) => {

    const summary_lp = new LastPromise();
    const apiConfig$ = context$.pipe(
      map(({ apiConfig }) => apiConfig),
      distinctUntilChanged((a, b) => objectEquals(a, b)),
    );

    const onClick$ = fromEvent(component, 'click')
      .pipe(filter((e) => {
        return e.target.tagName === 'BUTTON';
      }));

    unsubscribeWithSignal(disconnectSignal, [

      summary_lp.error$.subscribe((error) => component.innerHTML = '[ERROR]'),
      combineLatest(summary_lp.value$, context$).subscribe(([summary, context]) => {
        return component.innerHTML = render(summary, context);
      }),

      apiConfig$.subscribe((apiConfig) => {
        if (apiConfig != null) {
          console.log({apiConfig})
          component.innerHTML = `<div class="list">...</div><div class="list">...</div>`;
          summary_lp.push((signal) => fetchSummary({ apiConfig, signal }));
        }
      }),

      onClick$.subscribe((e) => {
        const { ownerId, appId } = e.target.dataset;
        if (ownerId != null) {
          component.dispatchEvent(new CustomEvent('cc-menu:owner', {
            detail: { ownerId }, bubbles: true, composed: true,
          }));
          component.dispatchEvent(new CustomEvent('cc-menu:app', {
            detail: { appId: null }, bubbles: true, composed: true,
          }));
        }
        else if (appId != null) {
          component.dispatchEvent(new CustomEvent('cc-menu:app', {
            detail: { appId }, bubbles: true, composed: true,
          }));
        }
      }),

    ]);
  },
});

function render (summary, context) {
  if (summary == null) {
    return `<div class="list">...</div><div class="list">...</div>`;
  }
  return `
    <div class="list">
      <ul>
        ${summary.organisations.map((o) => `
          <li><button data-owner-id="${o.id}">${o.name}</button></li>
        `).join('')}
      </ul>
    </div>
    <div class="list">
      ${(context.ownerId != null) ? `
        <ul>
          ${(summary.organisations.find(({ id }) => id === context.ownerId) || []).applications.map((a) => `
            <li><button data-app-id="${a.id}">${a.name}</button></li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
  `;
}

function fetchSummary ({ apiConfig, signal }) {
  return getSummary({}).then(sendToApi({ apiConfig, signal }));
}
