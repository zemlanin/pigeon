const querystring = require("querystring");

const httpRequest = require("./request.js");
let ORIGINATOR_PHONE = process.env.ORIGINATOR_PHONE;

if (ORIGINATOR_PHONE) {
  ORIGINATOR_PHONE = ORIGINATOR_PHONE.replace(/[^0-9]/gi, "");
}

if (!ORIGINATOR_PHONE) {
  throw new Error("pigeon needs `ORIGINATOR_PHONE` in env")
}

module.exports = async function messagePost(req, res) {
  const message = req.post.message;
  const phone = req.post.phone.replace(/[^0-9]/gi, "");

  if (!phone) {
    res.writeHead(401);
    return "fail";
  }

  await httpRequest(
    "/messages",
    "POST",
    querystring.stringify({
      recipients: phone,
      originator: ORIGINATOR_PHONE,
      body: message
    })
  );

  return "ok";
};

module.exports.originator = ORIGINATOR_PHONE;
