import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSendCode = async () => {
    if (!/^1\d{10}$/.test(phone)) {
      setError('请输入正确的手机号');
      return;
    }
    setError('');
    setBusy(true);
    // 演示版不调 API，直接模拟
    setCodeSent(true);
    setCode('123456');
    setBusy(false);
  };

  const handleLogin = async () => {
    if (!code) {
      setError('请输入验证码');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await login(phone, code);
      navigate('/home', { replace: true });
    } catch (e: any) {
      setError(e.message || '登录失败');
    } finally {
      setBusy(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setBusy(true);
    try {
      await login('13800000000', '123456');
      navigate('/home', { replace: true });
    } catch (e: any) {
      setError(e.message || '演示版进入失败，请确认服务已启动');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--color-brand)]">时光印记</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            C 端 AI 寻人产品 Demo
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            面试展示版：用 Mock AI 跑通完整产品路径
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-sm">
          <div className="mb-4">
            <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">手机号</label>
            <input
              type="tel"
              maxLength={11}
              placeholder="请输入手机号"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError(''); }}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm text-[var(--color-text-secondary)]">验证码</label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                placeholder="请输入验证码"
                value={code}
                onChange={e => { setCode(e.target.value); setError(''); }}
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)]"
              />
              <button
                onClick={handleSendCode}
                disabled={busy}
                className="shrink-0 rounded-lg bg-[var(--color-bg-secondary)] px-3 py-2.5 text-sm text-[var(--color-primary)] hover:bg-[var(--color-border)] disabled:opacity-50 transition-colors"
              >
                {codeSent ? '重新发送' : '发送验证码'}
              </button>
            </div>
          </div>

          {error && (
            <p className="mb-3 text-sm text-[var(--color-error)]">{error}</p>
          )}

          {codeSent && (
            <p className="mb-3 text-xs text-[var(--color-text-muted)]">
              演示版提示：验证码已自动填入
            </p>
          )}

          <button
            onClick={handleDemoLogin}
            disabled={busy}
            className="mb-3 w-full rounded-lg bg-[var(--color-accent)] py-2.5 font-medium text-white hover:bg-[var(--color-accent-light)] disabled:opacity-50 transition-colors"
          >
            {busy ? '进入中...' : '进入面试演示版'}
          </button>

          <div className="mb-4 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            <span className="h-px flex-1 bg-[var(--color-border)]" />
            <span>或手动登录</span>
            <span className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          <button
            onClick={handleLogin}
            disabled={busy}
            className="w-full rounded-lg bg-[var(--color-primary)] py-2.5 font-medium text-white hover:bg-[var(--color-brand)] disabled:opacity-50 transition-colors"
          >
            {busy ? '登录中...' : '登录'}
          </button>
        </div>
      </div>
    </div>
  );
}
