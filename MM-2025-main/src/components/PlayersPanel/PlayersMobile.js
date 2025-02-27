import {connect} from 'react-redux'
import { useState, useEffect } from 'react';

import './index.scss';

import PlayerCell from "./PlayerCell.js";

const testData = [
    {
        username: "asdf",
        amount: 1,
        multiplier: "asdf",
        gameResult: "asdf"
    }
]
const PlayersMobile = (props) => {
    const {allBets, onlinePlayerCount} = props;
    const [totalBet, setTotalBet] = useState(0)
    useEffect(() => {

        // Calculate total bet
        let _totalBet = 0;
        for (let i = 0; i < allBets.length; i++) {
            _totalBet += Number(allBets[i].amount);;
        }

        setTotalBet(_totalBet);
    },[allBets]);
    return (
        <div className="players-mobile">
            <div className="players">
                <div>
                    
                    <div className="player-table">
                        <table className="table">
                            <tr>
                                <th className="h-player">Players: {allBets.length}</th>
                                <th className="h-wager">Wager</th>
                                <th className="h-multi">Mult</th>
                                <th className="h-payout">Payout</th>
                            </tr>
                            {
                                allBets.length > 0 &&
                                allBets.map((data, index) => 
                                    <PlayerCell p_address="" p_name={data.username} key={index}
                                        wager={data.amount} mulitplayer={data.multiplier} 
                                        payout="+2.50 BNB"
                                        pay_type="bnb1"/>
                                )
                            }
                        </table>
                    </div>
                </div>
                <div className="total-info">
                    <div>Online: <span>{onlinePlayerCount}</span></div>
                    <div>Playing: <span>{allBets.length}</span></div>
                    <div>Bet Amount: <span>{Number(Number(totalBet).toFixed(0)).toLocaleString('en-US')}</span></div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps  = (state) => (
    {
        allBets: state.usersBetData.allBets,
        onlinePlayerCount: state.usersBetData.onlinePlayerCount 
    }
)

export default connect(mapStateToProps, {})(PlayersMobile)