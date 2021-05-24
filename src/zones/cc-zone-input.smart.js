import './cc-zone-input.js';
import '../smart/cc-smart-container.js';
import { defineComponent } from '../smart/smart-manager.js';
import { sendToApi } from '../lib/data-helpers.js';
import { getAllZones } from '@clevercloud/client/esm/api/v4/product.js';
import { LastPromise, unsubscribeWithSignal } from '../lib/observables.js';

defineComponent({
  selector: 'cc-zone-input',
  params: {
    apiConfig: { type: Object },
  },
  onConnect (container, component, context$, disconnectSignal) {

    const zones_lp = new LastPromise();

    unsubscribeWithSignal(disconnectSignal, [

      zones_lp.error$.subscribe(() => component.error = true),
      zones_lp.value$.subscribe((zones) => component.zones = zones),

      context$.subscribe(({ apiConfig }) => {
        component.error = false;
        zones_lp.push(() => fetchZones(apiConfig));
      }),

    ]);

  },
});

function fetchZones (apiConfig) {
  return getAllZones().then(sendToApi(apiConfig)).then((rawZones) => {
    return rawZones
      .filter((zone) => !zone.tags.includes('scope:private'))
      .filter((zone) => zone.tags.includes('for:applications'))
      .map((zone) => {
        return {
          ...zone,
          tags: zone.tags.filter((t) => !t.startsWith('for:')),
        };
      });
  });
}
