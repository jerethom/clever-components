import { getEventStream } from './data-helpers.js';
import { globalEventBus } from './global-bus.js';

const es = getEventStream();
es.on('event', (event) => {
  // console.log({ event });
  globalEventBus.next(event);
});
es.open();
