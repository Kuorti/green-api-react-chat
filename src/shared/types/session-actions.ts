export interface SessionActions {
  setSession: (idInstance: string, apiTokenInstance: string) => void;
  clearSession: () => void;
}
