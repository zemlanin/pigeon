const React = require("react");
const h = React.createElement;

const ReactDOM = require("react-dom");
const emotion = require("emotion");

const wrapper = emotion.css`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
  display: flex;
  min-height: 100%;
  flex-flow: column;
  box-sizing: border-box;
`;

const PhoneLogin = require("./phone-login.js");
const PhoneExit = require("./phone-exit.js");
const MessageForm = require("./message-form.js");
const MessageList = require("./message-list.js");
const Footer = require("./footer.js");

const AppContext = React.createContext();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      sharedPhone: "",
      inputs: {
        phone: localStorage.getItem("lastPhone") || "",
        message: ""
      },
      messages: [],
      eventSource: null,
      refreshInterval: null,

      onInput: (key, value) => {
        if (key === "phone" || key === "message") {
          this.setState({
            inputs: {
              ...this.state.inputs,
              [key]: value
            }
          });
        }
      },
      login: async phone => {
        return fetch(`/messages?phone=${phone}`)
          .then(resp => resp.json())
          .then(resp => {
            if (resp.messages) {
              const eventSource = new EventSource(
                "/message-events?phone=" + resp.phone
              );
              eventSource.addEventListener(
                "newMessage",
                e => {
                  let messages = [JSON.parse(e.data), ...this.state.messages];

                  messages.sort((a, b) => {
                    if (a.createdDatetime > b.createdDatetime) {
                      return -1;
                    }

                    if (a.createdDatetime < b.createdDatetime) {
                      return 1;
                    }

                    return 0;
                  });

                  this.setState({ messages: messages });
                },
                false
              );

              const refreshInterval = setInterval(() => {
                fetch(`/messages?phone=${phone}`)
                  .then(resp => resp.json())
                  .then(resp => {
                    if (!resp.messages) {
                      return;
                    }

                    this.setState({ messages: resp.messages });
                  });
              }, 10000);

              return this.setState(
                {
                  phone: resp.phone,
                  messages: resp.messages || [],
                  sharedPhone: resp.sharedPhone,
                  eventSource: eventSource,
                  refreshInterval: refreshInterval
                },
                () => {
                  localStorage.setItem("lastPhone", phone);
                }
              );
            }

            this.setState({
              inputs: {
                phone: resp.phone || ""
              }
            });
          });
      },
      exit: async () => {
        if (this.state.eventSource) {
          this.state.eventSource.close();
        }

        if (this.state.refreshInterval) {
          clearInterval(this.state.refreshInterval);
        }

        this.setState(
          {
            phone: null,
            eventSource: null,
            refreshInterval: null,
            inputs: {
              phone: this.state.phone
            },
            messages: []
          },
          () => {
            localStorage.removeItem("lastPhone");
          }
        );
      },
      send: async message => {
        if (!message || !message.trim()) {
          return;
        }

        return (
          fetch(`/message`, {
            method: "POST",
            body: `phone=${this.state.phone}&message=${encodeURIComponent(
              message
            )}`,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          })
            // API lags a bit and I don't have time to write a proper fix
            .then(() => {
              this.setState({
                inputs: {
                  message: ""
                },
                messages: [
                  {
                    id: "fake",
                    createdDatetime: new Date()
                      .toISOString()
                      .replace(/Z$/, "+00:00"),
                    message: message,
                    direction: "mt"
                  },
                  ...this.state.messages
                ]
              });
            })
        );
      }
    };
  }

  render() {
    return h(
      AppContext.Provider,
      { value: this.state },
      h(
        "div",
        {
          class: wrapper
        },
        h(
          AppContext.Consumer,
          {},
          context =>
            context.phone ? h(PhoneExit, context) : h(PhoneLogin, context)
        ),
        h(
          AppContext.Consumer,
          {},
          context => (context.phone ? h(MessageForm, context) : null)
        ),
        h(
          AppContext.Consumer,
          {},
          context => (context.phone ? h(MessageList, context) : null)
        ),
        h(
          AppContext.Consumer,
          {},
          context => (context.phone ? h(Footer, context) : null)
        )
      )
    );
  }
}

ReactDOM.render(h(App, {}), document.getElementById("app"));
