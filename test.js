const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { log, table } = console;
const { ReqInfo } = require("./utils/reqInfo");

app
  .use("/public", express.static("public"))
  .use(express.json())
  .use(bodyParser.urlencoded({ extended: false }));

// 获取首页
app.get("/", function (req, res) {
  res
    .status(200)
    .cookie("name", "tobi", {
      domain: ".example.com",
      path: "/admin",
      secure: true,
    })
    .send("Hello World, get /");

  log("get /");
  table(new ReqInfo(req));

  // log("req.app", req.app);
  // log("req.baseUrl", req.baseUrl);
  // log("req.cookie", req.cookie);
  // log("req.originalUrl", req.originalUrl);

  // log("req.accepts()", req.accepts());
  // log("req.acceptsCharsets()", req.acceptsCharsets());
  // log("req.acceptsEncodings", req.acceptsEncodings());
  // log("req.acceptsLanguages", req.acceptsLanguages());
  // log("req.get('Content-Type')", req.get("Content-Type"));
  // log("req.get('x-node')", req.get("x-node")); // 自定义请求头
  // log("req.xhr", req.xhr);
});
app.get("/home", function (req, res) {
  res.redirect(301, "/");
});

// 获取所有问题
app.get("/questions", function (req, res) {
  res.send("Hello World, get /questions");
  log("get /questions");
  table(new ReqInfo(req));
});
// 获取某个指定问题的信息
app.get("/questions/:id", function userIdHandler(req, res) {
  res.send("questions " + req.params.id);
  log("get /questions/:id");
  table(new ReqInfo(req));
});

// 获取所有问题的投票统计结果
app.get("/statistic", function userIdHandler(req, res) {
  res.send("Hello World, get /statistic");
  log("get /statistic");
  table(new ReqInfo(req));
});
// 更新结果统计数据
app.post("/statistic", function userIdHandler(req, res) {
  res.send("Hello World, post /statistic");
  log("post /statistic?qid=1");
  table(new ReqInfo(req));

  log("req.body", req.body);
  log("req.is('json')", req.is("json"));
  log("req.is('application/json')", req.is("application/json"));
  log("req.is('html')", req.is("html"));
});

// 测试下载
app.get("/download", function userIdHandler(req, res) {
  res.download("./public/images/red_book.png");
});

// 测试500, json()
app.get("/busy", (req, res) => {
  res.status(500).json({ error: "message" });
});

// 测试404
app.get("*", (req, res) => {
  res.status(404).send("请求的资源未找到呀！");
});

const server = app.listen(8081, function () {
  const host = server.address().address;
  const port = server.address().port;

  log("应用实例，访问地址为 http://%s:%s", host, port);
});
