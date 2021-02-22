# auto

利用 GitHub actions 自动执行任务

## Status

![v2ex](https://github.com/nashaofu/auto/workflows/v2ex/badge.svg)

## v2ex

支持 v2ex 每日自动领取奖励。注意 v2ex 领取奖励必须在早上 8 点之后，否则不能领取成功。

### 部署步骤

1. 登录 v2ex，打开浏览器控制台，进入 cookie 查看页面。![v2ex-cookie](./images/v2ex-cookie.jpg)
2. 在 Github 设置中添加 secrets，secrets 名称为 `V2EX_A2`，value 为 v2ex 网站 cookie 中的`A2`。![v2ex-secrets](./images/v2ex-secrets.jpg)
3. 在 Github 设置中添加 secrets `MAIL_USERNAME`(邮箱名)、`MAIL_PASSWORD`(邮箱密码，163邮箱使用授权密码，具体参考163邮箱)和`MAIL_TO`(收件邮箱账号)，他们分别表示脚本运行报错后，发送错误报告所用到的邮箱信息。项目中，默认使用163邮箱，如需使用其他邮箱，可修改`src/sendMail.ts`，具体配置参考https://nodemailer.com/
4. 自定义工作流运行时间，自定义运行时间请修改`.github\workflows\v2ex.yml`中 cron 表达式，注意时间必须为 8 点之后。
