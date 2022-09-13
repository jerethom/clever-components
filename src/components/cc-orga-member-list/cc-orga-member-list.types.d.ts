/*region StateMemberInvite */
export type StateMemberInvite = StateMemberInviteIdle | StateMemberInviteWaiting;

interface  StateMemberInviteIdle {
    state: 'idle',
    email: StateFormField,
    role: StateFormField,
}

interface  StateMemberInviteWaiting {
    state: 'waiting',
    email: StateFormField,
    role: StateFormField,
}

/* Could also do StateFormField with a state FormFieldIdle | FormFieldError, a prop ErrorType when StateFormField is of type FormFieldError  */
type StateFormField = StateFormFieldIdle | StateFormFieldError;

interface StateFormFieldIdle {
    state: 'idle';
    value: string;
}

interface StateFormFieldError {
    state: 'error';
    value: string;
    errorType: 'empty' | 'format' | 'duplicate';
}

export interface InviteMemberPayload {
    email: string,
    role: string,
}
/*endregion*/

/*region StateMemberList*/
export type StateMemberList = StateMemberListLoading | StateMemberListLoaded | StateMemberListErrorLoading;

interface StateMemberListLoading {
    state: 'loading'
}

interface StateMemberListErrorLoading {
    state: 'error-loading'
}

interface StateMemberListLoaded {
    state: 'loaded',
    memberInEditing: string,
    value: MemberCard[],
}

interface MemberCard {
    errorMessage?: string,
    isEditing?: boolean,
    member: {
        state: 'loaded',
        value: {
            avatar?: string,
            email: string,
            errorMessage?: string,
            id: string,
            isCurrentUser?: boolean,
            jobTitle?: string,
            mfa: boolean,
            name?: string,
            role: string,
        },
    },
}
/*endregion*/