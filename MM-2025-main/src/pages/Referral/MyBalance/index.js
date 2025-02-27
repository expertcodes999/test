import { useEffect, useState } from "react";

import { gerReferralBalance, claimReferral, setPopUp } from '../../../actions/gameActions'
import BNBCoinImg from '../../../assets/images/Neon___flare_BNB.png';
import './index.scss';

const MyBalance = () => {
  const [myBalance, setMyBalance] = useState(0)
  useEffect(
    async () => {
      const _balance = await gerReferralBalance()
      setMyBalance(_balance)
    }, []
  );
  const clickCaimBtn = async () => {
    const result = await claimReferral()
    if(result === "Sucessfully claimed") {
      window.location.reload()
    }
    else {
      setPopUp(result)
    }
  }
    return (
      <div className="my-balance">
        <div className="mooning-table coin-table">
          <div className="table-header">
            <div className="header-cell mooning-purple-text">Available</div>
            <div className="header-cell">Total</div>
          </div>
          <div className="data-list">
            <div className="data-cell">
              <div className="cell-available">
                <img className="coin-img" src={BNBCoinImg}></img>
                <div className="coin-name">BNB</div>
              </div>
              <div className="cell-balance">
                <div className="coin-name">{myBalance}</div>
              </div>
            </div>
          </div>
        </div>
        <button className="cta-btn claim-btn" onClick={clickCaimBtn}>CLAIM</button>
      </div>
    );
}

export default MyBalance;