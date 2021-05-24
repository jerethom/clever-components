import '../smart/cc-smart-container.js';
import './cc-tile-instances.js';
import { defineComponent } from '../smart/smart-manager.js';
import { combineLatest, LastPromise, map, merge, scan, unsubscribeWithSignal } from '../lib/observables.js';
import { sendToApi } from '../lib/data-helpers.js';
import { get as getApp, getAllDeployments, getAllInstances } from '@clevercloud/client/esm/api/v2/application.js';
import { getStatus } from '@clevercloud/client/esm/utils/app-status.js';

defineComponent({
  selector: 'cc-tile-instances',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const app_lp = new LastPromise();
    const deployments_lp = new LastPromise();
    const instances_lp = new LastPromise();

    const error$ = merge(app_lp.error$, deployments_lp.error$, instances_lp.error$);
    const status$ = combineLatest(app_lp.value$, deployments_lp.value$, instances_lp.value$)
      .pipe(
        map(([app, deployments, instances]) => getStatus(app, deployments, instances)),
        scan((oldStatus, newStatus) => {
          return (newStatus === 'unknown' && oldStatus != null)
            ? oldStatus
            : newStatus;
        }),
      );
    const instances$ = combineLatest(status$, instances_lp.value$)
      .pipe(map(([status, rawInstances]) => formatInstances(status, rawInstances)));

    unsubscribeWithSignal(disconnectSignal, [

      error$.subscribe((error) => component.error = true),
      instances$.subscribe((instances) => component.instances = instances),

      context$.subscribe(({ apiConfig, ownerId, appId }) => {

        component.error = false;
        component.instances = null;

        if (apiConfig != null && ownerId != null && appId != null) {
          app_lp.push((signal) => fetchApp({ apiConfig, signal, ownerId, appId }));
          deployments_lp.push((signal) => fetchDeployments({ apiConfig, signal, ownerId, appId }));
          instances_lp.push((signal) => fetchInstances({ apiConfig, signal, ownerId, appId }));
        }

      }),

    ]);
  },
});

function fetchApp ({ apiConfig, signal, ownerId, appId }) {
  return getApp({ id: ownerId, appId })
    .then(sendToApi({ apiConfig, signal }));
}

function fetchDeployments ({ apiConfig, signal, ownerId, appId }) {
  return getAllDeployments({ id: ownerId, appId })
    .then(sendToApi({ apiConfig, signal }));
}

function fetchInstances ({ apiConfig, signal, ownerId, appId }) {
  return getAllInstances({ id: ownerId, appId })
    .then(sendToApi({ apiConfig, signal }));
}

export function formatInstances (status, rawInstances) {
  const runningInstances = (status === 'stopped' || status === 'start-failed')
    ? []
    : rawInstances
      .filter((i) => i.state === 'UP')
      .map((i) => ({ flavorName: i.flavor.name, count: 1 }))
      .reduce(...countBy('flavorName'));

  const deployingInstances = (status === 'stopped' || status === 'start-failed' || status === 'running' || status === 'restart-failed')
    ? []
    : rawInstances
      .filter((i) => instanceState.deploying(i))
      .map((i) => ({ flavorName: i.flavor.name, count: 1 }))
      .reduce(...countBy('flavorName'));

  return { running: runningInstances, deploying: deployingInstances };
}

function countBy (propName) {
  return [
    (accumulator, currentValue, index, array) => {

      if (accumulator[currentValue[propName]] == null) {
        accumulator[currentValue[propName]] = { ...currentValue, count: 0 };
      }
      accumulator[currentValue[propName]].count += 1;

      return (index === (array.length - 1))
        ? Object.values(accumulator)
        : accumulator;
    },
    {},
  ];
}
