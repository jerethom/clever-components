const fs = require('fs/promises');
const { getWarp10AccessLogsToken } = require('@clevercloud/client/cjs/api/v2/warp-10.js');
const { ONE_DAY, withCache } = require('@clevercloud/client/cjs/with-cache.js');
const { getStatusCodesFromWarp10, getCpusAndRamFromWarp10 } = require('@clevercloud/client/cjs/access-logs.js');
const { THIRTY_SECONDS } = require('@clevercloud/client/cjs/request.fetch-with-timeout.js');
const { prefixUrl } = require('@clevercloud/client/cjs/prefix-url.js');
const { addOauthHeader } = require('@clevercloud/client/cjs/oauth.node.js');
const { withOptions } = require('@clevercloud/client/cjs/with-options.js');
const { request } = require('@clevercloud/client/cjs/request.superagent.js');
const { execWarpscript } = require('@clevercloud/client/cjs/request-warp10.superagent.js');

function getWarp10MetricsToken(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/w10tokens/metrics/read/${params.orgaId}`,
    headers: {
      Accept: 'application/json'
    } // no query params
    // no body
  });
}


function sendToApi ({ apiConfig = {}, signal, cacheDelay, timeout }) {

  return (requestParams) => {

    const cacheParams = { ...apiConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {

      const { API_HOST = 'https://api.clever-cloud.com', ...tokens } = apiConfig;
      return Promise.resolve(requestParams)
        .then(prefixUrl(API_HOST))
        .then(addOauthHeader(tokens))
        .then(withOptions({ signal, timeout }))
        .then(request);
    });
  };
}

function sendToWarp ({ apiConfig = {}, signal, cacheDelay, timeout }) {

  return (requestParams) => {

    const cacheParams = { ...apiConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {

      const { WARP_10_HOST } = apiConfig;
      return Promise.resolve(requestParams)
        .then(prefixUrl(WARP_10_HOST))
        .then(withOptions({ signal, timeout }))
        .then(execWarpscript);
    });
  };
}

function sendToPrometheus ({ apiConfig = {}, signal, cacheDelay, timeout }) {

  return (requestParams) => {

    const cacheParams = { ...apiConfig, ...requestParams };
    return withCache(cacheParams, cacheDelay, () => {

      const { PROMETHEUS_HOST } = apiConfig;
      return Promise.resolve(requestParams)
        .then(prefixUrl(PROMETHEUS_HOST))
        .then(withOptions({ signal, timeout }))
        .then(request);
    });
  };
}

function getMemoryUsage() {
  // const foo = "https://u:TOKEN@prometheus-c1-warp10-clevercloud-customers.services.clever-cloud.com/prometheus/api/v1/query_range?query=max(mem.used_percent%7Bapp_id%3D%22%24APP_ID%22%7D)%20by%20(host)&start=1623289800&end=1623311400&step=600";
  // await fetch("https://grafana.services.clever-cloud.com/api/datasources/proxy/4/api/v1/query_range", {
  //   "headers": {
  //     "Accept": "application/json, text/plain, */*",
  //     "content-type": "application/x-www-form-urlencoded",
  //   },
  //   "referrer": "https://grafana.services.clever-cloud.com/d/runtime/application-runtime?orgId=3&editPanel=3",
  //   "body": "query=mem.used%7Bapp_id%3D%22app_ac13fa80-0424-4ac1-8593-c7136a43c9e3%22%2Cdeployment_id%3D%22%7E.*%22%7D&start=1642063800&end=1642085400&step=600",
  //   "method": "POST",
    // "mode": "cors"
  // });
  const ts = new Date().getTime();
  const start = ts - 24 * 60 * 60 * 1000;

  return Promise.resolve({
    method: 'get',
    url: '/prometheus/api/v1/query_range',
    headers: {
      Accept: 'application/json'
    },
    // This is ignored by Warp10, it's here to help identify HTTP calls in browser devtools
    queryParams: {
      query: 'sum(label_replace({__name__=~"mem.used_percent|mem.total",app_id="app_ac13fa80-0424-4ac1-8593-c7136a43c9e3"}, "series_name", "$1", "__name__", "(.*)")) by (series_name, flavor_name)',
      start: Math.floor(start / 1000),
      end: Math.floor(ts / 1000),
      step: '3600',
    },
  });
}

function getCpuUsage() {
  // const foo = "https://u:TOKEN@prometheus-c1-warp10-clevercloud-customers.services.clever-cloud.com/prometheus/api/v1/query_range?query=max(mem.used_percent%7Bapp_id%3D%22%24APP_ID%22%7D)%20by%20(host)&start=1623289800&end=1623311400&step=600";
  // await fetch("https://grafana.services.clever-cloud.com/api/datasources/proxy/4/api/v1/query_range", {
  //   "headers": {
  //     "Accept": "application/json, text/plain, */*",
  //     "content-type": "application/x-www-form-urlencoded",
  //   },
  //   "referrer": "https://grafana.services.clever-cloud.com/d/runtime/application-runtime?orgId=3&editPanel=3",
  //   "body": "query=mem.used%7Bapp_id%3D%22app_ac13fa80-0424-4ac1-8593-c7136a43c9e3%22%2Cdeployment_id%3D%22%7E.*%22%7D&start=1642063800&end=1642085400&step=600",
  //   "method": "POST",
    // "mode": "cors"
  // });
  const ts = new Date().getTime();
  const start = ts - 24 * 60 * 60 * 1000;

  return Promise.resolve({
    method: 'get',
    url: '/prometheus/api/v1/query_range',
    headers: {
      Accept: 'application/json'
    },
    // This is ignored by Warp10, it's here to help identify HTTP calls in browser devtools
    queryParams: {
      query: '100 - max(cpu.usage_idle{app_id="app_b75977aa-563f-40fd-a592-224a5f6afbd6"})',
      start: Math.floor(start / 1000),
      end: Math.floor(ts / 1000),
      step: '3600',
    },
  });
}

async function run () {

  const {token, secret} = await fs
    .readFile('/home/mathieu/.config/clever-cloud', 'utf-8')
    .then((str) => JSON.parse(str));

  const ownerId = 'orga_858600a8-74f4-4d75-a8a3-f5b868be093c';
  // const ownerId = null;
  // const appId = 'app_1246f211-d4a7-4787-ba62-56c163a8b4ef';
  const appId = null;

  const apiConfig = {
    API_HOST: 'https://api.clever-cloud.com',
    WARP_10_HOST: 'https://c1-warp10-clevercloud-customers.services.clever-cloud.com',
    API_OAUTH_TOKEN: token,
    API_OAUTH_TOKEN_SECRET: secret,
    OAUTH_CONSUMER_KEY: 'T5nFjKeHH4AIlEveuGhB5S3xg8T19e',
    OAUTH_CONSUMER_SECRET: 'MgVMqTr6fWlf2M0tkC2MXOnhfqBWDT',
  };


  const warpToken = await getWarp10MetricsToken({ orgaId: ownerId })
    .then(sendToApi({ apiConfig, cacheDelay: ONE_DAY }));
  apiConfig.PROMETHEUS_HOST = `https://u:${warpToken}@prometheus-c1-warp10-clevercloud-customers.services.clever-cloud.com`;

  // const ram = await getMemoryUsage({ warpToken, ownerId, appId })
  //   .then(sendToPrometheus({ apiConfig, timeout: THIRTY_SECONDS }));
  console.log('making api call...');
  const cpus = await getCpuUsage({ warpToken, ownerId, appId })
    .then(sendToPrometheus({ apiConfig, timeout: THIRTY_SECONDS }));
  console.log('api call done');

  // ram.data.result.forEach((elems) => console.log(elems));
  console.log('cpus', cpus);
  cpus.data.result.forEach((elems) => console.log(elems));

  process.exit();
}

run().catch(console.error);

