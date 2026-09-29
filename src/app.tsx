import {ChatWindow} from "@src/components/chat-window/chat-window.tsx";
import {useSessionStore} from "@src/store/session-store.ts";
import {AuthForm} from "@src/components/auth-form/auth-form.tsx";

export default function App() {
    const isAuth = useSessionStore((state) => state.isAuth);

    return isAuth ? <ChatWindow /> : <AuthForm />;
}
