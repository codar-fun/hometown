// Hometown — Login modal (phone or email + 6-digit OTP)

const { useState, useEffect, useRef } = React;

function LoginModal({ open, onClose, onSuccess }) {
  const [step, setStep] = useState('method'); // 'method' | 'code'
  const [method, setMethod] = useState('phone'); // 'phone' | 'email'
  const [contact, setContact] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const codeRefs = useRef([]);

  useEffect(() => {
    if (!open) {
      // reset on close
      setTimeout(() => {
        setStep('method'); setContact(''); setCode(['','','','','','']); setError(''); setResendIn(0);
      }, 200);
    }
  }, [open]);

  useEffect(() => {
    if (resendIn > 0) {
      const t = setTimeout(() => setResendIn(resendIn - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendIn]);

  if (!open) return null;

  const validContact = method === 'phone'
    ? /^\+?[\d\s-]{7,}$/.test(contact)
    : /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact);

  function sendCode() {
    if (!validContact) {
      setError(method === 'phone' ? '请输入有效的手机号' : '请输入有效的邮箱');
      return;
    }
    setError('');
    setStep('code');
    setResendIn(60);
    setTimeout(() => codeRefs.current[0]?.focus(), 100);
  }

  function handleCode(i, v) {
    const digit = v.replace(/\D/g, '').slice(0, 1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) codeRefs.current[i + 1]?.focus();
    if (next.every(c => c) && next.join('').length === 6) {
      setTimeout(() => verify(next.join('')), 150);
    }
  }

  function handleCodeKey(i, e) {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) codeRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) codeRefs.current[i + 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      setTimeout(() => verify(pasted), 150);
    }
  }

  function verify(c) {
    // Demo: any 6 digits works, but '000000' fails to show error state
    if (c === '000000') {
      setError('验证码错误，请重试');
      setCode(['','','','','','']);
      setTimeout(() => codeRefs.current[0]?.focus(), 50);
      return;
    }
    onSuccess({ method, contact });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 'min(420px, 90vw)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="brand-mark" style={{ width: 32, height: 32, fontSize: 16 }}>H</div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>登录到 Hometown</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="关闭"><Icons.X /></button>
        </div>

        {step === 'method' && (
          <div className="stack" style={{ gap: 16 }}>
            <div style={{ display: 'flex', background: 'var(--bg)', padding: 4, borderRadius: 8, border: '1px solid var(--border)' }}>
              <button
                onClick={() => setMethod('phone')}
                style={{
                  flex: 1, height: 32, border: 'none', borderRadius: 6,
                  background: method === 'phone' ? 'var(--bg-elev-2)' : 'transparent',
                  color: method === 'phone' ? 'var(--text)' : 'var(--text-2)',
                  fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <Icons.Phone size={14} /> 手机号
              </button>
              <button
                onClick={() => setMethod('email')}
                style={{
                  flex: 1, height: 32, border: 'none', borderRadius: 6,
                  background: method === 'email' ? 'var(--bg-elev-2)' : 'transparent',
                  color: method === 'email' ? 'var(--text)' : 'var(--text-2)',
                  fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <Icons.Mail size={14} /> 邮箱
              </button>
            </div>

            <div>
              <label className="label">{method === 'phone' ? '手机号' : '邮箱'}</label>
              <input
                className="input input-lg"
                type={method === 'phone' ? 'tel' : 'email'}
                placeholder={method === 'phone' ? '+86 138 0000 0000' : 'you@example.com'}
                value={contact}
                onChange={e => { setContact(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && sendCode()}
                autoFocus
              />
              {error && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 6 }}>{error}</div>}
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={sendCode}>
              发送验证码
            </button>

            <div style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.5 }}>
              继续即表示同意《社区公约》和《隐私协议》。<br />
              首次登录将自动创建账号。
            </div>
          </div>
        )}

        {step === 'code' && (
          <div className="stack" style={{ gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>输入 6 位验证码</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>
                已发送至 <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{contact}</span>
                <button
                  onClick={() => { setStep('method'); }}
                  style={{ marginLeft: 8, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}
                >
                  改一下
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }} onPaste={handlePaste}>
              {code.map((d, i) => (
                <input
                  key={i}
                  ref={el => codeRefs.current[i] = el}
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleCode(i, e.target.value)}
                  onKeyDown={e => handleCodeKey(i, e)}
                  className="input"
                  style={{
                    width: 48, height: 56, padding: 0, fontSize: 20, fontWeight: 600,
                    textAlign: 'center', fontFamily: 'var(--font-mono)',
                    background: d ? 'var(--bg-elev-2)' : 'var(--bg-elev)',
                  }}
                />
              ))}
            </div>

            {error && <div style={{ color: 'var(--danger)', fontSize: 12, textAlign: 'center' }}>{error}</div>}

            <div style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>
              {resendIn > 0
                ? <>{resendIn} 秒后可重新发送</>
                : <button onClick={() => { setResendIn(60); }} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>重新发送验证码</button>}
            </div>

            <div style={{ padding: 10, background: 'var(--bg)', border: '1px dashed var(--border)', borderRadius: 6, fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>
              💡 演示提示：输入任意 6 位数字即可登录（输入 <span className="mono" style={{ color: 'var(--text-2)' }}>000000</span> 测试错误状态）
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.LoginModal = LoginModal;
