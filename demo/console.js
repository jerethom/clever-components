import './aa-init-french.js';
// define smart components
import '../src/smart/cc-smart-container.js';
import '../src/overview/cc-header-app.smart.js';
import '../src/overview/cc-overview.js';
import '../src/overview/cc-tile-scalability.smart.js';
import '../src/overview/cc-tile-deployments.smart.js';
import '../src/overview/cc-tile-consumption.smart.js';
import '../src/overview/cc-tile-instances.smart.js';
import '../src/overview/cc-tile-requests.smart.js';
import '../src/overview/cc-tile-status-codes.smart.js';
import '../src/maps/cc-logsmap.smart.js';
import './console-fake-cc-menu.js';
import { updateRootContext } from '../src/smart/smart-manager.js';
// import '../src/lib/event-api-to-bus.js';

const apiConfig = JSON.parse(localStorage.getItem('cc-tokens'));
apiConfig.WARP_10_EXEC_URL = 'https://c1-warp10-clevercloud-customers.services.clever-cloud.com/api/v0/exec';
apiConfig.WARP_10_HOST = 'https://c1-warp10-clevercloud-customers.services.clever-cloud.com';
const { API_HOST, ...tokens } = apiConfig;

updateRootContext({ apiConfig });

const $root = document.querySelector('.root');

$root.addEventListener('cc-menu:owner', ({ detail: { ownerId } }) => {
  console.log({ownerId})
  $root.context = { ...$root.context, ownerId };
});

$root.addEventListener('cc-menu:app', ({ detail: { appId } }) => {
  $root.context = { ...$root.context, appId };
});
