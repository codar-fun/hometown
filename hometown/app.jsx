// Hometown — App shell

const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const [route, setRoute] = useStateApp('home');
  const [user, setUser] = useStateApp(null);
  const [loginOpen, setLoginOpen] = useStateApp(false);
  const [forms, setForms] = useStateApp(window.HometownData.STARTER_FORMS);
  const [activeForm, setActiveForm] = useStateApp(window.HometownData.STARTER_HACKATHON_FORM);
  const [applications, setApplications] = useStateApp(window.HometownData.STARTER_APPLICATIONS);
  const [activeProject, setActiveProject] = useStateApp(null);
  const [hackathons, setHackathons] = useStateApp(window.HometownData.STARTER_HACKATHONS);
  const [editingHack, setEditingHack] = useStateApp(null);

  function signIn(payload) {
    setUser({
      name: '林知夏',
      handle: 'zhixia',
      avatar: '林',
      email: payload.method === 'email' ? payload.contact : 'zhixia@hometown.dev',
      phone: payload.method === 'phone' ? payload.contact : '+86 138 0013 8000',
      contact: payload.contact,
      isAdmin: true,
    });
    setLoginOpen(false);
  }

  const navItems = [
    { id: 'home', label: '首页', icon: 'Home', kbd: 'G H' },
    { id: 'events', label: '活动', icon: 'Calendar', kbd: 'G E' },
    { id: 'projects', label: '项目展示', icon: 'Builder', kbd: 'G J' },
    { id: 'members', label: '成员广场', icon: 'User', kbd: 'G M' },
    { id: 'hackathon', label: '黑客松报名', icon: 'Bolt', kbd: 'G K' },
    { id: 'profile', label: '个人主页', icon: 'User', kbd: 'G P' },
  ];
  const adminItems = [
    { id: 'hackathons', label: '黑客松管理', icon: 'Bolt' },
    { id: 'builder', label: '表单构建器', icon: 'Builder', highlight: true },
    { id: 'forms', label: '所有表单', icon: 'Form' },
    { id: 'review', label: '报名审核', icon: 'Inbox', badge: applications.filter(a => a.status === 'pending').length },
    { id: 'email', label: '邮件模板', icon: 'Mail' },
  ];

  const wide = route === 'builder' || route === 'review';

  function saveHackathon(updated) {
    setHackathons(hs => hs.map(h => h.id === updated.id ? updated : h));
    setEditingHack(updated);
  }
  function createHackathon(newHack) {
    setHackathons(hs => [newHack, ...hs]);
    setEditingHack(newHack);
    setRoute('hackathon-edit');
  }
  function deleteHackathon(h) {
    setHackathons(hs => hs.filter(x => x.id !== h.id));
    setEditingHack(null);
    setRoute('hackathons');
  }
  function publishHackathon(h) {
    const updated = { ...h, status: 'live', updatedAt: new Date().toISOString().slice(0, 10) };
    saveHackathon(updated);
  }

  return (
    <>
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">H</div>
            <div className="brand-name">Hometown</div>
          </div>

          <div className="nav-section-label">社区</div>
          {navItems.map(item => (
            <NavBtn key={item.id} item={item} active={route === item.id} onClick={() => setRoute(item.id)} />
          ))}

          <div className="nav-section-label">管理员</div>
          {adminItems.map(item => (
            <NavBtn key={item.id} item={item} active={route === item.id} onClick={() => setRoute(item.id)} />
          ))}

          <div className="nav-spacer" />

          {user ? (
            <div className="user-card" onClick={() => setRoute('profile')}>
              <div className="avatar">{user.avatar}</div>
              <div className="user-meta">
                <div className="nm">{user.name}</div>
                <div className="sub">{user.isAdmin ? 'Admin' : '社区成员'}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setUser(null); setRoute('home'); }} title="退出">
                <Icons.Logout size={13} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => setLoginOpen(true)}>
              登录 / 注册
            </button>
          )}
        </aside>

        <main className="main" style={wide ? { padding: 0 } : {}}>
          {route === 'home' && <HomePage user={user} onNavigate={setRoute} onSignIn={() => setLoginOpen(true)} />}
          {route === 'events' && <EventsPage user={user} onSignIn={() => setLoginOpen(true)} />}
          {route === 'projects' && <ProjectsGallery user={user} onOpenProject={(p) => { setActiveProject(p); setRoute('project-detail'); }} onSubmit={() => setRoute('project-submit')} onSignIn={() => setLoginOpen(true)} />}
          {route === 'project-detail' && activeProject && <ProjectDetail project={activeProject} user={user} onBack={() => setRoute('projects')} onSignIn={() => setLoginOpen(true)} />}
          {route === 'project-submit' && <ProjectSubmit user={user} onSignIn={() => setLoginOpen(true)} onBack={() => setRoute('projects')} onSubmitted={() => setRoute('projects')} />}
          {route === 'members' && <MembersDirectory user={user} onSignIn={() => setLoginOpen(true)} />}
          {route === 'hackathon' && <HackathonForm form={activeForm} user={user} onSignIn={() => setLoginOpen(true)} />}
          {route === 'profile' && <ProfilePage user={user} applications={applications} />}
          {route === 'hackathons' && <HackathonsList hackathons={hackathons} onCreate={() => setRoute('hackathon-create')} onEdit={(h) => { setEditingHack(h); setRoute('hackathon-edit'); }} onOpenForm={() => setRoute('builder')} />}
          {route === 'hackathon-create' && <HackathonCreate onCancel={() => setRoute('hackathons')} onCreate={createHackathon} />}
          {route === 'hackathon-edit' && editingHack && <HackathonEdit hack={editingHack} onBack={() => setRoute('hackathons')} onSave={saveHackathon} onDelete={deleteHackathon} onPublish={publishHackathon} onOpenForm={() => setRoute('builder')} />}
          {route === 'builder' && <FormBuilder form={activeForm} setForm={setActiveForm} onPreview={() => setRoute('hackathon')} onPublish={() => setRoute('forms')} />}
          {route === 'forms' && <FormsList forms={forms} onOpen={(f) => { setActiveForm(f); setRoute('builder'); }} onCreateNew={() => setRoute('builder')} />}
          {route === 'review' && <ReviewQueue applications={applications} setApplications={setApplications} onOpenEmail={() => setRoute('email')} />}
          {route === 'email' && <EmailPreview application={applications.find(a => a.status === 'approved')} />}
        </main>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={signIn} />
    </>
  );
}

function NavBtn({ item, active, onClick }) {
  const Ico = Icons[item.icon];
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <Ico />
      <span>{item.label}</span>
      {item.badge ? (
        <span style={{ marginLeft: 'auto', minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9, background: 'var(--accent)', color: '#FFFFFF', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {item.badge}
        </span>
      ) : item.highlight ? (
        <Icons.Sparkle size={12} style={{ marginLeft: 'auto', color: 'var(--accent)' }} />
      ) : null}
    </button>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
