import { Modal } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState, useRef } from 'react';
import './index.scss';
import {connect} from 'react-redux'
import { AiOutlineClose } from 'react-icons/ai';

import { showSelectWalletModal, showWheelPrizeSpinModal, playSpinBtnClickSoundAction, getDailyBonusRecentWins, getPrize,
    getTimeLeft, setPopUp } from '../../actions/gameActions'
import CoinImg from '../../assets/images/TAK Token.png';
import BitImg from '../../assets/images/Neon___flare_BNB.png';
import btnClickSound from '../../assets/sound/wheel prize/button-click-sound-effect/Button click sound effect --- [0.03].mp3'

let leftSecond = 0
let currentTimeOut = null
let mounted = false;

const DailyBonusModal = (props) => {
    const { show, onHide, showSelectWalletModal, showWheelPrizeSpinModal, playSpinBtnClickSoundAction } = props;
    const [havePlayed, setHavePlayed] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const [recentWins, setRecentWins] = useState([])
    const [leftTime, setLeftTime] = useState({
        hour: "00",
        minute: "00",
        second: "00"
    })
    const buttonSoundRef = useRef(null);
    const { active, account } = useWeb3React();  
    useEffect(() => {
        
    }, [account])
    useEffect(async () => {
        mounted = show
        if(currentTimeOut) {
            clearTimeout(currentTimeOut)
        }
        if(show) {   
            console.log("~~~~~~ daily bones modal.")         
            setLoadingData(true)
            leftSecond = await getTimeLeft()
            if(leftSecond === false) {
                setPopUp("Sorry, You can't get daily bonus.")    
                // onHide()
            }
            else if(leftSecond === "Not logged in!") {
                setPopUp("Please log in")    
                //onHide()
            }
            else if(Number(leftSecond) === 0) {
                setHavePlayed(false)
                setLoadingData(false)
            }
            else {
                setHavePlayed(true)
                currentTimeOut = timeCounter()
                setLoadingData(false)
            }
            setLoadingData(false)
            let recentWinData = await getDailyBonusRecentWins()
            console.log("!!!!!!!!! recent win data: ", recentWinData)
            setRecentWins(recentWinData)
        }
    }, [show])
    const calculateLeftTime = () => {
        let hour = Math.trunc(leftSecond / 3600)
        let minute = Math.trunc((leftSecond % 3600) / 60)
        let second = Math.trunc(leftSecond % 60)
        setLeftTime({
            hour: ("00" + hour.toString()).slice(-2),
            minute: ("00" + minute.toString()).slice(-2),
            second: ("00" + second.toString()).slice(-2)
        })
    }
    const timeCounter = () => {
        if(!mounted) return
        calculateLeftTime()
        if(leftSecond <= 0) {
            setHavePlayed(false)
            return
        }
        leftSecond = Number(leftSecond) - 1
        setTimeout(timeCounter, 1000)
    }
    const clickConnectBtn = () => {
        showSelectWalletModal()
    }
    const clickSpinBtn = () => {
        //setPopUp("It Looks Like your device already Got a Chance to Spin the wheel recently")
        playSpinBtnClickSoundAction(true)
        showWheelPrizeSpinModal()
        onHide()
    }
    return (
        <>
            <Modal show={show} onHide={onHide} className="monkey-modal daily-bonus-modal">
                <AiOutlineClose className="close-btn" onClick={onHide}/>
                <Modal.Body>
                    <div className="rotate-button-container">
                        {
                            havePlayed
                            ?   <div className="next-lucky-timer">
                                    <p className="title">Next Lucky Spin in</p>
                                    <div className="time-content">
                                        <div className="hour">{leftTime.hour}</div><spin>:</spin>
                                        <div className="minute">{leftTime.minute}</div><spin>:</spin>
                                        <div className="second">{leftTime.second}</div>
                                    </div>
                                </div>
                            :   <div className="play">   
                                    <img src={CoinImg}></img>
                                    {
                                        !account
                                        ?   <button className="rotate-button yellow-btn" disabled={loadingData} onClick={clickConnectBtn}>
                                                <p>Connect Wallet & Spin</p>
                                            </button>
                                        :   <button className="rotate-button yellow-btn" disabled={loadingData} onClick={clickSpinBtn}>
                                                <p>SPIN & WIN</p>
                                            </button> 
                                    }
                                </div>
                        }
                    </div>
                    <div className="recent-wins">
                        {
                            recentWins.map(win => {
                                return (
                                    <div className="recent-win-unit">
                                        <img className="" src={BitImg}></img>
                                        <p>{`${win[0]} Bits`}</p>
                                    </div> 
                                )
                            })
                        }
                    </div>
                </Modal.Body>
            </Modal>
            
        </>
    );
}

const mapStateToProps  = (state) => (
    {
        
    }
)
export default connect(mapStateToProps, {showSelectWalletModal, playSpinBtnClickSoundAction, showWheelPrizeSpinModal})(DailyBonusModal)