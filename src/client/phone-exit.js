const h = require("react").createElement;
const { InputForm, negativeButton } = require("./input-form.js");

const PhoneExit = props =>
  h(InputForm, {
    inputProps: {
      name: "phone",
      type: "tel",
      placeholder: "Phone",
      value: props.phone,
      disabled: true
    },
    buttonLabel: "Exit",
    buttonClass: negativeButton,
    submitAction: props.exit
  });

module.exports = PhoneExit;
