import '../smart/cc-smart-container.js';
import './cc-tile-scalability.js';
import { get as getApp } from '@clevercloud/client/esm/api/v2/application.js';
import { observeAppEvents } from '../lib/global-bus.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-tile-scalability',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const app_lp = new LastPromise();

    const appEvents$ = observeAppEvents(context$);

    unsubscribeWithSignal(disconnectSignal, [

      app_lp.error$.subscribe(console.error),
      app_lp.error$.subscribe(() => (component.error = true)),
      app_lp.value$.subscribe((instance) => (component.scalability = instance)),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.error = false;
        component.scalability = null;

        if (apiConfig != null && ownerId != null && appId != null) {
          app_lp.push((signal) => fetchScalability({ apiConfig, signal, ownerId, appId }));
        }

      }),

      appEvents$.subscribe(([$, { apiConfig, ownerId, appId }]) => {
        app_lp.push((signal) => fetchScalability({ apiConfig, signal, ownerId, appId }));
      }),

    ]);
  },
});

function fetchScalability ({ apiConfig, signal, ownerId, appId }) {
  return getApp({ id: ownerId, appId })
    .then(sendToApi({ apiConfig, signal, cacheDelay: 1000 }))
    .then((app) => app.instance);
}
