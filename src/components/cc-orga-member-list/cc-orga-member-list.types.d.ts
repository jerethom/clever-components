export interface InviteMemberPayload {
    email: string,
    role: string,
}

export type StateMemberInvite = "loaded" | "waiting";

export type StateMemberList = "loading" | "error" | "loaded";