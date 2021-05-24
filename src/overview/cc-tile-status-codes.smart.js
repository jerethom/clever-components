import '../smart/cc-smart-container.js';
import './cc-tile-status-codes.js';
import { defineComponent } from '../smart/smart-manager.js';
import { getWarp10AccessLogsToken } from '@clevercloud/client/esm/api/v2/warp-10.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { ONE_DAY, sendToApi, sendToWarp } from '../lib/data-helpers.js';
import { getStatusCodesFromWarp10 } from '@clevercloud/client/esm/access-logs.js';

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
      statusCodes_lp.error$.subscribe((error) => component.error = true),
      statusCodes_lp.value$.subscribe((statusCodes) => component.statusCodes = statusCodes),

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
    .then(sendToWarp({ apiConfig, signal }));
}
