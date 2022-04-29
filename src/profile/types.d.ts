export interface SSHKey {
  name: string,
  key?: string,
  fingerprint?: string,
}

export type ErrorType = null | "loading" | "loading-third-parties" | "adding" | "deleting" | "importing";

export type  ClientErrorType = null | "emptyName" | "emptyPublicKey";
