import '../smart/cc-smart-container.js';
import './cc-tile-status-codes.js';
import { getStatusCodesFromWarp10 } from '@clevercloud/client/esm/access-logs.js';
import { getWarp10AccessLogsToken } from '@clevercloud/client/esm/api/v2/warp-10.js';
import { THIRTY_SECONDS } from '@clevercloud/client/esm/request.fetch-with-timeout.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { sendToApi, sendToWarp } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-tile-status-codes',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    // Optional
    appId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const statusCodes_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      statusCodes_lp.error$.subscribe(console.error),
      statusCodes_lp.error$.subscribe(() => (component.error = true)),
      statusCodes_lp.value$.subscribe((statusCodes) => (component.statusCodes = statusCodes)),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.error = false;
        component.statusCodes = null;

        if (apiConfig != null && ownerId != null) {
          statusCodes_lp.push((signal) => fetchStatusCodes({ apiConfig, signal, ownerId, appId }));
        }

      }),

    ]);
  },
});

async function fetchStatusCodes ({ apiConfig, signal, ownerId, appId }) {
  const warpToken = await getWarp10AccessLogsToken({ orgaId: ownerId })
    .then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
  return getStatusCodesFromWarp10({ warpToken, ownerId, appId })
    .then(sendToWarp({ apiConfig, signal, timeout: THIRTY_SECONDS }));
}
