import './cc-orga-member-list.js';
// TODO check, not necessary to import both, only smart ?!
import './cc-orga-member-list.smart.js';
import { i18n } from '../../lib/i18n.js';
import { notifySuccess } from '../../lib/notifications.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const baseMemberList = [{
  member: {
    state: 'loaded',
    value: {
      id: 'member1',
      avatar: '',
      name: 'John Doe',
      isCurrentUser: true,
      jobTitle: 'Frontend Developer',
      role: 'ADMIN',
      email: 'john.doe@example.com',
      mfa: false,
    },
  },
},
{
  member: {
    state: 'loaded',
    value: {
      id: 'member2',
      avatar: 'http://placekitten.com/202/202',
      name: 'Jane Doe',
      jobTitle: 'Backend Developer',
      role: 'DEVELOPER',
      email: 'jane.doe@example.com',
      mfa: true,
    },
  },
},
{
  member: {
    state: 'loaded',
    value: {
      id: 'member3',
      avatar: '',
      name: 'Veryveryveryveryveryveryveryveryvery long name',
      role: 'MANAGER',
      email: 'very-very-very-long-email-address@very-very-very-very-very-very-very-long-example.com',
      mfa: true,
    },
  },
},
{
  member: {
    state: 'loaded',
    value: {
      id: 'member4',
      avatar: 'http://placekitten.com/205/205',
      role: 'ACCOUNTING',
      email: 'john.doe@example.com',
      mfa: false,
    },
  },
},
];

export default {
  title: '🛠 Organisation/<cc-orga-member-list>',
  component: 'cc-orga-member-list',
};

const conf = {
  component: 'cc-orga-member-list',
};

export const defaultStory = makeStory(conf, {
  items: [{
    stateMemberList: {
      state: 'loaded',
      value: baseMemberList,
    },
  }],
});

export const defaultWithInviteLongEmail = makeStory(conf, {
  items: [{
    stateMemberInvite: {
      state: 'idle',
      email: {
        state: 'idle',
        value: 'very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-long-email-address@very-very-very-very-very-very-very-long-domain.eu',
      },
      role: {
        state: 'idle',
        value: 'ADMIN',
      },
    },
    stateMemberList: {
      state: 'loaded',
      value: baseMemberList,
    },
  }],
});

/* TODO might not be a good idea to use i18n here */
export const errorWithInviteEmptyEmail = makeStory(conf, {
  items: [{
    stateMemberInvite: {
      state: 'idle',
      email: {
        state: 'error',
        value: '',
        errorType: 'empty',
      },
      role: {
        state: 'idle',
        value: 'ADMIN',
      },
    },
    stateMemberList: {
      state: 'loaded',
      value: baseMemberList,
    },
  }],
});

/* TODO might not be a good idea to use i18n here */
export const errorWithInviteBadEmail = makeStory(conf, {
  items: [{
    stateMemberInvite: {
      state: 'idle',
      email: {
        state: 'error',
        value: 'jane.doe',
        errorType: 'format',
      },
      role: {
        state: 'idle',
        value: 'ADMIN',
      },
    },
    stateMemberList: {
      state: 'loaded',
      value: baseMemberList,
    },
  }],
});

/* TODO might not be a good idea to use i18n here */
export const errorWithInviteMemberAlreadyInsideOrganisation = makeStory(conf, {
  items: [{
    stateMemberInvite: {
      state: 'idle',
      email: {
        state: 'error',
        value: 'john.doe@example.com',
        errorType: 'duplicate',
      },
      role: {
        state: 'idle',
        value: 'ADMIN',
      },
    },
    stateMemberList: {
      state: 'loaded',
      value: baseMemberList,
    },
  },
  ],
});

export const waitingWithInviteMember = makeStory(conf, {
  items: [{
    stateMemberInvite: {
      state: 'waiting',
      email: {
        state: 'idle',
        value: 'jane.doe@example.com',
      },
      role: {
        state: 'idle',
        value: 'ADMIN',
      },
    },
    stateMemberList: {
      state: 'loaded',
      value: [baseMemberList[0]],
    },
  }],
});

/* TODO might not be a good idea to use notify here */
export const simulationsWithInviteMember = makeStory(conf, {
  items: [{
    stateMemberList: {
      state: 'loaded',
      value: baseMemberList,
    },
  }],
  simulations: [
    storyWait(1000, ([component]) => {
      component.stateMemberInvite = {
        ...component.stateMemberInvite,
        email: {
          ...component.stateMemberInvite.email,
          value: 'john.doe@example.com',
        },
      };
    }),
    storyWait(1000, ([component]) => {
      component.stateMemberInvite = {
        ...component.stateMemberInvite,
        role: {
          ...component.stateMemberInvite.role,
          value: 'ADMIN',
        },
      };
    }),
    storyWait(500, ([component]) => {
      component.stateMemberInvite = {
        ...component.stateMemberInvite,
        state: 'waiting',
      };
    }),
    storyWait(2000, ([component]) => {
      component.stateMemberInvite = {
        ...component.stateMemberInvite,
        state: 'idle',
        email: {
          ...component.stateMemberInvite.email,
          value: '',
        },
        role: {
          ...component.stateMemberInvite.role,
          value: 'DEVELOPER',
        },
      };
      notifySuccess(component, 'Member has been invited');
    }),
  ],
});

export const loadingWithMemberList = makeStory(conf, {
  items: [{
    // TODO since default, not necessary ?
    stateMemberList: { state: 'loading' },
  }],
});

export const errorWithLoadingMemberList = makeStory(conf, {
  items: [{
    stateMemberList: { state: 'error' },
  }],
});

export const dataLoaded = makeStory(conf, {
  items: [{
    stateMemberList: {
      state: 'loaded',
      value: baseMemberList,
    },
  }],
});

export const dataLoadedWithOnlyOneMember = makeStory(conf, {
  items: [{
    stateMemberList: { state: 'loaded', value: [baseMemberList[0]] },
  }],
});

export const dataLoadedWithTwoFactorAuthenticationEnabledOnly = makeStory(conf, {
  items: [{
    stateMemberList: {
      state: 'loaded',
      value: baseMemberList.map((baseMemberListItem) => ({
        ...baseMemberListItem,
        member: {
          ...baseMemberListItem.member,
          value: {
            ...baseMemberListItem.member.value,
            mfa: true,
          },
        },
      })),
    },
  }],
});

export const errorWithDeletingLastAdmin = makeStory(conf, {
  items: [{
    stateMemberList: {
      state: 'loaded',
      value: baseMemberList.map((baseMemberListItem) => {
        if (baseMemberListItem.member.value.role === 'ADMIN') {
          return {
            ...baseMemberListItem,
            errorMessage: i18n('cc-orga-member-card.error-remove'),
          };
        }
        return baseMemberListItem;
      }),
    },
  }],
});

export const errorWithEditingLastAdmin = makeStory(conf, {
  items: [{
    stateMemberList: {
      state: 'loaded',
      value: baseMemberList.map((baseMemberListItem) => {
        if (baseMemberListItem.member.value.role === 'ADMIN') {
          return {
            ...baseMemberListItem,
            errorMessage: i18n('cc-orga-member-card.error-edit'),
          };
        }
        return baseMemberListItem;
      }),
    },
  }],
});

export const simulationsWithMemberList = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000, ([component]) => {
      component.stateMemberList = {
        state: 'loaded',
        value: baseMemberList,
      };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  defaultWithInviteLongEmail,
  errorWithInviteEmptyEmail,
  errorWithInviteBadEmail,
  errorWithInviteMemberAlreadyInsideOrganisation,
  waitingWithInviteMember,
  simulationsWithInviteMember,
  loadingWithMemberList,
  errorWithLoadingMemberList,
  dataLoaded,
  dataLoadedWithOnlyOneMember,
  dataLoadedWithTwoFactorAuthenticationEnabledOnly,
  errorWithDeletingLastAdmin,
  errorWithEditingLastAdmin,
  simulationsWithMemberList,
});
