export interface CreateFormModel {
  inputName: ValueErrorObject;
  inputKey: ValueErrorObject;
  state: string;
}

export type CreateFormErrors = "none" | "required" | "format";

export type CreateFormStates = "ready" | "saving" | "error"; // TODO remove 'error' when wiring to toast

export interface GithubKeysModel {
  keys: SSHKey[];
  state: string;
}

export type GithubKeysStates = "loading" | "ready" | "error" | "unlinked"; // TODO remove 'error' when wiring to toast

export interface PersonalKeysModel {
  keys: SSHKey[];
  state: string;
}

export type PersonalKeysStates = "loading" | "ready" | "error"; // TODO remove 'error' when wiring to toast

export interface SSHKey {
  name: string;
  key?: string;
  fingerprint?: string;
  processing?: boolean;
}

export interface ValueErrorObject {
  value: string;
  error: string;
}
