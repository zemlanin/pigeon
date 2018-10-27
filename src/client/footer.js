const React = require("react");
const emotion = require("emotion");

const h = React.createElement;

const footer = emotion.css`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
`;

const Footer = props =>
  h(
    "footer",
    { class: footer },
    h(
      "span",
      {},
      "Send messages to ",
      h("a", { href: "sms:+" + props.sharedPhone }, "+" + props.sharedPhone)
    ),
    h("a", { href: "https://github.com/zemlanin/pigeon", target: "_blank" }, "src")
  );

module.exports = Footer;
