// Hometown — Projects (gallery + detail + submit)

const { useState: useStateProj, useMemo: useMemoProj } = React;

// Generative cover art — pure CSS / SVG patterns keyed by project's coverPattern
function ProjectCover({ project, height = 180, label = true }) {
  const bg = project.cover || '#0C0A09';
  const isDark = ['#0C0A09', '#0EA5E9', '#10B981', '#A78BFA', '#60A5FA', '#F87171', '#F472B6', '#FB923C', '#FBBF24'].includes(bg);
  const ink = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(12,10,9,0.55)';
  const inkStrong = isDark ? '#FFFFFF' : '#0C0A09';

  const pattern = project.coverPattern || 'grid';
  let patternEl = null;
  if (pattern === 'grid') {
    patternEl = (
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={`g-${project.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={ink} strokeWidth="0.5" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${project.id})`} />
      </svg>
    );
  } else if (pattern === 'wave') {
    patternEl = (
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        {[0, 30, 60, 90, 120, 150].map(y => (
          <path key={y} d={`M 0 ${y + 100} Q 100 ${y + 70} 200 ${y + 100} T 400 ${y + 100}`} fill="none" stroke={ink} strokeWidth="1.2" opacity="0.5" />
        ))}
      </svg>
    );
  } else if (pattern === 'lines') {
    patternEl = (
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={`l-${project.id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={ink} strokeWidth="1" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#l-${project.id})`} />
      </svg>
    );
  } else if (pattern === 'dots') {
    patternEl = (
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={`d-${project.id}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="9" cy="9" r="1.5" fill={ink} opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#d-${project.id})`} />
      </svg>
    );
  } else if (pattern === 'circles') {
    patternEl = (
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        {[0,1,2,3,4].map(i => <circle key={i} cx={200} cy={100} r={20 + i * 28} fill="none" stroke={ink} strokeWidth="1" opacity={0.6 - i * 0.1} />)}
      </svg>
    );
  } else if (pattern === 'leaves') {
    patternEl = (
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        {[40, 120, 200, 280, 360].map((x, i) => (
          <path key={x} d={`M ${x} 200 Q ${x - 18} 140 ${x} 80 Q ${x + 18} 140 ${x} 200`} fill={ink} opacity={0.4 + (i % 2) * 0.2} />
        ))}
      </svg>
    );
  } else if (pattern === 'rings') {
    patternEl = (
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        {[0,1,2,3].map(i => <circle key={i} cx={350 - i * 80} cy={50 + i * 40} r="28" fill="none" stroke={ink} strokeWidth="1.5" opacity="0.55" />)}
      </svg>
    );
  } else if (pattern === 'hex') {
    patternEl = (
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={`h-${project.id}`} width="28" height="32" patternUnits="userSpaceOnUse">
            <polygon points="14,2 26,9 26,23 14,30 2,23 2,9" fill="none" stroke={ink} strokeWidth="1" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#h-${project.id})`} />
      </svg>
    );
  } else if (pattern === 'waves') {
    patternEl = (
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        {[0,1,2,3,4,5,6].map(i => (
          <path key={i} d={`M 0 ${30 + i * 25} Q 100 ${10 + i * 25} 200 ${30 + i * 25} T 400 ${30 + i * 25}`} fill="none" stroke={ink} strokeWidth="1" opacity="0.45" />
        ))}
      </svg>
    );
  } else if (pattern === 'bars') {
    patternEl = (
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        {[40, 80, 120, 160, 200, 240, 280, 320].map((x, i) => {
          const h = [60, 90, 50, 110, 70, 130, 80, 100][i];
          return <rect key={x} x={x} y={200 - h} width="22" height={h} fill={ink} opacity="0.55" />;
        })}
      </svg>
    );
  }

  return (
    <div style={{
      position: 'relative', width: '100%', height,
      background: bg,
      overflow: 'hidden',
    }}>
      {patternEl}
      {label && (
        <div style={{ position: 'absolute', left: 16, bottom: 14, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: inkStrong, opacity: 0.85, fontWeight: 600 }}>
          {project.name}
        </div>
      )}
    </div>
  );
}

// ─────────── Gallery ───────────
function ProjectsGallery({ user, onOpenProject, onSubmit, onSignIn }) {
  const projects = window.HometownData.STARTER_PROJECTS;
  const tracks = window.HometownData.PROJECT_TRACKS;

  const [trackFilter, setTrackFilter] = useStateProj('all');
  const [search, setSearch] = useStateProj('');
  const [sort, setSort] = useStateProj('hot');
  const [liked, setLiked] = useStateProj({});

  const filtered = useMemoProj(() => {
    let res = projects.slice();
    if (trackFilter !== 'all') res = res.filter(p => p.track === trackFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.tech.some(t => t.toLowerCase().includes(q))
      );
    }
    if (sort === 'hot') res.sort((a, b) => b.likes - a.likes);
    else if (sort === 'new') res.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    return res;
  }, [trackFilter, search, sort]);

  function toggleLike(id, e) {
    e.stopPropagation();
    if (!user) { onSignIn(); return; }
    setLiked(s => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div className="page" style={{ maxWidth: 1240 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">项目展示</h1>
          <p className="page-subtitle">Hometown Hackathon 2026 · 48 小时 · 47 支队伍 · {projects.length} 个完赛作品</p>
        </div>
        <button className="btn btn-primary" onClick={onSubmit}>
          <Icons.Plus size={14} /> 提交我的项目
        </button>
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 220, maxWidth: 380 }}>
          <Icons.Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input
            className="input"
            placeholder="搜索项目名 / 简介 / 技术栈"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 34 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--bg-elev-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
          {[{ id: 'hot', label: '🔥 最受欢迎' }, { id: 'new', label: '🕐 最新提交' }].map(s => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              style={{
                padding: '6px 12px', fontSize: 12, fontWeight: 500,
                background: sort === s.id ? 'var(--surface)' : 'transparent',
                border: 'none', borderRadius: 5,
                color: sort === s.id ? 'var(--text)' : 'var(--text-2)',
                cursor: 'pointer',
                boxShadow: sort === s.id ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
              }}
            >{s.label}</button>
          ))}
        </div>
      </div>

      {/* Track chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        <TrackChip active={trackFilter === 'all'} onClick={() => setTrackFilter('all')}>
          全部 <span style={{ color: 'var(--text-3)', marginLeft: 4 }}>{projects.length}</span>
        </TrackChip>
        {tracks.map(t => {
          const count = projects.filter(p => p.track === t.id).length;
          return (
            <TrackChip key={t.id} active={trackFilter === t.id} onClick={() => setTrackFilter(t.id)} dot={t.color}>
              {t.label} <span style={{ color: 'var(--text-3)', marginLeft: 4 }}>{count}</span>
            </TrackChip>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map(p => (
          <ProjectCard
            key={p.id}
            project={p}
            track={tracks.find(t => t.id === p.track)}
            liked={liked[p.id]}
            onLike={(e) => toggleLike(p.id, e)}
            onClick={() => onOpenProject(p)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
          没有符合条件的项目
        </div>
      )}
    </div>
  );
}

function TrackChip({ active, onClick, children, dot }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 11px', borderRadius: 999, fontSize: 12, fontWeight: 500,
        background: active ? 'var(--text)' : 'var(--surface)',
        color: active ? '#FFFFFF' : 'var(--text-2)',
        border: '1px solid', borderColor: active ? 'var(--text)' : 'var(--border)',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
      }}
    >
      {dot && <span style={{ width: 8, height: 8, borderRadius: 2, background: dot, flexShrink: 0 }} />}
      {children}
    </button>
  );
}

function ProjectCard({ project: p, track, liked, onLike, onClick }) {
  return (
    <article
      className="card"
      onClick={onClick}
      style={{
        padding: 0, overflow: 'hidden', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        transition: 'border-color .12s, transform .04s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <ProjectCover project={p} height={148} />

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
            {p.name}
            {p.winner && <span style={{ fontSize: 10, marginLeft: 6, padding: '2px 6px', background: '#FEF3C7', color: '#A16207', borderRadius: 4, fontWeight: 600, verticalAlign: 'middle' }}>🏆 {p.winner}</span>}
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 36 }}>
          {p.tagline}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {p.tech.slice(0, 4).map(t => (
            <span key={t} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'var(--bg-elev-2)', color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{t}</span>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <div style={{ display: 'flex' }}>
              {p.team.slice(0, 3).map((m, i) => (
                <div key={i} className="avatar" style={{ width: 20, height: 20, fontSize: 9, marginLeft: i === 0 ? 0 : -5, border: '1.5px solid var(--surface)' }}>{m.avatar}</div>
              ))}
            </div>
            {track && (
              <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {track.label}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button
              onClick={onLike}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                fontSize: 11, color: liked ? '#DC2626' : 'var(--text-2)', fontWeight: 600,
              }}
            >
              <span style={{ fontSize: 12 }}>{liked ? '❤️' : '🤍'}</span>
              {p.likes + (liked ? 1 : 0)}
            </button>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>💬 {p.comments}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────── Detail page ───────────
function ProjectDetail({ project: p, user, onBack, onSignIn }) {
  const tracks = window.HometownData.PROJECT_TRACKS;
  const track = tracks.find(t => t.id === p.track);
  const [liked, setLiked] = useStateProj(false);
  const [followingTeam, setFollowingTeam] = useStateProj({});
  const [comment, setComment] = useStateProj('');
  const [comments, setComments] = useStateProj([
    { author: 'Maya Patel', avatar: 'M', when: '5h', text: '看了 demo — 时间戳暂停那个想法太聪明了。能加一个分享片段的功能吗？' },
    { author: 'Daniel Wu', avatar: 'D', when: '3h', text: '订阅了。Web 版会做吗？' },
  ]);

  function postComment() {
    if (!comment.trim()) return;
    if (!user) { onSignIn(); return; }
    setComments([...comments, { author: user.name, avatar: user.avatar, when: 'now', text: comment.trim() }]);
    setComment('');
  }

  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        <Icons.ChevronLeft size={14} /> 返回项目展示
      </button>

      {/* Hero */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        <ProjectCover project={p} height={260} label={false} />
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                {track && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-2)', fontWeight: 500 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: track.color }} /> {track.label}
                </span>}
                {p.winner && <span style={{ fontSize: 11, padding: '3px 8px', background: '#FEF3C7', color: '#A16207', borderRadius: 4, fontWeight: 600 }}>🏆 {p.winner}</span>}
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>· {p.submittedAt}</span>
              </div>
              <h1 style={{ margin: '0 0 6px', fontSize: 28, letterSpacing: '-0.02em', fontWeight: 700 }}>{p.name}</h1>
              <p style={{ margin: 0, fontSize: 16, color: 'var(--text-2)', lineHeight: 1.5 }}>{p.tagline}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={liked ? 'btn' : 'btn'}
                onClick={() => { if (!user) { onSignIn(); return; } setLiked(!liked); }}
                style={liked ? { borderColor: '#FCA5A5', background: '#FEF2F2', color: '#DC2626' } : {}}
              >
                <span>{liked ? '❤️' : '🤍'}</span>
                <span>{p.likes + (liked ? 1 : 0)}</span>
              </button>
              {p.demo && <a href="#" onClick={e => e.preventDefault()} className="btn btn-primary">
                <Icons.Eye size={14} /> 打开 Demo
              </a>}
            </div>
          </div>
        </div>
      </div>

      {/* 2-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 24, alignItems: 'start' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Demo video placeholder */}
          {p.video && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                aspectRatio: '16/9', background: '#0C0A09', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: 'linear-gradient(135deg, #1F2937 0%, #0C0A09 100%)',
              }}>
                <button style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer',
                  display: 'grid', placeItems: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0C0A09"><path d="M8 5v14l11-7z" /></svg>
                </button>
                <div style={{ position: 'absolute', bottom: 14, left: 16, color: '#FFFFFF', fontSize: 12, opacity: 0.85, fontFamily: 'var(--font-mono)' }}>
                  ▸ 演示视频 · 2:14
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="card">
            <h3 style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>项目介绍</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'var(--text)' }}>{p.description}</p>
          </div>

          {/* Comments */}
          <div className="card">
            <h3 style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>评论 · {comments.length}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
              {comments.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 10 }}>
                  <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, flexShrink: 0 }}>{c.avatar}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 12, marginBottom: 2 }}>
                      <strong>{c.author}</strong>
                      <span style={{ color: 'var(--text-3)', marginLeft: 8 }}>{c.when}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <input
                className="input"
                placeholder={user ? '说点什么…' : '登录后参与讨论'}
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && postComment()}
                disabled={!user}
              />
              <button className="btn btn-primary" onClick={postComment} disabled={!user || !comment.trim()}>发送</button>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 24 }}>
          {/* Links */}
          <div className="card">
            <h4 style={{ margin: '0 0 12px', fontSize: 11, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>链接</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {p.demo && <DetailLink icon="Eye" label="在线 Demo" value={p.demo} />}
              {p.github && <DetailLink icon="Github" label="代码仓库" value={p.github} />}
              {p.video && <DetailLink icon="Activity" label="演示视频" value="点击播放" />}
            </div>
          </div>

          {/* Team */}
          <div className="card">
            <h4 style={{ margin: '0 0 12px', fontSize: 11, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>团队 · {p.team.length} 人</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {p.team.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0 }}>{m.avatar}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{m.role}</div>
                  </div>
                  <button
                    className="btn btn-sm"
                    onClick={() => { if (!user) { onSignIn(); return; } setFollowingTeam(s => ({ ...s, [m.name]: !s[m.name] })); }}
                    style={followingTeam[m.name] ? { background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: '#D9F99D' } : {}}
                  >
                    {followingTeam[m.name] ? <><Icons.Check size={12} /> 已关注</> : '关注'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tech */}
          <div className="card">
            <h4 style={{ margin: '0 0 12px', fontSize: 11, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>技术栈</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {p.tech.map(t => (
                <span key={t} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'var(--bg-elev-2)', color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Seeking */}
          {p.seeking && p.seeking.length > 0 && (
            <div className="card" style={{ background: 'var(--accent-soft)', borderColor: '#D9F99D' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>📣 正在寻找</h4>
              <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>
                {p.seeking.map(s => <li key={s}>{s}</li>)}
              </ul>
              <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}>
                <Icons.Send size={12} /> 联系团队
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function DetailLink({ icon, label, value }) {
  const Ico = Icons[icon];
  return (
    <a href="#" onClick={e => e.preventDefault()} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', borderRadius: 6,
      background: 'var(--bg-elev)', border: '1px solid var(--border)',
      color: 'var(--text)', textDecoration: 'none', fontSize: 12,
    }}>
      <Ico size={14} style={{ color: 'var(--text-3)' }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
      </div>
      <Icons.ChevronRight size={12} style={{ color: 'var(--text-3)' }} />
    </a>
  );
}

window.ProjectsGallery = ProjectsGallery;
window.ProjectDetail = ProjectDetail;
window.ProjectCover = ProjectCover;
