import React from "react";
import ReactDOM from "react-dom";
import Cart from "./cart.js";
import "./index.css";
import "./home.css";
import axios from "axios";
import jwt from "jsonwebtoken";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      username: "",
      dis: { display: "none" },
      dis0: { display: "block" },
      dis1: { display: "none" },
      a: "",
      checkedA: true,
      msg: props.msg,
    };
  }
  componentDidMount() {
    axios
      .post(`/tok`)
      .then((res) => {
        let use = jwt.verify(
          res.data.tokenres,
          process.env.REACT_APP_JWT_SECRET
        );
        if (use.user) {
          ReactDOM.render(
            <Cart uses={use.user} />,
            document.getElementById("root")
          );
        } else if (use.message) {
          if (this.state.msg) {
            this.setState({ a: this.state.msg, dis: { display: "block" } });
          } else {
            this.setState({ a: use.message, dis: { display: "block" } });
          }
        }
      })
      .catch((error) => {
        alert(error.response.statusText)
      });
  }
  change = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };
  sub = (event) => {
    event.preventDefault();
    var regex = /[^A-Za-z 0-9]/g;
    if (!regex.test(this.state.username)) {
      if (this.state.password && this.state.username) {
        let token = jwt.sign(
          { username: this.state.username, password: this.state.password },
          process.env.REACT_APP_JWT_SECRET,
          { expiresIn: 60 * 2 }
        );
        axios
          .post(`/logUp`, { token: token })
          .then((res) => {
            let use = jwt.verify(
              res.data.tokenres,
              process.env.REACT_APP_JWT_SECRET
            );
            if (use.user) {
              ReactDOM.render(
                <Cart uses={use.user} />,
                document.getElementById("root")
              );
            } else if (use.message) {
              this.setState({ a: use.message, dis: { display: "block" } });
            }
          })
          .catch((error) => {
            alert(error.response.statusText);
          });
      } else {
        this.setState({
          username: null,
          password: null,
          a: "Sing Up imcomplete",
          dis: { display: "block" },
        });
      }
    } else {
      this.setState({
        username: null,
        password: null,
        a: "No special characters",
        dis: { display: "block" },
      });
    }
    document.getElementById("a1").reset();
  };
  sub0 = (event) => {
    event.preventDefault();
    let token = jwt.sign(
      { username: this.state.username, password: this.state.password },
      process.env.REACT_APP_JWT_SECRET,
      { expiresIn: 60 * 2 }
    );
    axios
      .post(`/logIn`, { token: token })
      .then((res) => {
        let use = jwt.verify(
          res.data.tokenres,
          process.env.REACT_APP_JWT_SECRET
        );
        if (use.user) {
          ReactDOM.render(
            <Cart uses={use.user} />,
            document.getElementById("root")
          );
        } else if (use.message) {
          this.setState({ a: use.message, dis: { display: "block" } });
        }
      })
      .catch((error) => {
        alert(error.response.statusText);
      });
    document.getElementById("a2").reset();
  };
  handleChange0 = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
    if (!this.state.checkedA) {
      this.setState({ dis0: { display: "block" } });
      this.setState({ dis1: { display: "none" } });
    } else {
      this.setState({ dis1: { display: "block" } });
      this.setState({ dis0: { display: "none" } });
    }
  };
  render() {
    return (
      <div className="cont">
        <div id="di">
          <div style={{ height: "80px" }}></div>
          <div style={this.state.dis}>
            <div
              id="l1"
              style={{
                margin: "auto",
                marginBottom: "45px",
                width: "175px",
                height: "115px",
              }}
            >
              <h1>Rec Videos</h1>
            </div>
          </div>
          <div id="lo" style={this.state.dis}>
            <AccountCircle
              style={{ position: "relative", top: "4px", left: "4px" }}
            />
            <Tooltip
              placement="top"
              title={
                <span style={{ fontSize: "150%" }}>
                  Toggle switch Log In / Sign Up
                </span>
              }
            >
              <Switch
                checked={this.state.checkedA}
                onChange={this.handleChange0("checkedA")}
                value="checkedA"
                inputProps={{
                  "aria-label": "Toggle switch sign In / Up",
                }}
              />
            </Tooltip>
            <h2> &nbsp;{this.state.a}</h2>
            <form id="a2" style={this.state.dis0} onSubmit={this.sub0}>
              <TextField
                inputProps={{
                  maxLength: 16,
                }}
                InputProps={{
                  style: {
                    color: "white",
                    fontSize: "170%",
                    borderRadius: 0,
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
                type="text"
                name="username"
                placeholder="User:"
                onChange={this.change}
              />
              <TextField
                inputProps={{
                  maxLength: 16,
                }}
                InputProps={{
                  style: {
                    color: "white",
                    fontSize: "170%",
                    borderRadius: 0,
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOpenIcon />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
                type="password"
                name="password"
                placeholder="Pass:"
                onChange={this.change}
              />
              <Button
                style={{
                  color: "white",
                  backgroundColor: "black",
                  width: "100%",
                  height: "60px",
                  fontSize: "120%",
                  borderRadius: 0,
                }}
                variant="contained"
                type="submit"
              >
                {" "}
                Log In
              </Button>
            </form>
            <form id="a1" style={this.state.dis1} onSubmit={this.sub}>
              <TextField
                inputProps={{
                  maxLength: 16,
                }}
                InputProps={{
                  style: {
                    color: "white",
                    fontSize: "170%",
                    borderRadius: 0,
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
                type="text"
                name="username"
                placeholder="User:"
                onChange={this.change}
              />
              <TextField
                inputProps={{
                  maxLength: 16,
                }}
                InputProps={{
                  style: {
                    color: "white",
                    fontSize: "170%",
                    borderRadius: 0,
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOpenIcon />
                    </InputAdornment>
                  ),
                }}
                variant="filled"
                type="password"
                name="password"
                placeholder="Pass:"
                onChange={this.change}
              />
              <Button
                style={{
                  color: "white",
                  backgroundColor: "black",
                  width: "100%",
                  height: "60px",
                  fontSize: "120%",
                  borderRadius: 0,
                }}
                variant="contained"
                type="submit"
              >
                {" "}
                Sign Up
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
ReactDOM.render(<Index />, document.getElementById("root"));

export default Index;
