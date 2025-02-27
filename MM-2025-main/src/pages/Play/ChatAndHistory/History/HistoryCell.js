import './index.scss';
import React from 'react';

import bnb1Img from '../../../../assets/images/playpage/bnb1.png';
import bnb2Img from '../../../../assets/images/playpage/bnb2.png';
import TakCoinImg from '../../../../assets/images/Neon___flare_BNB.png';
import {format} from 'date-fns';
import {GAME_HISTORY_TYPE} from "../../../../utils/types";

const HistoryCell = (props) => {
    const { h_game, h_address, h_time, h_wager, h_mult, h_payout, pay_type, type, h_username } = props;
    
    let styles;
    if(h_payout < 1){
        // If this was a loss show red text
        styles= {
            color: 'red',
        };
    }


    return (
        <div className="history-cell">
            {/* <div className="game data-item">{h_game}</div> */}
            {
                type !== GAME_HISTORY_TYPE.MY_WAGER &&
                <div className="username data-item">{h_username}</div>
            }
            
            <div className="time data-item">{format(new Date(h_time), 'p')}</div>
            <div className="wager data-item">
                <div className="wager-container">
                    <img style={{display: pay_type == "bnb1" ? "block" : "none"}} src={bnb1Img}></img>
                    <img style={{display: pay_type == "bnb2" ? "block" : "none"}} src={bnb2Img}></img>
                    <img style={{display: pay_type == "tak" ? "block" : "none"}} src={TakCoinImg}></img>
                    <p>{h_wager}</p>
                </div>
            </div>
            <div className="mult data-item"><p>{h_mult}</p> <span>x</span></div>
            <div className="payout data-item">
                
                <img style={{display: pay_type == "bnb1" ? "block" : "none"}} src={bnb1Img}></img>
                <img style={{display: pay_type == "bnb2" ? "block" : "none"}} src={bnb2Img}></img>
                <img style={{display: pay_type == "tak" ? "block" : "none"}} src={TakCoinImg}></img>
                <p style={styles}>{Number(h_payout).toLocaleString('en-US')}</p>
            </div>
            
        </div>
    );
}

export default HistoryCell;