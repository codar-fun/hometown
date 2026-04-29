// Hometown — Hackathons admin (list + create wizard + edit info)

const { useState: useStateH, useMemo: useMemoH } = React;
const Field = window.Field;

// ─────────── Hackathons List ───────────
function HackathonsList({ hackathons, onCreate, onEdit, onOpenForm }) {
  const [tab, setTab] = useStateH('all');
  const [search, setSearch] = useStateH('');

  const filtered = useMemoH(() => {
    let res = hackathons.slice();
    if (tab !== 'all') res = res.filter(h => h.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(h => h.name.toLowerCase().includes(q) || h.theme.toLowerCase().includes(q));
    }
    res.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return res;
  }, [hackathons, tab, search]);

  const counts = {
    all: hackathons.length,
    live: hackathons.filter(h => h.status === 'live').length,
    draft: hackathons.filter(h => h.status === 'draft').length,
    ended: hackathons.filter(h => h.status === 'ended').length,
  };

  return (
    <div className="page" style={{ maxWidth: 1240 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">黑客松</h1>
          <p className="page-subtitle">{hackathons.length} 个活动 · {hackathons.reduce((a, h) => a + h.registered, 0)} 总报名 · 管理你的所有 hackathon</p>
        </div>
        <button className="btn btn-primary" onClick={onCreate}>
          <Icons.Plus size={14} /> 创建黑客松
        </button>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="进行中" value={counts.live} accent="#4D7C0F" />
        <StatCard label="草稿" value={counts.draft} accent="#A8A29E" />
        <StatCard label="已结束" value={counts.ended} accent="#0C0A09" />
        <StatCard label="累计报名" value={hackathons.reduce((a, h) => a + h.registered, 0)} accent="#0EA5E9" mono />
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 220, maxWidth: 380 }}>
          <Icons.Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input className="input" placeholder="搜索 hackathon" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34 }} />
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-elev-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
          {[
            { id: 'all', label: '全部', count: counts.all },
            { id: 'live', label: '进行中', count: counts.live },
            { id: 'draft', label: '草稿', count: counts.draft },
            { id: 'ended', label: '已结束', count: counts.ended },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '6px 12px', fontSize: 12, fontWeight: 500,
              background: tab === t.id ? 'var(--surface)' : 'transparent',
              border: 'none', borderRadius: 5,
              color: tab === t.id ? 'var(--text)' : 'var(--text-2)',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
              boxShadow: tab === t.id ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
            }}>
              {t.label} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(h => (
          <HackathonRow key={h.id} hack={h} onEdit={() => onEdit(h)} onOpenForm={() => onOpenForm(h)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
          没有匹配的 hackathon — <button onClick={onCreate} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>创建一个新的 →</button>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent, mono }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: mono ? 'var(--font-mono)' : 'inherit', color: 'var(--text)', display: 'flex', alignItems: 'baseline', gap: 8 }}>
        {value}
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
      </div>
    </div>
  );
}

function HackathonRow({ hack: h, onEdit, onOpenForm }) {
  const statusMap = {
    live: { label: '进行中', color: 'var(--accent)', bg: 'var(--accent-soft)', dot: true },
    draft: { label: '草稿', color: 'var(--text-2)', bg: 'var(--bg-elev-2)' },
    ended: { label: '已结束', color: 'var(--text-2)', bg: 'var(--bg-elev-2)' },
    reviewing: { label: '审核中', color: '#A16207', bg: '#FEF3C7' },
  };
  const s = statusMap[h.status];
  const fillPct = h.capacity > 0 ? Math.min(100, (h.registered / h.capacity) * 100) : 0;

  return (
    <div className="card" style={{ padding: 0, display: 'flex', overflow: 'hidden' }}>
      {/* Cover stripe */}
      <div style={{ width: 8, background: h.coverColor, flexShrink: 0 }} />

      {/* Content */}
      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20, minWidth: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{h.name}</h3>
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 999,
              background: s.bg, color: s.color, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              {s.dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, animation: 'pulse 1.6s infinite' }} />}
              {s.label}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{h.slug}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>
            <span style={{ fontWeight: 500 }}>{h.theme}</span>
            {h.theme && h.tagline && <span style={{ color: 'var(--text-3)' }}> · </span>}
            <span>{h.tagline}</span>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-3)', flexWrap: 'wrap' }}>
            <span><Icons.Calendar size={11} style={{ verticalAlign: '-2px' }} /> {fmtDateRange(h.startDate, h.endDate)}</span>
            <span><Icons.Home size={11} style={{ verticalAlign: '-2px' }} /> {h.location}</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>¥{(h.prizePool / 1000).toFixed(0)}k 奖池</span>
            <span>{h.tracks.length} 条赛道</span>
          </div>
        </div>

        {/* Capacity bar */}
        {h.status !== 'draft' && (
          <div style={{ width: 140, flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-2)' }}>报名</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{h.registered} / {h.capacity}</span>
            </div>
            <div style={{ height: 4, background: 'var(--bg-elev-2)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${fillPct}%`, height: '100%', background: fillPct > 80 ? '#DC2626' : 'var(--accent)' }} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>
              {h.approved} 已通过审核
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {h.formId && <button className="btn btn-sm" onClick={onOpenForm}><Icons.Form size={12} /> 报名表</button>}
          <button className="btn btn-sm btn-primary" onClick={onEdit}><Icons.Settings size={12} /> 管理</button>
        </div>
      </div>
    </div>
  );
}

function fmtDateRange(s, e) {
  const fmt = (d) => {
    const [y, m, day] = d.split('-');
    return `${parseInt(m)}月${parseInt(day)}日`;
  };
  if (s === e) return fmt(s);
  return `${fmt(s)} — ${fmt(e)}`;
}


// ─────────── Create Wizard ───────────
function HackathonCreate({ onCancel, onCreate }) {
  const [step, setStep] = useStateH(1);
  const [data, setData] = useStateH({
    name: '', slug: '', theme: '', tagline: '',
    description: '',
    startDate: '', endDate: '', submitDeadline: '',
    location: '', locationType: 'hybrid',
    capacity: 100,
    prizePool: 20000,
    tracks: [],
    trackInput: '',
    coverColor: '#4D7C0F',
    coverPattern: 'leaves',
  });

  function update(patch) { setData(d => ({ ...d, ...patch })); }
  function addTrack() {
    const t = data.trackInput.trim();
    if (!t || data.tracks.includes(t)) return;
    update({ tracks: [...data.tracks, t], trackInput: '' });
  }
  function removeTrack(t) { update({ tracks: data.tracks.filter(x => x !== t) }); }

  const steps = [
    { num: 1, label: '基础信息' },
    { num: 2, label: '时间地点' },
    { num: 3, label: '赛道与奖项' },
    { num: 4, label: '视觉与确认' },
  ];

  const valid = {
    1: data.name.trim() && data.slug.trim() && data.theme.trim(),
    2: data.startDate && data.endDate && data.location.trim(),
    3: data.tracks.length > 0,
    4: true,
  };

  function nextStep() { if (valid[step] && step < 4) setStep(step + 1); }
  function prevStep() { if (step > 1) setStep(step - 1); }

  function submit() {
    onCreate({
      ...data,
      id: 'h_' + Date.now(),
      status: 'draft',
      registered: 0, approved: 0,
      sponsors: [],
      currency: 'CNY',
      formId: null,
      createdBy: '林知夏',
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <button onClick={onCancel} className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }}>
        <Icons.ChevronLeft size={14} /> 取消并返回列表
      </button>

      <div className="page-header" style={{ borderBottom: 'none', marginBottom: 20, paddingBottom: 0 }}>
        <div>
          <h1 className="page-title">创建黑客松</h1>
          <p className="page-subtitle">第 {step} / 4 步 · 创建后默认为草稿状态，可继续编辑</p>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, padding: '12px 16px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.num}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: step >= s.num ? 'var(--accent)' : 'var(--bg-elev-2)',
                color: step >= s.num ? '#FFF' : 'var(--text-3)',
                display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700,
                fontFamily: 'var(--font-mono)',
              }}>
                {step > s.num ? <Icons.Check size={12} /> : s.num}
              </div>
              <span style={{ fontSize: 12, color: step === s.num ? 'var(--text)' : 'var(--text-3)', fontWeight: step === s.num ? 600 : 500, whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: step > s.num ? 'var(--accent)' : 'var(--border)', margin: '0 12px', minWidth: 16 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="card" style={{ padding: '24px 28px' }}>
        {step === 1 && <Step1Basics data={data} update={update} />}
        {step === 2 && <Step2When data={data} update={update} />}
        {step === 3 && <Step3Tracks data={data} update={update} addTrack={addTrack} removeTrack={removeTrack} />}
        {step === 4 && <Step4Confirm data={data} />}
      </div>

      {/* Footer nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button className="btn" onClick={prevStep} disabled={step === 1}>
          <Icons.ChevronLeft size={13} /> 上一步
        </button>
        {step < 4 ? (
          <button className="btn btn-primary" onClick={nextStep} disabled={!valid[step]}>
            下一步 <Icons.ChevronRight size={13} />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={submit}>
            <Icons.Check size={13} /> 创建为草稿
          </button>
        )}
      </div>
    </div>
  );
}

function Step1Basics({ data, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field label="活动名称" required>
        <input className="input input-lg" value={data.name} onChange={e => {
          const name = e.target.value;
          const slug = data.slug || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 30);
          update({ name, slug });
        }} placeholder="例如 Hometown Hackathon 2026" maxLength={50} />
      </Field>
      <Field label="URL slug" required help="用在活动链接里 · 只能用小写字母 / 数字 / -">
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg-elev)', overflow: 'hidden' }}>
          <span style={{ padding: '0 12px', color: 'var(--text-3)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>hometown.dev/h/</span>
          <input style={{ flex: 1, padding: '10px 0', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 13 }} value={data.slug} onChange={e => update({ slug: e.target.value.toLowerCase().replace(/[^\w-]/g, '') })} />
        </div>
      </Field>
      <Field label="主题" required help="一个能贯穿活动的关键词">
        <input className="input" value={data.theme} onChange={e => update({ theme: e.target.value })} placeholder="例如 Tools for Builders" />
      </Field>
      <Field label="一句话简介" help={`${data.tagline.length} / 100`}>
        <input className="input" value={data.tagline} onChange={e => update({ tagline: e.target.value.slice(0, 100) })} placeholder="一句话讲清楚这是什么活动" />
      </Field>
      <Field label="详细介绍" help="支持 Markdown · 可以写规则、评审标准、行为准则等">
        <textarea className="input textarea" style={{ minHeight: 120, fontFamily: 'var(--font-mono)', fontSize: 13 }} value={data.description} onChange={e => update({ description: e.target.value })} placeholder="## 关于活动&#10;&#10;为什么我们办这个 hackathon · 期望什么样的作品 · 评审标准…" />
      </Field>
    </div>
  );
}

function Step2When({ data, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="开始日期" required>
          <input className="input" type="date" value={data.startDate} onChange={e => update({ startDate: e.target.value })} />
        </Field>
        <Field label="结束日期" required>
          <input className="input" type="date" value={data.endDate} onChange={e => update({ endDate: e.target.value })} />
        </Field>
      </div>
      <Field label="作品提交截止" help="通常是结束日期当天">
        <input className="input" type="datetime-local" value={data.submitDeadline} onChange={e => update({ submitDeadline: e.target.value })} />
      </Field>
      <Field label="举办形式" required>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { v: 'onsite', l: '🏢 线下', d: '在物理场地举办' },
            { v: 'online', l: '💻 线上', d: 'Discord / Zoom' },
            { v: 'hybrid', l: '🌐 混合', d: '线上线下都有' },
          ].map(o => (
            <button key={o.v} type="button" onClick={() => update({ locationType: o.v })}
              style={{
                padding: 12, textAlign: 'left', cursor: 'pointer',
                border: '1px solid', borderColor: data.locationType === o.v ? 'var(--accent)' : 'var(--border)',
                background: data.locationType === o.v ? 'var(--accent-soft)' : 'var(--surface)',
                borderRadius: 8,
              }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{o.l}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{o.d}</div>
            </button>
          ))}
        </div>
      </Field>
      <Field label="地点 / 平台" required>
        <input className="input" value={data.location} onChange={e => update({ location: e.target.value })} placeholder={data.locationType === 'online' ? 'Discord 链接' : '上海 · 西岸艺术中心'} />
      </Field>
      <Field label="人数上限" help="超过会进入候补名单">
        <input className="input" type="number" min="1" value={data.capacity} onChange={e => update({ capacity: parseInt(e.target.value) || 0 })} style={{ fontFamily: 'var(--font-mono)' }} />
      </Field>
    </div>
  );
}

function Step3Tracks({ data, update, addTrack, removeTrack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field label="赛道 / 分类" required help="按回车添加 · 至少 1 条">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: 10, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-elev)', minHeight: 56 }}>
          {data.tracks.map(t => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '4px 10px', borderRadius: 4, background: 'var(--surface)', border: '1px solid var(--border)', fontWeight: 500 }}>
              {t}
              <button onClick={() => removeTrack(t)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', color: 'var(--text-3)', padding: 0 }}>
                <Icons.X size={12} />
              </button>
            </span>
          ))}
          <input
            value={data.trackInput}
            onChange={e => update({ trackInput: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTrack(); } }}
            placeholder={data.tracks.length === 0 ? '例如 Tools for Builders' : '继续添加'}
            style={{ flex: 1, minWidth: 120, border: 'none', outline: 'none', background: 'transparent', fontSize: 13 }}
          />
        </div>
      </Field>
      <Field label="奖池总额（CNY）">
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>¥</span>
          <input className="input input-lg" type="number" min="0" step="1000" value={data.prizePool} onChange={e => update({ prizePool: parseInt(e.target.value) || 0 })} style={{ paddingLeft: 28, fontFamily: 'var(--font-mono)' }} />
        </div>
      </Field>
      <div style={{ padding: 12, background: 'var(--accent-soft)', borderRadius: 6, border: '1px solid #D9F99D', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Icons.Sparkle size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 12, color: 'var(--accent)', lineHeight: 1.5 }}>
          创建后可以在管理页详细配置每个赛道的奖项金额、评委、评审标准。
        </div>
      </div>
    </div>
  );
}

function Step4Confirm({ data }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 600 }}>预览</h3>
      <div style={{ background: 'var(--bg-elev)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ height: 100, background: data.coverColor, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: '#FFFFFF', opacity: 0.7, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{data.theme || '主题待定'}</div>
            <div style={{ fontSize: 18, color: '#FFFFFF', fontWeight: 700, letterSpacing: '-0.01em' }}>{data.name || '活动名称'}</div>
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--text-2)' }}>{data.tagline || '（无简介）'}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
            <SummaryRow label="时间" value={data.startDate && data.endDate ? `${data.startDate} → ${data.endDate}` : '—'} />
            <SummaryRow label="地点" value={data.location || '—'} />
            <SummaryRow label="形式" value={{ onsite: '🏢 线下', online: '💻 线上', hybrid: '🌐 混合' }[data.locationType]} />
            <SummaryRow label="人数" value={`${data.capacity} 人`} />
            <SummaryRow label="奖池" value={`¥${data.prizePool.toLocaleString()}`} />
            <SummaryRow label="赛道" value={`${data.tracks.length} 条`} />
          </div>
          {data.tracks.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>赛道</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {data.tracks.map(t => <span key={t} className="badge">{t}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: 16, padding: 12, background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 6, fontSize: 12, color: '#A16207' }}>
        ⚠️ 创建后默认为<strong>草稿</strong>状态。需要在管理页设置报名表，并切换到「进行中」才会公开显示。
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{value}</div>
    </div>
  );
}


// ─────────── Edit ───────────
function HackathonEdit({ hack, onBack, onSave, onDelete, onPublish, onOpenForm }) {
  const [section, setSection] = useStateH('basics');
  const [draft, setDraft] = useStateH({ ...hack });
  const [saved, setSaved] = useStateH(false);
  const [showPublishConfirm, setShowPublishConfirm] = useStateH(false);

  function update(patch) { setDraft(d => ({ ...d, ...patch })); setSaved(false); }
  function save() { onSave({ ...draft, updatedAt: new Date().toISOString().slice(0, 10) }); setSaved(true); setTimeout(() => setSaved(false), 2000); }

  const sections = [
    { id: 'basics', label: '基础信息', icon: 'Type' },
    { id: 'when', label: '时间地点', icon: 'Calendar' },
    { id: 'tracks', label: '赛道奖项', icon: 'Builder' },
    { id: 'form', label: '报名表', icon: 'Form' },
    { id: 'sponsors', label: '赞助商', icon: 'Star' },
    { id: 'visibility', label: '发布设置', icon: 'Eye' },
    { id: 'danger', label: '危险操作', icon: 'Trash' },
  ];

  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }}>
        <Icons.ChevronLeft size={14} /> 返回列表
      </button>

      <div className="page-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <h1 className="page-title" style={{ marginBottom: 0 }}>{draft.name}</h1>
            <StatusPill status={draft.status} />
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>id: {draft.id}</span>
          </div>
          <p className="page-subtitle">由 {draft.createdBy} 创建于 {draft.createdAt} · 最后更新 {draft.updatedAt}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {draft.status === 'draft' && (
            <button className="btn btn-primary" onClick={() => setShowPublishConfirm(true)}>
              <Icons.Send size={13} /> 发布
            </button>
          )}
          {draft.status === 'live' && (
            <button className="btn">预览公开页</button>
          )}
          <button className="btn btn-primary" onClick={save} style={saved ? { background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: '#D9F99D' } : {}}>
            {saved ? <><Icons.Check size={13} /> 已保存</> : '保存修改'}
          </button>
        </div>
      </div>

      {/* 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Side nav */}
        <aside style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sections.map(s => {
            const Ico = Icons[s.icon];
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 12px', textAlign: 'left',
                  background: section === s.id ? 'var(--bg-elev-2)' : 'transparent',
                  border: 'none', borderRadius: 6,
                  fontSize: 13, fontWeight: 500,
                  color: s.id === 'danger' ? 'var(--danger, #DC2626)' : (section === s.id ? 'var(--text)' : 'var(--text-2)'),
                  cursor: 'pointer',
                }}
              >
                <Ico size={14} />
                {s.label}
              </button>
            );
          })}
        </aside>

        {/* Section panel */}
        <div className="card" style={{ padding: '24px 28px' }}>
          {section === 'basics' && <SectionBasics draft={draft} update={update} />}
          {section === 'when' && <SectionWhen draft={draft} update={update} />}
          {section === 'tracks' && <SectionTracks draft={draft} update={update} />}
          {section === 'form' && <SectionForm draft={draft} update={update} onOpenForm={() => onOpenForm(draft)} />}
          {section === 'sponsors' && <SectionSponsors draft={draft} update={update} />}
          {section === 'visibility' && <SectionVisibility draft={draft} update={update} />}
          {section === 'danger' && <SectionDanger draft={draft} onDelete={() => onDelete(draft)} />}
        </div>
      </div>

      {/* Publish confirm modal */}
      {showPublishConfirm && (
        <div className="modal-overlay" onClick={() => setShowPublishConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(12,10,9,0.4)', display: 'grid', placeItems: 'center', zIndex: 100 }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: 24 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>确认发布 hackathon？</h3>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
              发布后<strong style={{ color: 'var(--text)' }}>「{draft.name}」</strong>会出现在公开活动列表，社区成员可以开始报名。你之后仍然可以编辑信息，但删除会受限。
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setShowPublishConfirm(false)}>取消</button>
              <button className="btn btn-primary" onClick={() => { onPublish(draft); setShowPublishConfirm(false); }}>
                <Icons.Send size={13} /> 确认发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    live: { label: '进行中', color: 'var(--accent)', bg: 'var(--accent-soft)', dot: true },
    draft: { label: '草稿', color: 'var(--text-2)', bg: 'var(--bg-elev-2)' },
    ended: { label: '已结束', color: 'var(--text-2)', bg: 'var(--bg-elev-2)' },
    reviewing: { label: '审核中', color: '#A16207', bg: '#FEF3C7' },
  };
  const s = map[status] || map.draft;
  return (
    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: s.bg, color: s.color, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      {s.dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, animation: 'pulse 1.6s infinite' }} />}
      {s.label}
    </span>
  );
}

function SectionBasics({ draft, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16 }}>基础信息</h2>
      <Field label="活动名称"><input className="input input-lg" value={draft.name} onChange={e => update({ name: e.target.value })} /></Field>
      <Field label="URL slug"><input className="input" value={draft.slug} onChange={e => update({ slug: e.target.value })} style={{ fontFamily: 'var(--font-mono)' }} /></Field>
      <Field label="主题"><input className="input" value={draft.theme} onChange={e => update({ theme: e.target.value })} /></Field>
      <Field label="一句话简介"><input className="input" value={draft.tagline} onChange={e => update({ tagline: e.target.value })} /></Field>
      <Field label="详细介绍"><textarea className="input textarea" style={{ minHeight: 140, fontFamily: 'var(--font-mono)', fontSize: 13 }} value={draft.description} onChange={e => update({ description: e.target.value })} /></Field>
      <Field label="封面颜色">
        <div style={{ display: 'flex', gap: 8 }}>
          {['#4D7C0F', '#0EA5E9', '#A78BFA', '#FCE7F3', '#FBBF24', '#F87171', '#0C0A09'].map(c => (
            <button key={c} type="button" onClick={() => update({ coverColor: c })} style={{
              width: 32, height: 32, borderRadius: 6, background: c, cursor: 'pointer',
              border: '2px solid', borderColor: draft.coverColor === c ? 'var(--text)' : 'var(--border)',
              outlineOffset: 2,
            }} />
          ))}
        </div>
      </Field>
    </div>
  );
}

function SectionWhen({ draft, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16 }}>时间与地点</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="开始日期"><input className="input" type="date" value={draft.startDate} onChange={e => update({ startDate: e.target.value })} /></Field>
        <Field label="结束日期"><input className="input" type="date" value={draft.endDate} onChange={e => update({ endDate: e.target.value })} /></Field>
      </div>
      <Field label="作品提交截止"><input className="input" type="datetime-local" value={draft.submitDeadline} onChange={e => update({ submitDeadline: e.target.value })} /></Field>
      <Field label="举办形式">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { v: 'onsite', l: '🏢 线下' },
            { v: 'online', l: '💻 线上' },
            { v: 'hybrid', l: '🌐 混合' },
          ].map(o => (
            <button key={o.v} type="button" onClick={() => update({ locationType: o.v })}
              style={{
                padding: 10, cursor: 'pointer',
                border: '1px solid', borderColor: draft.locationType === o.v ? 'var(--accent)' : 'var(--border)',
                background: draft.locationType === o.v ? 'var(--accent-soft)' : 'var(--surface)',
                borderRadius: 6, fontSize: 13, fontWeight: 500,
              }}>
              {o.l}
            </button>
          ))}
        </div>
      </Field>
      <Field label="地点 / 平台"><input className="input" value={draft.location} onChange={e => update({ location: e.target.value })} /></Field>
      <Field label="人数上限"><input className="input" type="number" value={draft.capacity} onChange={e => update({ capacity: parseInt(e.target.value) || 0 })} style={{ fontFamily: 'var(--font-mono)' }} /></Field>
    </div>
  );
}

function SectionTracks({ draft, update }) {
  function addTrack() {
    const t = (draft._trackInput || '').trim();
    if (!t || draft.tracks.includes(t)) return;
    update({ tracks: [...draft.tracks, t], _trackInput: '' });
  }
  function removeTrack(t) { update({ tracks: draft.tracks.filter(x => x !== t) }); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16 }}>赛道与奖项</h2>
      <Field label="赛道">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: 10, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-elev)', minHeight: 56 }}>
          {draft.tracks.map(t => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '4px 10px', borderRadius: 4, background: 'var(--surface)', border: '1px solid var(--border)', fontWeight: 500 }}>
              {t}
              <button onClick={() => removeTrack(t)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', color: 'var(--text-3)' }}><Icons.X size={12} /></button>
            </span>
          ))}
          <input
            value={draft._trackInput || ''}
            onChange={e => update({ _trackInput: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTrack(); } }}
            placeholder="按回车添加赛道"
            style={{ flex: 1, minWidth: 120, border: 'none', outline: 'none', background: 'transparent', fontSize: 13 }}
          />
        </div>
      </Field>
      <Field label="奖池总额（CNY）">
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>¥</span>
          <input className="input input-lg" type="number" value={draft.prizePool} onChange={e => update({ prizePool: parseInt(e.target.value) || 0 })} style={{ paddingLeft: 28, fontFamily: 'var(--font-mono)' }} />
        </div>
      </Field>
      <div style={{ padding: 14, background: 'var(--bg-elev)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
        💡 高级：为每条赛道分配独立奖项金额、设置不同的评委组。该功能将在 v1.2 上线。
      </div>
    </div>
  );
}

function SectionForm({ draft, update, onOpenForm }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16 }}>报名表</h2>
      {draft.formId ? (
        <div className="card" style={{ background: 'var(--bg-elev)', display: 'flex', alignItems: 'center', gap: 14, padding: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', color: 'var(--accent)', flexShrink: 0 }}>
            <Icons.Form size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{draft.name} · 报名表</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{draft.formId} · 已收 {draft.registered} 份</div>
          </div>
          <button className="btn btn-sm" onClick={onOpenForm}><Icons.Builder size={12} /> 编辑表单</button>
        </div>
      ) : (
        <div style={{ padding: 24, textAlign: 'center', border: '2px dashed var(--border)', borderRadius: 8 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
          <div style={{ fontSize: 13, marginBottom: 4, fontWeight: 500 }}>还没有报名表</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>用表单构建器创建一个 — 字段、规则都可以拖拽配置</div>
          <button className="btn btn-primary" onClick={() => update({ formId: 'f_new_' + Date.now() })}>
            <Icons.Plus size={13} /> 创建报名表
          </button>
        </div>
      )}
      <Field label="报名截止时间">
        <input className="input" type="datetime-local" value={draft.regDeadline || ''} onChange={e => update({ regDeadline: e.target.value })} />
      </Field>
      <Field label="审核模式">
        <div style={{ display: 'flex', gap: 8 }}>
          {[{v:'auto', l:'自动通过'}, {v:'manual', l:'人工审核'}].map(o => (
            <button key={o.v} type="button" onClick={() => update({ reviewMode: o.v })} style={{
              flex: 1, padding: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
              border: '1px solid', borderColor: (draft.reviewMode || 'manual') === o.v ? 'var(--accent)' : 'var(--border)',
              background: (draft.reviewMode || 'manual') === o.v ? 'var(--accent-soft)' : 'var(--surface)',
              borderRadius: 6, color: (draft.reviewMode || 'manual') === o.v ? 'var(--accent)' : 'var(--text)',
            }}>{o.l}</button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function SectionSponsors({ draft, update }) {
  function addSponsor() {
    const s = (draft._sponsorInput || '').trim();
    if (!s || draft.sponsors.includes(s)) return;
    update({ sponsors: [...draft.sponsors, s], _sponsorInput: '' });
  }
  function removeSponsor(s) { update({ sponsors: draft.sponsors.filter(x => x !== s) }); }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16 }}>赞助商 · 合作方</h2>
      <Field label="赞助商列表">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: 10, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-elev)', minHeight: 56 }}>
          {draft.sponsors.map(s => (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '4px 10px', borderRadius: 4, background: 'var(--surface)', border: '1px solid var(--border)', fontWeight: 500 }}>
              {s}
              <button onClick={() => removeSponsor(s)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', color: 'var(--text-3)' }}><Icons.X size={12} /></button>
            </span>
          ))}
          <input
            value={draft._sponsorInput || ''}
            onChange={e => update({ _sponsorInput: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSponsor(); } }}
            placeholder="按回车添加"
            style={{ flex: 1, minWidth: 120, border: 'none', outline: 'none', background: 'transparent', fontSize: 13 }}
          />
        </div>
      </Field>
    </div>
  );
}

function SectionVisibility({ draft, update }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16 }}>发布设置</h2>
      <Field label="状态">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {[
            { v: 'draft', l: '草稿', d: '只有管理员能看到' },
            { v: 'live', l: '进行中', d: '公开 · 可报名' },
            { v: 'reviewing', l: '审核中', d: '已截止报名 · 审核中' },
            { v: 'ended', l: '已结束', d: '归档展示' },
          ].map(o => (
            <button key={o.v} type="button" onClick={() => update({ status: o.v })} style={{
              padding: 12, textAlign: 'left', cursor: 'pointer',
              border: '1px solid', borderColor: draft.status === o.v ? 'var(--accent)' : 'var(--border)',
              background: draft.status === o.v ? 'var(--accent-soft)' : 'var(--surface)',
              borderRadius: 8,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{o.l}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{o.d}</div>
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function SectionDanger({ draft, onDelete }) {
  const [confirm, setConfirm] = useStateH('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16, color: 'var(--danger, #DC2626)' }}>危险操作</h2>
      <div style={{ padding: 16, border: '1px solid #FCA5A5', borderRadius: 8, background: '#FEF2F2' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#991B1B', marginBottom: 4 }}>删除这个 hackathon</div>
        <div style={{ fontSize: 12, color: '#7F1D1D', marginBottom: 12, lineHeight: 1.5 }}>
          会一并删除所有报名记录、提交作品、邮件模板。此操作不可逆。
        </div>
        <Field label={<span>输入活动名称 <strong>{draft.name}</strong> 以确认</span>}>
          <input className="input" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={draft.name} />
        </Field>
        <button className="btn btn-danger" disabled={confirm !== draft.name} style={{ marginTop: 12 }} onClick={onDelete}>
          <Icons.Trash size={13} /> 永久删除
        </button>
      </div>
    </div>
  );
}

window.HackathonsList = HackathonsList;
window.HackathonCreate = HackathonCreate;
window.HackathonEdit = HackathonEdit;
