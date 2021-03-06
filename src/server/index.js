const http = require("http");
const url = require("url");
const querystring = require("querystring");

const React = require("react");
const h = React.createElement;
const ReactDOMServer = require("react-dom/server");

const { createClientBundle } = require("./bundle.js");

const handlers = {
  "GET /": async (req, res) => {
    res.setHeader("content-type", "text/html");

    return ReactDOMServer.renderToStaticMarkup(
      h(
        "html",
        null,
        h(
          "head",
          {},
          h("title", {}, "pigeon"),
          h("meta", { charSet: "utf-8" }),
          h("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
          })
        ),
        h(
          "body",
          { style: { backgroundColor: "#f6fafd" } },
          h("div", { id: "app" }),
          h("script", {
            type: "text/javascript",
            dangerouslySetInnerHTML: { __html: await createClientBundle() }
          })
        )
      )
    );
  },
  "GET /messages": require("./messages.js"),
  "GET /message-events": require("./message-events.js"),
  "POST /message": require("./message-post.js"),
  "POST /webhook": require("./webhook.js")
};

async function processPost(request, response, parse) {
  let queryData = "";
  return new Promise((resolve, reject) => {
    request.on("data", function(data) {
      queryData += data;
      if (queryData.length > 1e6) {
        queryData = "";
        response.writeHead(413, { "Content-Type": "text/plain" }).end();
        request.connection.destroy();
        reject("413 Content Too Long");
      }
    });

    request.on("end", function() {
      request.post = parse(queryData);
      resolve(request.post);
    });
  });
}

const server = http.createServer((req, res) => {
  let handler =
    handlers[
      `${req.method} ${url.parse(req.url).pathname.replace(/\/$/, "") || "/"}`
    ];

  if (!handler) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404");
  } else {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
    const host = req.headers["x-forwarded-host"] || req.headers["host"];
    const port = (host.match(/:(\d+)$/) && host.match(/:(\d+)$/)[1]) || null;

    req.absolute = url.format({
      protocol,
      host,
      port
    });

    if (
      req.method === "POST" &&
      (req.headers["content-type"] === "application/x-www-form-urlencoded" ||
        req.headers["content-type"] === "application/json")
    ) {
      const ogHandler = handler;
      handler = async () => {
        await processPost(
          req,
          res,
          req.headers["content-type"] === "application/x-www-form-urlencoded"
            ? querystring.parse
            : JSON.parse
        );
        return ogHandler(req, res);
      };
    }

    handler(req, res)
      .then(body => {
        const contentType = res.getHeader("content-type");
        if (
          typeof body === "string" ||
          contentType === "text/plain" ||
          contentType === "text/html"
        ) {
          res.writeHead(res.statusCode, {
            "Content-Type": contentType || "text/html"
          });
          res.end(body);
        } else if (
          body ||
          res.getHeader("content-type") === "application/json"
        ) {
          res.writeHead(res.statusCode, { "Content-Type": "application/json" });
          res.end(JSON.stringify(body));
        } else {
          res.end();
        }
      })
      .catch(err => {
        if (!res.finished) {
          console.error(err);

          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("500");
        }
      });
  }
});

server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

const port = process.env.PORT || 8000;

server.listen(port);

console.log(`running on ${port}`);
