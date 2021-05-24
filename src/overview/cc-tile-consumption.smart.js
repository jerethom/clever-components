import '../smart/cc-smart-container.js';
import './cc-tile-consumption.js';
import { defineComponent } from '../smart/smart-manager.js';
import { ONE_DAY, sendToApi } from '../lib/data-helpers.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { getCreditPrice } from '@clevercloud/client/esm/api/v2/product.js';
import { getConsumptions as getOwnerConsumptions } from '@clevercloud/client/esm/api/v2/organisation.js';

defineComponent({
  selector: 'cc-tile-consumption',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const consumption_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      consumption_lp.error$.subscribe((error) => component.error = true),
      consumption_lp.value$.subscribe((consumption) => component.consumption = consumption),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.error = false;
        component.consumption = null;

        if (ownerId != null && appId != null && apiConfig != null) {
          consumption_lp.push((signal) => fetchConsumption({ apiConfig, signal, ownerId, appId }));
        }

      }),

    ]);
  },
});

function fetchConsumption ({ apiConfig, signal, ownerId, appId }) {
  return Promise
    .all([
      fetchEuroCreditPrice({ apiConfig, signal }),
      fetchConsumptionInCredits({ apiConfig, signal, ownerId, appId }),
    ])
    .then(([euroCreditPrice, consumption]) => {
      return {
        yesterday: consumption.yesterday * euroCreditPrice,
        last30Days: consumption.last30Days * euroCreditPrice,
      };
    });
}

function fetchEuroCreditPrice ({ apiConfig, signal }) {
  return getCreditPrice().then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }))
    .then((prices) => {
      const price = prices.find((p) => p.currency === 'EUR');
      if (price == null) {
        // TODO: what do we do?
        throw new Error('');
      }
      return price.value;
    });
}

function fetchConsumptionInCredits ({ apiConfig, signal, ownerId, appId }) {
  return getOwnerConsumptions({ id: ownerId }).then(sendToApi({ apiConfig, signal }))
    .then((consumptionByAppId) => {
      const consumption = consumptionByAppId[appId];
      const yesterday = consumption[getStartOfYesterday()];
      const last30Days = Object.values(consumption).reduce((a, b) => a + b, 0);
      return { yesterday, last30Days };
    });
}

const DAY = (24 * 60 * 60 * 1000);

export function getStartOfYesterday () {
  const todayTimestampWithTz = new Date().getTime();
  const startOfTodayTimestampUtc = todayTimestampWithTz - todayTimestampWithTz % DAY;
  const startOfTYesterdayTimestampUtc = startOfTodayTimestampUtc - DAY;
  return new Date(startOfTYesterdayTimestampUtc).toISOString();
}
