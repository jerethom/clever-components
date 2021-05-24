import '../src/smart/cc-smart-container.js';
import '../src/overview/cc-tile-scalability.js';
import { get as getApp } from '@clevercloud/client/esm/api/v2/application.js';
import { sendToApi } from '../src/lib/send-to-api.js';
import { defineComponent } from '../src/lib/smart-manager.js';
import { LastPromise, unsubscribeWithSignal } from '../src/lib/observables.js';

defineComponent({
  selector: 'cc-tile-scalability',
  onConnect (container, component, context$, disconnectSignal) {

    console.log('onConnect', { container, component });

    const app_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [
      app_lp.error$.subscribe((err) => {
        console.error(err);
        component.error = true;
      }),

      app_lp.value$.subscribe((scalability) => {
        console.log(scalability);
        component.scalability = scalability;
      }),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        console.log('context$', apiConfig.API_HOST, ownerId, appId);

        component.scalability = null;
        component.error = false;

        if (apiConfig != null && ownerId != null && appId != null) {
          app_lp.push((signal) => fetchScalability({ apiConfig, signal, ownerId, appId }));
        }

      }),
    ]);

  },
});

function fetchScalability ({ apiConfig, signal, ownerId, appId }) {
  return getApp({ id: ownerId, appId })
    .then(sendToApi({ apiConfig, signal, cacheDelay: 1000 }))
    .then((app) => app.instance);
}
