# auto

利用 GitHub actions 自动执行任务

## v2ex

支持 v2ex 每日自动领取奖励。注意 v2ex 领取奖励必须在早上 8 点之后，否则不能领取成功。

### 部署步骤

1. 登录 v2ex，打开浏览器控制台，进入 cookie 查看页面。![v2ex-cookie](./images/v2ex-cookie.jpg)
2. 在 Github 设置中添加 secrets，secrets 名称为 `V2EX_A2`，value 为 v2ex 网站 cookie 中的`A2`。![v2ex-secrets](./images/v2ex-secrets.jpg)
3. 自定义工作流运行时间，自定义运行时间请修改`.github\workflows\v2ex.yml`中 cron 表达式，注意时间必须为 8 点之后。
