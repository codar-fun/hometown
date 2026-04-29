// Hometown — Form Builder (the centerpiece)
// Three-column: palette · canvas · properties

const { useState: useStateFB } = React;

function FieldIcon({ type, size = 16 }) {
  const map = {
    short_text: Icons.Type, long_text: Icons.AlignLeft, email: Icons.AtSign,
    phone: Icons.Phone, url: Icons.Link, number: Icons.Hash,
    radio: Icons.Radio, checkbox: Icons.CheckSquare, select: Icons.List,
    date: Icons.Calendar,
  };
  const C = map[type] || Icons.Type;
  return <C size={size} />;
}

function FormBuilder({ form, setForm, onPreview, onPublish }) {
  const [selectedId, setSelectedId] = useStateFB(form.fields[0]?.id || null);
  const [draggingIdx, setDraggingIdx] = useStateFB(null);
  const [overIdx, setOverIdx] = useStateFB(null);

  const selected = form.fields.find(f => f.id === selectedId);
  const palette = window.HometownData.STARTER_FIELD_PALETTE;

  function addField(type) {
    const labels = {
      short_text: '单行文本', long_text: '多行文本', email: '邮箱', phone: '手机号',
      url: '链接', number: '数字', radio: '单选题', checkbox: '多选题', select: '下拉选择', date: '日期',
    };
    const newField = {
      id: 'f_' + Math.random().toString(36).slice(2, 8),
      type,
      label: labels[type],
      placeholder: '',
      required: false,
      help: '',
      options: ['radio', 'checkbox', 'select'].includes(type) ? ['选项 1', '选项 2', '选项 3'] : undefined,
    };
    setForm({ ...form, fields: [...form.fields, newField] });
    setSelectedId(newField.id);
  }

  function updateField(id, patch) {
    setForm({ ...form, fields: form.fields.map(f => f.id === id ? { ...f, ...patch } : f) });
  }

  function deleteField(id) {
    const idx = form.fields.findIndex(f => f.id === id);
    const next = form.fields.filter(f => f.id !== id);
    setForm({ ...form, fields: next });
    if (selectedId === id) setSelectedId(next[Math.max(0, idx - 1)]?.id || null);
  }

  function duplicateField(id) {
    const f = form.fields.find(x => x.id === id);
    const clone = { ...f, id: 'f_' + Math.random().toString(36).slice(2, 8), label: f.label + ' (副本)' };
    const idx = form.fields.findIndex(x => x.id === id);
    const next = [...form.fields.slice(0, idx + 1), clone, ...form.fields.slice(idx + 1)];
    setForm({ ...form, fields: next });
    setSelectedId(clone.id);
  }

  function moveField(from, to) {
    if (from === to) return;
    const next = [...form.fields];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setForm({ ...form, fields: next });
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px minmax(420px, 1fr) 300px', height: '100%', minWidth: 1080, overflow: 'auto' }}>
      {/* PALETTE */}
      <div style={{ borderRight: '1px solid var(--border)', padding: '20px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
          字段类型
        </div>
        <div className="stack" style={{ gap: 4 }}>
          {palette.map(p => (
            <button
              key={p.type}
              onClick={() => addField(p.type)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 6,
                background: 'transparent', border: '1px solid transparent', color: 'var(--text)',
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elev)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-elev-2)', display: 'grid', placeItems: 'center', color: 'var(--text-2)', flexShrink: 0 }}>
                <FieldIcon type={p.type} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.desc}</div>
              </div>
              <Icons.Plus size={14} style={{ color: 'var(--text-3)' }} />
            </button>
          ))}
        </div>

        <div style={{ marginTop: 24, padding: 12, background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Icons.Sparkle size={14} style={{ color: 'var(--accent)', marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>从模板开始</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5 }}>
                有 12 个常用模板：报名、招募、调研…
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CANVAS */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span className="badge badge-success badge-dot">{form.status === 'live' ? '已发布' : form.status === 'draft' ? '草稿' : '已关闭'}</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>· 上次更新 {form.updatedAt}</span>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-sm" onClick={onPreview}><Icons.Eye size={14} /> 预览</button>
          <button className="btn btn-sm">分享链接</button>
          <button className="btn btn-primary btn-sm" onClick={onPublish}>保存并发布</button>
        </div>

        <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px', width: '100%' }}>
          <input
            className="input"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={{ height: 'auto', padding: '4px 8px', fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', background: 'transparent', border: '1px solid transparent', marginBottom: 4 }}
            onFocus={e => e.target.style.borderColor = 'var(--border)'}
            onBlur={e => e.target.style.borderColor = 'transparent'}
          />
          <input
            className="input"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ height: 'auto', padding: '4px 8px', fontSize: 13, color: 'var(--text-2)', background: 'transparent', border: '1px solid transparent', marginBottom: 24 }}
            onFocus={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text)'; }}
            onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.color = 'var(--text-2)'; }}
            placeholder="表单描述（可选）"
          />

          <div className="stack" style={{ gap: 8 }}>
            {form.fields.map((field, i) => (
              <FieldCanvasRow
                key={field.id}
                field={field}
                index={i}
                selected={selectedId === field.id}
                onSelect={() => setSelectedId(field.id)}
                onDelete={() => deleteField(field.id)}
                onDuplicate={() => duplicateField(field.id)}
                draggingIdx={draggingIdx}
                overIdx={overIdx}
                onDragStart={() => setDraggingIdx(i)}
                onDragOver={() => setOverIdx(i)}
                onDragEnd={() => { if (draggingIdx !== null && overIdx !== null) moveField(draggingIdx, overIdx); setDraggingIdx(null); setOverIdx(null); }}
              />
            ))}

            {form.fields.length === 0 && (
              <div style={{ padding: 48, border: '1.5px dashed var(--border)', borderRadius: 12, textAlign: 'center', color: 'var(--text-2)' }}>
                <div style={{ fontSize: 14, marginBottom: 4 }}>从左侧添加你的第一个字段</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>或者从模板开始更快</div>
              </div>
            )}

            <button
              onClick={() => addField('short_text')}
              style={{
                marginTop: 12, padding: '14px 16px', borderRadius: 8,
                background: 'transparent', border: '1.5px dashed var(--border)',
                color: 'var(--text-2)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}
            >
              <Icons.Plus size={14} /> 添加字段
            </button>
          </div>
        </div>
      </div>

      {/* PROPERTIES */}
      <div style={{ borderLeft: '1px solid var(--border)', padding: '20px', background: 'var(--surface)' }}>
        {selected ? (
          <PropertiesPanel field={selected} onChange={p => updateField(selected.id, p)} />
        ) : (
          <div style={{ color: 'var(--text-3)', fontSize: 13, textAlign: 'center', padding: '40px 20px' }}>
            选中一个字段以编辑属性
          </div>
        )}
      </div>
    </div>
  );
}

function FieldCanvasRow({ field, index, selected, onSelect, onDelete, onDuplicate, draggingIdx, overIdx, onDragStart, onDragOver, onDragEnd }) {
  const isOver = overIdx === index && draggingIdx !== null && draggingIdx !== index;
  return (
    <div
      onClick={onSelect}
      draggable
      onDragStart={onDragStart}
      onDragOver={e => { e.preventDefault(); onDragOver(); }}
      onDragEnd={onDragEnd}
      style={{
        position: 'relative',
        padding: '14px 16px 14px 36px',
        background: selected ? 'var(--bg-elev)' : 'var(--surface)',
        border: '1px solid',
        borderColor: selected ? 'var(--accent)' : (isOver ? 'var(--accent)' : 'var(--border)'),
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'border-color .12s, background .12s',
        boxShadow: selected ? '0 0 0 3px rgba(163,230,53,0.1)' : 'none',
      }}
    >
      <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', cursor: 'grab', display: 'flex' }}>
        <Icons.Drag size={14} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{field.label}</span>
            {field.required && <span style={{ color: 'var(--danger)', fontSize: 12 }}>*</span>}
            <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 6px', background: 'var(--bg-elev-2)', borderRadius: 4 }}>
              <FieldIcon type={field.type} size={11} /> {field.type}
            </span>
          </div>
          <FieldPreview field={field} />
          {field.help && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>{field.help}</div>}
        </div>

        {selected && (
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            <button className="btn btn-ghost btn-sm" onClick={onDuplicate} title="复制"><Icons.Copy size={13} /></button>
            <button className="btn btn-ghost btn-sm btn-danger" onClick={onDelete} title="删除"><Icons.Trash size={13} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldPreview({ field }) {
  const t = field.type;
  if (t === 'short_text' || t === 'email' || t === 'phone' || t === 'url' || t === 'number') {
    return <input className="input" disabled placeholder={field.placeholder || '用户在这里输入'} style={{ pointerEvents: 'none' }} />;
  }
  if (t === 'long_text') {
    return <textarea className="textarea" disabled placeholder={field.placeholder || '用户在这里输入'} style={{ pointerEvents: 'none', minHeight: 60 }} />;
  }
  if (t === 'date') {
    return <input className="input" disabled placeholder="选择日期" style={{ pointerEvents: 'none' }} />;
  }
  if (t === 'select') {
    return <select className="select" disabled style={{ pointerEvents: 'none' }}><option>{field.options?.[0] || '选择...'}</option></select>;
  }
  if (t === 'radio' || t === 'checkbox') {
    const isRadio = t === 'radio';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {(field.options || []).slice(0, 4).map((o, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-2)' }}>
            <div style={{ width: 14, height: 14, border: '1.5px solid var(--border-strong)', borderRadius: isRadio ? '50%' : 3, flexShrink: 0 }} />
            {o}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function PropertiesPanel({ field, onChange }) {
  const hasOptions = ['radio', 'checkbox', 'select'].includes(field.type);
  const hasPlaceholder = ['short_text', 'long_text', 'email', 'phone', 'url', 'number'].includes(field.type);

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
          字段属性
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 6 }}>
          <FieldIcon type={field.type} />
          <span style={{ fontSize: 12, fontWeight: 500 }}>{
            ({short_text:'单行文本',long_text:'多行文本',email:'邮箱',phone:'手机号',url:'链接',number:'数字',radio:'单选题',checkbox:'多选题',select:'下拉选择',date:'日期'})[field.type]
          }</span>
        </div>
      </div>

      <div>
        <label className="label">标签</label>
        <input className="input" value={field.label} onChange={e => onChange({ label: e.target.value })} />
      </div>

      {hasPlaceholder && (
        <div>
          <label className="label">占位符</label>
          <input className="input" value={field.placeholder || ''} onChange={e => onChange({ placeholder: e.target.value })} placeholder="（可选）" />
        </div>
      )}

      <div>
        <label className="label">帮助文本</label>
        <input className="input" value={field.help || ''} onChange={e => onChange({ help: e.target.value })} placeholder="（可选）显示在字段下方" />
      </div>

      {hasOptions && (
        <div>
          <label className="label">选项</label>
          <div className="stack" style={{ gap: 6 }}>
            {(field.options || []).map((o, i) => (
              <div key={i} style={{ display: 'flex', gap: 6 }}>
                <input
                  className="input"
                  value={o}
                  onChange={e => { const next = [...field.options]; next[i] = e.target.value; onChange({ options: next }); }}
                />
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onChange({ options: field.options.filter((_, j) => j !== i) })}
                  style={{ flexShrink: 0 }}
                ><Icons.X size={13} /></button>
              </div>
            ))}
            <button
              className="btn btn-sm"
              onClick={() => onChange({ options: [...(field.options || []), `选项 ${(field.options?.length || 0) + 1}`] })}
              style={{ alignSelf: 'flex-start' }}
            ><Icons.Plus size={13} /> 添加选项</button>
          </div>
        </div>
      )}

      <div style={{ height: 1, background: 'var(--border)' }} />

      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
          验证
        </div>
        <Toggle
          label="必填项"
          desc="用户必须填写才能提交"
          checked={field.required}
          onChange={v => onChange({ required: v })}
        />
        {field.type === 'short_text' && (
          <div style={{ marginTop: 12 }}>
            <label className="label">最大字符数</label>
            <input className="input" type="number" value={field.maxLength || ''} onChange={e => onChange({ maxLength: e.target.value })} placeholder="不限" />
          </div>
        )}
        {field.type === 'long_text' && (
          <div style={{ marginTop: 12 }}>
            <label className="label">最大字符数</label>
            <input className="input" type="number" value={field.maxLength || 500} onChange={e => onChange({ maxLength: e.target.value })} />
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 0' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 32, height: 18, padding: 2, border: 'none', borderRadius: 999,
          background: checked ? 'var(--accent)' : 'var(--bg-elev-2)',
          position: 'relative', cursor: 'pointer', transition: 'background .15s',
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: checked ? '#FFFFFF' : 'var(--text-2)',
          transform: checked ? 'translateX(14px)' : 'translateX(0)',
          transition: 'transform .15s',
        }} />
      </button>
    </div>
  );
}

window.FormBuilder = FormBuilder;
window.FieldIcon = FieldIcon;
window.FieldPreview = FieldPreview;
window.Toggle = Toggle;
