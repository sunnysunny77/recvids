import React from "react";
import ReactDOM from "react-dom";
import Menu from "./menu.js";
import Index from "./index.js";
import Cart from "./cart.js";
import "./ac.css";
import "./index.css";
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import jwt from "jsonwebtoken";
import axios from "axios";

class Ac extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: props.uses,
      head: null,
      load: false,
    };
  }
  componentDidMount() {
    let script = document.createElement("script");
    script.setAttribute("id", "papa");
    document.body.appendChild(script);
    script.onload = () => {
      window.paypal
        .Buttons({
          style: {
            shape: "pill",
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "0.01",
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              document.getElementById("name").innerHTML =
                "Thak you: \xa0" + details.payer.name.given_name;
              let token = jwt.sign(
                { username: this.state.a },
                process.env.REACT_APP_JWT_SECRET,
                { expiresIn: 60 * 2 }
              );
              return axios
                .post(`/pay`, { token: token })
                .then((res) => {
                  let use = jwt.verify(
                    res.data.tokenres,
                    process.env.REACT_APP_JWT_SECRET
                  );
                  this.setState({ pay: true });
                  return this.t(use.message.payed, use.message.date);
                })
                .catch((error) => {
                  alert(error);
                });
            });
          },
        })
        .render("#paypal-button-container");
    };
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AVOpOjhvvp16zgBvD3gyNYfHDQpBql2zM1Cv3p4GFMsfiGE3yWPPPVJISVYktJaqlBB9ZHTVDq-s9ftJ&currency=AUD";

    let token = jwt.sign(
      { username: this.state.a },
      process.env.REACT_APP_JWT_SECRET,
      { expiresIn: 60 * 2 }
    );
    axios
      .post(`/gg`, { token: token })
      .then((res) => {
        let rsss = jwt.verify(
          res.data.tokenres,
          process.env.REACT_APP_JWT_SECRET
        );
        return this.tab(rsss.message[0].ofString);
      })
      .catch((error) => {
        alert(error.response.statusText);
      });
    let token1 = jwt.sign(
      { username: this.state.a },
      process.env.REACT_APP_JWT_SECRET,
      { expiresIn: 60 * 2 }
    );
    axios
      .post(`/pa`, { token: token1 })
      .then((res) => {
        let use = jwt.verify(
          res.data.tokenres,
          process.env.REACT_APP_JWT_SECRET
        );
        return this.t(use.message.payed, use.message.date);
      })
      .catch((error) => {
        alert(error.response.statusText);
      });
  }
  componentWillUnmount() {
    document.getElementById("papa").remove();
  }
  tab = (res) => {
    let mm = res.map((key, index) => {
      let n = key.lastIndexOf("/");
      let m = key.length;
      let re = key.slice(n + 1, m);
      let ss = "\xa0\xa0" + re + "\xa0\xa0";
      return (
        <ul
          key={index}
          style={{
            width: "275px",
            listStyleType: "square",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <li
            className="iii"
            onClick={() =>
              ReactDOM.render(
                <Cart vidy={key} uses={this.state.a} />,
                document.getElementById("root")
              )
            }
            style={{ width: "275px", textAlign: "right" }}
          >
            {ss}
          </li>
          <br />
        </ul>
      );
    });
    ReactDOM.render(mm, document.getElementById("ffff"));
  };
  t = (r, g) => {
    if (r) {
      let y = g.split("T");
      let d = y[1].replace(/\.[\dZ]{4}/g, " ");
      let a = "Status: Paid Until:";
      let sp = "\xa0";
      let j = y[0];
      let b = "ISO";
      let s = a + sp + j + sp + d + sp + b;
      this.setState({ head: s });
    } else {
      this.setState({ head: "Status: Unpaid: Video previews enabled" });
    }
  };
  bout = (v) => {
    let token = jwt.sign(
      { username: this.state.a },
      process.env.REACT_APP_JWT_SECRET,
      { expiresIn: 60 * 2 }
    );
    axios
      .post(`/do`, { token: token })
      .then((res) => {
        let use = jwt.verify(
          res.data.tokenres,
          process.env.REACT_APP_JWT_SECRET
        );
        if (use.message) {
          ReactDOM.render(
            <Index msg={use.message} />,
            document.getElementById("root")
          );
        } else if (use.message0) {
          ReactDOM.render(
            <Index msg={use.message0} />,
            document.getElementById("root")
          );
        }
      })
      .catch((error) => {
        alert(error.response.statusText);
      });
  };
  out = () => {
    axios
      .post(`/clear`)
      .then((res) => {
        ReactDOM.render(<Index />, document.getElementById("root"));
      })
      .catch((error) => {
        alert(error.response.statusText);
      });
  };
  render() {
    return (
      <div className="cont">
        <nav>
          <h3>{this.state.a}</h3>
          <br />
          <h3 style={{ padding: "0px 20px" }}>Rec Videos</h3>
        </nav>
        <Menu uses0={this.state.a} />
        <div id="di">
          <div style={{ height: "80px" }}></div>
          <div style={{ textAlign: "center" }}>
            <Button
              onClick={this.out}
              style={{
                color: "white",
                backgroundColor: "black",
                width: "200px",
                borderRadius: 0,
              }}
            >
              Log Out
            </Button>
          </div>
          <br />
          <br />
          <h3 style={{ textAlign: "center", padding: 0 }}>Videos</h3>
          <br />
          <br />
          <br />
          <div
            style={{
              backgroundColor: "black",
              opacity: 0.9,
              width: "90%",
              marginLeft: "auto",
              minHeight: "100px",
              marginRight: "auto",
              border: "solid 0.5px white",
            }}
            id="ffff"
          ></div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <p
            id="name"
            style={{
              color: "white",
              margin: 0,
              fontSize: "130%",
              fontWeight: 700,
              textShadow:
                "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
              height: "60px",
              textAlign: "center",
              padding: 0,
            }}
          ></p>
          <h3 style={{ textAlign: "center", padding: 0 }}>
            {" "}
            {this.state.head}{" "}
          </h3>
          <br />
          <div
            id="paypal-button-container"
            style={{ textAlign: "center", maxWidth: "90%", margin: "auto" }}
          ></div>
          <br />
          <br />
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "white", position: "relative", left: "6.5px" }}>
              &nbsp;&nbsp;Delete Accout -{" "}
              <ExitToAppIcon
                style={{ position: "relative", top: "6.5px" }}
                id="ex"
                onClick={this.bout}
              />
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Ac;
