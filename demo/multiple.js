import './aa-init-french.js';
import { defineComponent, updateRootContext } from '../src/lib/smart-manager.js';
import { sendToApi } from '../src/lib/send-to-api.js';
import { LastPromise, unsubscribeWithSignal } from '../src/lib/observables.js';
import { get as getApp } from '@clevercloud/client/esm/api/v2/application.js';
// define smart components
import('../src/smart/cc-smart-container.js');
import('../src/overview/cc-tile-deployments.smart.js');
import('../src/overview/cc-tile-scalability.smart.js');
import('../src/env-var/cc-env-var-form.smart-env-var.js');

const apiConfig = JSON.parse(localStorage.getItem('cc-tokens'));
updateRootContext({ apiConfig });

defineComponent({
  selector: 'div.app-title',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const app_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      app_lp.error$.subscribe(() => component.textContent = '[error]'),
      app_lp.value$.subscribe((app) => {
        component.textContent = app.name;
        component.style.backgroundImage = `url(${app.instance.variant.logo})`;
      }),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.textContent = '????';
        component.style.backgroundImage = ``;

        if (apiConfig != null && ownerId != null && appId != null) {
          app_lp.push((signal) => fetchApp({ apiConfig, signal, ownerId, appId }));
        }

      }), disconnectSignal,

    ]);
  },
});

function fetchApp ({ apiConfig, signal, ownerId, appId }) {
  return getApp({ id: ownerId, appId })
    .then(sendToApi({ apiConfig, signal }));
}
