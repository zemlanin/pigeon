const { openedConnectionCallbacks } = require("./message-events.js");

module.exports = async function webhook(req, res) {
  const phone = req.post.originator;
  const message = req.post.body;

  if (!phone || !message) {
    return;
  }

  if (!openedConnectionCallbacks[phone]) {
    return;
  }

  for (const callback of openedConnectionCallbacks[phone]) {
    callback({
      id: req.post.id,
      phone,
      message,
      createdDatetime: req.post.createdDatetime
    });
  }
};
