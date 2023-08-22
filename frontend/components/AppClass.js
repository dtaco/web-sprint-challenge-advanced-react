import React from 'react'
import axios from "axios"

//starting state - I should not touch this...
const initialState = {
  message: '',
  email: '',
  index: 4,
  steps: 0,
}

export default class AppClass extends React.Component {
  constructor(){
    super();
    //my state lives here
    this.state = {
      grid: {
        ...initialState,
      currentX: 2,
      currentY: 2
      }
    }
  }

  getXY = (coordinate) => {
    const coordinatesMap = {
      "11": [0, 0],
      "21": [1, 0],
      "31": [2, 0],
      "12": [0, 1],
      "22": [1, 1],
      "32": [2, 1],
      "13": [0, 2],
      "23": [1, 2],
      "33": [2, 2],
    };
  
    const [newX, newY] = coordinatesMap[coordinate]; //this SHOULD set the coordinates based on the object above
    this.move(newX + newY * 3, newX + 1, newY + 1);
  };
  

  getXYMessage = (direction) => {
    let message = "";
    
    if (direction === "left") {
      message = `You can't go ${direction}`;
    } else if (direction === "right") {
      message = `You can't go ${direction}`;
    } else if (direction === "up") {
      message = `You can't go ${direction}`;
    } else if (direction === "down") {
      message = `You can't go ${direction}`;
    }
  
    this.setState({
      ...this.state,
      grid: {
        ...this.state.grid,
        message: message
      }
    });
  }
  

  reset = () => {
    this.setState({
      ...this.state,
      grid: {
        message: initialState.message,
        email: initialState.email,
        index: initialState.index, 
        steps: initialState.steps,
        currentX: 2,
        currentY: 2
      }
    })

    console.log('You reset everything!')
  }

  getNextIndex = (direction) => {
    const { currentX, currentY } = this.state.grid;
  
    let newX = currentX;
    let newY = currentY;
  
    if (direction === "left" && currentX !== 1) {
      newX = currentX - 1;
    } else if (direction === "right" && currentX !== 3) {
      newX = currentX + 1;
    } else if (direction === "up" && currentY !== 1) {
      newY = currentY - 1;
    } else if (direction === "down" && currentY !== 3) {
      newY = currentY + 1;
    } else {
      this.getXYMessage(direction);
      return;
      //return without performing anything else...
    }
  
    this.getXY(`${newX}${newY}`, newX, newY); //if we get here we run getXY method with new values
  };

  move = (newIndex, newX, newY) => {
    this.setState({
      ...this.state,
      grid: {
        ...this.state.grid,
        index: newIndex,
        currentX: newX,
        currentY: newY,
        steps: this.state.grid.steps + 1,
        message: ''
      }
    })
  }

  onChange = (evt) => {
    const emailInput = evt.target.value;
    this.setState({
      ...this.state, 
      grid: {
        ...this.state.grid,
        email: emailInput
      }
    })
  }

  onSubmit = (evt) => { 
    evt.preventDefault();
    const URL = "http://localhost:9000/api/result" 
    axios.post(URL, {"x": this.state.grid.currentX, "y": this.state.grid.currentY, "steps": this.state.grid.steps, "email": this.state.grid.email})
    .then(res => {
      this.setState({
        ...this.state, 
        grid: {
          ...this.state.grid,
          message: res.data.message,
          email: '' //reset the email
        }
      })
    })
    .catch(error => {
      this.setState({
        ...this.state,
        grid: {
          ...this.state.grid,
          message: error.response.data.message
        }
      })
    });
  }

  render() {

    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({this.state.grid.currentX}, {this.state.grid.currentY})</h3>
          <h3 id="steps">You moved {this.state.grid.steps} {this.state.grid.steps === 1 ? "time" : "times"}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.grid.index ? ' active' : ''}`}>
                {idx === this.state.grid.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.grid.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.getNextIndex("left")}>LEFT</button>
          <button id="up" onClick={() => this.getNextIndex("up")}>UP</button>
          <button id="right" onClick={() => this.getNextIndex("right")}>RIGHT</button>
          <button id="down" onClick={() => this.getNextIndex("down")}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="Your Email" value={this.state.grid.email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}