import React from "react";
import ReactDOM from "react-dom";
import Menu from "./menu.js";
import "./cart.css";
import "./index.css";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";
import jwt from "jsonwebtoken";
import axios from "axios";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: props.uses,
      xt: null,
      dd: true,
      vd: props.vidy,
      c: null,
      vdel: null,
      dis: { display: "none" },
    };
  }
  componentDidMount() {
    axios
      .post(`/g`)
      .then((res) => {
        let rsss = jwt.verify(
          res.data.tokenres,
          process.env.REACT_APP_JWT_SECRET
        );
        return this.tab(rsss.message);
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
        return use.message.payed;
      })
      .then((res) => {
        if (res === false) {
          document
            .getElementById("vvv")
            .addEventListener("timeupdate", (event) => {
              if (!event.target._startTime)
                event.target._startTime = event.target.currentTime;
              let playedTime =
                event.target.currentTime - event.target._startTime;
              if (playedTime >= 10) event.target.pause();
            });
        }
      })
      .catch((error) => {
        alert(error.response.statusText);
      });
    if (this.state.vd) {
      this.play(this.state.vd);
    }
  }
  change = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val, c: null, dis: { display: "none" } });
  };
  sub = (event) => {
    event.preventDefault();
    function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
    if (this.state.vdel) {
      if (
        endsWith(this.state.vdel.toLowerCase(), ".mp4.mp4") &&
        8 === this.state.vdel.length
      ) {
        this.setState({
          c: "Anything but .mp4.mp4",
          dis: { display: "block" },
        });
      } else {
        let token = jwt.sign(
          { namev: this.state.vdel },
          process.env.REACT_APP_JWT_SECRET,
          { expiresIn: 60 * 2 }
        );
        axios
          .post(`/ggg`, { token: token })
          .then((res) => {
            let rsss = jwt.verify(
              res.data.tokenres,
              process.env.REACT_APP_JWT_SECRET
            );
            if (rsss.message) {
              this.setState({ c: rsss.message, dis: { display: "block" } });
            }
            if (rsss.mes) {
              return this.taby(rsss.mes);
            }
          })
          .catch((error) => {
            alert(error.response.statusText);
          });
      }
    } else {
      this.setState({ c: "Search form imcomplete", dis: { display: "block" } });
    }
    document.getElementById("f3").reset();
    this.setState({ vdel: "" });
  };
  taby = (res) => {
    let mm = res.map((key, index) => {
      let gg = key.split("vid/").pop();
      let rr = gg.split("/").shift();
      let n = key.lastIndexOf("/");
      let m = key.length;
      let re = key.slice(n + 1, m);
      let ss = "\xa0\xa0" + re + "\xa0\xa0";
      return (
        <ul
          className="aaa"
          key={index}
          style={{
            listStyleType: "square",
            width: "400px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <li style={{ width: "375px", textAlign: "right" }}>
            <span
              onClick={() => {
                document.querySelector(".c" + rr).scrollIntoView();
                document.querySelector("#id" + rr).style.display = "block";
              }}
              className="boo"
            >
              {" "}
              {rr}{" "}
            </span>
            <span className="baa" onClick={() => this.play(key)}>
              {" "}
              {ss}{" "}
            </span>
          </li>
          <br />
        </ul>
      );
    });
    ReactDOM.render(mm, document.getElementById("fyy"));
  };
  tab = (res) => {
    this.setState({
      xt: res.map((key, index) => {
        const { _id, ofString, username } = key;
        let mm = ofString.map((key, index) => {
          let n = key.lastIndexOf("/");
          let m = key.length;
          let re = key.slice(n + 1, m);
          let ss = "\xa0\xa0" + re + "\xa0\xa0";
          return (
            <span className="wot" onClick={() => this.play(key)} key={index}>
              {ss}
            </span>
          );
        });
        return (
          <table style={{ width: "100%", backgroundColor: "black" }} key={_id}>
            <tbody key={_id + "0"}>
              <tr key={_id + "1"}>
                <td className={"c" + username}>
                  <Button
                    onClick={() =>
                      (document.querySelector("#id" + username).style.display =
                        "block")
                    }
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
                    {username}
                  </Button>
                </td>
              </tr>
              <tr key={_id + "2"}>
                <td>
                  <p
                    id={"id" + username}
                    style={{
                      paddingTop: "5px",
                      minHeight: "80px",
                      width: "calc(100% - 4px)",
                      display: "none",
                      fontSize: "110%",
                      margin: 0,
                      textAlign: "right",
                      color: "white",
                      backgroundColor: "rgb(111, 26, 189)",
                      border: "solid 2px black",
                    }}
                  >
                    {mm}
                    <CloseIcon
                      className="bbb"
                      style={{ float: "right", width: "80px", height: "80px" }}
                      onClick={() =>
                        (document.querySelector(
                          "#id" + username
                        ).style.display = "none")
                      }
                    />
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        );
      }),
    });
  };
  play = (a) => {
    let res = a.replace("./store/build/", "./");
    document.getElementById("vv").style.backgroundImage = "none";
    document.getElementById("vvv").src = res;
    document.getElementById("vv").style.padding = 0;
    this.setState({ vd: null });
    window.scrollTo(0, 115);
    document.getElementById("vvv").onended = () => {
    document.getElementById("vv").style.backgroundImage = "url('wlle.jpg')";
    document.getElementById("vv").style.padding = "5%";
  
    };
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
          <div id="vv">
            <video id="vvv" poster="tv.jpg" controls>
              <source src="" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <Tooltip
            placement="top"
            title={<span style={{ fontSize: "150%" }}>Search for a Video</span>}
          >
            <form id="f3" onSubmit={this.sub}>
              <input
                maxLength="40"
                id="vdel"
                type="text"
                name="vdel"
                placeholder="Search Video"
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
                Search
              </Button>
            </form>
          </Tooltip>
          <br />
          <div style={{ height: "25px" }}>
            <h3 className="mss" style={this.state.dis}>
              {this.state.c}
            </h3>
          </div>
          <br />
          <h3 style={{ textAlign: "center", padding: 0 }}>Videos</h3>
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
            id="fyy"
          ></div>
          <div style={{ height: "80px" }}></div>
          <div style={{ backgroundColor: "black" }}>{this.state.xt}</div>
          <div style={{ height: "80px" }}></div>
        </div>
      </div>
    );
  }
}

export default Cart;
