import './aa-init-french.js';
import { updateRootContext } from '../src/smart/smart-manager.js';
// define smart components
import('../src/smart/cc-smart-container.js');
import('../src/zones/cc-zone-input.smart.js');

const apiConfig = JSON.parse(localStorage.getItem('cc-tokens'));
updateRootContext({ apiConfig });

// Setup interactivity between cc-zone-input and cc-zone for current selected zone

const $currentZone = document.querySelector('cc-zone');
const $zonesInput = document.querySelector('cc-zone-input');

$zonesInput.addEventListener('cc-zone-input:input', ({ detail: zoneName }) => {
  $currentZone.zone = $zonesInput.zones.find(({ name }) => name === zoneName);
});
