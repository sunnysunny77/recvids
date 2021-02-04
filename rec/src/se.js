import React from "react";
import Menu from "./menu.js";
import "./se.css";
import "./index.css";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import jwt from "jsonwebtoken";
import axios from "axios";

class Se extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: props.uses,
      b: null,
      c: null,
      p: "Choose video",
      dis: { display: "none" },
      dis1: { display: "none" },
      file: null,
      del: "",
    };
  }
  change = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({
      [nam]: val,
      b: null,
      dis: { display: "none" },
      c: null,
      dis1: { display: "none" },
    });
  };
  file = (event) => {
    this.setState({
      p: event.target.files[0].name,
      file: event.target.files[0],
      b: null,
      dis: { display: "none" },
      c: null,
      dis1: { display: "none" },
    });
  };
  sub0 = (event) => {
    event.preventDefault();
    if (this.state.del) {
      let ext = this.state.del.split(".").pop();
      let extt = ext.trim();
      if (extt === "mp4") {
        let token = jwt.sign(
          { vidname: this.state.del.trim(), username: this.state.a },
          process.env.REACT_APP_JWT_SECRET,
          { expiresIn: 60 * 2 }
        );
        axios
          .post(`/down`, { token: token })
          .then((res) => {
            let rsss = jwt.verify(
              res.data.tokenres,
              process.env.REACT_APP_JWT_SECRET
            );
            this.setState({ c: rsss.message, dis1: { display: "block" } });
          })
          .catch((error) => {
            alert(error.response.statusText);
          });
      } else {
        this.setState({
          c: "Delete is not a .mp4",
          dis1: { display: "block" },
        });
      }
    } else {
      this.setState({
        c: "Delete form imcomplete",
        dis1: { display: "block" },
      });
    }
    document.getElementById("f1").reset();
    this.setState({ del: "" });
  };
  sub = (event) => {
    event.preventDefault();
    function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
    if (this.state.file) {
      if (this.state.file.name.length <= 40) {
        if (!endsWith(this.state.file.name.toLowerCase(), ".mp4.mp4")) {
          if (this.state.file.size < 100000000) {
            let extension = this.state.file.name.split(".").pop();
            if (extension === "mp4") {
              this.setState({ b: "Loading", dis: { display: "block" } });
              document.querySelector(".custom-file-upload").style.cursor =
                "progress";
              document.querySelector("#wy").style.cursor = "progress";
              document.querySelector("html").style.cursor = "progress";
              document.querySelector("#del").style.cursor = "progress";
              document.querySelector("#wy1").style.cursor = "progress";
              let formData = new FormData();
              formData.append("filetoupload", this.state.file);
              let token = jwt.sign(
                { username: this.state.a },
                process.env.REACT_APP_JWT_SECRET,
                { expiresIn: 60 * 2 }
              );
              formData.append("go", JSON.stringify({ token: token }));
              axios
                .post(`/up`, formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                })
                .then((res) => {
                  let rsss = jwt.verify(
                    res.data.tokenres,
                    process.env.REACT_APP_JWT_SECRET
                  );
                  this.setState({ b: rsss.message, dis: { display: "block" } });
                  document.querySelector(".custom-file-upload").style.cursor =
                    "pointer";
                  document.querySelector("#wy").style.cursor = "pointer";
                  document.querySelector("html").style.cursor = "initial";
                  document.querySelector("#del").style.cursor = "pointer";
                  document.querySelector("#wy1").style.cursor = "pointer";
                })
                .catch((error) => {
                  alert(error.response.statusText);
                });
            } else {
              this.setState({
                b: "Upload is not a .mp4",
                dis: { display: "block" },
              });
            }
          } else {
            this.setState({
              b: "Upload is over 100MB",
              dis: { display: "block" },
            });
          }
        } else {
          this.setState({
            b: "Anything but .mp4.mp4",
            dis: { display: "block" },
          });
        }
      } else {
        this.setState({ b: "Upload name is > 50", dis: { display: "block" } });
      }
    } else {
      this.setState({ b: "Upload form imcomplete", dis: { display: "block" } });
    }
    document.getElementById("f0").reset();
    this.setState({ file: null, p: "Choose video" });
  };
  render() {
    return (
      <div className="cont">
        <nav>
          <h2 className="h2">{this.state.a}</h2>
          <br />
          <h1 className="h1" style={{ padding: "0px 20px" }}>
            Rec Videos
          </h1>
        </nav>
        <Menu uses0={this.state.a} />
        <div id="di">
          <div style={{ height: "80px" }}></div>
          <Tooltip
            placement="top"
            title={
              <span style={{ fontSize: "150%" }}>Upload a .mp4 100MB cap</span>
            }
          >
            <form id="f0" onSubmit={this.sub}>
              <label htmlFor="file-upload" className="custom-file-upload">
                <p>{this.state.p}</p>
              </label>
              <input
                id="file-upload"
                type="file"
                name="file"
                onChange={this.file}
              />
              <Button
                id="wy"
                style={{
                  width: "100%",
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
                Upload
              </Button>
            </form>
          </Tooltip>
          <br />
          <div style={{ height: "25px" }}>
            <h2 id="cent0" className="h2" style={this.state.dis}>
              {this.state.b}
            </h2>
          </div>
          <br />
          <br />
          <Tooltip
            placement="top"
            title={<span style={{ fontSize: "150%" }}>Delete a .mp4</span>}
          >
            <form id="f1" onSubmit={this.sub0}>
              <input
                maxLength="40"
                id="del"
                type="text"
                name="del"
                placeholder="Viedo name"
                onChange={this.change}
              />
              <Button
                id="wy1"
                style={{
                  width: "100%",
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
                Delete
              </Button>
            </form>
          </Tooltip>
          <br />
          <div style={{ height: "25px" }}>
            <h2 id="cent1" className=" h2" style={this.state.dis1}>
              {this.state.c}
            </h2>
          </div>
        </div>
      </div>
    );
  }
}

export default Se;
