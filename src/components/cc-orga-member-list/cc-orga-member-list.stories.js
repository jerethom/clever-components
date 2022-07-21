import './cc-orga-member-list.js';
// TODO check, not necessary to import both, only smart ?!
import './cc-orga-member-list.smart.js';
import { i18n } from '../../lib/i18n.js';
import { notifySuccess } from '../../lib/notifications.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const baseItems = [
  {
    id: 'member1',
    avatar: '',
    name: 'John Doe',
    jobTitle: 'Frondend Developer',
    role: 'ADMIN',
    email: 'john.doe@example.com',
    mfa: false,
  },
  {
    id: 'member2',
    avatar: 'http://placekitten.com/202/202',
    name: 'Jane Doe',
    jobTitle: 'Backend Developer',
    role: 'DEVELOPER',
    email: 'jane.doe@example.com',
    mfa: true,
  },
  {
    id: 'member3',
    avatar: '',
    name: 'Veryveryveryveryveryveryveryveryvery long name',
    role: 'MANAGER',
    email: 'very-very-very-long-email-address@very-very-very-very-very-very-very-long-example.com',
    mfa: true,
  },
  {
    id: 'member4',
    avatar: 'http://placekitten.com/205/205',
    role: 'ACCOUNTING',
    email: 'john.doe@example.com',
    mfa: false,
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
    currentUserId: 'member1',
    stateMemberList: 'loaded',
    memberList: baseItems,
  }],
});

export const defaultWithInviteLongEmail = makeStory(conf, {
  items: [{
    currentUserId: 'member1',
    emailField: 'very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-long-email-address@very-very-very-very-very-very-very-long-domain.eu',
    roleField: 'ADMIN',
    stateMemberList: 'loaded',
    memberList: baseItems,
  }],
});

/* TODO might not be a good idea to use i18n here */
export const errorWithInviteEmptyEmail = makeStory(conf, {
  items: [{
    currentUserId: 'member1',
    emailField: 'john.doe',
    roleField: 'ADMIN',
    stateMemberList: 'loaded',
    memberList: baseItems,
    inviteErrorMessage: i18n('cc-orga-member-list.invite-error-empty'),
  }],
});

/* TODO might not be a good idea to use i18n here */
export const errorWithInviteBadEmail = makeStory(conf, {
  items: [{
    currentUserId: 'member1',
    emailField: 'john.doe',
    roleField: 'ADMIN',
    stateMemberList: 'loaded',
    memberList: baseItems,
    inviteErrorMessage: i18n('cc-orga-member-list.invite-error-format'),
  }],
});

/* TODO might not be a good idea to use i18n here */
export const errorWithInviteMemberAlreadyInsideOrganisation = makeStory(conf, {
  items: [
    {
      currentUserId: 'member1',
      emailField: 'john.doe@example.com',
      roleField: 'ADMIN',
      memberList: baseItems,
      stateMemberList: 'loaded',
      inviteErrorMessage: i18n('cc-orga-member-list.invite-error-duplicate'),
    },
  ],
});

export const waitingWithInviteMember = makeStory(conf, {
  items: [
    {
      currentUserId: 'member1',
      emailField: 'john.doe@example.com',
      roleField: 'ADMIN',
      memberList: baseItems,
      stateMemberInvite: 'waiting',
      stateMemberList: 'loaded',
    },
  ],
});

/* TODO might not be a good idea to use notify here */
export const simulationsWithInviteMember = makeStory(conf, {
  items: [{
    currentUserId: 'member1',
    stateMemberList: 'loaded',
    memberList: baseItems,
  }],
  simulations: [
    storyWait(1000, ([component]) => {
      component.emailField = 'john.doe@example.com';
    }),
    storyWait(1000, ([component]) => {
      component.roleField = 'ADMIN';
    }),
    storyWait(500, ([component]) => {
      component.stateMemberInvite = 'waiting';
    }),
    storyWait(1000, ([component]) => {
      component.emailField = '';
      component.roleField = 'DEVELOPER';
      component.stateMemberInvite = 'loaded';
      notifySuccess(component, 'Member has been invited');
    }),
  ],
});

export const loadingWithMemberList = makeStory(conf, {
  items: [{
    // TODO since default, not necessary ?
    stateMemberList: 'loading',
  }],
});

export const errorWithLoadingMemberList = makeStory(conf, {
  items: [{
    stateMemberList: 'error',
  }],
});

export const dataLoaded = makeStory(conf, {
  items: [{
    currentUserId: 'member1',
    memberList: baseItems,
    stateMemberList: 'loaded',
  }],
});

export const dataLoadedWithOnlyOneMember = makeStory(conf, {
  items: [{
    currentUserId: 'member1',
    memberList: [baseItems[0]],
    stateMemberList: 'loaded',
  }],
});

export const dataLoadedWithTwoFactorAuthenticationEnabledOnly = makeStory(conf, {
  items: [{
    currentUserId: 'member1',
    memberList: baseItems.map((baseItem) => ({
      ...baseItem,
      mfa: true,
    })),
    stateMemberList: 'loaded',
  }],
});

export const errorWithDeletingLastAdmin = makeStory(conf, {
  items: [{
    currentUserId: 'member1',
    memberList: baseItems.map((member) => {
      if (member.role === 'ADMIN') {
        return {
          ...member,
          errorMessage: i18n('cc-orga-member-card.error-remove'),
        };
      }
      return member;
    }),
    stateMemberList: 'loaded',
  }],
});

export const errorWithEditingLastAdmin = makeStory(conf, {
  items: [{
    currentUserId: 'member1',
    memberList: baseItems.map((member) => {
      if (member.role === 'ADMIN') {
        return {
          ...member,
          errorMessage: i18n('cc-orga-member-card.error-edit'),
        };
      }
      return member;
    }),
    _memberInEditing: 'member1',
    stateMemberList: 'loaded',
  }],
});

export const simulationsWithMemberList = makeStory(conf, {
  items: [{
    stateMemberList: 'loading',
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.stateMemberList = 'loaded';
      component.currentUserId = 'member1';
      component.memberList = baseItems;
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
