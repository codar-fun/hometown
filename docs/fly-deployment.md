# Fly.io 部署记录

**应用地址:** https://hometown.fly.dev/  
**部署时间:** 2026-04-29  
**平台:** Fly.io · 组织 `sola-764` · 区域 `sin`（新加坡）  
**数据库:** Neon PostgreSQL（外部，非 Fly 托管）

---

## 部署命令

由于网络原因，`fly launch` 在自动创建阶段失败，改为手动分步操作：

```bash
# 1. 手动创建应用（fly launch 中 org slug 需用 sola-764，不能用 sola）
fly apps create hometown --org sola-764

# 2. 写入 fly.toml（手动，见下文）

# 3. 设置环境变量密钥
fly secrets set \
  DATABASE_URL="..." \
  RESEND_KEY="..." \
  ALIYUN_SMS_SIGN_NAME="..." \
  ALIYUN_SMS_TEMPLATE_CODE="..." \
  ACCESS_KEY_ID="..." \
  ACCESS_KEY_SECRET="..." \
  SECRET_KEY_BASE="..." \
  --app hometown

# 4. 部署
fly deploy --app hometown
```

---

## fly.toml

```toml
app = "hometown"
primary_region = "sin"

[build]

[deploy]
  release_command = "bin/rails db:migrate"

[env]
  RAILS_ENV = "production"
  RAILS_LOG_TO_STDOUT = "true"
  RAILS_SERVE_STATIC_FILES = "true"

[processes]
  app = "bin/rails server -b 0.0.0.0 -p 8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

  [http_service.concurrency]
    type = "connections"
    hard_limit = 25
    soft_limit = 20

[[vm]]
  memory = "1gb"
  cpu_kind = "shared"
  cpus = 1
```

---

## 遇到的问题与修复

### 问题：`listen tcp :80: bind: permission denied`

**现象：** 部署后应用持续崩溃重启，日志报错：

```
{"level":"ERROR","msg":"Failed to start HTTP listener","error":"listen tcp :80: bind: permission denied"}
```

**原因：** Rails 8 默认 Dockerfile 使用 `thruster`（`bin/thrust`）作为反向代理，thruster 默认监听 80 端口。容器以非 root 用户（uid 1000）运行，无法绑定特权端口（< 1024）。

Dockerfile 中没有设置 `ENV PORT`，thruster 回退到默认值 80：

```dockerfile
EXPOSE 80
CMD ["./bin/thrust", "./bin/rails", "server"]
```

**尝试过但无效的方案：**
- 在 `fly.toml [env]` 中设置 `PORT = "3000"` / `PORT = "8080"`
- 通过 `fly secrets set PORT=8080` 强制注入环境变量
- 均无效，thruster 仍绑定 :80

**最终解决方案：** 完全绕过 thruster，在 `fly.toml` 中用 `[processes]` 直接启动 Rails：

```toml
[processes]
  app = "bin/rails server -b 0.0.0.0 -p 8080"
```

Fly.io 在边缘层处理 HTTPS/TLS，容器内不需要 thruster 的反向代理功能。

---

## 环境变量清单

| 变量 | 来源 | 说明 |
|------|------|------|
| `DATABASE_URL` | Neon | PostgreSQL 连接串，含 `sslmode=require` |
| `RESEND_KEY` | Resend | 邮件发送 API Key |
| `ACCESS_KEY_ID` | 阿里云 | 短信服务 AccessKey |
| `ACCESS_KEY_SECRET` | 阿里云 | 短信服务 Secret |
| `ALIYUN_SMS_SIGN_NAME` | 阿里云 | 短信签名 |
| `ALIYUN_SMS_TEMPLATE_CODE` | 阿里云 | 短信模板 Code |
| `SECRET_KEY_BASE` | 手动生成 | Rails 加密 Key |

`RAILS_ENV`、`RAILS_LOG_TO_STDOUT`、`RAILS_SERVE_STATIC_FILES` 在 `fly.toml [env]` 中明文设置（非敏感）。

---

## 数据库

使用 Neon 外部 PostgreSQL，不使用 Fly 托管数据库。

连接串格式：
```
postgresql://user:pass@host-pooler.region.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

每次部署通过 release command 自动运行迁移：
```toml
[deploy]
  release_command = "bin/rails db:migrate"
```

生产数据库 seed 需手动执行：
```bash
fly ssh console --app hometown -C "bin/rails db:seed"
```

---

## 常用运维命令

```bash
# 查看日志
fly logs --app hometown --no-tail

# SSH 进入容器
fly ssh console --app hometown

# 重新部署
fly deploy --app hometown

# 扩缩容
fly scale count 1 --app hometown --yes

# 查看机器状态
fly machines list --app hometown

# 更新密钥（会触发滚动重启）
fly secrets set KEY=value --app hometown
```
