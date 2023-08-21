import React from 'react'

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;// the index the "B" is at
const initialX = 2;
const initialY = 2;

// const initialState = {
//   message: initialMessage,
//   email: initialEmail,
//   index: initialIndex,
//   steps: initialSteps,
// }

export default class AppClass extends React.Component {
  constructor() {
    super();

    this.state = {
      x: initialX,
      y: initialY,
      steps:initialSteps,
      xy: initialIndex,
      message: initialMessage,
      formValues: ''
    }
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return(`(${this.state.x},${this.state.y})`)
  }

  // POSSIBLY NOT NECESSARY
  // getXYMessage = () => {
  //   // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
  //   // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
  //   // returns the fully constructed string.
  // }

  reset = () => {
    this.setState({
      x: initialX,
      y: initialY,
      steps: initialSteps,
      message: initialMessage,
      xy: initialIndex,
      formValues: '',
    })
    // console.log('You reset everything!')
  }

  getNextIndex = (direction) => {
    const x = this.state.x;
    const y = this.state.y;
    const steps = this.state.steps + 1
    const xy = this.state.xy;

    const newX = 
      direction === 'left' ? (x-1 === 0 ? x : x-1) :
      direction === 'right' ? (x+1 === 4 ? x : x+1) : 
      x;

    const newY =
      direction === 'up' ? (y-1 === 0 ? y : y-1) :
      direction === 'down' ? (y+1 === 4 ? y : y+1) :
      y;

    const newXY =
      direction === 'left' || direction === 'up' ? this.state.xy - 1 :
      direction === 'right' || direction === 'down' ? this.state.xy + 3 :
      this.state.xy;

    return {"x" : newX, "y": newY, "xy" : newXY, "steps": steps};
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (evt) => {
    console.log('You clicked ' + `${evt.target.id}`);
    
    console.log(this.getNextIndex(evt.target.id));
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
  }

  onSubmit = (evt) => {
    evt.preventDefailt();
    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates {this.getXY()}</h3>
          <h3 id="steps">You moved 0 times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
                {idx === 4 ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={(evt) => this.move(evt)}>LEFT</button>
          <button id="up" onClick={(evt) => this.move(evt)}>UP</button>
          <button id="right" onClick={(evt) => this.move(evt)}>RIGHT</button>
          <button id="down" onClick={(evt) => this.move(evt)}>DOWN</button>
          <button id="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
