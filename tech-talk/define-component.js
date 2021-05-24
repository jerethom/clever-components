import './init-french.js';
import './cc-tile-scalability.not-so-smart.js';
import { updateRootContext } from '../src/lib/smart-manager.js';

const apiConfig = JSON.parse(window.localStorage.getItem('cc-tokens'));

updateRootContext({ apiConfig });
