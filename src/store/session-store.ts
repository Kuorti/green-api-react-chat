import { persist } from "zustand/middleware";
import {create} from "zustand";
import {SessionActions} from "@src/shared/types/session-actions.ts";
import {SessionState} from "@src/shared/types/session-state.ts";

type FullSessionStore = SessionState & SessionActions;

export const useSessionStore = create<FullSessionStore>()(
    persist(
        (set) => ({
            idInstance: '',
            apiTokenInstance: '',
            isAuth: false,
            setSession: (idInstance, apiTokenInstance) =>
                set({
                    idInstance,
                    apiTokenInstance,
                    isAuth: true
                }),
            clearSession: () =>
                set({
                    idInstance: '',
                    apiTokenInstance: '',
                    isAuth: false
                }),
        }),
        {
            name: 'green-api-session-storage',
            partialize: (state) => ({
                idInstance: state.idInstance,
                apiTokenInstance: state.apiTokenInstance,
                isAuth: state.isAuth,
            }),
        }
    )
);
