// Hometown — Project submit (post-hackathon flow) + Members directory

const { useState: useStateP2, useMemo: useMemoP2 } = React;

// ─────────────── Submit page ───────────────
function ProjectSubmit({ user, onSignIn, onSubmitted, onBack }) {
  const tracks = window.HometownData.PROJECT_TRACKS;
  const allMembers = window.HometownData.COMMUNITY_MEMBERS;

  const [step, setStep] = useStateP2(user ? 'form' : 'auth');
  const [done, setDone] = useStateP2(false);
  const [form, setForm] = useStateP2({
    name: '', track: tracks[0].id, tagline: '', description: '',
    demo: '', github: '', video: '',
    tech: [], techInput: '',
    team: user ? [{ name: user.name, avatar: user.avatar, role: '队长' }] : [],
    seeking: [],
    teamSearch: '',
  });

  if (!user) {
    return (
      <div className="page" style={{ maxWidth: 520, paddingTop: 80 }}>
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <h2 style={{ margin: '0 0 6px', fontSize: 18 }}>需要登录后提交</h2>
          <p style={{ margin: '0 0 20px', color: 'var(--text-2)', fontSize: 13 }}>项目提交关联到你的队伍 — 请先登录。</p>
          <button className="btn btn-primary" onClick={onSignIn}>登录 / 注册</button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="page" style={{ maxWidth: 560, paddingTop: 60 }}>
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
            background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', color: 'var(--accent)',
          }}>
            <Icons.Check size={28} />
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>项目已提交</h2>
          <p style={{ margin: '0 0 24px', color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text)' }}>{form.name}</strong> 已加入项目展示页 · 评委会在 24 小时内开始审阅 · 你会在邮箱收到通知。
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="btn" onClick={onBack}>返回项目展示</button>
            <button className="btn btn-primary" onClick={onSubmitted}>查看我的提交</button>
          </div>
        </div>
      </div>
    );
  }

  function update(patch) { setForm(f => ({ ...f, ...patch })); }

  function addTech() {
    const t = form.techInput.trim();
    if (!t || form.tech.includes(t)) return;
    update({ tech: [...form.tech, t], techInput: '' });
  }
  function removeTech(t) { update({ tech: form.tech.filter(x => x !== t) }); }

  function toggleSeeking(s) {
    update({ seeking: form.seeking.includes(s) ? form.seeking.filter(x => x !== s) : [...form.seeking, s] });
  }

  function addTeamMember(m) {
    if (form.team.find(t => t.name === m.name)) return;
    update({ team: [...form.team, { name: m.name, avatar: m.avatar, role: m.role }], teamSearch: '' });
  }
  function removeTeamMember(name) {
    if (name === user.name) return;
    update({ team: form.team.filter(t => t.name !== name) });
  }

  const teamMatches = form.teamSearch.trim()
    ? allMembers.filter(m =>
        !form.team.find(t => t.name === m.name) &&
        (m.name.toLowerCase().includes(form.teamSearch.toLowerCase()) || m.handle.includes(form.teamSearch.toLowerCase()))
      ).slice(0, 5)
    : [];

  const valid = form.name.trim() && form.tagline.trim() && form.description.trim();

  function submit() {
    if (!valid) return;
    setDone(true);
  }

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }}>
        <Icons.ChevronLeft size={14} /> 取消
      </button>

      <div className="page-header" style={{ borderBottom: 'none', marginBottom: 4, paddingBottom: 0 }}>
        <div>
          <h1 className="page-title">提交项目</h1>
          <p className="page-subtitle">Hometown Hackathon 2026 · 截止：5 月 19 日 18:00 · 剩余 02:18:43</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {/* Section: Basics */}
        <FormSection number="1" title="基础信息">
          <Field label="项目名称" required>
            <input className="input input-lg" value={form.name} onChange={e => update({ name: e.target.value })} placeholder="给你的作品起一个好记的名字" maxLength={40} />
          </Field>
          <Field label="一句话简介" required help={`${form.tagline.length} / 80`}>
            <input className="input" value={form.tagline} onChange={e => update({ tagline: e.target.value.slice(0, 80) })} placeholder="一句话讲清楚你做了什么" />
          </Field>
          <Field label="所属赛道" required>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {tracks.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => update({ track: t.id })}
                  style={{
                    padding: '12px 14px', textAlign: 'left',
                    border: '1px solid', borderColor: form.track === t.id ? 'var(--accent)' : 'var(--border)',
                    background: form.track === t.id ? 'var(--accent-soft)' : 'var(--surface)',
                    borderRadius: 8, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <span style={{ width: 20, height: 20, borderRadius: 4, background: t.color, flexShrink: 0, border: '1px solid rgba(0,0,0,0.06)' }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: form.track === t.id ? 'var(--accent)' : 'var(--text)' }}>{t.label}</span>
                </button>
              ))}
            </div>
          </Field>
        </FormSection>

        {/* Section: Description */}
        <FormSection number="2" title="项目详情">
          <Field label="详细描述" required help="支持 Markdown · 至少 50 字">
            <textarea
              className="input textarea"
              style={{ minHeight: 140, fontFamily: 'var(--font-mono)', fontSize: 13 }}
              value={form.description}
              onChange={e => update({ description: e.target.value })}
              placeholder="## 我们做了什么&#10;&#10;讲讲你的项目 · 解决什么问题 · 用了什么技术 · 48 小时里的关键决策…"
            />
          </Field>
          <Field label="技术栈" help="按回车添加 · 例如 React / Rust / Figma">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: 8, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-elev)', minHeight: 44 }}>
              {form.tech.map(t => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '3px 8px', borderRadius: 4, background: 'var(--surface)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
                  {t}
                  <button onClick={() => removeTech(t)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', color: 'var(--text-3)', padding: 0 }}>
                    <Icons.X size={11} />
                  </button>
                </span>
              ))}
              <input
                value={form.techInput}
                onChange={e => update({ techInput: e.target.value })}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                placeholder={form.tech.length === 0 ? '输入后按回车' : ''}
                style={{ flex: 1, minWidth: 80, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </Field>
        </FormSection>

        {/* Section: Links */}
        <FormSection number="3" title="链接 · 演示">
          <Field label="在线 Demo URL"><input className="input" value={form.demo} onChange={e => update({ demo: e.target.value })} placeholder="https://your-demo.com" /></Field>
          <Field label="GitHub / 代码仓库"><input className="input" value={form.github} onChange={e => update({ github: e.target.value })} placeholder="github.com/yourname/repo" /></Field>
          <Field label="演示视频 URL" help="YouTube / Bilibili / 直传 mp4 都可"><input className="input" value={form.video} onChange={e => update({ video: e.target.value })} placeholder="https://youtu.be/..." /></Field>
        </FormSection>

        {/* Section: Team */}
        <FormSection number="4" title="团队成员">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
            {form.team.map(m => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-elev)', borderRadius: 6, border: '1px solid var(--border)' }}>
                <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{m.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{m.role}</div>
                </div>
                {m.name !== user.name ? (
                  <button onClick={() => removeTeamMember(m.name)} className="btn btn-ghost btn-sm">
                    <Icons.X size={13} />
                  </button>
                ) : (
                  <span style={{ fontSize: 10, padding: '2px 6px', background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: 4, fontWeight: 600 }}>队长</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Icons.Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input
              className="input"
              placeholder="按姓名 / @handle 搜索社区成员邀请加入"
              value={form.teamSearch}
              onChange={e => update({ teamSearch: e.target.value })}
              style={{ paddingLeft: 34 }}
            />
            {teamMatches.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', marginTop: 4, left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: 'var(--shadow-pop)', zIndex: 10, overflow: 'hidden' }}>
                {teamMatches.map(m => (
                  <button key={m.id} onClick={() => addTeamMember(m)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="avatar" style={{ width: 26, height: 26, fontSize: 11, background: m.avatarColor }}>{m.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13 }}>{m.name} <span style={{ color: 'var(--text-3)' }}>@{m.handle}</span></div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{m.role} · {m.city}</div>
                    </div>
                    <Icons.Plus size={14} style={{ color: 'var(--text-3)' }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormSection>

        {/* Section: Seeking */}
        <FormSection number="5" title="寻找合作（可选）" last>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--text-2)' }}>勾选后，会在项目卡片上显眼展示，让感兴趣的人主动联系你。</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['招募团队成员', '寻找早期内测用户', '寻找投资人', '寻找设计协作', '寻找客户 / 合作伙伴'].map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6, cursor: 'pointer', background: form.seeking.includes(s) ? 'var(--accent-soft)' : 'var(--bg-elev)', border: '1px solid', borderColor: form.seeking.includes(s) ? '#D9F99D' : 'var(--border)' }}>
                <input type="checkbox" checked={form.seeking.includes(s)} onChange={() => toggleSeeking(s)} style={{ accentColor: 'var(--accent)' }} />
                <span style={{ fontSize: 13, color: form.seeking.includes(s) ? 'var(--accent)' : 'var(--text)', fontWeight: form.seeking.includes(s) ? 500 : 400 }}>{s}</span>
              </label>
            ))}
          </div>
        </FormSection>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-elev)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{valid ? '✓ 信息完整 · 可提交' : '请填写带 * 号的必填项'}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn">保存草稿</button>
            <button className="btn btn-primary" disabled={!valid} onClick={submit}>
              <Icons.Send size={13} /> 正式提交
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSection({ number, title, children, last }) {
  return (
    <div style={{ padding: '20px 24px', borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--text)', color: '#FFF', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{number}</span>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, required, help, children }) {
  return (
    <div>
      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>
          {label} {required && <span style={{ color: 'var(--danger, #DC2626)' }}>*</span>}
        </span>
        {help && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{help}</span>}
      </label>
      {children}
    </div>
  );
}


// ─────────────── Members Directory ───────────────
function MembersDirectory({ user, onSignIn }) {
  const members = window.HometownData.COMMUNITY_MEMBERS;

  const [tab, setTab] = useStateP2('all');
  const [role, setRole] = useStateP2('all');
  const [city, setCity] = useStateP2('all');
  const [skill, setSkill] = useStateP2('all');
  const [search, setSearch] = useStateP2('');
  const [following, setFollowing] = useStateP2(() => {
    const init = {};
    members.forEach(m => { if (m.isFollowing) init[m.id] = true; });
    return init;
  });

  const cities = useMemoP2(() => ['all', ...Array.from(new Set(members.map(m => m.city)))], []);
  const skills = useMemoP2(() => {
    const all = new Set();
    members.forEach(m => m.skills.forEach(s => all.add(s)));
    return ['all', ...Array.from(all).sort()];
  }, []);

  const filtered = useMemoP2(() => {
    let res = members.slice();
    if (tab === 'new') res = res.filter(m => m.isNew);
    else if (tab === 'following') res = res.filter(m => following[m.id]);
    if (role !== 'all') res = res.filter(m => m.role === role);
    if (city !== 'all') res = res.filter(m => m.city === city);
    if (skill !== 'all') res = res.filter(m => m.skills.includes(skill));
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.handle.includes(q) ||
        m.tagline.toLowerCase().includes(q) ||
        m.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    return res;
  }, [tab, role, city, skill, search, following]);

  function toggleFollow(id) {
    if (!user) { onSignIn(); return; }
    setFollowing(s => ({ ...s, [id]: !s[id] }));
  }

  const stats = {
    all: members.length,
    new: members.filter(m => m.isNew).length,
    following: Object.values(following).filter(Boolean).length,
  };

  return (
    <div className="page" style={{ maxWidth: 1240 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">成员广场</h1>
          <p className="page-subtitle">{members.length} 位社区成员 · 来自 {new Set(members.map(m => m.city)).size} 个城市 · 找人聊聊或一起做点东西</p>
        </div>
        <button className="btn"><Icons.Send size={14} /> 邀请新成员</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'all', label: '全部成员', count: stats.all },
          { id: 'new', label: '🌱 新加入', count: stats.new },
          { id: 'following', label: '⭐ 我关注的', count: stats.following },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 14px', background: 'transparent', border: 'none',
              color: tab === t.id ? 'var(--text)' : 'var(--text-3)',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              borderBottom: '2px solid', borderColor: tab === t.id ? 'var(--accent)' : 'transparent',
              marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            {t.label}
            <span style={{ fontSize: 11, color: 'var(--text-3)', padding: '0 6px', background: 'var(--bg-elev-2)', borderRadius: 4, minWidth: 20, textAlign: 'center' }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200, maxWidth: 320 }}>
          <Icons.Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input className="input" placeholder="搜索姓名 / 标签 / 介绍" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34 }} />
        </div>
        <FilterSelect label="角色" value={role} onChange={setRole} options={[{v:'all', l:'全部角色'}, {v:'设计师', l:'🎨 设计师'}, {v:'工程师', l:'💻 工程师'}, {v:'PM', l:'📋 PM'}, {v:'创始人', l:'🚀 创始人'}]} />
        <FilterSelect label="城市" value={city} onChange={setCity} options={cities.map(c => ({ v: c, l: c === 'all' ? '全部城市' : c }))} />
        <FilterSelect label="技能" value={skill} onChange={setSkill} options={skills.map(s => ({ v: s, l: s === 'all' ? '全部技能' : s }))} />
        {(role !== 'all' || city !== 'all' || skill !== 'all' || search) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setRole('all'); setCity('all'); setSkill('all'); setSearch(''); }}>
            <Icons.X size={12} /> 清空筛选
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-3)' }}>
          匹配 <strong style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{filtered.length}</strong> 位
        </span>
      </div>

      {/* List rows (layout option 3 — full-width row cards) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(m => (
          <MemberRow
            key={m.id}
            member={m}
            following={following[m.id]}
            onToggleFollow={() => toggleFollow(m.id)}
            isSelf={m.isSelf}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-3)' }}>
          没有符合条件的成员
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <select className="select" value={value} onChange={e => onChange(e.target.value)} style={{ height: 36, padding: '0 10px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, color: 'var(--text)', cursor: 'pointer' }}>
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}

function MemberRow({ member: m, following, onToggleFollow, isSelf }) {
  const joinedDate = new Date(m.joined);
  const monthsAgo = Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const joinedLabel = m.isNew ? '本月加入' : monthsAgo < 12 ? `${monthsAgo} 个月前加入` : `${Math.floor(monthsAgo / 12)} 年前加入`;

  return (
    <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
      {/* Avatar */}
      <div className="avatar" style={{
        width: 44, height: 44, fontSize: 16,
        background: m.avatarColor, color: '#0C0A09', flexShrink: 0,
      }}>{m.avatar}</div>

      {/* Identity */}
      <div style={{ minWidth: 200, flex: '0 0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</span>
          {isSelf && <span style={{ fontSize: 10, padding: '1px 6px', background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: 3, fontWeight: 600 }}>你</span>}
          {m.isNew && <span style={{ fontSize: 10, padding: '1px 6px', background: '#FEF3C7', color: '#A16207', borderRadius: 3, fontWeight: 600 }}>🌱 NEW</span>}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)' }}>@{m.handle}</span>
          <span>·</span>
          <span>{m.role}</span>
          <span>·</span>
          <span>📍 {m.city}</span>
        </div>
      </div>

      {/* Tagline + skills */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4, lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.tagline}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {m.skills.slice(0, 4).map(s => (
            <span key={s} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'var(--bg-elev-2)', color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 14, flexShrink: 0, fontSize: 11, color: 'var(--text-3)', textAlign: 'right' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{m.projects}</div>
          <div>项目</div>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{m.contrib}</div>
          <div>贡献</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ flexShrink: 0, display: 'flex', gap: 6 }}>
        {!isSelf && (
          <>
            <button
              className={following ? 'btn btn-sm' : 'btn btn-primary btn-sm'}
              onClick={onToggleFollow}
              style={following ? { background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: '#D9F99D' } : {}}
            >
              {following ? <><Icons.Check size={12} /> 已关注</> : <>+ 关注</>}
            </button>
          </>
        )}
        {isSelf && <span style={{ fontSize: 11, color: 'var(--text-3)', padding: '4px 10px' }}>这是你自己</span>}
      </div>
    </div>
  );
}

window.ProjectSubmit = ProjectSubmit;
window.MembersDirectory = MembersDirectory;
window.Field = Field;
