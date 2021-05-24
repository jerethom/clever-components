import '../smart/cc-smart-container.js';
import './cc-tile-deployments.js';
import { defineComponent } from '../smart/smart-manager.js';
import { getAllDeployments } from '@clevercloud/client/esm/api/v2/application.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { observeDeploymentsEvents } from '../lib/global-bus.js';
import { sendToApi } from '../lib/data-helpers.js';

defineComponent({
  selector: 'cc-tile-deployments',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const deployments_lp = new LastPromise();

    const deployments$ = observeDeploymentsEvents(context$);

    unsubscribeWithSignal(disconnectSignal, [

      deployments_lp.error$.subscribe((error) => component.error = true),
      deployments_lp.value$.subscribe((deployments) => component.deployments = deployments),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.error = false;
        component.deployments = null;

        if (ownerId != null && appId != null && apiConfig != null) {
          deployments_lp.push((signal) => fetchDeployments({ apiConfig, signal, ownerId, appId }));
        }

      }),

      deployments$.subscribe(([$, { apiConfig, ownerId, appId }]) => {
        deployments_lp.push((signal) => fetchDeployments({ apiConfig, signal, ownerId, appId }));
      }),

    ]);
  },
});

function fetchDeployments ({ apiConfig, signal, ownerId, appId }) {
  return getAllDeployments({ id: ownerId, appId })
    .then(sendToApi({ apiConfig, signal }))
    .then((deployments) => {
      return deployments
        .filter(({ action, state }) => (action !== 'CANCEL' && state !== 'WIP'))
        .map(({ state, action, date: ts, uuid }) => {
          const date = new Date(ts).toISOString();
          const logsUrl = getLogsUrl(ownerId, appId, uuid);
          return { state, action, date, logsUrl };
        })
        .slice(0, 2);
    });
}

function getLogsUrl (ownerId, appId, deploymentUuid) {
  const ownerHref = (ownerId == null || ownerId.startsWith('user_'))
    ? 'https://console.clever-cloud.com/users/me'
    : 'https://console.clever-cloud.com/organisations/' + ownerId;
  return (deploymentUuid != null)
    ? `${ownerHref}/applications/${appId}/logs?deploymentId=${deploymentUuid}`
    : `${ownerHref}/applications/${appId}/logs`;
}
