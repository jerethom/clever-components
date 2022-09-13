import './cc-orga-member-list.js';
import '../cc-smart-container/cc-smart-container.js';
import { getAllMembers, addMember, removeMemeber as removeMember, updateMember } from '@clevercloud/client/esm/api/v2/organisation.js';
import { CcEventTarget } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import { produce } from '../../lib/immer.js';
import { notifyError, notifySuccess } from '../../lib/notifications.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineComponent } from '../../lib/smart-manager.js';

defineComponent({
  selector: 'cc-orga-member-list',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    currentUserId: { type: String },
  },
  onContextUpdate ({ component, context, updateSignal }) {
    const target = new CcEventTarget();

    const { apiConfig, ownerId, currentUserId } = context;

    if (apiConfig == null || ownerId == null || currentUserId == null) {
      console.error('One of the smart component params is missing');
      console.log(context);
      return;
    }

    target.on('set-member-list', (newStateMemberList) => {
      component.stateMemberList = newStateMemberList;
    });

    target.on('reset-member-invite', () => {
      component.stateMemberInvite = produce(component.stateMemberInvite, (draft) => {
        draft.email.value = '';
        draft.role.value = 'DEVELOPER';
      });
    });

    component.addEventListener('cc-orga-member-list:invite', ({ detail: { email, role } }) => {
      component.stateMemberInvite = produce(component.stateMemberInvite, (draft) => {
        draft.state = 'waiting';
      });

      postNewMember({ apiConfig, ownerId, email, role })
        .then(() => {
          notifySuccess(component, i18n('cc-orga-member-list.invite.submit-success', { userEmail: email }));
          target.dispatch('reset-member-invite');
        })
        .catch(() => {
          notifyError(component, i18n('cc-orga-member-list.invite.submit-error', { userEmail: email }));
        })
        .finally(() => {
          component.stateMemberInvite = produce(component.stateMemberInvite, (draft) => {
            draft.state = 'loaded';
          });
        });
    });

    fetchMemberList({ apiConfig, ownerId, currentUserId, signal: updateSignal })
      .then((memberList) => {
        target.dispatch('populate-member-list', memberList);
      })
      .catch((error) => {
        console.error(error);
        component.stateMemberList = produce(component.stateMemberList, (draft) => {
          draft.state = 'error-loading';
        });
      });
  },
});

function fetchMemberList ({ apiConfig, ownerId, currentUserId, signal }) {
  return getAllMembers({ id: ownerId })
    .then(sendToApi({ apiConfig, signal }))
    .then((memberList) => {
      return {
        state: 'loaded',
        value: memberList.map(({ member, role, job }) => ({
          member: {
            state: 'loaded',
            value: {
              id: member.id,
              avatar: member.avatar,
              name: member.name,
              jobTitle: job,
              role: role,
              email: member.email,
              mfa: member.preferredMFA === 'TOTP',
              isCurrentUser: member.id === currentUserId,
            },
          },
        }))
          .sort((a, b) => {
            if ((a.member.value.id === currentUserId) || (b.member.value.id === currentUserId)) {
              return a.member.value.id === currentUserId ? -1 : 1;
            }

            return a.member.value.email.localeCompare(b.member.value.email, { sensitivity: 'base' });
          }),
      };
    });
};

function postNewMember ({ apiConfig, ownerId, email, role }) {
  return addMember({ id: ownerId }, { email, role, job: null })
    /* .then(sendToApi({ apiConfig }));*/
    .then(() => new Promise((resolve, reject) => {
      setTimeout(() => resolve('response'), 2000);
      /*setTimeout(() => reject(new Error('toto')), 2000);*/
    }));
};

function deleteMember ({ apiConfig, ownerId, memberId, signal }) {
  return removeMember({ id: ownerId, userId: memberId })
    /* .then(sendToApi({ apiConfig, signal })); */
    .then(() => new Promise((resolve, reject) => {
      setTimeout(() => resolve('response'), 2000);
    }));
};

function editMember ({ apiConfig, ownerId, memberId, role, signal }) {
  return updateMember({ id: ownerId, userId: memberId }, { role })
    /* .then(sendToApi({ apiConfig, signal }));*/
    .then(() => new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('NOPE')), 2000);
    }));
};

function updateMemberCard ({ component, memberId, property, value }) {
  component.memberList = component.memberList.map((member) => {
    if (member.id === memberId) {
      member[property] = value;
    }

    return member;
  });
};
