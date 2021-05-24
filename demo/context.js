import './aa-init-french.js';
// define smart components
import '../src/smart/cc-smart-container.js';
import '../src/overview/cc-tile-deployments.smart.js';
import '../src/overview/cc-tile-scalability.smart.js';
import '../src/overview/cc-tile-instances.smart.js';
import '../src/overview/cc-tile-consumption.smart.js';
import '../src/overview/cc-tile-status-codes.smart.js';
import '../src/overview/cc-tile-requests.smart.js';
import '../src/maps/cc-logsmap.smart.js';
import { updateRootContext } from '../src/smart/smart-manager.js';
// import { globalEventBus } from '../src/lib/global-bus.js';
// import { EventsStream } from '@clevercloud/client/esm/streams/events.browser.js';

const apiConfig = JSON.parse(localStorage.getItem('cc-tokens'));
apiConfig.WARP_10_EXEC_URL = 'https://c1-warp10-clevercloud-customers.services.clever-cloud.com/api/v0/exec';
const { API_HOST, ...tokens } = apiConfig;

updateRootContext({ apiConfig });

// const es = new EventsStream({ apiHost: API_HOST, tokens });
//
// es.on('event', (event) => {
//   globalEventBus.next(event);
// });
// es.open({ autoRetry: true });

const $logsmap = document.querySelector('cc-logsmap');
const $logsmapParent = $logsmap.parentElement;
document.querySelector('#toggle').addEventListener('click', () => {
  if ($logsmap.parentElement === $logsmapParent) {
    document.body.appendChild($logsmap);
  }
  else {
    $logsmapParent.appendChild($logsmap);
  }
});
