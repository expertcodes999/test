import './index.scss';
import React from 'react';
import {connect} from 'react-redux'
import { FaCircle } from 'react-icons/fa';
import {GAME_STATE} from '../../utils/types'

const PlayerCell = (props) => {
    const { p_address, p_name, wager, mulitplayer, payout, gameState, displayValue } = props;
    let p_state = "white-moon-text";
    let achieved = false;
    if(displayValue < 0) {
        p_state = "white-moon-text";
    }
    else {
        p_state = displayValue > mulitplayer ? "active" : gameState === GAME_STATE.CRASHED ? "red-moon-text" : "normal";
        achieved = displayValue > mulitplayer
    }
    return (
        <tr>
            <td className={"player " + p_state}>
                <div className="player-div">
                    <FaCircle></FaCircle>&nbsp;
                    {" " + p_address + " " + p_name}
                </div>
            </td>
            <td className={"wager " + p_state}>{Number(wager)}</td>
            <td className={"multi " + p_state}>{achieved ? `${mulitplayer}x` : "-"}</td>
            <td className={"payout " + p_state}>
                {achieved ? (Number(wager)*Number(mulitplayer)).toFixed(2).toLocaleString('en-US') : "-"}

                {/*<img style={{display: pay_type == "bnb1" ? "block" : "none"}} src={TakCoinImg}></img>
                <img style={{display: pay_type == "bnb2" ? "block" : "none"}} src={TakCoinImg}></img>*/}
            </td>
        </tr>
    );
}

const mapStateToProps  = (state) => (
    {
        displayValue: state.displayData.value,
        gameState: state.gameValue.gameState
    }
)

export default connect(mapStateToProps, {})(PlayerCell)