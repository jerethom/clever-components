import './cc-orga-member-card.js';
import { i18n } from '../../lib/i18n.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

/* TODO this is a good test for default values, try and remove mfa and isCurrentUser */
const baseItem = {
  member: {
    state: 'loaded',
    value: {
      id: 'member1',
      avatar: 'http://placekitten.com/200/200',
      name: 'John Doe',
      jobTitle: 'Frondend Developer',
      role: 'DEVELOPER',
      email: 'john.doe@domain.com',
      mfa: false,
      isCurrentUser: false,
    },
  },
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
    member: {
      ...baseItem.member,
      value: {
        ...baseItem.member.value,
        name: '',
      },
    },
  }],
});

export const defaultWithNoAvatar = makeStory(conf, {
  items: [{
    ...baseItem,
    member: {
      ...baseItem.member,
      value: {
        ...baseItem.member.value,
        avatar: '',
      },
    },
  }],
});

export const defaultWithLongEmail = makeStory(conf, {
  items: [{
    ...baseItem,
    member: {
      ...baseItem.member,
      value: {
        ...baseItem.member.value,
        email: longEmail,
        name: longName,
      },
    },
  }],
});

export const twoFactorAuthEnabled = makeStory(conf, {
  items: [{
    ...baseItem,
    member: {
      ...baseItem.member,
      value: {
        ...baseItem.member.value,
        mfa: true,
      },
    },
  }],
});

export const isCurrentUser = makeStory(conf, {
  items: [{
    ...baseItem,
    member: {
      ...baseItem.member,
      value: {
        ...baseItem.member.value,
        isCurrentUser: true,
      },
    },
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
    errorMessage: i18n('cc-orga-member-card.error-remove'),
    member: {
      ...baseItem.member,
      value: {
        ...baseItem.member.value,
        role: 'ADMIN',
      },
    },
  }],
});

export const waiting = makeStory(conf, {
  items: [
    {
      ...baseItem,
      member: {
        ...baseItem.member,
        state: 'waiting',
      },
    },
    {
      ...baseItem,
      isEditing: true,
      member: {
        ...baseItem.member,
        state: 'waiting',
      },
    }],
});

/* TODO to test, cannot use html attributes anymore, have to use storybook or js :( */
export const simulations = makeStory(conf, {
  items: [baseItem],
  simulations: [
    storyWait(2000, ([component]) => {
      component.isEditing = true;
    }),
    storyWait(1000, ([component]) => {
      component.member = {
        ...component.member,
        value: {
          ...component.member.value,
          role: 'ACCOUNTING',
        },
      };
    }),
    storyWait(1000, ([component]) => {
      component.member = {
        ...component.member,
        state: 'waiting',
      };
    }),
    storyWait(3000, ([component]) => {
      component.isEditing = false;
      component.member = {
        ...component.member,
        state: 'loaded',
      };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  defaultWithNoAvatar,
  defaultWithNoName,
  defaultWithLongEmail,
  twoFactorAuthEnabled,
  isCurrentUser,
  editing,
  errorWithLastAdmin,
  waiting,
  simulations,
});
