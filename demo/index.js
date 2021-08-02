import './aa-init-french.js';
// define smart components
import '../src/smart/cc-smart-container.js';
import '../src/overview/cc-header-app.smart.js';
import { updateRootContext } from '../src/smart/smart-manager.js';

const apiConfig = JSON.parse(localStorage.getItem('cc-tokens') ?? '{}');
const { API_HOST, ...tokens } = apiConfig;

updateRootContext({ apiConfig });
