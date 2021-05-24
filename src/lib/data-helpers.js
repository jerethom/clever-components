import { getConsumptions as getAppConsumption } from '@clevercloud/client/esm/api/v2/organisation.js';
import { getCreditPrice } from '@clevercloud/client/esm/api/v2/product.js';
import { addOauthHeader } from '@clevercloud/client/esm/oauth.browser.js';
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { request } from '../../demo/request.js';
import { execWarpscript } from '@clevercloud/client/esm/request-warp10.fetch.js';

export const ONE_DAY = 1000 * 60 * 60 * 24;

const cache = new Map();

/**
 *
 * @param {Object} apiConfig
 * @param {String} apiConfig.API_HOST
 * @param {String} apiConfig.API_OAUTH_TOKEN
 * @param {String} apiConfig.API_OAUTH_TOKEN_SECRET
 * @param {String} apiConfig.OAUTH_CONSUMER_KEY
 * @param {String} apiConfig.OAUTH_CONSUMER_SECRET
 * @param {Number?} cacheDelay
 * @return {function(*=): (any | undefined)}
 */
export function sendToApi ({ apiConfig, signal, cacheDelay = 1000 }) {

  const { API_HOST, ...tokens } = apiConfig;

  return (requestParams) => {

    const cacheKey = JSON.stringify({ apiConfig, requestParams });

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const promise = Promise.resolve(requestParams)
      .then(prefixUrl(API_HOST))
      .then(addOauthHeader(tokens))
      .then((rp) => request(rp, signal));

    if (requestParams.method === 'get') {
      cache.set(cacheKey, promise);
      setTimeout(() => {
        cache.delete(cacheKey);
      }, cacheDelay);
    }

    return promise;
  };
}

/**
 * @param {Object} apiConfig
 * @param {String} apiConfig.WARP_10_EXEC_URL
 * @param {Number?} cacheDelay
 * @return {function(*=): (any | undefined)}
 */
export function sendToWarp ({ apiConfig, signal, cacheDelay = 1000 }) {

  const { WARP_10_HOST } = apiConfig;

  return (requestParams) => {

    const cacheKey = JSON.stringify({ apiConfig, requestParams });

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const promise = Promise.resolve(requestParams)
      .then(prefixUrl(WARP_10_HOST))
      .then((rp) => execWarpscript(rp, { signal }));

    if (requestParams.method === 'get') {
      cache.set(cacheKey, promise);
      setTimeout(() => {
        cache.delete(cacheKey);
      }, cacheDelay);
    }

    return promise;
  };
}

export function fetchEuroCreditPrice () {
  return getCreditPrice().then((p) => sendToApi(p, 60 * 60 * 1000))
    .then((prices) => {
      const price = prices.find((p) => p.currency === 'EUR');
      if (price == null) {
        // TODO: what do we do?
        throw new Error('');
      }
      return price.value;
    });
}

const DAY = (24 * 60 * 60 * 1000);

export function getStartOfYesterday () {
  const todayTimestampWithTz = new Date().getTime();
  const startOfTodayTimestampUtc = todayTimestampWithTz - todayTimestampWithTz % DAY;
  const startOfTYesterdayTimestampUtc = startOfTodayTimestampUtc - DAY;
  return new Date(startOfTYesterdayTimestampUtc).toISOString();
}

export function fetchConsumptionInCredits (ownerId, appId) {
  return getAppConsumption({ id: ownerId, appId }).then(sendToApi)
    .then((consumptionByAppId) => {
      const consumption = consumptionByAppId[appId];
      const yesterday = consumption[getStartOfYesterday()];
      const last30Days = Object.values(consumption).reduce((a, b) => a + b, 0);
      return { yesterday, last30Days };
    });
}

export function fetchAppConsumption (ownerId, appId) {
  return Promise
    .all([
      fetchEuroCreditPrice(),
      fetchConsumptionInCredits(ownerId, appId),
    ])
    .then(([euroCreditPrice, consumption]) => {
      return {
        yesterday: consumption.yesterday * euroCreditPrice,
        last30Days: consumption.last30Days * euroCreditPrice,
      };
    });
}



