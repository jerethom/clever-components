import './init-french.js';
import '../src/overview/cc-tile-deployments.smart.js';
import '../src/overview/cc-tile-scalability.smart.js';
import { updateRootContext } from '../src/lib/smart-manager.js';

const apiConfig = JSON.parse(window.localStorage.getItem('cc-tokens'));

updateRootContext({ apiConfig });
