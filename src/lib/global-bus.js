import { filter, Subject, withLatestFrom } from './observables.js';

export const globalEventBus = new Subject();

export function observeAppEvents (context$) {
  return globalEventBus
    .pipe(
      withLatestFrom(context$),
      filter(([{ event, data }, context]) => {
        return (event === 'APPLICATION_EDITION')
          && data.ownerId === context.ownerId
          && data.appId === context.appId;
      }),
    );
}

export function observeDeploymentsEvents (context$) {
  return globalEventBus
    .pipe(
      withLatestFrom(context$),
      filter(([{ event, data }, context]) => {
        return (event.startsWith('DEPLOYMENT_'))
          && data.ownerId === context.ownerId
          && data.appId === context.appId;
      }),
    );
}
