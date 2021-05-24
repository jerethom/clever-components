import './aa-init-french.js';
// define smart components
import '../src/addon/cc-addon-linked-apps.smart.js';
import '../src/env-var/cc-env-var-form.smart-env-var-addon.js';
import { updateRootContext } from '../src/lib/smart-manager.js';

const apiConfig = JSON.parse(localStorage.getItem('cc-tokens'));
const { API_HOST, ...tokens } = apiConfig;

updateRootContext({ apiConfig });
