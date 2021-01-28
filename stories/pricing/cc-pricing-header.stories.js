import '../../src/pricing/cc-pricing-header.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-header>',
  component: 'cc-pricing-header',
};

const conf = {
  component: 'cc-pricing-header',
  css: `cc-pricing-header {
    margin-bottom: 1rem;
  }`,
};

export const defaultStory = makeStory(conf, {
  items: [
    { },
  ],
});

// Right now, because of how we're using this component, we don't need:
// * skeleton/waiting state
// * emtpy state
// * error state

enhanceStoriesNames({
  defaultStory,
});
