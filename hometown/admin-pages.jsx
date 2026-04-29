// Hometown — Admin pages: Forms list, Review queue (Gmail-style)

const { useState: useStateAdmin, useEffect: useEffectAdmin } = React;

// ─────────────── Forms List ───────────────
function FormsList({ forms, onOpen, onCreateNew }) {
  const [filter, setFilter] = useStateAdmin('all');
  const filtered = filter === 'all' ? forms : forms.filter(f => f.status === filter);

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">表单</h1>
          <p className="page-subtitle">管理你的所有表单 — 报名、调研、招募。</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <Icons.Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input className="input" placeholder="搜索表单..." style={{ width: 220, paddingLeft: 32 }} />
          </div>
          <button className="btn btn-primary" onClick={onCreateNew}><Icons.Plus size={14} /> 新建表单</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'all', label: '全部', count: forms.length },
          { id: 'live', label: '已发布', count: forms.filter(f => f.status === 'live').length },
          { id: 'draft', label: '草稿', count: forms.filter(f => f.status === 'draft').length },
          { id: 'closed', label: '已关闭', count: forms.filter(f => f.status === 'closed').length },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            style={{
              padding: '10px 14px', background: 'transparent', border: 'none',
              color: filter === t.id ? 'var(--text)' : 'var(--text-3)',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              borderBottom: '2px solid', borderColor: filter === t.id ? 'var(--accent)' : 'transparent',
              marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            {t.label}
            <span style={{ fontSize: 11, color: 'var(--text-3)', padding: '0 6px', background: 'var(--bg-elev-2)', borderRadius: 4 }}>{t.count}</span>
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 100px 130px 130px 40px', padding: '10px 16px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--bg)' }}>
          <div>名称</div>
          <div>状态</div>
          <div style={{ textAlign: 'right' }}>响应数</div>
          <div style={{ textAlign: 'right' }}>创建时间</div>
          <div style={{ textAlign: 'right' }}>更新时间</div>
          <div></div>
        </div>
        {filtered.map(f => (
          <button
            key={f.id}
            onClick={() => onOpen(f)}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 110px 100px 130px 130px 40px',
              padding: '14px 16px', border: 'none', background: 'transparent',
              borderBottom: '1px solid var(--border)', textAlign: 'left', cursor: 'pointer',
              alignItems: 'center', color: 'var(--text)', width: '100%',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elev)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{f.description}</div>
            </div>
            <div>
              {f.status === 'live' && <span className="badge badge-success badge-dot">已发布</span>}
              {f.status === 'draft' && <span className="badge">草稿</span>}
              {f.status === 'closed' && <span className="badge">已关闭</span>}
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{f.responses}</div>
            <div style={{ textAlign: 'right', color: 'var(--text-3)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{f.createdAt}</div>
            <div style={{ textAlign: 'right', color: 'var(--text-3)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{f.updatedAt}</div>
            <div style={{ textAlign: 'right', color: 'var(--text-3)' }}><Icons.ChevronRight size={14} /></div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────── Review Queue (Gmail-style) ───────────────
function ReviewQueue({ applications, setApplications, onOpenEmail }) {
  const [filter, setFilter] = useStateAdmin('pending');
  const [selectedId, setSelectedId] = useStateAdmin(applications.find(a => a.status === 'pending')?.id);
  const [toast, setToast] = useStateAdmin(null);

  const filtered = applications.filter(a => filter === 'all' ? true : a.status === filter);
  const selected = applications.find(a => a.id === selectedId);
  const idx = filtered.findIndex(a => a.id === selectedId);

  function setStatus(id, status) {
    setApplications(applications.map(a => a.id === id ? { ...a, status } : a));
    if (status === 'approved') setToast('已批准 · 通过邮件已发送');
    if (status === 'rejected') setToast('已拒绝 · 通知邮件已发送');
    setTimeout(() => setToast(null), 2400);
    // jump to next pending
    const nextPending = filtered.find((a, i) => i > idx && a.status === 'pending');
    if (nextPending) setSelectedId(nextPending.id);
  }

  function toggleStar(id) {
    setApplications(applications.map(a => a.id === id ? { ...a, starred: !a.starred } : a));
  }

  // keyboard shortcuts
  useEffectAdmin(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); const n = filtered[Math.min(filtered.length - 1, idx + 1)]; if (n) setSelectedId(n.id); }
      if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); const n = filtered[Math.max(0, idx - 1)]; if (n) setSelectedId(n.id); }
      if (e.key === 'e' && selected) setStatus(selected.id, 'approved');
      if (e.key === 'x' && selected) setStatus(selected.id, 'rejected');
      if (e.key === 's' && selected) toggleStar(selected.id);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px minmax(440px, 1fr)', height: '100%', minWidth: 880, overflow: 'auto' }}>
      {/* LIST */}
      <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>报名审核</div>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{filtered.length} 条</span>
          </div>
          <div style={{ position: 'relative' }}>
            <Icons.Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input className="input" placeholder="搜索申请者..." style={{ paddingLeft: 32, height: 32, fontSize: 12 }} />
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {[
              { id: 'pending', label: '待审核', n: applications.filter(a => a.status === 'pending').length },
              { id: 'approved', label: '已通过', n: applications.filter(a => a.status === 'approved').length },
              { id: 'rejected', label: '已拒绝', n: applications.filter(a => a.status === 'rejected').length },
              { id: 'all', label: '全部', n: applications.length },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                style={{
                  padding: '4px 10px', borderRadius: 999, border: '1px solid',
                  borderColor: filter === t.id ? 'var(--border-strong)' : 'transparent',
                  background: filter === t.id ? 'var(--bg-elev-2)' : 'transparent',
                  color: filter === t.id ? 'var(--text)' : 'var(--text-2)',
                  fontSize: 11, fontWeight: 500, cursor: 'pointer',
                }}
              >
                {t.label} <span style={{ color: 'var(--text-3)', marginLeft: 2 }}>{t.n}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          {filtered.map(a => (
            <button
              key={a.id}
              onClick={() => setSelectedId(a.id)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px',
                background: selectedId === a.id ? 'var(--bg-elev)' : 'transparent',
                borderLeft: '2px solid', borderLeftColor: selectedId === a.id ? 'var(--accent)' : 'transparent',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer', width: '100%', textAlign: 'left', color: 'var(--text)',
              }}
              onMouseEnter={e => { if (selectedId !== a.id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { if (selectedId !== a.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="avatar" style={{ width: 32, height: 32, fontSize: 13, flexShrink: 0, background: `hsl(${a.id.charCodeAt(1)*37 % 360}, 50%, 55%)` }}>{a.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                  {a.starred && <Icons.Star size={12} style={{ color: '#FBBF24', fill: '#FBBF24' }} />}
                  <span style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}>{a.submittedAt.split(' ')[0]}{' '}{a.submittedAt.split(' ')[1]}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="badge" style={{ height: 16, fontSize: 10, padding: '0 6px' }}>{a.role}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.school}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                  {a.idea}
                </div>
                {a.status !== 'pending' && (
                  <div style={{ marginTop: 6 }}>
                    {a.status === 'approved' && <span className="badge badge-success badge-dot" style={{ height: 16, fontSize: 10 }}>已通过</span>}
                    {a.status === 'rejected' && <span className="badge badge-danger badge-dot" style={{ height: 16, fontSize: 10 }}>已拒绝</span>}
                  </div>
                )}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              <Icons.Inbox size={24} style={{ marginBottom: 8, opacity: 0.5 }} /><br />
              没有 {filter === 'pending' ? '待审核' : filter === 'approved' ? '已通过' : '已拒绝'} 的申请
            </div>
          )}
        </div>
      </div>

      {/* DETAIL */}
      <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {selected ? (
          <ReviewDetail
            application={selected}
            onApprove={() => setStatus(selected.id, 'approved')}
            onReject={() => setStatus(selected.id, 'rejected')}
            onStar={() => toggleStar(selected.id)}
            onOpenEmail={onOpenEmail}
          />
        ) : (
          <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--text-3)' }}>
            选择左侧的申请进行审核
          </div>
        )}
      </div>

      {toast && (
        <div className="toast">
          <div className="toast-icon">✓</div> {toast}
        </div>
      )}
    </div>
  );
}

function ReviewDetail({ application, onApprove, onReject, onStar, onOpenEmail }) {
  const a = application;
  return (
    <div>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={onStar} title="标星 (S)">
          <Icons.Star size={14} style={a.starred ? { color: '#FBBF24', fill: '#FBBF24' } : {}} />
        </button>
        <button className="btn btn-ghost btn-sm" title="存档"><Icons.Archive size={14} /></button>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-3)', marginRight: 8, flexShrink: 0 }}>
          <span className="kbd-key">J</span><span className="kbd-key">K</span>
        </div>
        {a.status === 'pending' ? (
          <>
            <button className="btn btn-danger btn-sm" onClick={onReject}>
              <Icons.X size={14} /> 拒绝 <span className="kbd-key" style={{ marginLeft: 4 }}>X</span>
            </button>
            <button className="btn btn-primary btn-sm" onClick={onApprove}>
              <Icons.Check size={14} /> 批准 <span className="kbd-key" style={{ marginLeft: 4, background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF' }}>E</span>
            </button>
          </>
        ) : (
          <span className={`badge ${a.status === 'approved' ? 'badge-success' : 'badge-danger'} badge-dot`}>
            {a.status === 'approved' ? '已通过' : '已拒绝'}
          </span>
        )}
      </div>

      <div style={{ padding: '28px 24px', maxWidth: 760 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div className="avatar" style={{ width: 56, height: 56, fontSize: 22, background: `hsl(${a.id.charCodeAt(1)*37 % 360}, 50%, 55%)` }}>{a.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 2 }}>{a.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="mono">@{a.handle}</span>
              <span style={{ color: 'var(--text-3)' }}>·</span>
              <span>{a.school}</span>
              <span style={{ color: 'var(--text-3)' }}>·</span>
              <span>提交于 {a.submittedAt}</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          <DetailRow label="邮箱" value={<span className="mono">{a.email}</span>} />
          <DetailRow label="主要角色" value={<span className="badge">{a.role}</span>} />
          <DetailRow label="技术栈" value={
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {a.skills.map(s => <span key={s} className="badge">{s}</span>)}
            </div>
          } />
          <DetailRow label="GitHub / 作品集" value={<a href="#" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 13, textDecoration: 'none' }}>{a.github} ↗</a>} />
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
            项目想法
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'var(--text)' }}>{a.idea}</p>
        </div>

        <div className="card" style={{ background: 'var(--bg)', borderStyle: 'dashed' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              批准后将自动发送
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onOpenEmail}><Icons.Eye size={12} /> 查看模板</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 6 }}>
            <div style={{ width: 28, height: 28, background: 'var(--accent-soft)', borderRadius: 6, display: 'grid', placeItems: 'center' }}>
              <Icons.Mail size={14} style={{ color: 'var(--accent)' }} />
            </div>
            <div style={{ flex: 1, fontSize: 12 }}>
              <div style={{ color: 'var(--text)', fontWeight: 500 }}>🎉 你被录取了 — Hometown Hackathon 2026</div>
              <div style={{ color: 'var(--text-3)' }}>发送至 {a.email}</div>
            </div>
          </div>
        </div>

        {a.status === 'pending' && (
          <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--text-2)' }}>
            <Icons.Sparkle size={14} style={{ color: 'var(--accent)' }} />
            提示：用 <span className="kbd-key">E</span> 批准、<span className="kbd-key">X</span> 拒绝、<span className="kbd-key">S</span> 标星 — 不用离开键盘。
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', padding: '12px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center', minHeight: 44, gap: 8 }}>
      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{label}</div>
      <div style={{ fontSize: 13 }}>{value}</div>
    </div>
  );
}

window.FormsList = FormsList;
window.ReviewQueue = ReviewQueue;
