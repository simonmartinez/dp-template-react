import { create } from "zustand";
import Session from "../../models/dataplatform/Session";

interface AuthState {
  session: Session | null;
  setSession: (session: Session | null) => void
  clearSession: () => void
}
const sessionKey = 'dataplatform-client-session';

const getSessionFromStorage = (): Session | null => {
  const raw = localStorage.getItem(sessionKey);
  if (!raw) {
    return null;
  }
  return JSON.parse(raw as string) as Session
}

export const useAuthStore = create<AuthState>((set) => ({
  session: getSessionFromStorage(),
  setSession: (session: Session | null) => {
    if (session)
      localStorage.setItem(sessionKey, JSON.stringify(session))
    else
      localStorage.removeItem(sessionKey)
    set({ session: session as Session });
  },
  clearSession: () => {
    localStorage.removeItem(sessionKey)
    set({ session: null })
  }
}));

export const getAuthToken = (): string | undefined => {
  return useAuthStore.getState().session?.token;
}