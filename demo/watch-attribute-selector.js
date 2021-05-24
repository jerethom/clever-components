import './aa-init-french.js';
// define smart components
import '../src/smart/cc-smart-container.js';
import '../src/env-var/cc-env-var-form.smart-env-var.js';
import '../src/env-var/cc-env-var-form.smart-exposed-config.js';
import { updateRootContext } from '../src/lib/smart-manager.js';

const apiConfig = JSON.parse(localStorage.getItem('cc-tokens'));
updateRootContext({ apiConfig });

const [$one, $two] = Array.from(document.querySelectorAll('cc-env-var-form'));

document
  .querySelector('#toggle')
  .addEventListener('click', () => {
    const [contextForTwo, contextForOne] = [$one.getAttribute('context'), $two.getAttribute('context')];
    $one.setAttribute('context', contextForOne);
    $two.setAttribute('context', contextForTwo);
  });
