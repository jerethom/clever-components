import '../src/smart/cc-smart-container.js';
import { defineComponent } from '../src/lib/smart-manager.js';
import { setAbortableTimeout } from '../src/lib/timeout.js';
import { LastPromise, unsubscribeWithSignal } from '../src/lib/observables.js';

defineComponent({
  selector: 'div.smart-component.race',
  params: {
    delay: { type: Number },
    error: { type: Boolean },
  },
  onConnect (container, child, context$, disconnectSignal) {

    unsubscribeWithSignal(disconnectSignal, [

      context$.subscribe(({ delay, error }) => {
        child.innerHTML = '...';
        if (delay != null) {
          fakeApi({ delay, error }, 'with-race')
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
    delay: { type: Number },
    error: { type: Boolean },
  },
  onConnect (container, child, context$, disconnectSignal) {

    const data_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      data_lp.error$.subscribe((error) => child.innerHTML = `!!! ${error}`),
      data_lp.value$.subscribe((value) => child.innerHTML = value),

      context$.subscribe(({ delay, error }) => {

        if (delay != null) {
          child.innerHTML = '...';
          data_lp.push((signal) => fakeApi({ delay, error }, 'no-race', signal));
        }

      }),

    ]);
  },
});

const ac = new AbortController();
const unusedSignal = ac.signal;

function fakeApi ({ delay, error }, mode = '', signal = unusedSignal) {
  console.log(`API CALL   ${delay}ms (${mode})`);

  return new Promise((resolve, reject) => {
    setAbortableTimeout(() => {
      if (error) {
        const errorMessage = `API ERROR  ${delay}ms (${mode})`;
        console.error(errorMessage);
        reject(new Error(errorMessage));
      }
      else {
        const result = `API RESULT ${delay}ms (${mode})`;
        console.log(result);
        resolve(result);
      }
    }, delay, signal);
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
