function ReqInfo(req) {
  const { hostname, ip, method, protocol, path, params, query } = req;
  const keys = {
    hostname,
    ip,
    method, // 请求方式
    protocol, // 通信协议
    path, // 路径
    params, // 路径参数
    query, // 查询字符串
  };
  for (let key in keys) {
    this["req." + key] = keys[key];
  }
}
module.exports = { ReqInfo };
