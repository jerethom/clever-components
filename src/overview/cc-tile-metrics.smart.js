import '../smart/cc-smart-container.js';
import './cc-metrics.js';
import { prefixUrl } from '@clevercloud/client/cjs/prefix-url.js';
import { request } from '@clevercloud/client/cjs/request.superagent.js';
import { withCache } from '@clevercloud/client/cjs/with-cache.js';
import { withOptions } from '@clevercloud/client/cjs/with-options.js';
import { THIRTY_SECONDS } from '@clevercloud/client/esm/request.fetch-with-timeout.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-tile-metrics',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String, required: false },
  },
  onConnect (container, component, context$, disconnectSignal) {

    // const cpu_lp = new LastPromise();
    // const ram_lp = new LastPromise();
    const metrics_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      metrics_lp.error$.subscribe(console.error),
      metrics_lp.error$.subscribe(() => (component.error = true)),
      metrics_lp.value$.subscribe(({ ram, cpu }) => {
        component.cpuData = cpu;
        component.ramData = ram;
      }),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {
        component.error = false;
        component.cpuData = null;
        component.ramData = null;

        if (apiConfig != null && ownerId != null) {
          metrics_lp.push((signal) => fetchMetrics({ apiConfig, signal, ownerId, appId }));
        }
      }),

    ]);
  },
});

// TODO : move this elsewhere

function getCpuUsage () {
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
      Accept: 'application/json',
    },
    // This is ignored by Warp10, it's here to help identify HTTP calls in browser devtools
    queryParams: {
      query: '100 - max(cpu.usage_idle{app_id="app_67008db4-7bc3-4949-bb7f-fdf4afb17df8"})',
      start: Math.floor(start / 1000),
      end: Math.floor(ts / 1000),
      step: '3600',
    },
  });
}

function getMemoryUsage () {
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
      Accept: 'application/json',
    },
    // This is ignored by Warp10, it's here to help identify HTTP calls in browser devtools
    queryParams: {
      query: 'sum(label_replace({__name__=~"mem.used_percent|mem.total",app_id="app_67008db4-7bc3-4949-bb7f-fdf4afb17df8"}, "series_name", "$1", "__name__", "(.*)")) by (series_name, flavor_name)',
      start: Math.floor(start / 1000),
      end: Math.floor(ts / 1000),
      step: '3600',
    },
  });
}

function getWarp10MetricsToken (params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/w10tokens/metrics/read/${params.orgaId}`,
    headers: {
      Accept: 'application/json',
    }, // no query params
    // no body
  });
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

async function fetchMetrics ({ apiConfig, signal, ownerId, appId }) {
  const warpToken = await getWarp10MetricsToken({ orgaId: ownerId })
    .then(sendToApi({ apiConfig, cacheDelay: ONE_DAY }));
  apiConfig.PROMETHEUS_HOST = `https://u:${warpToken}@prometheus-c1-warp10-clevercloud-customers.services.clever-cloud.com`;
  const cpu = await getCpuUsage({ warpToken, ownerId, appId })
    .then(sendToPrometheus({ apiConfig, timeout: THIRTY_SECONDS }));
  const ram = await getMemoryUsage({ warpToken, ownerId, appId })
    .then(sendToPrometheus({ apiConfig, timeout: THIRTY_SECONDS }));
  return { cpu, ram };
}
