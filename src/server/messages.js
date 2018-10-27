const url = require("url");
const httpRequest = require("./request.js");
const { originator } = require("./message-post.js");

module.exports = async function messages(req, res) {
  res.setHeader("content-type", "application/json");

  const query = url.parse(req.url, true).query;
  const phone = query.phone.replace(/[^0-9]/gi, "");

  if (!phone) {
    return {
      phone
    };
  }

  const apiSentResp = JSON.parse(
    (await httpRequest(`/messages?recipient=${phone}`)).body
  );
  const apiRecResp = JSON.parse(
    (await httpRequest(`/messages?originator=${phone}`)).body
  );

  const result = apiSentResp.items.concat(apiRecResp.items).map(item => ({
    id: item.id,
    createdDatetime: item.createdDatetime,
    direction: item.direction,
    message: item.body
  }));

  result.sort((a, b) => {
    if (a.createdDatetime > b.createdDatetime) {
      return -1;
    }

    if (a.createdDatetime < b.createdDatetime) {
      return 1;
    }

    return 0;
  });

  return {
    messages: result,
    phone: phone,
    sharedPhone: originator
  };
};
