# auto

利用 GitHub actions 自动执行任务

## v2ex

支持 v2ex 每日自动领取奖励。

### 部署步骤

1. 登录 v2ex，打开浏览器控制台，进入 cookie 查看页面。![v2ex-cookie](./images/v2ex-cookie.jpg)
2. 在 Github 设置中添加 secrets，secrets 名称为 `V2EX_A2`，value 为 v2ex 网站 cookie 中的`A2`。![v2ex-secrets](./images/v2ex-secrets.jpg)
