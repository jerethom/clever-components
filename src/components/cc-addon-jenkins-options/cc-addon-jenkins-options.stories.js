import './cc-addon-jenkins-options.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Addon/<cc-addon-jenkins-options>',
  component: 'cc-addon-jenkins-options',
};

const conf = {
  component: 'cc-addon-jenkins-options',
};

export const defaultStory = makeStory(conf, {
  items: [{ options: [{ name: 'encryption', enabled: false, price: 10.00 }] }],
});

export const encryptionEnabled = makeStory(conf, {
  items: [{ options: [{ name: 'encryption', enabled: true, price: 10.00 }] }],
});

// This component isn't used when there are no options => no story for this case.

enhanceStoriesNames({
  defaultStory,
  encryptionEnabled,
});