import { useState } from 'react';
import {
    MainContainer,
    ChatContainer,
    ConversationHeader,
    MessageList,
    Message,
    MessageInput
} from '@chatscope/chat-ui-kit-react';
import {GreenApiService} from "@src/api/green-api.ts";
import {CreateChatForm} from "@src/components/create-chat-form/create-chat-form.tsx";
import styles from "./chat-window.module.scss";
import {useLongPolling} from "@src/hooks/use-long-polling.ts";

interface IMessage {
    id: string;
    text: string;
    direction: 'incoming' | 'outgoing';
    sender: string;
}

export const ChatWindow = () => {
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [msgInputValue, setMsgInputValue] = useState('');

    useLongPolling({ activeChat, setMessages });

    const handleSendMessage = async () => {
        if (!msgInputValue.trim() || !activeChat) {
            return;
        }

        const textToSend = msgInputValue.trim();
        const localMsg: IMessage = {
            id: Date.now().toString(),
            text: textToSend,
            direction: 'outgoing',
            sender: 'Вы'
        };

        setMsgInputValue('');
        setMessages(prev => [...prev, localMsg]);

        try {
            const chatId = `${activeChat}@c.us`;

            await GreenApiService.sendMessage(chatId, textToSend);
        } catch (error) {
            console.error(`Ошибка при отправке через сервис:`, error);
        }
    };

    if (!activeChat) {
        return <CreateChatForm onChatCreated={(phone) => setActiveChat(phone)} />;
    }

    return (
        <div className={styles.wrapper}>
            <MainContainer>
                <ChatContainer className={styles.chatContainer}>
                    <ConversationHeader>
                        <ConversationHeader.Content userName={`Чат с: +${activeChat}`} />
                    </ConversationHeader>

                    <MessageList>
                        {messages.map((msg) => (
                            <Message
                                key={msg.id}
                                model={{
                                    message: msg.text,
                                    sentTime: "только что",
                                    sender: msg.sender,
                                    direction: msg.direction,
                                    position: "single"
                                }}
                            />
                        ))}
                    </MessageList>

                    <MessageInput
                        placeholder="Введите сообщение..."
                        value={msgInputValue}
                        onChange={(_html, text) => setMsgInputValue(text)}
                        onSend={handleSendMessage}
                        attachButton={false}
                    />
                </ChatContainer>
            </MainContainer>
        </div>
    );
};
