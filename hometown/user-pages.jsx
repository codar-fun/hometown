// Hometown — User-facing pages: Home, Hackathon registration, Profile, Email preview

const { useState: useStateUser } = React;

// ─────────────── Home ───────────────
function HomePage({ user, onNavigate, onSignIn }) {
  return (
    <div className="page" style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--accent-soft)', border: '1px solid rgba(163,230,53,0.25)', borderRadius: 999, fontSize: 12, color: 'var(--accent)', marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
          报名进行中 · 截止 5 月 10 日
        </div>
        <h1 style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.03em', margin: '0 0 12px', lineHeight: 1.1 }}>
          一个让独立开发者<br />
          <span style={{ color: 'var(--text-3)' }}>不再孤单的</span> 社区。
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-2)', maxWidth: 560, margin: '0 0 28px', lineHeight: 1.6 }}>
          Hometown 是为热爱手艺的工程师、设计师和产品人准备的小镇广场。我们办黑客松、办读书会、办深夜聊天 — 也帮你找到一起做事的人。
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary btn-lg" onClick={() => user ? onNavigate('hackathon') : onSignIn()}>
            报名 Hackathon 2026 <Icons.ChevronRight size={14} />
          </button>
          <button className="btn btn-lg" onClick={() => onNavigate('hackathon')}>了解活动</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #F7FEE7 0%, #FFFFFF 60%)', borderColor: '#D9F99D', padding: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(77,124,15,0.10), transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>主舞台 · 即将开始</div>
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>Hometown Hackathon 2026</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 20, lineHeight: 1.6 }}>
              48 小时不间断 · 上海 · 5 月 18-19 日 · 主题「Tools for Builders」
            </div>
            <div style={{ display: 'flex', gap: 24, fontSize: 12, color: 'var(--text-2)' }}>
              <Stat label="已报名" value="47" total="200" />
              <Stat label="奖池" value="¥80,000" />
              <Stat label="赞助商" value="6" />
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>本周</div>
          <div className="stack" style={{ gap: 12 }}>
            <EventRow date="周三 · 19:00" title="Meetup #12" subtitle="Co-working · 23 人" />
            <EventRow date="周五 · 20:00" title="深夜书房：精益创业" subtitle="线上 · 自由参与" />
            <EventRow date="周六 · 14:00" title="设计工程师的工具箱" subtitle="工作坊 · 限 18 人" />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24, fontSize: 11, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        最近加入的小镇居民
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['陈思源','Maya','Tomás','王小川','Jordan','张语桐','Alex','李明轩','Priya','Daniel'].map((n, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px 6px 6px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 999 }}>
            <div className="avatar" style={{ width: 22, height: 22, fontSize: 10, background: `hsl(${i*37 % 360}, 50%, 60%)` }}>{n[0]}</div>
            <span style={{ fontSize: 12 }}>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, total }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
        {value}{total && <span style={{ color: 'var(--text-3)', fontSize: 13 }}> / {total}</span>}
      </div>
    </div>
  );
}

function EventRow({ date, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-3)', width: 80, flexShrink: 0 }}>{date}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{subtitle}</div>
      </div>
      <Icons.ChevronRight size={14} style={{ color: 'var(--text-3)' }} />
    </div>
  );
}

// ─────────────── Hackathon Form (user-facing) ───────────────
function HackathonForm({ form, user, onSubmit, onSignIn }) {
  const [values, setValues] = useStateUser({});
  const [submitted, setSubmitted] = useStateUser(false);
  const [errors, setErrors] = useStateUser({});

  if (!user) {
    return (
      <div className="page" style={{ maxWidth: 560, paddingTop: 80 }}>
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <Icons.User size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>请先登录后报名</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24 }}>
            登录后我们才能用邮件通知你报名结果。
          </div>
          <button className="btn btn-primary btn-lg" onClick={onSignIn}>登录 / 注册</button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="page" style={{ maxWidth: 560, paddingTop: 80 }}>
        <div className="card" style={{ textAlign: 'center', padding: 40, border: '1px solid #D9F99D' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
            <Icons.Check size={28} style={{ color: '#FFFFFF', strokeWidth: 2.5 }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.01em' }}>报名已提交</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 24, lineHeight: 1.6 }}>
            我们会在 3 个工作日内审核你的申请，<br />
            结果会发送到 <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{user.contact}</span>
          </div>
          <button className="btn" onClick={() => setSubmitted(false)}>修改报名</button>
        </div>
      </div>
    );
  }

  function submit() {
    const errs = {};
    form.fields.forEach(f => {
      if (f.required && !values[f.id]) errs[f.id] = '此项必填';
    });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
    onSubmit && onSubmit(values);
  }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--accent-soft)', border: '1px solid rgba(163,230,53,0.25)', borderRadius: 999, fontSize: 11, color: 'var(--accent)', marginBottom: 16, fontWeight: 500 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} />
          {form.responses} 人已报名 · 仍有 {200 - form.responses} 个名额
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px' }}>{form.title}</h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', margin: 0, lineHeight: 1.6 }}>{form.description}</p>
      </div>

      <div className="stack" style={{ gap: 24 }}>
        {form.fields.map(field => (
          <UserFieldInput
            key={field.id}
            field={field}
            value={values[field.id]}
            onChange={v => { setValues({ ...values, [field.id]: v }); if (errors[field.id]) setErrors({ ...errors, [field.id]: null }); }}
            error={errors[field.id]}
          />
        ))}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            提交后无法直接修改，但你可以联系组织者
          </div>
          <button className="btn btn-primary btn-lg" onClick={submit}>提交报名 <Icons.Send size={14} /></button>
        </div>
      </div>
    </div>
  );
}

function UserFieldInput({ field, value, onChange, error }) {
  return (
    <div>
      <label className="label" style={{ fontSize: 13, color: 'var(--text)', marginBottom: 8 }}>
        {field.label}{field.required && <span className="req">*</span>}
      </label>
      {(field.type === 'short_text' || field.type === 'email' || field.type === 'phone' || field.type === 'url' || field.type === 'number') && (
        <input className="input input-lg" type={field.type === 'number' ? 'number' : 'text'} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} style={error ? { borderColor: 'var(--danger)' } : {}} />
      )}
      {field.type === 'long_text' && (
        <textarea className="textarea" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} style={{ minHeight: 100, ...(error ? { borderColor: 'var(--danger)' } : {}) }} />
      )}
      {field.type === 'radio' && (
        <div className="stack" style={{ gap: 8 }}>
          {(field.options || []).map(o => (
            <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: value === o ? 'var(--accent-soft)' : 'var(--bg-elev)', border: '1px solid', borderColor: value === o ? 'var(--accent)' : 'var(--border)', borderRadius: 6, cursor: 'pointer' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid', borderColor: value === o ? 'var(--accent)' : 'var(--border-strong)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                {value === o && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />}
              </div>
              <span style={{ fontSize: 13 }}>{o}</span>
              <input type="radio" checked={value === o} onChange={() => onChange(o)} style={{ display: 'none' }} />
            </label>
          ))}
        </div>
      )}
      {field.type === 'checkbox' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(field.options || []).map(o => {
            const selected = (value || []).includes(o);
            return (
              <button
                key={o}
                onClick={() => {
                  const arr = value || [];
                  onChange(selected ? arr.filter(x => x !== o) : [...arr, o]);
                }}
                style={{
                  padding: '7px 12px', borderRadius: 999, fontSize: 12,
                  background: selected ? 'var(--accent-soft)' : 'var(--bg-elev)',
                  border: '1px solid', borderColor: selected ? 'var(--accent)' : 'var(--border)',
                  color: selected ? 'var(--accent)' : 'var(--text)',
                  cursor: 'pointer', fontWeight: 500,
                }}
              >
                {selected && '✓ '}{o}
              </button>
            );
          })}
        </div>
      )}
      {field.help && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>{field.help}</div>}
      {error && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 6 }}>{error}</div>}
    </div>
  );
}

// ─────────────── Profile ───────────────
function ProfilePage({ user, applications }) {
  if (!user) return <div className="page">请先登录</div>;
  const myApp = applications.find(a => a.email === user.email) || applications[0];
  const me = window.HometownData.STARTER_USERS[0];

  return (
    <div className="page" style={{ maxWidth: 880 }}>
      <div style={{ height: 140, background: 'linear-gradient(135deg, #ECFCCB 0%, #F7FEE7 50%, #FFFFFF 100%)', borderRadius: 12, marginBottom: -56, position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(77,124,15,0.18), transparent 50%), radial-gradient(circle at 80% 30%, rgba(34,211,238,0.10), transparent 50%)' }} />
      </div>

      <div style={{ padding: '0 24px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 24 }}>
          <div className="avatar" style={{ width: 96, height: 96, fontSize: 36, border: '4px solid var(--bg)', flexShrink: 0 }}>{me.avatar}</div>
          <div style={{ flex: 1, paddingBottom: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{me.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>@{me.handle} · 加入于 {me.joined}</div>
          </div>
          <button className="btn">编辑资料</button>
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <div className="stack" style={{ gap: 20 }}>
            <div className="card">
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>简介</div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{me.bio}</p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>我的活动</div>
              </div>
              <div className="stack" style={{ gap: 10 }}>
                <ActivityRow status="approved" title="Hometown Hackathon 2026" date="5 月 18-19 日" />
                <ActivityRow status="attended" title="Meetup #11 · 设计工程师之夜" date="3 月 22 日" />
                <ActivityRow status="attended" title="读书会：Pieces of the Action" date="2 月 14 日" />
                <ActivityRow status="hosted" title="工作坊：构建你的设计系统" date="1 月 28 日" />
              </div>
            </div>
          </div>

          <div className="stack" style={{ gap: 20 }}>
            <div className="card">
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>联系方式</div>
              <div className="stack" style={{ gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icons.AtSign size={14} style={{ color: 'var(--text-3)' }} /> <span className="mono">{me.email}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icons.Phone size={14} style={{ color: 'var(--text-3)' }} /> <span className="mono">{me.phone}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icons.Github size={14} style={{ color: 'var(--text-3)' }} /> <span className="mono">{me.github}</span></div>
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>技能</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {me.skills.map(s => <span key={s} className="badge">{s}</span>)}
              </div>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                <div><div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>4</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>参加活动</div></div>
                <div><div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>1</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>主办</div></div>
                <div><div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>23</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>认识的人</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ status, title, date }) {
  const map = {
    approved: { label: '已通过 · 即将开始', color: 'badge-success' },
    attended: { label: '已参加', color: '' },
    hosted: { label: '主办', color: 'badge-info' },
  };
  const s = map[status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{date}</div>
      </div>
      <span className={`badge ${s.color}`}>{s.label}</span>
    </div>
  );
}

// ─────────────── Email Notification Preview ───────────────
function EmailPreview({ application }) {
  const a = application || window.HometownData.STARTER_APPLICATIONS[0];
  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">邮件通知预览</h1>
        <p className="page-subtitle">报名通过后，发给申请者的邮件长这样。可在表单设置中编辑模板。</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16 }}>
        <div className="stack" style={{ gap: 4 }}>
          {[
            { id: 'approved', label: '已通过', active: true },
            { id: 'rejected', label: '未通过' },
            { id: 'waitlist', label: '候补名单' },
            { id: 'reminder', label: '活动前提醒' },
          ].map(t => (
            <button key={t.id} className={`nav-item ${t.active ? 'active' : ''}`}>
              <Icons.Mail size={14} /> {t.label}
            </button>
          ))}
        </div>

        <div>
          {/* email client mock */}
          <div style={{ background: '#FFFFFF', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            <div style={{ background: '#F5F5F4', padding: '14px 20px', borderBottom: '1px solid #E7E5E4', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
              </div>
              <span style={{ marginLeft: 12, fontSize: 12, color: '#78716C' }}>邮件 — 收件箱</span>
            </div>

            <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid #E7E5E4', color: '#1C1917' }}>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, color: '#0C0A09' }}>🎉 你被录取了 — Hometown Hackathon 2026</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#78716C' }}>
                <span><strong style={{ color: '#1C1917' }}>From</strong> Hometown &lt;hi@hometown.dev&gt;</span>
                <span><strong style={{ color: '#1C1917' }}>To</strong> {a.email}</span>
                <span style={{ marginLeft: 'auto' }}>4 月 28 日 · 09:14</span>
              </div>
            </div>

            <div style={{ padding: '32px 28px', color: '#1C1917', fontSize: 14, lineHeight: 1.7, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <div style={{ marginBottom: 24, padding: '4px 0' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#ECFCCB', color: '#365314', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                  ✓ 报名已通过
                </div>
              </div>

              <p style={{ margin: '0 0 16px' }}>嗨 {a.name}，</p>
              <p style={{ margin: '0 0 16px' }}>
                你的 Hometown Hackathon 2026 报名审核通过 — 我们很期待你来。
                组织者们浏览了你的项目想法，特别喜欢你提到的「{a.idea.slice(0, 30)}…」。
              </p>

              <div style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: 8, padding: 16, margin: '20px 0' }}>
                <div style={{ fontSize: 11, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 10 }}>活动信息</div>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '6px 12px', fontSize: 13 }}>
                  <div style={{ color: '#78716C' }}>日期</div><div>5 月 18 日 09:00 — 5 月 19 日 18:00</div>
                  <div style={{ color: '#78716C' }}>地点</div><div>上海徐汇 · 西岸艺术中心 B 馆</div>
                  <div style={{ color: '#78716C' }}>主题</div><div>Tools for Builders</div>
                  <div style={{ color: '#78716C' }}>奖池</div><div>¥80,000 + 6 家公司面试直通</div>
                </div>
              </div>

              <p style={{ margin: '0 0 8px' }}>请在 5 月 5 日前完成以下两件事：</p>
              <ul style={{ margin: '0 0 20px 20px', padding: 0, color: '#1C1917' }}>
                <li style={{ marginBottom: 6 }}>填写 T 恤尺码和饮食偏好（5 分钟）</li>
                <li style={{ marginBottom: 6 }}>加入选手 Discord 频道找队友</li>
              </ul>

              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#0C0A09', color: '#FFFFFF', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                完成参赛资料 →
              </a>

              <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #E7E5E4', fontSize: 12, color: '#78716C', lineHeight: 1.6 }}>
                有任何问题随时回复这封邮件，或者在 Discord 里 @ 组织者。<br />
                — Avery，代表 Hometown 组织团队
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icons.Sparkle size={14} style={{ color: 'var(--accent)' }} />
            模板支持 <span className="mono" style={{ color: 'var(--accent)' }}>{'{{name}}'}</span> <span className="mono" style={{ color: 'var(--accent)' }}>{'{{idea}}'}</span> 等变量，会在发送时自动替换。
          </div>
        </div>
      </div>
    </div>
  );
}

window.HomePage = HomePage;
window.HackathonForm = HackathonForm;
window.ProfilePage = ProfilePage;
window.EmailPreview = EmailPreview;
