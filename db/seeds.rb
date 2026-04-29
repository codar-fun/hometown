# ─── Users ───────────────────────────────────────────────────────────────────

avery = User.find_or_create_by!(email: "avery@hometown.dev") do |u|
  u.name        = "Avery Chen"
  u.handle      = "avery"
  u.role        = "admin"
  u.school      = "Hometown Team"
  u.city        = "上海"
  u.tagline     = "Hometown 创始人 / 社区运营"
  u.avatar_color = "#65A30D"
  u.skills      = ["Strategy", "Community", "Writing"]
end

zhixia = User.find_or_create_by!(email: "zhixia@hometown.dev") do |u|
  u.name        = "林知夏"
  u.handle      = "zhixia"
  u.role        = "member"
  u.school      = "清华大学"
  u.city        = "杭州"
  u.bio         = "前端 / 设计系统 / 喜欢做精致的小工具。"
  u.github      = "github.com/zhixia"
  u.tagline     = "前端 / 设计系统 / 喜欢小工具"
  u.avatar_color = "#A3E635"
  u.skills      = ["React", "TypeScript", "Figma", "Motion"]
end

members_data = [
  { email: "siyuan@stanford.edu",  name: "陈思源",       handle: "siyuan",    city: "上海",            school: "斯坦福大学 · CS",    tagline: "后端 / 隧道工具 / Rust 信徒",          avatar_color: "#A3E635", skills: ["Go", "Rust", "Postgres", "Redis"] },
  { email: "maya.p@design.io",     name: "Maya Patel",   handle: "maya",      city: "San Francisco",   school: "IDEO · Designer",    tagline: "产品设计 / 动效 / IDEO 出身",          avatar_color: "#F472B6", skills: ["Figma", "Motion", "Prototyping", "Research"] },
  { email: "tomas@upgrade.cl",     name: "Tomás Reyes",  handle: "tomas",     city: "智利 · Santiago", school: "智利大学",            tagline: "WebGL / 协作白板 / 慢节奏开发",        avatar_color: "#60A5FA", skills: ["React", "TypeScript", "WebGL", "Yjs"] },
  { email: "xc@bytedance.com",     name: "王小川",        handle: "xiaochuan", city: "北京",            school: "ByteDance · 工程师",  tagline: "ByteDance / ML / 隐私技术",           avatar_color: "#FBBF24", skills: ["Python", "ML", "K8s", "Go"] },
  { email: "jordan@growthly.co",   name: "Jordan Lee",   handle: "jordan",    city: "深圳",            school: "独立开发者",          tagline: "独立开发者 / 关注小型工具",            avatar_color: "#A78BFA", skills: ["Figma", "No-code", "Analytics", "SQL"] },
  { email: "yutong@cmu.edu",       name: "张语桐",        handle: "yutong",    city: "Pittsburgh",      school: "CMU · HCI",          tagline: "CMU HCI / 关注无障碍设计",            avatar_color: "#F87171", skills: ["Research", "Figma", "SwiftUI", "A11y"] },
  { email: "alex@kim.dev",         name: "Alex Kim",     handle: "alex",      city: "Seoul",           school: "KAIST",              tagline: "KAIST / Vue / 喜欢做小工具",          avatar_color: "#34D399", skills: ["Vue", "Nuxt", "GraphQL", "GSAP"] },
  { email: "mx@sjtu.edu.cn",       name: "李明轩",        handle: "mingxuan",  city: "上海",            school: "上海交通大学",        tagline: "上交 / 后端 / 社区运营工具",          avatar_color: "#0EA5E9", skills: ["Java", "Spring", "Redis", "K8s"] },
  { email: "priya@nyu.edu",        name: "Priya Shah",   handle: "priya",     city: "New York",        school: "NYU · ITP",          tagline: "NYU ITP / 互动装置 / 软硬结合",       avatar_color: "#FB923C", skills: ["Arduino", "TouchDesigner", "p5.js", "C++"] },
  { email: "daniel@wu.io",         name: "Daniel Wu",    handle: "daniel",    city: "San Francisco",   school: "Y Combinator W26",   tagline: "YC W26 / 创作者经济 / 数据",          avatar_color: "#A3E635", skills: ["Strategy", "Figma", "SQL", "Python"] },
  { email: "sora@musabi.ac.jp",    name: "Sora Tanaka",  handle: "sora",      city: "Tokyo",           school: "武藏野美大",          tagline: "武藏野美大 / 字体 / 印刷",            avatar_color: "#F472B6", skills: ["Type Design", "Print", "Figma"] },
  { email: "ravi@stripe.com",      name: "Ravi Mehta",   handle: "ravi",      city: "Bangalore",       school: "Stripe",             tagline: "Stripe 早期 PM / 现在做支付基础设施",  avatar_color: "#FBBF24", skills: ["Strategy", "Payments", "API Design"] },
  { email: "naomi@berlin.dev",     name: "Naomi Johnson", handle: "naomi",    city: "Berlin",          school: "独立研究",            tagline: "Privacy / E2E / 喜欢密码学",          avatar_color: "#60A5FA", skills: ["Rust", "Cryptography", "Linux"] },
]

users = { "avery" => avery, "zhixia" => zhixia }
members_data.each do |attrs|
  u = User.find_or_create_by!(email: attrs[:email]) do |u|
    u.name        = attrs[:name]
    u.handle      = attrs[:handle]
    u.role        = "member"
    u.city        = attrs[:city]
    u.school      = attrs[:school]
    u.tagline     = attrs[:tagline]
    u.avatar_color = attrs[:avatar_color]
    u.skills      = attrs[:skills]
  end
  users[attrs[:handle]] = u
end
puts "Users: #{User.count}"

# ─── Hackathon Registration Form ─────────────────────────────────────────────

hack_form = Form.find_or_create_by!(slug: "hackathon-2026") do |f|
  f.title       = "黑客松报名表单"
  f.description = "数智乡建黑客松 2026 · 5月21-24日 · 福建屏南"
  f.published   = true
  f.created_by  = avery
end

hack_form.form_fields.destroy_all

[
  {
    label:      "姓名",
    field_type: "short_text",
    required:   true,
    position:   1,
    options:    [],
  },
  {
    label:      "性别",
    field_type: "radio",
    required:   true,
    position:   2,
    options:    [
      { "label" => "男",        "value" => "男" },
      { "label" => "女",        "value" => "女" },
      { "label" => "不方便透露", "value" => "不方便透露" },
    ],
  },
  {
    label:      "职业状态",
    field_type: "radio",
    required:   true,
    position:   3,
    options:    [
      { "label" => "学生（本科/研究生/博士）", "value" => "学生" },
      { "label" => "在职，正在探索副业",        "value" => "在职探索副业" },
      { "label" => "自由职业者/数字游民",       "value" => "自由职业者" },
      { "label" => "创业者（OPC）",             "value" => "创业者OPC" },
      { "label" => "创业者（有团队）",          "value" => "创业者有团队" },
      { "label" => "间隔期",                    "value" => "间隔期" },
      { "label" => "其他",                      "value" => "其他" },
    ],
  },
  {
    label:      "你所在的学校/公司和专业/职位",
    field_type: "short_text",
    required:   true,
    position:   4,
    options:    [],
  },
  {
    label:      "你参与的社区",
    field_type: "short_text",
    required:   false,
    position:   5,
    options:    [],
  },
  {
    label:      "组队情况",
    field_type: "radio",
    required:   true,
    position:   6,
    options:    [
      { "label" => "单独参赛",    "value" => "单独参赛" },
      { "label" => "已经组好团队", "value" => "已组队" },
      { "label" => "需要组队支持", "value" => "需要组队" },
    ],
  },
  {
    label:      "请用一段话介绍下你自己，包括你的兴趣、技能、背景",
    field_type: "long_text",
    required:   true,
    position:   7,
    options:    [],
  },
  {
    label:      "是否已经有当前在做的产品/项目",
    field_type: "radio",
    required:   true,
    position:   8,
    options:    [
      { "label" => "有技能，但暂无 idea",               "value" => "无idea" },
      { "label" => "已有思路，尚未启动",                "value" => "有思路未启动" },
      { "label" => "项目已启动，需要更多正反馈",        "value" => "已启动需反馈" },
      { "label" => "项目已启动，且取得一定成果",        "value" => "已有成果" },
      { "label" => "其他",                              "value" => "其他" },
    ],
  },
  {
    label:      "你希望在此次创客松中实现的目标或想法",
    field_type: "long_text",
    required:   true,
    position:   9,
    options:    [],
  },
  {
    label:      "微信号",
    field_type: "short_text",
    required:   true,
    position:   10,
    options:    [],
  },
  {
    label:      "手机号",
    field_type: "phone",
    required:   true,
    position:   11,
    options:    [],
  },
  {
    label:      "GitHub 账号（选填）",
    field_type: "url",
    required:   false,
    position:   12,
    options:    [],
  },
].each { |attrs| hack_form.form_fields.create!(attrs) }

fields = hack_form.form_fields.order(:position).to_a
f_name, f_gender, f_career, f_school_co, f_community, f_team, f_intro, f_project_status, f_goal = fields
puts "Form: #{hack_form.title} (#{hack_form.form_fields.count} fields)"

# ─── Hackathons ───────────────────────────────────────────────────────────────

hackathon_2026 = Hackathon.find_or_create_by!(slug: "hh-2026") do |h|
  h.name            = "数智乡建黑客松 屏南 2026"
  h.status          = "live"
  h.featured        = true
  h.theme           = "未来乡村 · 数字智建"
  h.tagline         = "AI × 乡土 × 48 小时 · 福建屏南"
  h.description     = "技术可以服务于乡土，而非取代它。数智乡建黑客松 2026 邀请你来到福建屏南，将 AI、物联网与开源硬件带入真实的乡村场景 — 与当地农民、村官一起，用 48 小时做一个真正能用的东西。成功项目将获得种子资金支持和真实落地机会，欢迎跨学科团队报名，非程序员同样欢迎。"
  h.start_date      = Date.new(2026, 5, 21)
  h.end_date        = Date.new(2026, 5, 24)
  h.submit_deadline = Time.new(2026, 5, 23, 18, 0, 0)
  h.location        = "福建省 · 宁德屏南县"
  h.location_type   = "onsite"
  h.capacity        = 200
  h.registered_count = 47
  h.approved_count  = 32
  h.prize_pool      = 80_000
  h.currency        = "CNY"
  h.cover_color     = "#4D7C0F"
  h.cover_pattern   = "leaves"
  h.review_mode     = "manual"
  h.form            = hack_form
  h.created_by      = avery
end
# Ensure featured/info stays current on re-seed
hackathon_2026.update!(
  name:            "数智乡建黑客松 屏南 2026",
  featured:        true,
  tagline:         "AI × 乡土 × 48 小时 · 福建屏南",
  description:     "技术可以服务于乡土，而非取代它。数智乡建黑客松 2026 邀请你来到福建屏南，将 AI、物联网与开源硬件带入真实的乡村场景 — 与当地农民、村官一起，用 48 小时做一个真正能用的东西。成功项目将获得种子资金支持和真实落地机会，欢迎跨学科团队报名，非程序员同样欢迎。",
  start_date:      Date.new(2026, 5, 21),
  end_date:        Date.new(2026, 5, 24),
  location:        "福建省 · 宁德屏南县",
  location_type:   "onsite",
)

hackathon_2026.hackathon_tracks.destroy_all
[
  { label: "软件赛道",   color: "#DBEAFE", position: 1 },
  { label: "硬件赛道",   color: "#ECFCCB", position: 2 },
  { label: "创意赛道",   color: "#FCE7F3", position: 3 },
].each do |t|
  HackathonTrack.create!(hackathon: hackathon_2026, label: t[:label], color: t[:color], position: t[:position])
end

[
  { name: "乡建DAO", position: 1 },
  { name: "Social Layer",    position: 2 },
  { name: "SeeDAO",    position: 3 },
  { name: "NCC", position: 4 },
].each do |s|
  HackathonSponsor.find_or_create_by!(hackathon: hackathon_2026, name: s[:name]) do |sp|
    sp.position = s[:position]
  end
end


puts "Hackathons: #{Hackathon.count}"

# ─── Form Submissions (Applications) ─────────────────────────────────────────

applications = [
]

applications.each do |app|
  user = users[app[:handle]]
  next unless user

  sub = FormSubmission.find_or_initialize_by(form: hack_form, user: user)
  next unless sub.new_record?

  sub.status       = app[:status]
  sub.starred      = app[:starred]
  sub.submitted_at = app[:submitted_at]
  sub.save!

  [
    [f_name,           user.name],
    [f_gender,         app[:gender]],
    [f_career,         app[:career]],
    [f_school_co,      app[:school_co]],
    [f_community,      app[:community]],
    [f_team,           app[:team]],
    [f_intro,          app[:intro]],
    [f_project_status, app[:project_status]],
    [f_goal,           app[:goal]],
  ].each do |field, value|
    sub.form_answers.create!(form_field: field, value: value) if field
  end
end
puts "Submissions: #{FormSubmission.count}"

# ─── Events ───────────────────────────────────────────────────────────────────

events_data = [
  { title: "设计工程师的工具箱",            kind: "分享会",    date: Date.new(2026, 5,  4), time_label: "14:00 — 17:00", location: "上海 · 西岸 Hub",        host: avery,           desc: "从 Figma 插件到 React 组件库 — 看几位设计工程师如何打磨自己的日常工具，聊聊 LLM 时代的设计-开发协作流程。", tags: ["设计工程", "工具", "Figma"], going_count: 24, capacity: 40,  status: "upcoming", featured: true,  color: "#ECFCCB" },
  { title: "Hometown Meetup #12",           kind: "Meetup",    date: Date.new(2026, 5,  7), time_label: "19:00 — 22:00", location: "Co-working Space · 静安", host: avery,           desc: "每月一次的小镇聚会 · 自由 talk + 闪电分享 · 报名后会发地址。本期主题：「上半年我做过最不务正业的事」。",         tags: ["Meetup", "社交"],           going_count: 23, capacity: 60,  status: "upcoming", featured: false, color: "#DBEAFE" },
  { title: "深夜书房：Pieces of the Action", kind: "读书会",   date: Date.new(2026, 5, 10), time_label: "20:00 — 22:00", location: "线上 · Zoom",            host: zhixia,          desc: "Vannevar Bush 的回忆录 · 读组织如何运作创新。这次重点讨论第 4-7 章，关于二战期间 OSRD 的运作。",               tags: ["读书", "线上"],             going_count: 11, capacity: 30,  status: "upcoming", featured: false, color: "#FEF3C7" },
  { title: "从零搭建一个设计系统",           kind: "工作坊",    date: Date.new(2026, 5, 14), time_label: "10:00 — 18:00", location: "上海 · 张江实验室",      host: users["siyuan"], desc: "一整天的实操工作坊 · 涵盖 Token · 组件库 · 主题切换 · 文档站。需自带笔记本。",                                   tags: ["工作坊", "实操", "设计"],  going_count: 16, capacity: 20,  status: "upcoming", featured: false, color: "#FCE7F3" },
  { title: "Hometown Hackathon 2026",       kind: "Hackathon", date: Date.new(2026, 5, 18), time_label: "48 小时不间断",  location: "上海 · 西岸艺术中心",    host: avery,           desc: "主题「Tools for Builders」· ¥80,000 奖池 · 6 家公司面试直通 · 当前 47 / 200 人已报名。",                        tags: ["黑客松", "主舞台"],         going_count: 47, capacity: 200, status: "upcoming", featured: true,  color: "#ECFCCB" },
  { title: "独立开发者 Office Hours",       kind: "Office Hours", date: Date.new(2026, 5, 22), time_label: "20:00 — 22:00", location: "线上 · Discord",      host: users["daniel"], desc: "每周四晚的开放交流 · 你可以来聊产品定价 · 用户增长。这周话题：第一批付费用户。",                                tags: ["独立开发", "线上"],         going_count: 8,  capacity: 50,  status: "upcoming", featured: false, color: "#E0E7FF" },
  { title: "Meetup #11 · 设计工程师之夜",   kind: "Meetup",    date: Date.new(2026, 3, 22), time_label: nil,             location: "上海",                    host: avery,           desc: "38 人参加 · 6 个闪电分享 · 凌晨 2 点散场。",                                                                   tags: ["Meetup"],                   going_count: 38, capacity: nil, status: "past",     featured: false, color: nil },
  { title: "读书会：精益创业",               kind: "读书会",    date: Date.new(2026, 2, 14), time_label: nil,             location: "线上",                    host: zhixia,          desc: "14 人参与 · 重点讨论 MVP 与可衡量学习。",                                                                       tags: ["读书"],                     going_count: 14, capacity: nil, status: "past",     featured: false, color: nil },
  { title: "Design Engineering Workshop",   kind: "工作坊",    date: Date.new(2026, 1, 28), time_label: nil,             location: "上海",                    host: zhixia,          desc: "18 位设计工程师参加 · 完整工作日 · 收到全员好评。",                                                             tags: ["工作坊"],                   going_count: 18, capacity: nil, status: "past",     featured: false, color: nil },
]

events_data.each do |e|
  Event.find_or_create_by!(title: e[:title], date: e[:date]) do |ev|
    ev.kind        = e[:kind]
    ev.time_label  = e[:time_label]
    ev.location    = e[:location]
    ev.host        = e[:host]
    ev.description = e[:desc]
    ev.tags        = e[:tags]
    ev.going_count = e[:going_count]
    ev.capacity    = e[:capacity]
    ev.status      = e[:status]
    ev.featured    = e[:featured]
    ev.color       = e[:color]
  end
end
puts "Events: #{Event.count}"

# ─── Projects ─────────────────────────────────────────────────────────────────

projects_data = [
]

projects_data.each do |p|
  project = Project.find_or_initialize_by(name: p[:name])
  next unless project.new_record?

  project.assign_attributes(
    tagline:       p[:tagline],
    hackathon:     hackathon_2026,
    track:         p[:track],
    cover_color:   p[:cover_color],
    cover_pattern: p[:cover_pattern],
    description:   p[:description],
    seeking:       p[:seeking],
    tech:          p[:tech],
    demo_url:      p[:demo_url],
    github_url:    p[:github_url],
    likes_count:   p[:likes_count],
    winner:        p[:winner],
    submitted_at:  p[:submitted_at],
  )
  project.save!

  p[:team].each do |member|
    u = users[member[:handle]]
    next unless u
    ProjectTeamMember.find_or_create_by!(project: project, user: u) do |m|
      m.role_label = member[:role_label]
    end
  end
end
puts "Projects: #{Project.count}"

puts "\nSeed complete!"
puts "  Users:       #{User.count}"
puts "  Forms:       #{Form.count} (#{FormField.count} fields)"
puts "  Hackathons:  #{Hackathon.count}"
puts "  Submissions: #{FormSubmission.count}"
puts "  Events:      #{Event.count}"
puts "  Projects:    #{Project.count} (#{ProjectTeamMember.count} members)"
