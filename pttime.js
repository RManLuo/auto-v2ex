const got = require("got");

const url = "https://www.pttime.org/attendance.php";

async function main() {
  const data = await got.get(url, {
    headers: {
      cookie: process.env.PTTIME_COOKIE,
    },
    retry: 3,
    resolveBodyOnly: true,
  });

  if (data.includes("<title>PTT :: 登录 - Powered by NexusPHP</title>")) {
    throw new Error("登录已经过期");
  }

  if (!data.includes("<title>PTT :: 签到 - Powered by NexusPHP</title>")) {
    throw new Error("签到失败：" + data);
  }
  console.log("签到成功");
}

main();
