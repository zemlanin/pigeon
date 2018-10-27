const url = require("url");

// {"phone": [ (data) => null ]}
const openedConnectionCallbacks = {};

function cleanUp(phone, callback) {
  if (!openedConnectionCallbacks[phone]) {
    return;
  }

  openedConnectionCallbacks[phone] = openedConnectionCallbacks[phone].filter(
    cb => cb != callback
  );
}

module.exports = async function messages(req, res) {
  const query = url.parse(req.url, true).query;
  const phone = query.phone.replace(/[^0-9]/gi, "");

  if (!phone) {
    res.end(404);
    return;
  }

  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache"
  });

  let closed = false;

  req.on("close", function() {
    closed = true;
  });

  const callback = data => {
    if (req.aborted || closed) {
      cleanUp(phone, callback);
      return;
    }

    res.write(`event: newMessage\ndata: ${JSON.stringify(data)}`);
    res.write("\n\n");
  };

  openedConnectionCallbacks[phone] = openedConnectionCallbacks[phone] || [];
  openedConnectionCallbacks[phone].push(callback);

  const keepingAliveCheck = (resolve, reject) => {
    if (req.aborted || closed) {
      res.end();
      cleanUp(phone, callback);
      return reject(new Error("Connection's Dead"));
    }

    setTimeout(resolve, 1000);
  };

  while (1) {
    try {
      await new Promise(keepingAliveCheck);
    } catch (e) {
      return;
    }
  }
};

module.exports.openedConnectionCallbacks = openedConnectionCallbacks;
