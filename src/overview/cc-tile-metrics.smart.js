import '../smart/cc-smart-container.js';
import './cc-tile-metrics.js';
import { prefixUrl } from '@clevercloud/client/esm/prefix-url.js';
import { THIRTY_SECONDS } from '@clevercloud/client/esm/request.fetch-with-timeout.js';
import { request } from '@clevercloud/client/esm/request.fetch.js';
import { ONE_DAY, withCache } from '@clevercloud/client/esm/with-cache.js';
import { withOptions } from '@clevercloud/client/esm/with-options.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';
import { sendToApi, sendToPrometheus } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';
import { addMissingPoints, roundHour } from '../lib/chart-add-points.js';

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_HOUR = 60 * 60;

defineComponent({
  selector: 'cc-tile-metrics',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const metrics_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      metrics_lp.error$.subscribe(console.error),
      metrics_lp.error$.subscribe(() => (component.error = true)),
      metrics_lp.value$.subscribe(({ cpu, ram }) => {
        component.cpuData = cpu;
        component.ramData = ram;
      }),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {
        component.error = false;
        component.cpuData = null;
        component.ramData = null;

        if (apiConfig != null && ownerId != null && appId != null) {
          metrics_lp.push((signal) => fetchMetrics({ apiConfig, signal, ownerId, appId }));
        }
      }),

    ]);
  },
});

// TODO clever-client
function getCpuUsage (appId) {
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
  const now = new Date().getTime();
  const end = now - (now % ONE_HOUR_MS);
  const start = now - ONE_HOUR_MS * 24;

  return Promise.resolve({
    method: 'get',
    url: '/prometheus/api/v1/query_range',
    headers: {
      Accept: 'application/json',
    },
    // This is ignored by Warp10, it's here to help identify HTTP calls in browser devtools
    queryParams: {
      query: `100 - max(cpu.usage_idle{app_id="${appId}"})`,
      start: Math.floor(start / 1000),
      end: Math.floor(end / 1000),
      step: '3600',
    },
  });
}

function getMemoryUsage (appId) {
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
  const now = new Date().getTime();
  const end = now - (now % ONE_HOUR_MS);
  const start = now - ONE_HOUR_MS * 24;

  return Promise.resolve({
    method: 'get',
    url: '/prometheus/api/v1/query_range',
    headers: {
      Accept: 'application/json',
    },
    // This is ignored by Warp10, it's here to help identify HTTP calls in browser devtools
    queryParams: {
      query: `max(mem.used_percent{app_id="${appId}"})`,
      start: Math.floor(start / 1000),
      end: Math.floor(end / 1000),
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

async function fetchMetrics ({ apiConfig, signal, ownerId, appId }) {
  const warpToken = await getWarp10MetricsToken({ orgaId: ownerId })
    .then(sendToApi({ apiConfig, cacheDelay: ONE_DAY }));
  // TODO: Fetch in parallel
  const cpu = await getCpuUsage(appId)
    .then(sendToPrometheus({ apiConfig, signal, timeout: THIRTY_SECONDS, warpToken }));
  const ram = await getMemoryUsage(appId)
    .then(sendToPrometheus({ apiConfig, signal, timeout: THIRTY_SECONDS, warpToken }));

  const now = new Date().getTime();
  const end = now - (now % ONE_HOUR_MS);
  const start = now - ONE_HOUR_MS * 24;
  // console.log('cpu', addMissingPoints(cpu.data.result[0].values));
  // console.log('ram', addMissingPoints(ram.data.result[0].values));
  console.log('cpu', cpu.data.result[0].values);
  console.log('ram', ram.data.result[0].values);

  if (cpu.data.result.length === 0 || ram.data.result.length === 0) {
    return { cpu: [], ram: [] };
  }

  return { cpu: addMissingPoints(cpu.data.result[0].values), ram: addMissingPoints(ram.data.result[0].values) };
}
