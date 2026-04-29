// Hometown — Events page (community sharing activities)

const { useState: useStateEv } = React;

const EVENTS_DATA = [
  {
    id: 'e1', kind: '分享会', title: '设计工程师的工具箱', date: '5 月 4 日', time: '14:00 — 17:00', location: '上海 · 西岸 Hub', host: 'Avery Chen',
    desc: '从 Figma 插件到 React 组件库 — 看几位设计工程师如何打磨自己的日常工具，聊聊 LLM 时代的设计-开发协作流程。', tags: ['设计工程', '工具', 'Figma'],
    going: 24, capacity: 40, status: 'upcoming', featured: true, color: '#ECFCCB',
  },
  {
    id: 'e2', kind: 'Meetup', title: 'Hometown Meetup #12', date: '5 月 7 日', time: '19:00 — 22:00', location: 'Co-working Space · 静安', host: '社区运营组',
    desc: '每月一次的小镇聚会 · 自由 talk + 闪电分享 · 报名后会发地址。本期主题：「上半年我做过最不务正业的事」。', tags: ['Meetup', '社交'],
    going: 23, capacity: 60, status: 'upcoming', color: '#DBEAFE',
  },
  {
    id: 'e3', kind: '读书会', title: '深夜书房：Pieces of the Action', date: '5 月 10 日', time: '20:00 — 22:00', location: '线上 · Zoom', host: '林知夏',
    desc: 'Vannevar Bush 的回忆录 · 读组织如何运作创新。这次重点讨论第 4-7 章，关于二战期间 OSRD 的运作。建议提前读完。', tags: ['读书', '线上'],
    going: 11, capacity: 30, status: 'upcoming', color: '#FEF3C7',
  },
  {
    id: 'e4', kind: '工作坊', title: '从零搭建一个设计系统', date: '5 月 14 日', time: '10:00 — 18:00', location: '上海 · 张江实验室', host: '陈思源',
    desc: '一整天的实操工作坊 · 跟着搭建一个真实可用的设计系统 · 涵盖 Token · 组件库 · 主题切换 · 文档站。需自带笔记本。', tags: ['工作坊', '实操', '设计'],
    going: 16, capacity: 20, status: 'upcoming', color: '#FCE7F3',
  },
  {
    id: 'e5', kind: 'Hackathon', title: 'Hometown Hackathon 2026', date: '5 月 18-19 日', time: '48 小时不间断', location: '上海 · 西岸艺术中心', host: '组织团队',
    desc: '主题「Tools for Builders」· ¥80,000 奖池 · 6 家公司面试直通 · 当前 47 / 200 人已报名。', tags: ['黑客松', '主舞台'],
    going: 47, capacity: 200, status: 'upcoming', featured: true, color: '#ECFCCB',
  },
  {
    id: 'e6', kind: 'Office Hours', title: '独立开发者 Office Hours', date: '5 月 22 日', time: '20:00 — 22:00', location: '线上 · Discord', host: 'Daniel Wu',
    desc: '每周四晚的开放交流 · 你可以来聊产品定价 · 用户增长 · 也可以只是来听别人聊。这周话题：第一批付费用户。', tags: ['独立开发', '线上'],
    going: 8, capacity: 50, status: 'upcoming', color: '#E0E7FF',
  },
  // past
  {
    id: 'e7', kind: 'Meetup', title: 'Meetup #11 · 设计工程师之夜', date: '3 月 22 日', host: 'Avery Chen', tags: ['Meetup'], going: 38, status: 'past', desc: '38 人参加 · 6 个闪电分享 · 凌晨 2 点散场。',
  },
  {
    id: 'e8', kind: '读书会', title: '读书会：精益创业', date: '2 月 14 日', host: '林知夏', tags: ['读书'], going: 14, status: 'past', desc: '14 人参与 · 重点讨论 MVP 与可衡量学习。',
  },
  {
    id: 'e9', kind: '工作坊', title: 'Design Engineering Workshop', date: '1 月 28 日', host: '林知夏', tags: ['工作坊'], going: 18, status: 'past', desc: '18 位设计工程师参加 · 完整工作日 · 收到全员好评。',
  },
];

function EventsPage({ user, onSignIn }) {
  const [filter, setFilter] = useStateEv('upcoming');
  const [tag, setTag] = useStateEv('all');
  const [going, setGoing] = useStateEv({});

  const allTags = ['all', ...new Set(EVENTS_DATA.flatMap(e => e.tags))];
  let filtered = EVENTS_DATA.filter(e => filter === 'all' || e.status === filter);
  if (tag !== 'all') filtered = filtered.filter(e => e.tags.includes(tag));

  const featured = filtered.filter(e => e.featured);
  const regular = filtered.filter(e => !e.featured);

  function toggleGoing(id) {
    if (!user) { onSignIn(); return; }
    setGoing({ ...going, [id]: !going[id] });
  }

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">活动</h1>
          <p className="page-subtitle">小镇里正在发生的事 — 分享会、读书会、Meetup、Hackathon。</p>
        </div>
        <button className="btn"><Icons.Plus size={14} /> 提议活动</button>
      </div>

      {/* tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'upcoming', label: '即将开始', count: EVENTS_DATA.filter(e => e.status === 'upcoming').length },
          { id: 'past', label: '已结束', count: EVENTS_DATA.filter(e => e.status === 'past').length },
          { id: 'all', label: '全部', count: EVENTS_DATA.length },
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

      {/* tag filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {allTags.map(t => (
          <button
            key={t}
            onClick={() => setTag(t)}
            style={{
              padding: '5px 10px', borderRadius: 999, fontSize: 12,
              background: tag === t ? 'var(--text)' : 'var(--bg-elev)',
              color: tag === t ? '#FFFFFF' : 'var(--text-2)',
              border: '1px solid', borderColor: tag === t ? 'var(--text)' : 'var(--border)',
              cursor: 'pointer', fontWeight: 500,
            }}
          >
            {t === 'all' ? '全部话题' : t}
          </button>
        ))}
      </div>

      {/* featured */}
      {featured.length > 0 && filter !== 'past' && (
        <div style={{ display: 'grid', gridTemplateColumns: featured.length === 1 ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {featured.map(e => <FeaturedEventCard key={e.id} event={e} going={going[e.id]} onToggle={() => toggleGoing(e.id)} />)}
        </div>
      )}

      {/* regular list */}
      <div className="stack" style={{ gap: 12 }}>
        {regular.map(e => <EventRow2 key={e.id} event={e} going={going[e.id]} onToggle={() => toggleGoing(e.id)} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
          没有符合条件的活动
        </div>
      )}
    </div>
  );
}

function FeaturedEventCard({ event: e, going, onToggle }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)' }}>
      <div style={{ height: 96, background: `linear-gradient(135deg, ${e.color} 0%, #FFFFFF 100%)`, padding: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4, opacity: 0.6 }}>{e.kind}</div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text)' }}>{e.title}</div>
        </div>
        <span className="badge badge-success badge-dot" style={{ flexShrink: 0 }}>主舞台</span>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14, fontSize: 13, color: 'var(--text-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icons.Calendar size={14} style={{ color: 'var(--text-3)' }} />
            <span>{e.date}</span>
            {e.time && <span style={{ color: 'var(--text-3)' }}>· {e.time}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icons.Home size={14} style={{ color: 'var(--text-3)' }} />
            <span>{e.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icons.User size={14} style={{ color: 'var(--text-3)' }} />
            <span>主办：{e.host}</span>
          </div>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{e.desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {[0,1,2,3].map(i => (
                <div key={i} className="avatar" style={{ width: 22, height: 22, fontSize: 9, marginLeft: i === 0 ? 0 : -6, border: '2px solid var(--bg)', background: `hsl(${i*73 % 360}, 50%, 60%)` }}>
                  {['陈','M','T','王'][i]}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}><strong style={{ color: 'var(--text)' }}>{e.going}</strong> / {e.capacity} 人已报名</span>
          </div>
          <button className={going ? 'btn' : 'btn btn-primary'} onClick={onToggle}>
            {going ? <><Icons.Check size={14} /> 已报名</> : '我要参加'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventRow2({ event: e, going, onToggle }) {
  const isPast = e.status === 'past';
  return (
    <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, opacity: isPast ? 0.75 : 1 }}>
      <div style={{ width: 64, flexShrink: 0, background: e.color || 'var(--bg-elev)', borderRadius: 8, padding: '10px 8px', textAlign: 'center', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>
          {e.date.split(' ')[0]}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
          {e.date.match(/\d+/)?.[0]}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge" style={{ height: 18, fontSize: 10, padding: '0 6px' }}>{e.kind}</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{e.title}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', gap: 12, marginBottom: 4 }}>
          {e.time && <span>{e.time}</span>}
          {e.location && <span>· {e.location}</span>}
          <span>· 主办 {e.host}</span>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{e.desc}</p>
      </div>

      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
        {!isPast && (
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
            <strong style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{e.going}</strong>{e.capacity ? ` / ${e.capacity}` : ''}
          </span>
        )}
        {isPast ? (
          <span className="badge">已结束 · {e.going} 人</span>
        ) : (
          <button className={going ? 'btn btn-sm' : 'btn btn-primary btn-sm'} onClick={onToggle}>
            {going ? <><Icons.Check size={13} /> 已报名</> : '报名'}
          </button>
        )}
      </div>
    </div>
  );
}

window.EventsPage = EventsPage;
