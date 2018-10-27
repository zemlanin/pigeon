const https = require("https");
const { promisify } = require("util");

const API_KEY = process.env.API_KEY;

module.exports = async function httpRequest(
  path,
  method = "GET",
  postData = ""
) {
  params = {
    hostname: "rest.messagebird.com",
    port: "443",
    path: path,
    method: method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      Authorization: `AccessKey ${API_KEY}`
    }
  };

  return new Promise(function(resolve, reject) {
    var req = https.request(params, function(res) {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject({
          statusCode: res.statusCode,
          headers: res.headers
        });
      }
      var body = [];
      res.on("data", function(chunk) {
        body.push(chunk);
      });
      res.on("end", function() {
        try {
          body = Buffer.concat(body).toString();
        } catch (e) {
          reject(e);
        }
        resolve({
          body,
          statusCode: res.statusCode,
          headers: res.headers
        });
      });
    });

    req.on("error", function(err) {
      reject(err);
    });
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};
