import { useRef, useState } from 'react';

interface Props {
  photos: string[];
  letters: string[];
  textOnly: string;
  onAddPhoto: (file: File) => Promise<string>;
  onAddLetter: (file: File) => Promise<string>;
  onRemovePhoto?: (index: number) => void;
  onRemoveLetter?: (index: number) => void;
  onTextChange: (text: string) => void;
  onNext: () => void;
}

export default function PublishStep1({
  photos,
  letters,
  textOnly,
  onAddPhoto,
  onAddLetter,
  onRemovePhoto,
  onRemoveLetter,
  onTextChange,
  onNext,
}: Props) {
  const photoRef = useRef<HTMLInputElement>(null);
  const letterRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'media' | 'text'>(photos.length > 0 || letters.length > 0 ? 'media' : 'text');

  const handleFile = async (file: File, type: 'photo' | 'letter') => {
    if (!file.type.startsWith('image/')) {
      setError('请上传 JPG、PNG 等图片文件。');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('图片超过 8MB，建议压缩后再上传。');
      return;
    }

    setUploading(true);
    setError('');
    try {
      if (type === 'photo') {
        await onAddPhoto(file);
      } else {
        await onAddLetter(file);
      }
    } catch {
      setError('图片读取失败，请重新选择。');
    } finally {
      setUploading(false);
    }
  };

  const canProceed = photos.length > 0 || letters.length > 0 || textOnly.trim().length > 0;

  return (
    <div className="px-4 pt-2">
      <p className="mb-4 text-sm leading-6 text-[var(--color-text-secondary)]">
        上传旧照片、信件照片，或直接输入文字线索。当前 Demo 会在本机生成预览，不需要真实上传服务器。
      </p>

      <div className="mb-4 flex gap-2 rounded-lg bg-[var(--color-bg-secondary)] p-1">
        <button
          onClick={() => setMode('media')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            mode === 'media'
              ? 'bg-[var(--color-bg-card)] text-[var(--color-text)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          上传图片
        </button>
        <button
          onClick={() => setMode('text')}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            mode === 'text'
              ? 'bg-[var(--color-bg-card)] text-[var(--color-text)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          文字描述
        </button>
      </div>

      {mode === 'media' && (
        <>
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">旧照片</h3>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFile(file, 'photo');
                e.currentTarget.value = '';
              }}
            />
            <button
              onClick={() => photoRef.current?.click()}
              disabled={uploading}
              className="flex h-28 w-full items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-card)] text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50"
            >
              {uploading ? '正在读取图片...' : '+ 选择照片'}
            </button>
            {photos.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {photos.map((p, i) => (
                  <div key={`${p}-${i}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--color-bg-secondary)]">
                    <img src={p} alt="" className="h-full w-full object-cover" />
                    {onRemovePhoto && (
                      <button
                        onClick={() => onRemovePhoto(i)}
                        className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/55 text-xs text-white"
                        aria-label="删除照片"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-5">
            <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">信件 / 备注照片</h3>
            <input
              ref={letterRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFile(file, 'letter');
                e.currentTarget.value = '';
              }}
            />
            <button
              onClick={() => letterRef.current?.click()}
              disabled={uploading}
              className="flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-card)] text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50"
            >
              {uploading ? '正在读取图片...' : '+ 选择信件照片'}
            </button>
            {letters.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {letters.map((l, i) => (
                  <div key={`${l}-${i}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--color-bg-secondary)]">
                    <img src={l} alt="" className="h-full w-full object-cover" />
                    {onRemoveLetter && (
                      <button
                        onClick={() => onRemoveLetter(i)}
                        className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/55 text-xs text-white"
                        aria-label="删除信件照片"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {mode === 'text' && (
        <div className="mb-5">
          <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">描述你要找的人</h3>
          <textarea
            placeholder={'例如：姓名或昵称、失联时间、地点、共同经历、最后一次联系等'}
            value={textOnly}
            onChange={e => onTextChange(e.target.value)}
            rows={6}
            className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
          />
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            线索越具体，后续搜索和传播越容易。
          </p>
        </div>
      )}

      {error && (
        <p className="mb-3 rounded-lg bg-[var(--color-error)]/10 px-3 py-2 text-xs text-[var(--color-error)]">
          {error}
        </p>
      )}

      <button
        onClick={onNext}
        disabled={!canProceed || uploading}
        className="w-full rounded-lg bg-[var(--color-primary)] py-2.5 font-medium text-white transition-colors hover:bg-[var(--color-brand)] disabled:opacity-50"
      >
        {mode === 'text' ? '下一步：补充信息' : '下一步：整理线索'}
      </button>
    </div>
  );
}
