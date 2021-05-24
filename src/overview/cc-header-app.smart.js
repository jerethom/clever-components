import './cc-header-app.js';
import '../smart/cc-smart-container.js';
import {
  cancelDeployment,
  get as getApp,
  getAllDeployments,
  getAllInstances,
  redeploy,
  undeploy,
} from '@clevercloud/client/esm/api/v2/application.js';
import { getAllZones } from '@clevercloud/client/esm/api/v4/product.js';
import { getStatus } from '@clevercloud/client/esm/utils/app-status.js';
import { ONE_DAY } from '@clevercloud/client/esm/with-cache.js';
import { observeAppEvents, observeDeploymentsEvents } from '../lib/global-bus.js';
import {
  combineLatest,
  fromCustomEvent,
  LastPromise,
  map,
  merge,
  scan,
  unsubscribeWithSignal,
  withLatestFrom,
} from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

defineComponent({
  selector: 'cc-header-app',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    // Setup LastPromise objects
    const app_lp = new LastPromise();
    const deployments_lp = new LastPromise();
    const instances_lp = new LastPromise();
    const allZones_lp = new LastPromise();

    // Setup observables created from LastPromise objects
    // Always start with error handling
    const error$ = merge(app_lp.error$, app_lp.error$, instances_lp.error$, allZones_lp.error$);
    const status$ = combineLatest(app_lp.value$, deployments_lp.value$, instances_lp.value$)
      .pipe(
        map(([app, deployments, instances]) => getStatus(app, deployments, instances)),
        scan((oldStatus, newStatus) => {
          return (newStatus === 'unknown' && oldStatus != null)
            ? oldStatus
            : newStatus;
        }),
      );
    const statusAndInstances$ = combineLatest(status$, instances_lp.value$);
    const runningCommit$ = statusAndInstances$
      .pipe(map(([status, instances]) => getRunningCommit(status, instances)));
    const startingCommit$ = statusAndInstances$
      .pipe(map(([status, instances]) => getStartingCommit(status, instances)));
    const zone$ = combineLatest(app_lp.value$, allZones_lp.value$)
      .pipe(map(([app, allZones]) => allZones.find((z) => z.name === app.zone)));

    // Setup observables from DOM events
    const onStart$ = fromCustomEvent(component, 'cc-header-app:start')
      .pipe(withLatestFrom(context$));
    const onRestart$ = fromCustomEvent(component, 'cc-header-app:restart')
      .pipe(withLatestFrom(context$));
    const onCancel$ = fromCustomEvent(component, 'cc-header-app:cancel')
      .pipe(withLatestFrom(context$, deployments_lp.value$));
    const onStop$ = fromCustomEvent(component, 'cc-header-app:stop')
      .pipe(withLatestFrom(context$));

    // Setup observables from global event bus
    const appEvent$ = observeAppEvents(context$);
    const deploymentsEvent$ = observeDeploymentsEvents(context$);

    // Setup all observable subscriptions
    unsubscribeWithSignal(disconnectSignal, [

      // Wire observable to component element properties
      // Always start with error handling
      error$.subscribe(console.error),
      error$.subscribe(() => (component.error = true)),
      app_lp.value$.subscribe((app) => (component.app = app)),
      status$.subscribe((status) => (component.status = status)),
      runningCommit$.subscribe((runningCommit) => (component.runningCommit = runningCommit)),
      startingCommit$.subscribe((startingCommit) => (component.startingCommit = startingCommit)),
      zone$.subscribe((zone) => (component.zone = zone)),

      // Wire DOM events to actions
      // TODO: manage/dispatch errors from API calls
      onStart$.subscribe(([type, { apiConfig, ownerId, appId }]) => onRestartApp({ apiConfig, ownerId, appId, type })),
      onRestart$.subscribe(([type, { apiConfig, ownerId, appId }]) => {
        return onRestartApp({ apiConfig, ownerId, appId, type });
      }),
      onCancel$.subscribe(([$, { apiConfig, ownerId, appId }, deployments]) => {
        return onCancelLastDeployment({ apiConfig, ownerId, appId, deployments });
      }),
      onStop$.subscribe(([$, { apiConfig, ownerId, appId }]) => onStopApp({ apiConfig, ownerId, appId })),

      // Wire context changes to component element reset and data updates
      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.error = false;
        component.app = null;
        component.status = null;
        component.zone = null;

        if (ownerId != null && appId != null) {
          app_lp.push((signal) => fetchAppInfos({ apiConfig, signal, ownerId, appId }));
          deployments_lp.push((signal) => fetchDeployments({ apiConfig, signal, ownerId, appId }));
          instances_lp.push((signal) => fetchInstances({ apiConfig, signal, ownerId, appId }));
          // We don't really need the context for this
          allZones_lp.push((signal) => fetchZones({ apiConfig, signal }));
        }

      }),

      // interval(2000).pipe(withLatestFrom(context$)).subscribe(([$, { ownerId, appId }]) => {
      //   app_lp.push(() => fetchApp(ownerId, appId).then((rawApp) => getAppInfos(ownerId, rawApp)));
      //   deployments_lp.push(() => fetchDeployments(ownerId, appId));
      //   instances_lp.push(() => fetchInstances(ownerId, appId));
      // }),

      // Wire observables from global event bus to data updates
      appEvent$.subscribe(([$, { apiConfig, ownerId, appId }]) => {
        app_lp.push((signal) => fetchAppInfos({ apiConfig, signal, ownerId, appId }));
      }),

      deploymentsEvent$.subscribe(([$, { apiConfig, ownerId, appId }]) => {
        deployments_lp.push((signal) => fetchDeployments({ apiConfig, signal, ownerId, appId }));
      }),

    ]);
  },
});

function fetchAppInfos ({ apiConfig, signal, ownerId, appId }) {
  return getApp({ id: ownerId, appId })
    .then(sendToApi({ apiConfig, signal }))
    .then((rawApp) => {
      return {
        ...rawApp,
        lastDeploymentLogsUrl: getLogsUrl(ownerId, rawApp.id),
        commit: rawApp.commitId,
        variantName: rawApp.instance.variant.name,
        variantLogo: rawApp.instance.variant.logo,
      };
    });
}

function getLogsUrl (ownerId, appId, deploymentUuid) {
  const ownerHref = (ownerId == null || ownerId.startsWith('user_'))
    ? '/users/me'
    : '/organisations/' + ownerId;
  return (deploymentUuid != null)
    ? `${ownerHref}/applications/${appId}/logs?deploymentId=${deploymentUuid}`
    : `${ownerHref}/applications/${appId}/logs`;
}

export function fetchDeployments ({ apiConfig, signal, ownerId, appId }) {
  return getAllDeployments({ id: ownerId, appId }).then(sendToApi({ apiConfig, signal }));
}

export function fetchInstances ({ apiConfig, signal, ownerId, appId }) {
  return getAllInstances({ id: ownerId, appId }).then(sendToApi({ apiConfig, signal }));
}

export function fetchZones ({ apiConfig, signal }) {
  return getAllZones().then(sendToApi({ apiConfig, signal, cacheDelay: ONE_DAY }));
}

function getRunningCommit (status, rawInstances) {
  return (status === 'stopped' || status === 'start-failed')
    ? null
    : rawInstances
      .filter((i) => i.state === 'UP')
      .reduce((a, b) => b.commit, null);
}

function getStartingCommit (status, rawInstances) {
  return (status === 'stopped' || status === 'start-failed' || status === 'running' || status === 'restart-failed')
    ? null
    : rawInstances
      .filter((i) => isDeploying(i))
      .reduce((a, b) => b.commit, null);
}

function isDeploying (instance) {
  return ['BOOTING', 'STARTING', 'DEPLOYING', 'READY'].includes(instance.state);
}

function onRestartApp ({ apiConfig, ownerId, appId, type }) {

  const params = {
    id: ownerId,
    appId,
    useCache: (type === 'rebuild') ? 'no' : null,
    commit: (type === 'last-commit') ? 'HEAD' : null,
  };

  return redeploy(params).then(sendToApi({ apiConfig }));
}

function onCancelLastDeployment ({ apiConfig, ownerId, appId, deployments }) {
  const wipDeployment = deployments[0];
  if (wipDeployment != null && wipDeployment.state === 'WIP') {
    return cancelDeployment({ id: ownerId, appId, deploymentId: wipDeployment.id }).then(sendToApi({ apiConfig }));
  }
}

function onStopApp ({ apiConfig, ownerId, appId }) {
  return undeploy({ id: ownerId, appId }).then(sendToApi({ apiConfig }));
}
