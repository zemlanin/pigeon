const querystring = require("querystring");

const httpRequest = require("./request.js");
const originator = "48732100980";

module.exports = async function messagePost(req, res) {
  const recipients = req.post.phone;
  const body = req.post.message;

  await httpRequest(
    "/messages",
    "POST",
    querystring.stringify({
      recipients: req.post.phone,
      originator: originator,
      body: req.post.message
    })
  );

  return "ok";
};

module.exports.originator = originator;
