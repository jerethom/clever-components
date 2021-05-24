import '../smart/cc-smart-container.js';
import './cc-logsmap.js';
import { defineComponent } from '../smart/smart-manager.js';
import { getWarp10AccessLogsToken } from '@clevercloud/client/esm/api/v2/warp-10.js';
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
import { ONE_DAY, sendToApi, sendToWarp } from '../lib/data-helpers.js';
import { get as getApp } from '@clevercloud/client/esm/api/v2/application.js';
import { get as getOwner } from '@clevercloud/client/esm/api/v2/organisation.js';
import { getAccessLogsDotmapFromWarp10, getAccessLogsHeatmapFromWarp10 } from '@clevercloud/client/esm/access-logs.js';

defineComponent({
  selector: 'cc-logsmap',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    // Optional
    appId: { type: String },
  },
  onConnect: function (container, component, context$, disconnectSignal) {

    const spreadDuration = 5000;
    const pointDelay = spreadDuration + 2000;
    // TODO
    let lastTo;

    const owner_lp = new LastPromise();
    const app_lp = new LastPromise();
    const livePoints_lp = new LastPromise();
    const heatmapPoints_lp = new LastPromise();

    const errors$ = merge(owner_lp.error$, app_lp.error$, livePoints_lp.error$, heatmapPoints_lp.error$);
    // TODO comprendre pourquoi withLatestFrom
    const mode$ = merge(of(component.mode), fromCustomEvent(component, 'cc-logsmap:mode'));
    const modeAndContext$ = combineLatest(mode$, context$);

    const livePointsAll$ = merge(livePoints_lp.value$, livePoints_lp.error$)
      .pipe(
        delay(spreadDuration),
        filter(() => component.mode === 'points'),
        withLatestFrom(context$),
      );

    unsubscribeWithSignal(disconnectSignal, [

      errors$.subscribe((error) => {
        console.error(error);
        component.error = true;
        component.loading = false;
      }),
      // TODO reset orga if app and vice versa
      owner_lp.value$.subscribe((owner) => component.orgaName = owner.name),
      app_lp.value$.subscribe((app) => component.appName = app.name),
      // TODO: filter en fonction du mode
      livePoints_lp.value$.subscribe((rawPoints) => {
        console.log('points', rawPoints);
        if (rawPoints == null) {
          component.clearPoints();
        }
        else {
          component.error = false;
          component.loading = false;
          const points = rawPoints.map((p) => ({ ...p, tooltip: p.city, delay: pointDelay }));
          component.addPoints(points, { spreadDuration });
        }
      }),
      heatmapPoints_lp.value$.subscribe((heatmapPoints) => {
        console.log('heatmap', heatmapPoints);
        component.loading = false;
        component.error = false;
        component.heatmapPoints = heatmapPoints;
      }),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        console.log('context', apiConfig, ownerId, appId);

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

          // TODO: cancel appel rest

          if (mode === 'points') {
            // TODO fetch points from 5 secs ago to now
            livePoints_lp.push((signal) => fetchLivePoints({ apiConfig, signal, ownerId, appId }));
          }

          if (mode === 'heatmap') {
            heatmapPoints_lp.push((signal) => fetchHeatmapPoints({ apiConfig, signal, ownerId, appId }));
          }

        }
      }),

      livePointsAll$.subscribe(([$, { apiConfig, ownerId, appId }]) => {
        console.log('foobar');
        // TODO fetch points from dernier appel to now
        livePoints_lp.push((signal) => fetchLivePoints({ apiConfig, signal, ownerId, appId }));
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

function getMillisecsAgo (ms) {
  return new Date((new Date().getTime() - ms)).toISOString();
}

function getNow () {
  return new Date().toISOString();
}

async function fetchLivePoints ({ apiConfig, signal, ownerId, appId }) {

  // throw new Error();

  console.log('fetchLivePoints');

  let lastToDate;
  const spreadDuration = 5000;
  const delay = spreadDuration + 2000;
  const fromDate = lastToDate || getMillisecsAgo(spreadDuration);
  const toDate = getNow();

  const warpToken = await getWarp10AccessLogsToken({ orgaId: ownerId })
    .then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
  return getAccessLogsDotmapFromWarp10({ warpToken, ownerId, appId, fromDate, toDate })
    .then(sendToWarp({ apiConfig, signal }));
}

async function fetchHeatmapPoints ({ apiConfig, signal, ownerId, appId }) {
  const warpToken = await getWarp10AccessLogsToken({ orgaId: ownerId })
    .then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
  return getAccessLogsHeatmapFromWarp10({ warpToken, ownerId, appId })
    .then(sendToWarp({ apiConfig, signal }));
}
