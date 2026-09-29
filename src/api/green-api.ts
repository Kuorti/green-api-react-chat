import {useSessionStore} from "@src/store/session-store.ts";

const BASE_URL = 'https://api.green-api.com';
const RECEIVE_TIMEOUT = 5;

interface InstanceData {
  idInstance: number;
  wid: string;
  typeInstance: string;
}

interface SenderData {
  chatId: string;
  chatName: string;
  chatType: 'user' | 'group' | string;
  sender: string;
  senderName: string;
  senderType: 'user' | string;
  senderContactName: string;
  senderPhoneNumber: number;
}

interface TextMessageData {
  textMessage: string;
}

interface MessageData {
  typeMessage: 'textMessage' | string;
  textMessageData: TextMessageData;
}

interface IncomingMessageWebhook {
  typeWebhook: 'incomingMessageReceived' | string;
  instanceData: InstanceData;
  timestamp: number;
  idMessage: string;
  senderData: SenderData;
  messageData: MessageData;
}

export class GreenApiService {
  private static getCredentials() {
    const { idInstance, apiTokenInstance } = useSessionStore.getState();

    if (!idInstance || !apiTokenInstance) {
      throw new Error(`GREEN-API: Missing credentials in session store.`);
    }

    return { idInstance, apiTokenInstance };
  }

  static async sendMessage(chatId: string, message: string): Promise<{ idMessage: string }> {
    const { idInstance, apiTokenInstance } = this.getCredentials();
    const url = `${BASE_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId, message }),
    });

    if (!response.ok) {
      throw new Error(`sendMessage failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async receiveNotification(): Promise<{ receiptId: number, body: IncomingMessageWebhook } | null> {
    const { idInstance, apiTokenInstance } = this.getCredentials();
    const url = `${BASE_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=${RECEIVE_TIMEOUT}`;
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`receiveNotification failed: ${response.statusText}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  static async deleteNotification(receiptId: number): Promise<{ result: boolean }> {
    const { idInstance, apiTokenInstance } = this.getCredentials();
    const url = `${BASE_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error(`deleteNotification failed: ${response.statusText}`);
    }

    return response.json();
  }
}
