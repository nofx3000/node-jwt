const jwt = require("jsonwebtoken");

const util = require("util");
const verify = util.promisify(jwt.verify);

const router = require("koa-router")();

router.prefix("/users");

router.post("/login", async (ctx, next) => {
  const { userName, password } = ctx.request.body;

  let userInfo;
  if (userName === "dh" && password === "123") {
    userInfo = {
      userid: 1,
      userName: "dh",
      role: "admin",
    };
  }

  if (userInfo === null) {
    ctx.body = {
      errno: -1,
      msg: "login failed",
    };
    return;
  }

  let token;
  token = jwt.sign(userInfo, "secret_code", {
    expiresIn: "24h",
  });

  ctx.body = {
    errno: 0,
    data: token,
  };
});

router.get("/decode", async (ctx, next) => {
  const token = ctx.header.authorization;
  // console.log(token);
  try {
    const payload = await verify(token.split(" ")[1], "secret_code");
    ctx.body = {
      errno: 0,
      data: payload,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      errno: -1,
      msg: error,
    };
  }
});

router.get("/bar", function (ctx, next) {
  ctx.body = "this is a users/bar response";
});

module.exports = router;
