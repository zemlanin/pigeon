const React = require("react");
const emotion = require("emotion");

const h = React.createElement;

const form = emotion.css`
  width: 100%;
  display: flex;
  flex-flow: row;
  margin: 0;
  align-items: baseline;
  margin: 5px 0;
`;

const input = emotion.css`
  border: 1px solid #eaf0fa;
  border-radius: 8px;
  background-color: #fff;
  font-size: 1rem;
  box-sizing: border-box;
  padding: 10px;
  flex-grow: 1;
  margin: 0 10px 0 0;
  font-family: Lota,"Helvetica Neue",Helvetica,Arial,sans-serif;

  &:disabled, form:disabled & {
    background-color: #eaf0fa;
  }
`;

const button = emotion.css`
  color: #fff;
  background-color: gray;
  border-radius: 8px;
  border: 0px;
  font-size: 1rem;
  font-weight: bold;
  box-sizing: border-box;
  padding: 10px;
  width: 120px;
  cursor: pointer;
  font-family: Lota,"Helvetica Neue",Helvetica,Arial,sans-serif;
`;

const negativeButton = emotion.css`
  background-color: #ff756c;
  color: #fff;

  &:hover {
    color: #ff756c;
    background-color: #fff;
    transition: color 0.2s ease-out, background-color 0.2s ease-out;
  }
`;

const primaryButton = emotion.css`
  color: #fff;
  background-color: #3f90dc;

  &:hover {
    background-color: #fff;
    color: #3f90dc;
    transition: color 0.2s ease-out, background-color 0.2s ease-out;
  }
`;

const loading = emotion.css`
  @keyframes rotating {
    from{
        transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
    }
  }

  overflow: hidden;
  animation: rotating 0.8s 0.2s ease-in-out infinite;
`;

class InputForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focus();
  }

  render() {
    const {
      inputProps,
      buttonLabel,
      buttonClass,
      submitAction,
      onInput
    } = this.props;

    return h(
      "form",
      {
        onSubmit: e => {
          e.preventDefault();
          this.setState({ loading: true }, () => {
            submitAction(this.textInput.current.value).then(() =>
              this.setState({ loading: false })
            );
          });
        },
        class: form
      },
      h("input", {
        disabled: !!this.state.loading,
        ...inputProps,
        class: input,
        ref: this.textInput,
        onInput: onInput
          ? e => {
              onInput(e.target.value);
            }
          : null
      }),
      h(
        "button",
        { class: `${button} ${buttonClass || ""}` },
        h("div", { class: this.state.loading ? loading : "" }, buttonLabel)
      )
    );
  }
}

module.exports = {
  InputForm,
  button,
  primaryButton,
  negativeButton
};
