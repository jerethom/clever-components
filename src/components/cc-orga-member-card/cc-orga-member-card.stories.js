import './cc-orga-member-card.js';
import { i18n } from '../../lib/i18n.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const baseItem = {
  id: 'member1',
  avatar: 'http://placekitten.com/200/200',
  name: 'John Doe',
  jobTitle: 'Frondend Developer',
  role: 'DEVELOPER',
  email: 'john.doe@domain.com',
  mfa: false,
  isCurrentUser: false,
};

const longEmail = 'very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-long-email-address@very-very-very-very-very-very-very-long-domain.eu';
const longName = 'Veryveryveryveryveryveryveryveryvery long name';

export default {
  title: '🛠 Organisation/<cc-orga-member-card>',
  component: 'cc-orga-member-card',
};

const conf = {
  component: 'cc-orga-member-card',
  // language=CSS
  css: `cc-orga-member-card {
    margin: 2em 0;
  }`,
};

export const defaultStory = makeStory(conf, {
  items: [baseItem],
});

export const defaultWithNoName = makeStory(conf, {
  items: [{
    ...baseItem,
    name: '',
  }],
});

export const defaultWithLongEmail = makeStory(conf, {
  items: [{
    ...baseItem,
    email: longEmail,
    name: longName,
  }],
});

export const twoFactorAuthEnabled = makeStory(conf, {
  items: [{
    ...baseItem,
    mfa: true,
  }],
});

export const isCurrentUser = makeStory(conf, {
  items: [{
    ...baseItem,
    isCurrentUser: true,
  }],
});

export const editing = makeStory(conf, {
  items: [{
    ...baseItem,
    isEditing: true,
  }],
});

export const errorWithLastAdmin = makeStory(conf, {
  items: [{
    ...baseItem,
    role: 'ADMIN',
    errorMessage: i18n('cc-orga-member-card.error-remove'),
  }],
});

export const waiting = makeStory(conf, {
  items: [{
    ...baseItem,
    state: 'waiting',
  },
  {
    ...baseItem,
    isEditing: true,
    state: 'waiting',
  }],
});

export const simulations = makeStory(conf, {
  items: [baseItem],
  simulations: [
    storyWait(2000, ([component]) => {
      component.isEditing = true;
    }),
    storyWait(1000, ([component]) => {
      component.role = 'ACCOUNTING';
    }),
    storyWait(1000, ([component]) => {
      component.state = 'waiting';
    }),
    storyWait(3000, ([component]) => {
      component.isEditing = false;
      component.state = 'loaded';
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  defaultWithNoName,
  defaultWithLongEmail,
  twoFactorAuthEnabled,
  isCurrentUser,
  editing,
  errorWithLastAdmin,
  waiting,
  simulations,
});
