import '../smart/cc-smart-container.js';
import './cc-tile-requests.js';
import { getRequestsFromWarp10 } from '@clevercloud/client/esm/access-logs.js';
import { getWarp10AccessLogsToken } from '@clevercloud/client/esm/api/v2/warp-10.js';
import { THIRTY_SECONDS } from '@clevercloud/client/esm/request.fetch-with-timeout.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { sendToApi, sendToWarp } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-tile-requests',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    // Optional
    appId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const requests_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      requests_lp.error$.subscribe(console.error),
      requests_lp.error$.subscribe(() => (component.error = true)),
      requests_lp.value$.subscribe((data) => (component.data = data)),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.error = false;
        component.data = null;

        if (apiConfig != null && ownerId != null) {
          requests_lp.push((signal) => fetchRequests({ apiConfig, signal, ownerId, appId }));
        }

      }),

    ]);
  },
});

async function fetchRequests ({ apiConfig, signal, ownerId, appId }) {
  const warpToken = await getWarp10AccessLogsToken({ orgaId: ownerId })
    .then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
  return getRequestsFromWarp10({ warpToken, ownerId, appId })
    .then(sendToWarp({ apiConfig, signal, timeout: THIRTY_SECONDS }));
}
