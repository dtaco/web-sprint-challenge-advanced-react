import React, { useState } from 'react'
import axios from 'axios';

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 

export default function AppFunctional(props) {
 const [gridState, setGridState] = useState({
    message: initialMessage,
    email: initialEmail,
    steps: initialSteps,
    index: initialIndex,
    currentX: 2,
    currentY: 2
 })

  function getXY(coordinate) {
    const coordinatesMap = {
      '11': [0,0],
      '21': [1,0],
      '31': [2,0],
      '12': [0,1],
      '22': [1,1],
      '32': [2,1],
      '13': [0,2],
      '23': [1,2],
      '33': [2,2]
    };

    const [newX, newY] = coordinatesMap[coordinate];
    move(newX + newY * 3, newX + 1, newY + 1);
  }

  function getXYMessage(direction) {
   let message = '';

   if (direction === 'left') {
    message = `You can't go ${direction}`;
   } else if (direction === 'right') {
    message = `You can't go ${direction}`;
   } else if (direction === 'up') {
    message = `You can't go ${direction}`;
   } else if (direction === 'down') {
    message = `You can't go ${direction}`;
   }

   setGridState({
    ...gridState,
    message: message
   });
  }

  function reset() {
    setGridState({
      message: initialMessage,
      email: initialEmail,
      index:initialIndex,
      steps: initialSteps,
      currentX: 2,
      currentY: 2
    })
  }

  function getNextIndex(direction) {
    const { currentX, currentY } = gridState;

    let newX = currentX;
    let newY = currentY;

    if (direction === 'left' && currentX !== 1) {
      newX = currentX - 1;
    } else if (direction === 'right' && currentX !== 3) {
      newX = currentX + 1;
    } else if (direction === 'up' && currentY !== 1) {
      newY = currentY - 1;
    } else if (direction === 'down' && currentY !== 3) {
      newY = currentY + 1;
    } else {
      getXYMessage(direction);
      return;
    }

    getXY(`${newX}${newY}`, newX, newY);
  }

  function move(newIndex, newX, newY) {
    setGridState({
      ...gridState,
      index: newIndex,
      currentX: newX,
      currentY: newY,
      steps: gridState.steps + 1,
      message: '',
    });
  }

  function onChange(evt) {
    const emailInput = evt.target.value;

    setGridState({
      ...gridState,
      email: emailInput
    });
  }

  function onSubmit(evt) {
    evt.preventDefault();

    const URL = 'http://localhost:9000/api/result';
    axios.post(URL, {
      x: gridState.currentX,
      y: gridState.currentY,
      steps: gridState.steps,
      email: gridState.email
    })
    .then((res) => {
      setGridState({
        ...gridState,
        message: res.data.message,
        email: ''
      });
    })
    .catch((err) => {
      setGridState({
        ...gridState,
        message: err.response.data.message
      });
    });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({gridState.currentX}, {gridState.currentY})</h3>
        <h3 id="steps">You moved {gridState.steps} {gridState.steps === 1 ? 'time' : 'times'} </h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === gridState.index ? ' active' : ''}`}>
              {idx === gridState.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{gridState.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => getNextIndex('left')}>LEFT</button>
        <button id="up" onClick={() => getNextIndex('up')}>UP</button>
        <button id="right" onClick={() => getNextIndex('right')}>RIGHT</button>
        <button id="down" onClick={() => getNextIndex('down')}>DOWN</button>
        <button id="reset" onClick={() => reset()}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input 
          id="email" 
          type="email" 
          placeholder="type email" 
          value={gridState.email}
          onChange={onChange} 
          ></input>
        <input 
          id="submit" 
          type="submit"
        ></input>
      </form>
    </div>
  )
}
