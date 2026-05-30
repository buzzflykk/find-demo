import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import {
  appendLocalMessage,
  getConversationKey,
  getLocalMessageStore,
  type DemoMessageStore,
} from '../services/demoDataStore';

export interface Conversation {
  last_msg_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  msg_type: string;
  image_url: string;
  is_read: number;
  last_msg_at: string;
  missing_person_id: string;
  other_user_id: string;
  missing_title: string;
  missing_photos: string[];
  other_user_name: string;
  other_user_avatar: string;
  unread_count: number;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  msg_type: string;
  image_url: string;
  is_read: number;
  created_at: string;
}

function inferMissingTitle(missingPersonId: string) {
  if (missingPersonId === 'demo-old-photo') return '寻找 2005 年小学毕业照里的李明';
  if (missingPersonId === 'demo-letter-aunt') return '旧信件里的广州陈阿姨';
  return '线索沟通';
}

function inferOtherName(otherUserId: string) {
  if (otherUserId === 'demo-publisher') return '发布者';
  return '线索联系人';
}

function buildLocalConversations(store: DemoMessageStore): Conversation[] {
  return Object.entries(store)
    .map(([key, items]) => {
      const [missingPersonId, otherUserId] = key.split(':');
      const last = items[items.length - 1];
      if (!last || !missingPersonId || !otherUserId) return null;
      return {
        last_msg_id: last.id,
        sender_id: last.sender_id,
        receiver_id: last.receiver_id,
        content: last.content,
        msg_type: last.msg_type,
        image_url: last.image_url,
        is_read: last.is_read,
        last_msg_at: last.created_at,
        missing_person_id: missingPersonId,
        other_user_id: otherUserId,
        missing_title: inferMissingTitle(missingPersonId),
        missing_photos: [],
        other_user_name: inferOtherName(otherUserId),
        other_user_avatar: '',
        unread_count: 0,
      } satisfies Conversation;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.last_msg_at).getTime() - new Date(a!.last_msg_at).getTime()) as Conversation[];
}

function mergeMessages(serverItems: Message[], localItems: Message[]) {
  return [...serverItems, ...localItems]
    .filter((item, index, arr) => arr.findIndex(next => next.id === item.id) === index)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

function mergeConversations(serverItems: Conversation[], localItems: Conversation[]) {
  return [...localItems, ...serverItems]
    .filter((item, index, arr) => {
      const signature = `${item.missing_person_id}:${item.other_user_id}`;
      return arr.findIndex(next => `${next.missing_person_id}:${next.other_user_id}` === signature) === index;
    })
    .sort((a, b) => new Date(b.last_msg_at).getTime() - new Date(a.last_msg_at).getTime());
}

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);

  const loadConversations = useCallback(async () => {
    const localConversations = buildLocalConversations(getLocalMessageStore());
    try {
      const data = await api.getConversations();
      setConversations(mergeConversations(data.items, localConversations));
    } catch {
      setConversations(localConversations);
    }
  }, []);

  const loadMessages = useCallback(async (missingPersonId: string, otherUserId: string) => {
    setLoading(true);
    const key = getConversationKey(missingPersonId, otherUserId);
    const localItems = (getLocalMessageStore()[key] || []) as Message[];
    try {
      const data = await api.getMessages(missingPersonId, otherUserId);
      setMessages(mergeMessages(data.items, localItems));
    } catch {
      setMessages(localItems);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (
    receiverId: string,
    missingPersonId: string,
    content: string,
    msgType = 'text',
    imageUrl = '',
  ) => {
    const userId = localStorage.getItem('userId') || 'demo-user';
    const localMessage: Message = {
      id: `local-${Date.now()}`,
      sender_id: userId,
      receiver_id: receiverId,
      content,
      msg_type: msgType,
      image_url: imageUrl,
      is_read: 1,
      created_at: new Date().toISOString(),
    };

    const key = getConversationKey(missingPersonId, receiverId);
    appendLocalMessage(missingPersonId, receiverId, localMessage);
    setMessages(prev => mergeMessages(prev, [localMessage]));

    try {
      await api.sendMessage({
        receiver_id: receiverId,
        missing_person_id: missingPersonId,
        content,
        msg_type: msgType,
        image_url: imageUrl,
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const loadUnreadTotal = useCallback(async () => {
    try {
      const data = await api.getUnreadTotal();
      setUnreadTotal(data.total);
    } catch {
      setUnreadTotal(0);
    }
  }, []);

  useEffect(() => {
    loadUnreadTotal();
    const interval = window.setInterval(loadUnreadTotal, 10000);
    return () => window.clearInterval(interval);
  }, [loadUnreadTotal]);

  return {
    conversations,
    loading,
    messages,
    unreadTotal,
    loadConversations,
    loadMessages,
    sendMessage,
    loadUnreadTotal,
  };
}
