const h = require("react").createElement;
const { InputForm, primaryButton } = require("./input-form.js");

const MessageForm = props =>
  h(InputForm, {
    inputProps: {
      name: "message",
      placeholder: "Message",
      value: props.inputs.message
    },
    buttonLabel: "Send",
    buttonClass: primaryButton,
    submitAction: props.send,
    value: props.inputs.message,
    onInput: value => props.onInput("message", value)
  });

module.exports = MessageForm;
