import React from 'react';
//import AnimatedNumber from "react-animated-number";
import {connect} from 'react-redux'
import { useEffect, useState } from 'react';
import {GAME_STATE} from '../../utils/types'

const CurrentValueDisplayer = (props) => {
  const {gameResult, gameState, displayValue} = props
  const [flyingUp, setFlyingUp] = useState(false)
  useEffect(() => {
    if(gameState === GAME_STATE.WAITING) {
      
    }
  }, [])
  useEffect(() => {
    if(gameState === GAME_STATE.WAITING) {
      setTimeout(()=>setFlyingUp(true), 5000)
    }
    else {
      setFlyingUp(false)
    }
  }, [gameState])

  return (
    <>
      <div className={`current-value-displayer ${gameState === GAME_STATE.RUNNING ? "show": "hidden"}`}>
        {/* <AnimatedNumber
            value={displayValue}
            style={{
              color: "white"
            }}
            className="aniamted-current-value"
            duration={300}
            formatValue={(n) => n.toFixed(2)}
          /> */}
        <span className="aniamted-current-value" id="game-value">{Number(displayValue).toFixed(2)}</span>
        <span className="multi-icon">X</span>
        <div className="title">Current Payout</div>
      </div>
      <div className={`crashed-game ${gameState === GAME_STATE.CRASHED ? "show": "hidden"}`}>
          <div className="title-top">CRASHED</div>
          <div className="value">{Number(gameResult).toFixed(2)}<span>X</span></div>
          <div className="title-bottom">Round Over</div>
      </div>
      <div className={`waiting-round ${(gameState === GAME_STATE.WAITING) && !flyingUp ? "show": "hidden"}`}>
          <div className="title">Next round in</div>
      </div>
    </>
  );

};


const mapStateToProps  = (state) => (
  {
      displayValue: state.displayData.value,
      gameResult: state.gameValue.gameResult,
      gameState: state.gameValue.gameState,
      timeToStart: state.betGameData.timeToStart,
  }
)

export default connect(mapStateToProps, {})(CurrentValueDisplayer)
