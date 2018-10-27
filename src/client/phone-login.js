const h = require("react").createElement;
const { InputForm, primaryButton } = require("./input-form.js");

const PhoneLogin = props =>
  h(InputForm, {
    inputProps: {
      name: "phone",
      type: "tel",
      placeholder: "Phone",
      value: props.inputs.phone
    },
    buttonLabel: "Login",
    buttonClass: primaryButton,
    submitAction: props.login,
    onInput: value => props.onInput("phone", value)
  });

module.exports = PhoneLogin;
