import {connect} from 'react-redux'
import { useEffect, useState } from "react";
import './index.scss';
import ContainerComponent from "../../../../components/ContainerComponent";
import TabsBottomRainBow from "../../../../components/TabsBottomRainBow";
import HistoryTable from "./HistoryTable.js";
import {GAME_HISTORY_TYPE, GAME_STATE} from "../../../../utils/types";
import {getHistoryData} from "../../../../actions/gameActions"

const History = (props) => {
    const { getHistoryData, gameHistory, logged, gameState } = props;
    const [gameHistoryType, setGameHistoryType] = useState(GAME_HISTORY_TYPE.ALL)
    
    useEffect(
        () => {
            switch(gameState) {
                // Update history after new game round started
                case GAME_STATE.WAITING:
                    getHistoryData(gameHistoryType)
                break;
            }
        },
        [gameState, gameHistoryType],
    );
    useEffect(
        () => {
            clickHistoryTab(GAME_HISTORY_TYPE.ALL)
        },
        [],
    );
    const clickHistoryTab = (historyType) => {
        setGameHistoryType(historyType)
        getHistoryData(historyType)
    }
    let tabDataList = [
        {
            title: "All Wins",
            component: <HistoryTable type=""/>,
            clickFunc: ()=>clickHistoryTab(GAME_HISTORY_TYPE.ALL)
        },
        {
            title: "High Wins",
            component: <HistoryTable type=""/>,
            clickFunc: ()=>clickHistoryTab(GAME_HISTORY_TYPE.HIGH_WINS)
        },
        {
            title: "Lucky Wins",
            component: <HistoryTable type=""/>,
            clickFunc: ()=>clickHistoryTab(GAME_HISTORY_TYPE.LUCKY_WINS)
        },
    ];

    if(logged){
        tabDataList.push(
            {
                title: "MY BETS",
                component: <HistoryTable type={GAME_HISTORY_TYPE.MY_WAGER}/>,
                clickFunc: ()=>clickHistoryTab(GAME_HISTORY_TYPE.MY_WAGER)
            }
        )
    }

    return (
        <div className="flex flex-col histroy">
            <TabsBottomRainBow tabDataList={tabDataList}/>
        </div>
                    
    );
}

const mapStateToProps  = (state) => (
    { 
        gameHistory: state.betGameData.gameHistory,
        logged: state.userData.logged,
        gameState: state.gameValue.gameState
    }
)
export default connect(mapStateToProps, {getHistoryData})(History)