import React from "react";
import ReactDOM from "react-dom";
import "./m.css";
import Cart from "./cart.js";
import Se from "./se.js";
import Ac from "./ac.js";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: props.uses0,
    };
  }
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll = () => {
    if (window.scrollY >= 115) {
      document.querySelector(".m").style.position = "fixed";
      document.querySelector(".m").style.top = "0";
      document.querySelector("#di").style.position = "relative";
      document.querySelector("#di").style.paddingTop = "50px";
    } else {
      document.querySelector(".m").style.position = "relative";
      document.querySelector("#di").style.paddingTop = "0";
    }
  };
  render() {
    return (
      <div>
        <div className="m">
          <span
            onClick={() =>
              ReactDOM.render(
                <Se uses={this.state.a} />,
                document.getElementById("root")
              )
            }
          >
            &bull;Upload & Delete
          </span>
          <span
            onClick={() =>
              ReactDOM.render(
                <Ac uses={this.state.a} />,
                document.getElementById("root")
              )
            }
          >
            &bull;Account
          </span>
          <span
            onClick={() =>
              ReactDOM.render(
                <Cart uses={this.state.a} />,
                document.getElementById("root")
              )
            }
          >
            &bull;Search & Play
          </span>
        </div>
      </div>
    );
  }
}

export default Menu;
