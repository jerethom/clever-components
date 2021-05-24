import '../smart/cc-smart-container.js';
import './cc-logsmap.js';
import { getAccessLogsDotmapFromWarp10, getAccessLogsHeatmapFromWarp10 } from '@clevercloud/client/esm/access-logs.js';
import { get as getApp } from '@clevercloud/client/esm/api/v2/application.js';
import { get as getOwner } from '@clevercloud/client/esm/api/v2/organisation.js';
import { getWarp10AccessLogsToken } from '@clevercloud/client/esm/api/v2/warp-10.js';
import { THIRTY_SECONDS } from '@clevercloud/client/esm/request.fetch-with-timeout.js';
import { ONE_SECOND_MICROS, toMicroTimestamp } from '@clevercloud/client/esm/utils/date.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import {
  combineLatest,
  delay,
  filter,
  fromCustomEvent,
  LastPromise,
  merge,
  of,
  unsubscribeWithSignal,
  withLatestFrom,
} from '../lib/observables.js';
import { sendToApi, sendToWarp } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

const SAFE_DELAY_MICROS = 10 * ONE_SECOND_MICROS;

defineComponent({
  selector: 'cc-logsmap',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String, required: false },
  },
  onConnect: function (container, component, context$, disconnectSignal) {

    const spreadDurationMicro = 5 * ONE_SECOND_MICROS;
    // milliseconds
    const spreadDurationMs = spreadDurationMicro / 1000;
    // milliseconds
    const delayMs = (spreadDurationMs + 2 * ONE_SECOND_MICROS) / 1000;
    let lastTo;

    const owner_lp = new LastPromise(disconnectSignal);
    const app_lp = new LastPromise(disconnectSignal);
    const livePoints_lp = new LastPromise(disconnectSignal);
    const heatmapPoints_lp = new LastPromise(disconnectSignal);

    const errors$ = merge(owner_lp.error$, app_lp.error$, livePoints_lp.error$, heatmapPoints_lp.error$);
    const mode$ = merge(of(component.mode), fromCustomEvent(component, 'cc-logsmap:mode'));
    // TODO understand why withLatestFrom does not work
    const modeAndContext$ = combineLatest(mode$, context$);

    const livePointsAllDelayedAndContext$ = merge(livePoints_lp.value$, livePoints_lp.error$)
      .pipe(
        delay(spreadDurationMs),
        filter(() => component.mode === 'points'),
        withLatestFrom(context$),
      );

    unsubscribeWithSignal(disconnectSignal, [

      errors$.subscribe(console.error),
      errors$.subscribe(() => {
        component.error = true;
        component.loading = false;
        lastTo = null;
      }),
      owner_lp.value$.subscribe((owner) => {
        component.orgaName = owner.name;
        component.appName = null;
      }),
      app_lp.value$.subscribe((app) => {
        component.appName = app.name;
        component.orgaName = null;
      }),

      // IMPROVEMENT: we could filter on the mode here
      livePoints_lp.value$.subscribe((rawPoints) => {
        if (rawPoints == null) {
          component.clearPoints();
        }
        else {
          component.error = false;
          component.loading = false;
          const points = rawPoints.map((p) => ({ ...p, tooltip: p.city, delay: delayMs }));
          component.addPoints(points, { spreadDuration: spreadDurationMs });
        }
      }),

      // IMPROVEMENT: we could filter on the mode here
      heatmapPoints_lp.value$.subscribe((heatmapPoints) => {
        component.loading = false;
        component.error = false;
        component.heatmapPoints = heatmapPoints;
      }),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.error = false;
        component.appName = null;
        component.orgaName = null;

        if (apiConfig != null && ownerId != null) {

          if (appId == null) {
            owner_lp.push((signal) => fetchOwner({ apiConfig, signal, ownerId }));
          }
          else {
            app_lp.push((signal) => fetchApp({ apiConfig, signal, ownerId, appId }));
          }
        }
      }),

      modeAndContext$.subscribe(([mode, { apiConfig, ownerId, appId }]) => {

        if (apiConfig != null && ownerId != null) {

          component.loading = true;
          component.heatmapPoints = null;
          component.clearPoints();
          component.error = false;

          // IMPROVEMENT: we could cancel calls when we switch mode
          if (mode === 'points') {
            const from = (toMicroTimestamp() - spreadDurationMicro);
            const to = toMicroTimestamp();
            lastTo = to;
            livePoints_lp.push((signal) => fetchLivePoints({ apiConfig, signal, ownerId, appId, from, to }));
          }

          if (mode === 'heatmap') {
            heatmapPoints_lp.push((signal) => fetchHeatmapPoints({ apiConfig, signal, ownerId, appId }));
          }

        }
      }),

      livePointsAllDelayedAndContext$.subscribe(([$, { apiConfig, ownerId, appId }]) => {
        const from = lastTo || (toMicroTimestamp() - spreadDurationMicro);
        const to = toMicroTimestamp();
        lastTo = to;
        livePoints_lp.push((signal) => fetchLivePoints({ apiConfig, signal, ownerId, appId, from, to }));
      }),

    ]);
  },
});

function fetchOwner ({ apiConfig, signal, ownerId }) {
  return getOwner({ id: ownerId })
    .then(sendToApi({ apiConfig, signal }));
}

function fetchApp ({ apiConfig, signal, ownerId, appId }) {
  return getApp({ id: ownerId, appId })
    .then(sendToApi({ apiConfig, signal }));
}

async function fetchLivePoints ({ apiConfig, signal, ownerId, appId, from, to }) {
  const fromWithDelay = from - SAFE_DELAY_MICROS;
  const toWithDelay = to - SAFE_DELAY_MICROS;
  const warpToken = await getWarp10AccessLogsToken({ orgaId: ownerId })
    .then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
  return getAccessLogsDotmapFromWarp10({ warpToken, ownerId, appId, from: fromWithDelay, to: toWithDelay })
    .then(sendToWarp({ apiConfig, signal, timeout: THIRTY_SECONDS }));
}

async function fetchHeatmapPoints ({ apiConfig, signal, ownerId, appId }) {
  const warpToken = await getWarp10AccessLogsToken({ orgaId: ownerId })
    .then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
  return getAccessLogsHeatmapFromWarp10({ warpToken, ownerId, appId })
    .then(sendToWarp({ apiConfig, signal, timeout: THIRTY_SECONDS }));
}
