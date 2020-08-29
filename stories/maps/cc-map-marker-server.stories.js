import '../../src/maps/cc-map-marker-server.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Maps/<cc-map-marker-server>',
  component: 'cc-map-marker-server',
};

const conf = {
  component: 'cc-map-marker-server',
  // language=CSS
  css: `
    cc-map-marker-server {
      display: inline-block;
      margin: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    { enabled: false },
    { enabled: true },
  ],
});

enhanceStoriesNames({
  defaultStory,
});
