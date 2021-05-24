import './init-french.js';
// // define smart components
import './console-fake-cc-menu.js';
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
import { updateRootContext } from '../src/lib/smart-manager.js';

const apiConfig = JSON.parse(localStorage.getItem('cc-tokens'));
const { API_HOST, ...tokens } = apiConfig;

updateRootContext({ apiConfig });

const $root = document.querySelector('.root');

const updateContext = (e) => {
  const [ownerId, appId] = location.hash.slice(1).split('/');
  console.log({ ownerId, appId });
  $root.context = { ownerId, appId };
};
window.addEventListener('hashchange', updateContext);
// updateContext();
