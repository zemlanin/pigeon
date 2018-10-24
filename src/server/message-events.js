module.exports = async function messages(req, res) {
  // const r = Math.random()
  const r = req.url.split("?")[1]

  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  let id = 0;
  let closed = false

  req.on('close', function(err) { console.error(err); closed = true })
  console.log(req.headers["user-agent"])

  while (1) {
    if (req.aborted || closed) {
      res.end()
      return
    }
    res.write(`event: ticker\nid: ${id}\ndata:This is event ${id}.`)
    res.write("\n\n")
    console.log(r, id)
    id++;
    await new Promise(r => setTimeout(r, 1000))
  }
}
