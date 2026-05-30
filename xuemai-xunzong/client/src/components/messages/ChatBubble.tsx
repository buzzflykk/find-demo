interface Props {
  content: string;
  msgType: string;
  imageUrl: string;
  isMine: boolean;
  createdAt: string;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  if (d.toDateString() === now.toDateString()) return time;
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${time}`;
}

export default function ChatBubble({ content, msgType, imageUrl, isMine, createdAt }: Props) {
  return (
    <div className={`mb-3 flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[75%]">
        {msgType === 'image' && imageUrl ? (
          <div className={`overflow-hidden rounded-xl ${isMine ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
            <img src={imageUrl} alt="图片消息" className="max-h-48 w-auto rounded-xl object-cover" />
          </div>
        ) : (
          <div
            className={`rounded-xl px-3.5 py-2 text-sm leading-relaxed ${
              isMine
                ? 'rounded-br-sm bg-[var(--color-primary)] text-white'
                : 'rounded-bl-sm border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text)]'
            }`}
          >
            {content}
          </div>
        )}
        <p className={`mt-0.5 text-[10px] text-[var(--color-text-muted)] ${isMine ? 'text-right' : 'text-left'}`}>
          {formatTime(createdAt)}
        </p>
      </div>
    </div>
  );
}
