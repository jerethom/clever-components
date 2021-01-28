import '../../src/pricing/cc-pricing-nav.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 pricing/<cc-pricing-nav>',
  component: 'cc-pricing-nav',
};

const conf = {
  component: 'cc-pricing-nav',
  // language=CSS
  css: `cc-example-component {
    margin-bottom: 1rem;
  }`,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      navItems: [
        {
          icon: 'https://ddo0fzhfvians.cloudfront.net/uploads/icons/png/5798666251543238869-512.png',
          name: 'Runtime',
          url: '/',
        },
        {
          icon: 'https://ddo0fzhfvians.cloudfront.net/uploads/icons/png/5129299051571183081-512.png',
          name: 'Addons',
          url: '/',
        },
      ],
    },
  ],
});

// Right now, because of how we're using this component, we don't need:
// * skeleton/waiting state
// * emtpy state
// * error state

enhanceStoriesNames({
  defaultStory,
});
