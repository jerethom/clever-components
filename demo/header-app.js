import './aa-init-french.js';
// define smart components
import '../src/smart/cc-smart-container.js';
import '../src/overview/cc-header-app.smart.js';
import { updateRootContext } from '../src/smart/smart-manager.js';
import { globalEventBus } from '../src/lib/global-bus.js';
import { EventsStream } from '@clevercloud/client/esm/streams/events.browser.js';

const apiConfig = JSON.parse(localStorage.getItem('cc-tokens'));
const { API_HOST, ...tokens } = apiConfig;

updateRootContext({ apiConfig });

const es = new EventsStream({ apiHost: API_HOST, tokens });

es.on('event', (event) => {
  globalEventBus.next(event);
});
// es.open({ autoRetry: true });

