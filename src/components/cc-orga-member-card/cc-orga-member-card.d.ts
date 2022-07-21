export type StateMemberCard = "loaded" | "waiting";

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