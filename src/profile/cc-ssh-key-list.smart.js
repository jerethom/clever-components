import './cc-ssh-key-list.js';
import '../smart/cc-smart-container.js';
import { getKeys } from '@clevercloud/client/esm/api/v2/github.js';
import {
  todo_addSshKey,
  todo_getSshKeys,
  todo_removeSshKey,
} from '@clevercloud/client/esm/api/v2/user.js';
import {
  fromCustomEvent,
  LastPromise,
  merge,
  unsubscribeWithSignal,
  withLatestFrom,
} from '../lib/observables.js';
import { sendToApi } from '../lib/send-to-api.js';
import { defineComponent } from '../lib/smart-manager.js';

function getSshKeyFromName (sshKeys, name) {
  return sshKeys.find((key) => key.name === name);
}

defineComponent({
  selector: 'cc-ssh-key-list',
  params: {
    apiConfig: { type: Object },
  },
  onConnect: function (container, component, context$, disconnectSignal) {

    const createKey_lp = new LastPromise();
    const personalKeys_lp = new LastPromise();
    const githubKeys_lp = new LastPromise();

    const errors$ = merge(createKey_lp.error$, personalKeys_lp.error$, githubKeys_lp.error$);

    const onCreate$ = fromCustomEvent(component, 'cc-ssh-key-list:create').pipe(withLatestFrom(context$));
    const onImport$ = fromCustomEvent(component, 'cc-ssh-key-list:import').pipe(withLatestFrom(context$));
    const onDelete$ = fromCustomEvent(component, 'cc-ssh-key-list:delete').pipe(withLatestFrom(context$));

    function refreshAllKeys ({ apiConfig }) {
      if (apiConfig != null) {
        component.resetPersonalKeys();
        component.resetGithubKeys();
    
        component.personalKeysModel.keys = null;
        personalKeys_lp.push((signal) => fetchKeysPersonal({ apiConfig, signal, cacheDelay: 0 }));
    
        component.githubKeysModel.keys = null;
        githubKeys_lp.push((signal) => fetchKeysGithub({ apiConfig, signal, cacheDelay: 0 }));
      }
    }

    unsubscribeWithSignal(disconnectSignal, [

      errors$.subscribe(console.error),

      personalKeys_lp.error$.subscribe(() => {
        component.personalKeysModel.state = 'error'; // TODO wire to new toast implementation
        component.requestUpdate();
      }),
      githubKeys_lp.error$.subscribe(() => {
        component.githubKeysModel.state = 'error'; // TODO wire to new toast implementation
        component.requestUpdate();
      }),

      personalKeys_lp.value$.subscribe((keys) => {
        component.personalKeysModel = {
          ...component.personalKeysModel,
          keys: keys,
          state: 'ready',
        };
      }),
      githubKeys_lp.value$.subscribe((keys) => {
        component.githubKeysModel = {
          ...component.githubKeysModel,
          keys: keys,
          state: 'ready',
        };
      }),

      onCreate$.subscribe(([key, { apiConfig }]) => {
        component.createFormModel.state = 'saving';

        createKey_lp.push((signal) => {
          return addKey({ apiConfig, signal, key })
            .then(() => {
              component.createFormModel.state = 'ready';
              refreshAllKeys({ apiConfig });
            })
            .catch(() => {
              component.createFormModel.state = 'error'; // TODO wire to new toast implementation
              component.requestUpdate();
            });
        });
      }),

      onImport$.subscribe(([key, { apiConfig }]) => {
        const importingKey = getSshKeyFromName(component.githubKeysModel.keys, key.name);
        importingKey.processing = true;

        githubKeys_lp.push((signal) => {
          return addKey({ apiConfig, signal, key })
            .then(() => {
              importingKey.processing = false;

              refreshAllKeys({ apiConfig });
            })
            .catch(() => {
              importingKey.processing = false;

              component.githubKeysModel.state = 'error'; // TODO wire to new toast implementation
              component.requestUpdate();
            });
        });
      }),

      onDelete$.subscribe(([key, { apiConfig }]) => {
        const deletingKey = getSshKeyFromName(component.personalKeysModel.keys, key.name);
        deletingKey.processing = true;

        personalKeys_lp.push((signal) => {
          return deleteKey({ apiConfig, signal, key })
            .then(() => {
              deletingKey.processing = false;

              refreshAllKeys({ apiConfig });
            })
            .catch(() => {
              deletingKey.processing = false;

              component.personalKeysModel.state = 'error'; // TODO wire to new toast implementation
              component.requestUpdate();
            });
        });
      }),

      context$.subscribe(({ apiConfig }) => {
        refreshAllKeys({ apiConfig });
      }),
    ]);
  },
});

async function fetchKeysPersonal ({ apiConfig, signal, cacheDelay }) {
  return todo_getSshKeys()
    .then(sendToApi({ apiConfig, signal, cacheDelay }));
}

async function fetchKeysGithub ({ apiConfig, signal, cacheDelay }) {
  return getKeys()
    .then(sendToApi({ apiConfig, signal, cacheDelay }));
}

async function addKey ({ apiConfig, signal, key }) {
  return todo_addSshKey({ key: key.name }, JSON.stringify(key.key))
    .then(sendToApi({ apiConfig, signal }));
}

async function deleteKey ({ apiConfig, signal, key }) {
  return todo_removeSshKey({ key: key.name })
    .then(sendToApi({ apiConfig, signal }));
}
