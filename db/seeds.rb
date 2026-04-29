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
  f.description = "Hometown Hackathon 2026 · 5月18-19日 · 上海"
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
].each { |attrs| hack_form.form_fields.create!(attrs) }

fields = hack_form.form_fields.order(:position).to_a
f_name, f_gender, f_career, f_school_co, f_community, f_team, f_intro, f_project_status, f_goal = fields
puts "Form: #{hack_form.title} (#{hack_form.form_fields.count} fields)"

# ─── Hackathons ───────────────────────────────────────────────────────────────

hackathon_2026 = Hackathon.find_or_create_by!(slug: "hh-2026") do |h|
  h.name            = "Hometown Hackathon 2026"
  h.status          = "live"
  h.theme           = "Tools for Builders"
  h.tagline         = "为 Builder 打造工具的 Builder · 48 小时不间断"
  h.description     = "我们相信最好的工具来自最了解问题的人。Hometown Hackathon 2026 邀请你和你的团队，用 48 小时做一个真正能用的工具 — 自用、给朋友用、给社区用都行。"
  h.start_date      = Date.new(2026, 5, 18)
  h.end_date        = Date.new(2026, 5, 19)
  h.submit_deadline = Time.new(2026, 5, 19, 18, 0, 0)
  h.location        = "上海 · 西岸艺术中心"
  h.location_type   = "hybrid"
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

[
  { label: "Tools for Builders", color: "#ECFCCB", position: 1 },
  { label: "AI Agents",          color: "#DBEAFE", position: 2 },
  { label: "为创作者",            color: "#FCE7F3", position: 3 },
  { label: "社区与社交",          color: "#FEF3C7", position: 4 },
  { label: "健康与生活",          color: "#E0E7FF", position: 5 },
  { label: "学习工具",            color: "#FEE2E2", position: 6 },
].each do |t|
  HackathonTrack.find_or_create_by!(hackathon: hackathon_2026, label: t[:label]) do |tr|
    tr.color    = t[:color]
    tr.position = t[:position]
  end
end

[
  { name: "ByteDance", position: 1 },
  { name: "Vercel",    position: 2 },
  { name: "Linear",    position: 3 },
  { name: "Anthropic", position: 4 },
].each do |s|
  HackathonSponsor.find_or_create_by!(hackathon: hackathon_2026, name: s[:name]) do |sp|
    sp.position = s[:position]
  end
end

Hackathon.find_or_create_by!(slug: "winter-25") do |h|
  h.name            = "Winter Sprint 2025"
  h.status          = "ended"
  h.theme           = "Less is more"
  h.tagline         = "一周时间，做一个能在 30 秒内讲清楚的小工具"
  h.description     = "冬日里的 7 天 mini-hackathon，鼓励小而美的作品。"
  h.start_date      = Date.new(2025, 12, 9)
  h.end_date        = Date.new(2025, 12, 15)
  h.submit_deadline = Time.new(2025, 12, 15, 23, 59, 0)
  h.location        = "线上"
  h.location_type   = "online"
  h.capacity        = 100
  h.registered_count = 86
  h.approved_count  = 86
  h.prize_pool      = 20_000
  h.currency        = "CNY"
  h.cover_color     = "#0EA5E9"
  h.cover_pattern   = "waves"
  h.review_mode     = "auto"
  h.created_by      = avery
end

Hackathon.find_or_create_by!(slug: "design-week") do |h|
  h.name            = "Summer Camp · 设计周"
  h.status          = "ended"
  h.theme           = "为日常做点什么"
  h.tagline         = "只面向设计师的 5 天创作营"
  h.description     = "把日常的小不爽，重新设计一遍。5 天集中创作 + 一晚展览。"
  h.start_date      = Date.new(2025, 8, 4)
  h.end_date        = Date.new(2025, 8, 8)
  h.submit_deadline = Time.new(2025, 8, 8, 20, 0, 0)
  h.location        = "上海 · 静安"
  h.location_type   = "onsite"
  h.capacity        = 40
  h.registered_count = 40
  h.approved_count  = 38
  h.prize_pool      = 12_000
  h.currency        = "CNY"
  h.cover_color     = "#FCE7F3"
  h.cover_pattern   = "circles"
  h.review_mode     = "manual"
  h.created_by      = avery
end

Hackathon.find_or_create_by!(slug: "autumn-26") do |h|
  h.name            = "Autumn Hack · AI Edition"
  h.status          = "draft"
  h.theme           = "（待定）"
  h.tagline         = "（草稿 — 主题尚未公布）"
  h.description     = ""
  h.start_date      = Date.new(2026, 9, 26)
  h.end_date        = Date.new(2026, 9, 27)
  h.submit_deadline = Time.new(2026, 9, 27, 20, 0, 0)
  h.location        = "（待定）"
  h.location_type   = "hybrid"
  h.capacity        = 150
  h.registered_count = 0
  h.approved_count  = 0
  h.prize_pool      = 50_000
  h.currency        = "CNY"
  h.cover_color     = "#A78BFA"
  h.cover_pattern   = "hex"
  h.review_mode     = "manual"
  h.created_by      = avery
end
puts "Hackathons: #{Hackathon.count}"

# ─── Form Submissions (Applications) ─────────────────────────────────────────

applications = [
  { handle: "siyuan",    gender: "男",  career: "在职探索副业",   school_co: "斯坦福大学 · CS",    community: "Buildspace, 少楠",           team: "需要组队",  intro: "后端工程师，写了六年 Go 和 Rust，专注工具链和底层基础设施。最近对隧道工具和可观测性很感兴趣。",                    project_status: "已启动需反馈", goal: "想做一个面向独立开发者的 webhook 调试工具，支持本地隧道和回放。已经有原型，希望黑客松期间能完成 v1 的发布。",      status: "pending",  starred: true,  submitted_at: Time.new(2026, 4, 26, 14, 32, 0) },
  { handle: "maya",      gender: "女",  career: "自由职业者",     school_co: "IDEO · 产品设计师",  community: "Design Matters, Figma 社区",  team: "单独参赛",  intro: "产品设计师，IDEO 出身，专注动效和系统设计。喜欢把复杂的交互做得像呼吸一样自然。",                                  project_status: "有思路未启动", goal: "把读书笔记自动转换成卡片化播客 — 用 LLM 生成适合通勤听的 5 分钟摘要，UX 重在「断点续听」。",                        status: "pending",  starred: false, submitted_at: Time.new(2026, 4, 26, 11,  8, 0) },
  { handle: "tomas",     gender: "男",  career: "学生",           school_co: "智利大学 · 计算机系", community: "WebGL Dev, Three.js 论坛",  team: "需要组队",  intro: "热爱 WebGL 和实时协作技术。毕业论文就在做多人白板的延迟优化，这次想把研究成果做成产品。",                          project_status: "有思路未启动", goal: "WebGL 协作白板，支持多人手写笔迹同步和图层。重点解决远程团队 sketch session 卡顿的问题。",                          status: "pending",  starred: false, submitted_at: Time.new(2026, 4, 25, 22, 45, 0) },
  { handle: "xiaochuan", gender: "男",  career: "在职探索副业",   school_co: "ByteDance · 推荐算法工程师", community: "MLOps 社区, PaperWeekly", team: "单独参赛", intro: "在字节做了三年推荐系统，对隐私计算越来越感兴趣。业余时间在研究联邦学习和本地化向量检索。",                     project_status: "已有成果",     goal: "为社区做一个隐私优先的 RSS 推荐器，本地嵌入 + 云端协同过滤，不上传阅读历史。",                                       status: "approved", starred: false, submitted_at: Time.new(2026, 4, 25, 16, 20, 0) },
  { handle: "jordan",    gender: "不方便透露", career: "创业者OPC", school_co: "独立开发者",     community: "Indie Hackers, 产品沉思录",  team: "需要组队",  intro: "连续创业者，做过三个 no-code 工具，最后一个卖出去了。现在专注线下社群的数字化工具。",                             project_status: "已启动需反馈", goal: "想给小型读书会做一个「主持人工具包」 — 自动生成讨论提纲、计时、轮次提醒。让线下读书更结构化但不死板。",              status: "pending",  starred: false, submitted_at: Time.new(2026, 4, 25,  9, 11, 0) },
  { handle: "yutong",    gender: "女",  career: "学生",           school_co: "CMU · HCI 博士在读", community: "ACM SIGCHI, 无障碍设计联盟", team: "需要组队", intro: "HCI 研究员，做了两年面向老年人的交互设计研究。相信好的技术应该让更多人能用上，而不只是服务年轻人。",              project_status: "有思路未启动", goal: "给独居老人的「家庭日历」iPad 端 — 不依赖文字输入，全是大图标和语音。希望能跟一位 iOS 工程师组队。",                status: "pending",  starred: true,  submitted_at: Time.new(2026, 4, 24, 19, 55, 0) },
  { handle: "alex",      gender: "男",  career: "在职探索副业",   school_co: "KAIST · 前端工程师", community: "Vue Korea, Creative Coding",  team: "单独参赛", intro: "前端工程师，KAIST 毕业。写 Vue 五年，最近迷上创意编码和生成艺术。想把严肃的工具做得有美感。",                    project_status: "有思路未启动", goal: "把日历事件可视化成「时间花园」 — 把任务种成植物，专注一段时间长大，分心枯萎。要做得不像番茄钟。",                  status: "rejected", starred: false, submitted_at: Time.new(2026, 4, 24, 15, 33, 0) },
  { handle: "mingxuan",  gender: "男",  career: "学生",           school_co: "上海交通大学 · 软件工程", community: "SJTU 开源社, 稀土掘金",  team: "已组队",   intro: "上交大三，写 Java 和 Spring 三年。对社区运营工具很感兴趣，平时帮学校开源社管运营，深感工具太分散。",            project_status: "有思路未启动", goal: "社区运营自动化工具 — 给微信群和 Discord 一起用的 dashboard，整合活跃度统计、积分、自动 onboard 新人。",           status: "pending",  starred: false, submitted_at: Time.new(2026, 4, 24, 10,  2, 0) },
  { handle: "priya",     gender: "女",  career: "学生",           school_co: "NYU · ITP 研究生",   community: "Processing 社区, Arduino Hub", team: "需要组队", intro: "NYU ITP 在读，玩互动装置三年。喜欢把传感器和代码结合做出有温度的物件。希望找一个前端同学一起。",               project_status: "有思路未启动", goal: "做一个「房间情绪灯」 — 通过摄像头识别房间里的人数和活动强度，调节灯光颜色与节奏。",                                status: "pending",  starred: false, submitted_at: Time.new(2026, 4, 23, 21, 14, 0) },
  { handle: "daniel",    gender: "男",  career: "创业者有团队",   school_co: "Y Combinator W26 · CEO", community: "YC Alumni, On Deck",    team: "已组队",   intro: "YC W26，做创作者经济工具两年。对数据可视化和预测模型有执念，相信创作者需要更好的数字仪表盘。",                  project_status: "已有成果",     goal: "给独立创作者的「订阅数据看板」 — Substack / Patreon / 小报童一站式看，重点是趋势预测和流失预警。",                   status: "approved", starred: false, submitted_at: Time.new(2026, 4, 23, 14, 48, 0) },
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
  { name: "Wormhole",       tagline: "一行命令把本地端口暴露给世界 — 但首先要可视化它",   track: "Tools for Builders", cover_color: "#0C0A09", cover_pattern: "grid",    description: "我们在两天里从零搭了一个可视化的 webhook / tunnel 调试工具：把每一次进出本地服务的请求渲染成可拖动的卡片流，可以暂停、回放、改写后再次发送。",                                     seeking: ["找早期内测用户", "招前端协作者"], tech: ["React", "WebSockets", "Workers", "Rust"], demo_url: "wormhole.dev",        github_url: "github.com/wormhole/cli",    likes_count: 142, winner: "最佳工具", submitted_at: Time.new(2026, 5, 19, 16, 42, 0), team: [{ handle: "siyuan", role_label: "后端" }, { handle: "zhixia", role_label: "前端" }, { handle: "xiaochuan", role_label: "DevOps" }] },
  { name: "小报童 Daily",   tagline: "把 RSS 订阅自动剪辑成 5 分钟通勤播客",             track: "为创作者",           cover_color: "#FCE7F3", cover_pattern: "wave",    description: "订阅你常读的 newsletter / blog，每天清晨拿到一个像电台的语音摘要。重点解决「断点续听」 — 在你下车那一刻精确暂停，第二天接上。",                                               seeking: ["找投资"],                        tech: ["Swift", "ElevenLabs", "OpenAI"],         demo_url: "xiaobaotong.daily",   github_url: nil,                          likes_count: 96,  winner: nil,        submitted_at: Time.new(2026, 5, 19, 16, 55, 0), team: [{ handle: "maya", role_label: "设计" }, { handle: "alex", role_label: "前端" }] },
  { name: "Sketchpad Live", tagline: "远程 sketch 不再卡 — WebGL 协作白板",              track: "Tools for Builders", cover_color: "#0EA5E9", cover_pattern: "lines",   description: "我们做了一个 WebGL 协作白板，重点是手写笔迹的低延迟同步和多图层管理。在 50 人同屏的压测中保持 60fps。",                                                                        seeking: ["招前端协作者", "找早期内测用户"], tech: ["WebGL", "Yjs", "TypeScript"],             demo_url: "sketchpad.live",      github_url: "github.com/tomas/sketchpad", likes_count: 78,  winner: nil,        submitted_at: Time.new(2026, 5, 19, 17,  1, 0), team: [{ handle: "tomas", role_label: "前端" }, { handle: "mingxuan", role_label: "后端" }] },
  { name: "Quiet RSS",      tagline: "本地嵌入 + 云端协同过滤，但不上传你的阅读历史",    track: "AI Agents",          cover_color: "#10B981", cover_pattern: "dots",    description: "隐私优先的 RSS 推荐器。所有阅读历史在本地嵌入，云端只做匿名向量协同过滤。在我们的离线评测中达到主流推荐器 82% 的命中率。",                                                   seeking: ["找投资", "招后端"],              tech: ["Go", "Python", "pgvector"],              demo_url: "quiet.rss",           github_url: "github.com/quiet/rss",       likes_count: 64,  winner: nil,        submitted_at: Time.new(2026, 5, 19, 17,  8, 0), team: [{ handle: "xiaochuan", role_label: "后端" }] },
  { name: "Round Table",    tagline: "小型读书会的「主持人工具包」",                       track: "社区与社交",         cover_color: "#FEF3C7", cover_pattern: "circles", description: "自动生成讨论提纲、计时、轮次提醒、参与度统计。让线下读书会更结构化，但保留灵活的边界。我们在三场真实读书会上做了 user testing。",                                            seeking: ["找早期内测用户"],               tech: ["Next.js", "Tailwind", "OpenAI"],          demo_url: "roundtable.club",     github_url: nil,                          likes_count: 53,  winner: nil,        submitted_at: Time.new(2026, 5, 19, 17, 14, 0), team: [{ handle: "jordan", role_label: "产品" }, { handle: "yutong", role_label: "设计" }] },
  { name: "Garden Hours",   tagline: "不像番茄钟的专注工具 — 把任务种成植物",            track: "健康与生活",         cover_color: "#A3E635", cover_pattern: "leaves",  description: "把日历事件可视化成一座时间花园。专注时间长，植物长大；分心，植物枯萎。我们花了大量时间在动画细节和「不打扰但有存在感」的反馈机制上。",                                     seeking: ["招设计师"],                      tech: ["Vue", "Nuxt", "GSAP"],                   demo_url: "garden.hours",        github_url: "github.com/alex/garden",     likes_count: 49,  winner: nil,        submitted_at: Time.new(2026, 5, 19, 17, 20, 0), team: [{ handle: "alex", role_label: "前端" }] },
  { name: "Family Calendar", tagline: "给独居老人的 iPad 日历 — 全是大图标和语音",       track: "健康与生活",         cover_color: "#F87171", cover_pattern: "rings",   description: "不依赖文字输入。子女在云端编辑，老人端只看大图标和听语音提醒。我们和两位 75+ 老人做了原型测试，迭代了三轮交互。",                                                           seeking: ["找投资", "找用户"],              tech: ["SwiftUI", "CloudKit"],                   demo_url: "familycal.app",       github_url: nil,                          likes_count: 38,  winner: nil,        submitted_at: Time.new(2026, 5, 19, 17, 28, 0), team: [{ handle: "yutong", role_label: "设计" }, { handle: "priya", role_label: "硬件" }] },
  { name: "CommunityOS",    tagline: "微信群 + Discord 双端社区运营 dashboard",          track: "社区与社交",         cover_color: "#A78BFA", cover_pattern: "hex",     description: "整合活跃度统计、积分体系、自动 onboard 新人。一个 dashboard 同时管理微信群和 Discord，避免在两个工具之间来回切。",                                                       seeking: ["招前端", "找早期内测用户"],      tech: ["Java", "Spring", "Redis", "React"],       demo_url: nil,                   github_url: "github.com/mx/communityos",  likes_count: 31,  winner: nil,        submitted_at: Time.new(2026, 5, 19, 17, 33, 0), team: [{ handle: "mingxuan", role_label: "后端" }] },
  { name: "Mood Lamp",      tagline: "通过摄像头识别房间情绪，调节灯光",                  track: "健康与生活",         cover_color: "#F472B6", cover_pattern: "waves",   description: "硬件 + 软件作品。摄像头识别房间里的人数和活动强度，灯光颜色与节奏自动调节。希望让科技的存在感更柔和。",                                                                   seeking: ["招前端协作者"],                  tech: ["Arduino", "TouchDesigner", "p5.js"],     demo_url: nil,                   github_url: nil,                          likes_count: 27,  winner: nil,        submitted_at: Time.new(2026, 5, 19, 17, 40, 0), team: [{ handle: "priya", role_label: "硬件" }] },
  { name: "Subs Dashboard", tagline: "独立创作者的订阅数据看板",                           track: "为创作者",           cover_color: "#FBBF24", cover_pattern: "bars",    description: "Substack / Patreon / 小报童一站式看，重点是趋势预测和流失预警。我们用 24 个真实创作者的数据做了模型训练。",                                                               seeking: ["找投资"],                        tech: ["Python", "SQL", "Recharts"],             demo_url: "subs.fyi",            github_url: nil,                          likes_count: 22,  winner: nil,        submitted_at: Time.new(2026, 5, 19, 17, 48, 0), team: [{ handle: "daniel", role_label: "产品" }] },
  { name: "Echo Notes",     tagline: "把会议自动剪辑成可分享的「时间戳片段」",             track: "AI Agents",          cover_color: "#60A5FA", cover_pattern: "dots",    description: "会议结束后自动生成可分享的精彩片段卡片，每个卡片都附上时间戳和上下文摘要。",                                                                                               seeking: ["招后端"],                        tech: ["Python", "Whisper", "Next.js"],           demo_url: nil,                   github_url: nil,                          likes_count: 19,  winner: nil,        submitted_at: Time.new(2026, 5, 19, 17, 55, 0), team: [{ handle: "daniel", role_label: "产品" }, { handle: "maya", role_label: "设计" }] },
  { name: "Slowly",         tagline: "强制慢节奏的英语笔友 app",                          track: "学习工具",           cover_color: "#FB923C", cover_pattern: "lines",   description: "信件按距离模拟「慢慢送达」 — 越远的人越慢。鼓励长文和深度交流。",                                                                                                         seeking: [],                                tech: ["React Native", "Supabase"],              demo_url: "slowly.fm",           github_url: nil,                          likes_count: 14,  winner: nil,        submitted_at: Time.new(2026, 5, 19, 18,  2, 0), team: [{ handle: "alex", role_label: "前端" }] },
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
