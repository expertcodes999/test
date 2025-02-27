import React, {useEffect} from "react";

import "./index.scss";
import BetTypeContainer from './BetTypeContainer';
import MainChartComponent from "../../components/MainChartComponent";
import SoundComponent from "../../components/SoundComponent";
import GameDataController from "../../components/GameDataController";
import { useMediaQuery } from 'react-responsive'

import ChatAndHistory from './ChatAndHistory';
import PlayersDesktop from '../../components/PlayersPanel/PlayersDesktop';
import {connect} from 'react-redux'
import {changeUseChainData} from '../../actions/userActions'
import { bscChainData } from '../../constants/chain';

const Play = (props) => {
  const {changeUseChainData} = props;
  const testMode = false;
  const isDesktop = useMediaQuery({ query: '(min-width: 800px)' })
  useEffect(() => {
    changeUseChainData(bscChainData)
  },[]);
  return (
    
    <div className="dashboard">
    {
      !testMode &&
      <>
        <SoundComponent/>
        <GameDataController/>
        <div className="game-bet-chat-content">
          <div className="game-bet">
            <div className="game">
              <MainChartComponent />
            </div>
            <div className="bet">
              <div
                className="bet-wrapper"
              >
                <BetTypeContainer/>
              </div>
            </div>
          </div>
          <ChatAndHistory/>  
        </div>
        { isDesktop &&
          <div className="players-content">
            <PlayersDesktop/>  
          </div>
        }
      </>
    }
    </div>
        
  );
};

const mapStateToProps  = (state) => (
  {

  }
)

export default connect(mapStateToProps, {changeUseChainData})(Play)
