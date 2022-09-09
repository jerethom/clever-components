export type StateMemberCard = MemberCardStateLoaded | MemberCardStateWaiting;

interface MemberCardStateLoaded {
    errorMessage?: boolean;
    isEditing?: boolean;
    state: 'loaded';
    value: MemberInfo;
}

interface MemberCardStateWaiting {
    isEditing?: boolean;
    state: 'waiting';
    value: MemberInfo;
}


interface MemberInfo {
    avatar?: string,
    email: string,
    id: string,
    isCurrentUser?: boolean,
    jobTitle?: string,
    mfa: boolean,
    name?: string,
    role: string,
}

export interface EditMemberPayload {
    id: string,
    role: string,
}

export interface Member {
    id: string,
    email: string,
    role: string,
}

export interface UpdateEditingCardPayload {
    memberId: string,
    isEditing: boolean,
}