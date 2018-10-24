const React = require("react");
const h = React.createElement;

const ReactDOM = require("react-dom");
const emotion = require("emotion");

const red = emotion.css`
  color: red;
`;

const model = {
  messages: [],
  phoneHash: ""
};

const messagesSource = new EventSource('/message-events?r='+(Math.random()));
messagesSource.addEventListener("ticker", e => ReactDOM.render(
  h("h1", { class: red }, e.data),
  document.getElementById("app")
), false)

ReactDOM.render(
  h("h1", { class: red }, "pigeon"),
  document.getElementById("app")
);
