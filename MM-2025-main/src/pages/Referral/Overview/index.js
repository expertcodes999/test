import { useEffect, useState } from "react";
import ContainerComponentTransparent from "../../../components/ContainerComponentTransparent";
import { FiUserPlus, FiPlusCircle } from 'react-icons/fi';
import { AiOutlineCopy } from 'react-icons/ai';
import { FaSnapchatSquare, FaInstagramSquare } from 'react-icons/fa';
import { BsTwitter, BsReddit } from 'react-icons/bs';
import { ImFacebook2, ImTumblr2 } from 'react-icons/im';

import { getReferralCode } from '../../../actions/userActions'
import { copyTextToClipboard, setPopUp, getReferralStats } from '../../../actions/gameActions'

import MonkeyImg from '../../../assets/images/monkey.png';
import './index.scss';

const Overview = (props) => {
  const [myReferralCode, setMyReferralCode] = useState("")
  const [referralStats, setReferralStats] = useState(["", 0, 0, 0])
  const socialShareStr = "I just won $1000 on MoonCrash.com! Join me for free! "
  useEffect(
    async () => {
      const _referralCode = await getReferralCode()
      if(_referralCode !== "error" && _referralCode !== "Not logged in!") {
        setMyReferralCode(`${window.location.origin}/play?refCode=${_referralCode}`)
      }
      else {
        setMyReferralCode("")
      }
      const _referralStats = await getReferralStats()
      if(_referralStats.length >= 1) {
        setReferralStats(_referralStats[0])
      }
    }, []
  );
  const clickCopyBtn = () => {
    copyTextToClipboard(myReferralCode)
    setPopUp("copied!")
  }
    return (
      <div className="referral-overview">
        <p className="title">My Referrals</p>
        <ContainerComponentTransparent className="user-data">
          <div className="data">
            <div className="user-name data-item">
              <FiUserPlus className="data-icon"/>
              <div className="data-description">
                <p className="data-title">Referred by</p>
                <p className="data-str">{referralStats[0] == "" ? "None" : referralStats[0] }</p>
              </div>
            </div>
            <div className="fund-data">
              <div className="data-item">
                <FiUserPlus className="data-icon"/>
                <div className="data-description">
                  <p className="data-title">Referrals</p>
                  <p className="data-str">{referralStats[1]}</p>
                </div>
              </div>
              <div className="data-item">
                <FiPlusCircle className="data-icon"/>
                <div className="data-description">
                  <p className="data-title">Total wager</p>
                  <p className="data-str">${referralStats[2]}</p>
                </div>
              </div>
              <div className="data-item">
                <FiPlusCircle className="data-icon"/>
                <div className="data-description">
                  <p className="data-title">Total earnings</p>
                  <p className="data-str">${referralStats[3]}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="logo-back-title">$$$</div>
          <img src={MonkeyImg} className="logo-img"></img>
        </ContainerComponentTransparent>
        <div className="social-commission">
          <ContainerComponentTransparent className="social-info row">
            <div className="col">
              <div className="referral-link info-item">
                <p className="title">My Referral link</p>
                <ContainerComponentTransparent className="link">
                  <p className="link-str">{myReferralCode}</p>
                  <AiOutlineCopy className="link-copy" onClick={clickCopyBtn} style={{ fill: "url(#orange-gradient)" }}/>
                </ContainerComponentTransparent>
              </div>
              <div className="promo info-item">
                <p className="title">Promo</p>
                <a  
                  target="_blank"
                  href="https://drive.google.com/drive/folders/16odOHR8dsxUtbnodLjUCQl3oy-TwvBZS?usp=sharing" 
                  className="cta-btn get-promo-btn">GET PROMO MATERIALS</a>
              </div>
            </div>
            <div className="col">
              <div className="info-item share">
                <p className="title">Share</p>
                <div className="share-collection">
                  <svg width="0" height="0">
                    <linearGradient id="orange-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop stopColor="#f27145" offset="0%" />
                      <stop stopColor="#efbf55" offset="100%" />
                    </linearGradient>
                    <linearGradient id="blue-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop stopColor="#7a6ded" offset="0%" />
                      <stop stopColor="#591885" offset="100%" />
                    </linearGradient>
                  </svg>
                  
                  <a target="_blank" 
                    href={`https://twitter.com/intent/tweet?url=${myReferralCode}&text=${socialShareStr}&via=MooningMonkeys&related=MooningMonkeys,Crypto,CrashGame`}
                  >
                    <BsTwitter className="share-linker" style={{ fill: "url(#blue-gradient)" }}/>
                  </a>
                  <a target="_blank" 
                    href={`https://www.tumblr.com/privacy/consent/begin?redirect=https%3A%2F%2Fwww.tumblr.com%2Fshare%2Fvideo%3Fembed%3D${myReferralCode}%2526feature%253Dshare%26caption%3D${socialShareStr}&v=2`}
                  >
                    <ImTumblr2 className="share-linker" style={{ fill: "url(#blue-gradient)" }}/>
                  </a>
                  <a target="_blank" 
                    href={`https://www.reddit.com/submit?url=${myReferralCode.replaceAll(':', '%3A').replaceAll('?', '%3F').replaceAll('=', '%3D').replaceAll('/', '%2F')}&title=${socialShareStr.replaceAll(' ', '%')}`}
                  >
                    <BsReddit className="share-linker" style={{ fill: "url(#blue-gradient)" }}/>
                  </a>
                  
                  
                </div>
              </div>
            </div>
          </ContainerComponentTransparent>
          <ContainerComponentTransparent className="commission">
            <p className="title">Commission</p>
            <p className="sub-title">Get up to 1.5% For All Winning Bets</p>
            <p className="description">Earn up to 1.5% from the platform’s house edge whenever your referred player plays & wins a round.</p>
          </ContainerComponentTransparent>
        </div>
      </div>
    );
}

export default Overview;