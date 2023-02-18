const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { log, table } = console;
const { ReqInfo } = require("./utils/reqInfo");

var mysql = require("mysql2");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  port: "3306",
  database: "smart_qa",
});

connection.connect();

// const sql = "SELECT * FROM question";
// //查
// connection.query(sql, (err, result) => {
//   if (err) {
//     log("query failed: ", err.message);
//   }
//   log("---------------------SELECT---------------------");
//   log(result);
//   log("------------------------------------------------\n\n");
// });
// connection.end();

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
});

app.get("/home", function (req, res) {
  res.redirect(301, "/");
});

// 获取所有问题
app.get("/questions", function (req, res) {
  table(new ReqInfo(req));
  connection.connect();
  const sql = "SELECT * FROM question";
  //查
  connection.query(sql, (err, result) => {
    if (err) {
      log("query failed: ", err.message);
    }
    log("---------------------SELECT---------------------");
    log(result);
    log("------------------------------------------------\n\n");

    connection.end();
    res.send(result);
  });
});
// 获取某个指定问题的信息
app.get("/questions/:id", function userIdHandler(req, res) {
  res.send("questions " + req.params.id);
  log("get /questions/:id");
  table(new ReqInfo(req));
});
// 新增问题
app.post("/questions", (req, res) => {
  table(new ReqInfo(req));
  const { content, answer, A, B, C, D } = req.body;
  console.log(content, answer, A, B, C, D);

  connection.connect();

  var addSql =
    "INSERT INTO question(content, answer, A, B, C, D, statistic_id) VALUES(?,?,?,?,?,?,3)";
  var addSqlParams = [content, answer, A, B, C, D];
  //增
  connection.query(addSql, addSqlParams, function (err, result) {
    if (err) {
      console.log("[INSERT ERROR] - ", err.message);
      return;
    }

    console.log("--------------------------INSERT----------------------------");
    //console.log('INSERT ID:',result.insertId);
    console.log("INSERT ID:", result);
    console.log(
      "-----------------------------------------------------------------\n\n"
    );

    connection.end();
    res.status(200).send("添加成功！");
  });
});
// 删除问题
app.delete("/questions/:id", (req, res) => {
  table(new ReqInfo(req));
  const { id } = req.params;

  connection.connect();

  var delSql = `DELETE FROM question where id=${id}`;
  //删
  connection.query(delSql, function (err, result) {
    if (err) {
      console.log("[DELETE ERROR] - ", err.message);
      return;
    }

    console.log("--------------------------DELETE----------------------------");
    console.log("DELETE affectedRows", result.affectedRows);
    console.log(
      "-----------------------------------------------------------------\n\n"
    );

    connection.end();
    res.status(200).send("删除成功！");
  });
});

// 获取所有问题的投票统计结果
app.get("/statistic", function userIdHandler(req, res) {
  res.send("Hello World, get /statistic");
  log("get /statistic");
  table(new ReqInfo(req));
});
// 更新结果统计数据
app.patch("/statistic", function userIdHandler(req, res) {
  table(new ReqInfo(req));
  log("req.body", req.body);
  log("req.is('json')", req.is("json"));
  log("req.is('application/json')", req.is("application/json"));
  log("req.is('html')", req.is("html"));

  connection.connect();

  var modSql = `UPDATE statistic SET ${req.body.option} = ${req.body.option} + 1 WHERE question_id = ?`;
  var modSqlParams = [req.query.qid];
  connection.query(modSql, modSqlParams, function (err, result) {
    if (err) {
      console.log("[UPDATE ERROR] - ", err.message);
      return;
    }
    console.log("--------------------------UPDATE----------------------------");
    console.log("UPDATE affectedRows", result.affectedRows);
    console.log(
      "-----------------------------------------------------------------\n\n"
    );
    connection.end();
    res.status(200).send("更新成功！");
  });
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
