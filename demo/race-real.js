import '../src/smart/cc-smart-container.js';
import { defineComponent } from '../src/lib/smart-manager.js';
import { LastPromise, unsubscribeWithSignal } from '../src/lib/observables.js';

defineComponent({
  selector: 'div.smart-component.race',
  params: {
    size: { type: Number },
    error: { type: Boolean },
  },
  onConnect (container, child, contextObservable, disconnectSignal) {

    unsubscribeWithSignal(disconnectSignal, [

      contextObservable.subscribe(({ size, error }) => {
        child.innerHTML = '...';
        if (size != null) {
          realApi({ size, error }, 'with-race')
            .then((value) => child.innerHTML = value)
            .catch((error) => child.innerHTML = error);
        }
      }),

    ]);
  },
});

defineComponent({
  selector: 'div.smart-component.norace',
  params: {
    size: { type: Number },
    error: { type: Boolean },
  },
  onConnect (container, child, context$, disconnectSignal) {

    const data_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      data_lp.error$.subscribe((error) => child.innerHTML = `!!! ${error}`),
      data_lp.value$.subscribe((value) => child.innerHTML = value),

      context$.subscribe(({ size, error }) => {

        if (size != null) {
          child.innerHTML = '...';
          data_lp.push((signal) => realApi({ size, error }, 'no-race', signal));
        }

      }),

    ]);
  },
});

function realApi ({ size, error }, mode = '', signal) {
  console.log(`API CALL   [${size}] (${mode})`);

  return fetch(`https://fakerapi.it/api/v1/companies?_quantity=${size}&mode=${mode}`, { signal })
    .then((r) => {
      if (error) {
        const errorMessage = `API ERROR  [${size}] (${mode}) ${r.status}`;
        throw new Error(errorMessage);
      }
      return r.json();
    })
    .then((apiResult) => {
      const allNames = apiResult.data.slice(0, 5).map((i) => i.name).join(', ');
      return `API RESULT [${size}] (${mode}) ${allNames}`;
    });
}

const $smartContainer = document.querySelector('cc-smart-container');
const $container = document.querySelector('.container');

let [$from, $to] = [$smartContainer, $container];

document
  .querySelector('#toggle')
  .addEventListener('click', () => {
    Array
      .from($from.children)
      .forEach((child) => $to.appendChild(child));
    [$from, $to] = [$to, $from];
  });

document
  .querySelector('.buttons')
  .addEventListener('click', (e) => {
    const context = JSON.parse(e.target.dataset.context);
    $smartContainer.context = context;
  });
