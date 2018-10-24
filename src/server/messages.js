module.exports = async function messages(req, res) {
  res.setHeader("content-type", "application/json");

  return [
    {id: "4a5b97d0-203f-400d-bf23-5b21b8fcea93", datetime: "2018-10-24T21:44:56+03:00", message: "lol", originator: "me"},
    {id: "5cc7f053-d9b3-4fe7-a4bc-80883f653947", datetime: "2018-10-24T21:45:25+03:00", message: "kek", originator: "them"},
  ]
}
