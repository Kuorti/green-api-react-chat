export interface IMessage {
    id: string;
    text: string;
    sender: 'me' | 'them';
    timestamp: number;
}

export type ChatHistory = Record<string, IMessage[]>;
