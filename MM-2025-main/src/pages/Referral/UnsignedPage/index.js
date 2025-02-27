import {connect} from 'react-redux'
import { BsLightning } from 'react-icons/bs';
import { useMediaQuery } from "react-responsive";

import ContainerComponentTransparent from "../../../components/ContainerComponentTransparent";
import CoinImg from '../../../assets/images/referral/coins.png';
import CoinSmallImg from '../../../assets/images/referral/coins_small.png';
import MonkeyImg from '../../../assets/images/referral/Banner 2.png';
import MonkeyImg1 from '../../../assets/images/whiteMonkey.png';
import ReferImg from '../../../assets/images/referral/refer-header.png';
import EarnImg from '../../../assets/images/referral/earn-header.png';
import { showSelectWalletModal } from '../../../actions/gameActions'

import './index.scss';

const UnsignedPage = (props) => {
  const {showSelectWalletModal} = props
  const clickConnectWalletBtn = () => {
    showSelectWalletModal()
  }
  const isDesktop = useMediaQuery({ query: "(min-width: 800px)" });
    return (
      <div className="referral-unsigned">
        
        <ContainerComponentTransparent className="alert-content">
          <img className="coin-img" src={isDesktop? CoinImg: CoinSmallImg}></img>

          <div className="main-content">
            <div className="message-content">
              <p className="title gradient-font">Get up to 1.5% For All Winning Bets</p>
              <p className="description">Invite your friends and earn more together!</p>
              <p className="description">Receive passive income from all your referral’s winnings and set kickback rates to share the earnings with your friends.</p>
            </div>
            <img className="monkey-img" src={MonkeyImg}></img>
          </div>
          
          
        


        </ContainerComponentTransparent>
        <div className="wallet-connnect-content">
          <div>
            <p className="title">How it works</p>
            <div className="work-description">
              <div className="sub-content">
                <img src={ReferImg} className="title-img"></img>
                <div className="description">
                  Enjoy passive income for each referred player who signs up using your referral link and plays on the platform.
  Create multiple campaigns with unique referral links and personalized commission and referral kickback rates!
                </div>
              </div>
              <div className="sub-content" style={{marginTop:"-2.6%"}}>
              <img src={EarnImg} className="title-img"></img>
                <div className="description">
                  Enjoy passive income for each referred player who signs up using your referral link and plays on the platform.
  Create multiple campaigns with unique referral links and personalized commission and referral kickback rates!
                </div>
              </div>
              
              
            </div>
          </div>
            <div className="connect-content">
                
                <button className="connect-button" onClick={clickConnectWalletBtn}>CONNECT WALLET</button>
            </div>
        </div>
      </div>
    );
}
// {/* <img className="coin-img" src={CoinImg}></img>
//           <img className="monkey-img" src={MonkeyImg}></img> */}
const mapStateToProps  = (state) => (
  {
      
  }
)

export default connect(mapStateToProps, {showSelectWalletModal})(UnsignedPage)