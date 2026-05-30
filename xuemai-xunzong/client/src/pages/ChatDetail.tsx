import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMessages } from '../hooks/useMessages';
import ChatBubble from '../components/messages/ChatBubble';

export default function ChatDetail() {
  const { missingPersonId, otherUserId } = useParams<{ missingPersonId: string; otherUserId: string }>();
  const nav = useNavigate();
  const { messages, loading, loadMessages, sendMessage } = useMessages();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sendHint, setSendHint] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem('userId') || 'demo-user';

  useEffect(() => {
    if (!missingPersonId || !otherUserId) return;
    loadMessages(missingPersonId, otherUserId);
    const interval = window.setInterval(() => {
      loadMessages(missingPersonId, otherUserId);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [missingPersonId, otherUserId, loadMessages]);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !missingPersonId || !otherUserId || sending) return;

    setSending(true);
    try {
      const synced = await sendMessage(otherUserId, missingPersonId, text);
      setInput('');
      setSendHint(synced ? '已发送' : '演示模式：消息已本地发送');
      window.setTimeout(() => setSendHint(''), 2200);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3">
        <button onClick={() => nav(-1)} className="text-sm text-[var(--color-text-muted)]">
          ← 返回
        </button>
        <span className="text-sm font-medium text-[var(--color-text)]">私信</span>
      </div>

      <div ref={messagesRef} className="min-h-0 flex-1 overflow-y-auto px-4 pt-3">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center pt-16 text-sm text-[var(--color-text-muted)]">
            加载中...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <div className="mb-2 text-4xl opacity-60">✉️</div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              暂无消息，发送第一条消息吧
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <ChatBubble
              key={msg.id}
              content={msg.content}
              msgType={msg.msg_type}
              imageUrl={msg.image_url}
              isMine={msg.sender_id === userId}
              createdAt={msg.created_at}
            />
          ))
        )}
      </div>

      <div className="relative flex shrink-0 items-end gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3">
        {sendHint && (
          <span className="absolute bottom-[72px] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--color-text)]/80 px-3 py-1 text-[11px] text-white">
            {sendHint}
          </span>
        )}
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          rows={1}
          className="max-h-24 min-h-[40px] flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3.5 py-2 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="h-[40px] shrink-0 rounded-xl bg-[var(--color-primary)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand)] disabled:opacity-50"
        >
          {sending ? '发送中' : '发送'}
        </button>
      </div>
    </div>
  );
}
