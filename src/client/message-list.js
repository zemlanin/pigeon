const React = require("react");
const emotion = require("emotion");

const h = React.createElement;

const messageList = emotion.css`
  border: 1px solid #ebf5ff;
  border-radius: 8px;
  background-color: #fff;
  padding: 10px;
  flex-grow: 1;
  overflow-y: scroll;
  height: 100px;
  margin: 5px 0;
`;

const message = emotion.css`
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const sent = emotion.css`
  background-color: #3f90dc;
  margin-left: 100px;
`;
const recieved = emotion.css`
  background-color: #f6fafd;
  color: black;
  margin-right: 100px;
`;

const messageAligner = emotion.css`
  flex-grow: 1;
`;

const timestamp = emotion.css`
  font-size: 0.8rem;
  margin-top: 8px;
  font-style: italic;
`;

const Message = props =>
  h(
    "div",
    {
      style: { display: "flex", flexDirection: "row" }
    },
    props.direction === "mt" && h("div", { class: messageAligner }),
    h(
      "div",
      { class: `${message} ${props.direction === "mt" ? sent : recieved}` },
      h("div", {}, props.message),
      h(
        "time",
        { class: timestamp, datetime: props.createdDatetime },
        new Date(props.createdDatetime).toLocaleString()
      )
    ),
    props.direction !== "mt" && h("div", { class: messageAligner })
  );

const MessageList = props => {
  return h("main", { class: messageList }, ...props.messages.map(Message));
};

module.exports = MessageList;
