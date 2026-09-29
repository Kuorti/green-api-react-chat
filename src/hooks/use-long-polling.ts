import { useEffect, useRef } from 'react';
import {GreenApiService} from "@src/api/green-api.ts";
import * as React from "react";

interface IMessage {
    id: string;
    text: string;
    direction: 'incoming' | 'outgoing';
    sender: string;
}

interface UseLongPollingProps {
    activeChat: string | null;
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

export const useLongPolling = ({ activeChat, setMessages }: UseLongPollingProps) => {
    const activeChatRef = useRef<string | null>(activeChat);

    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    useEffect(() => {
        let isPolling = true;

        const pollNotifications = async () => {
            if (!activeChatRef.current) {
                if (isPolling) {
                    setTimeout(pollNotifications, 1000);
                }
                return;
            }

            try {
                const notification = await GreenApiService.receiveNotification();

                if (notification && notification.receiptId) {
                    const { receiptId, body } = notification;

                    if (body && body.typeWebhook === 'incomingMessageReceived') {
                        const senderChatId: string = body.senderData?.chatId || '';
                        const [senderNumber] = senderChatId.split('@');
                        const text = body.messageData?.textMessageData?.textMessage;

                        if (senderNumber === activeChatRef.current && text) {
                            setMessages(prev => [...prev, {
                                id: body.idMessage || Date.now().toString(),
                                text: text,
                                direction: 'incoming',
                                sender: 'Собеседник'
                            }]);
                        }
                    }

                    await GreenApiService.deleteNotification(receiptId);
                }
            } catch (err) {
                console.error(`Ошибка в цикле Long Polling:`, err);
            } finally {
                if (isPolling) {
                    setTimeout(pollNotifications, 500);
                }
            }
        };

        pollNotifications();

        return () => {
            isPolling = false;
        };
    }, [setMessages]);
};
