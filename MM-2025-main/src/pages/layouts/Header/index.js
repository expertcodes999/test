import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import { useWeb3React } from "@web3-react/core";

import WalletConnectBtn from '../../../components/WalletConnectBtn';

import InfoBox from '../../../components/InfoBox';
import { connectWallet, getCurrentWalletConnected, changeNetwork } from '../../../utils/interact';
import './Header.scss';
import cryptoImg from '../../../assets/images/playpage/crypto-net.png';
import USDTImg from '../../../assets/images/USDT.svg';
import CakeImg from '../../../assets/images/cake.svg';
import BUSDImg from '../../../assets/images/BUSD.svg';
import TakCoinImg from '../../../assets/images/Neon___flare_BNB.png';

import MooningLogo from '../../../assets/images/playpage/Logos/newTopLogo-min.png';

import LogoHeader from './LogoHeader.js';
import {connect} from 'react-redux'

import { FaAngleDoubleDown } from 'react-icons/fa';

import 'react-toastify/dist/ReactToastify.css';
import { hideLoginModal, showStatsModal, showLeaderboardModal, showDepositModal, showBankRollModal, showSelectNetworkModal,
    showHelpModal, showWithdrawModal } from '../../../actions/gameActions'
import {setPublicKey, getRegisteredState, changeCurrentChainID, logout} from '../../../actions/userActions'
import {nextVersion} from '../../../utils/constant'
import {setPopUp} from '../../../actions/gameActions'
import { getCurrentWalletAddress, getCurrentChainID } from '../../../utils/interact';

const Header = (props) => {
    const { children, setPublicKey, maxCredits, 
        hideLoginModal, 
        showStatsModal, showLeaderboardModal,  
        showHelpModal,
        showWithdrawModal,
        showDepositModal,
        showBankRollModal,
        showSelectNetworkModal,
        signed,
        logged, 
        useChainData, 
        currentChainId, changeCurrentChainID } = props;


    const [moneyType, setMoneyType] = useState(false);
    const [status, setStatus] = useState(null);
    
    
    const [basicModal, setBasicModal] = useState(false);
    const { active, account, library, chainId, connector, activate, deactivate } = useWeb3React();    
    const toggleShow = () => setBasicModal(!basicModal);
 
    const notify = () => toast.info(status, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
    
    const addWalletListener = () => {
        if (window.ethereum) {
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
                console.log("~~~~~~~~setPublicKey: ", accounts[0])
                setPublicKey(accounts[0]);
                
            } else {
                setPublicKey("");
            }
          });
          window.ethereum.on("connect", async (connectInfo) => {
            
            const { address, status } = await getCurrentWalletConnected(useChainData.chainId)
            setPublicKey(address);
            console.log("~~~~~~~~wallet: ", address)
          });
          window.ethereum.on("chainChanged", async (chain) => {
            changeCurrentChainID(chain)
          });
        }
      }
    
    useEffect(async () => {
        addWalletListener()
        const { address, status } = await getCurrentWalletConnected(useChainData.chainId)
        const {chainId} = await getCurrentChainID()
        setPublicKey(address)
        changeCurrentChainID(chainId)
        
    }, [])
    
    useEffect(() => {
        if (logged) {
            hideLoginModal()
        }
    }, [logged]);

    useEffect(() => {
        if (chainId) {
            console.log("chainId", chainId)
        }
    }, [chainId]);
    useEffect(() => {
        
    }, [signed]);
    
    useEffect(() => {
        if (status) {
            notify();
          setStatus(null)
        }
    }, [status]);
    const clickStatsBtn = () => {
        showStatsModal()
    }
    const clickWithdrawBtn = () => {
        if(logged) {
            showWithdrawModal()
        }
        else {
            setPopUp("Please login");
        }
    }
    const clickLeaderboardBtn = () => {
        showLeaderboardModal()
    }
    const clickDepositBtn = () => {
        if(logged) {
            showDepositModal()
        }
        else {
            setPopUp("Please login");
        }
    }

    const  formatNumberWithCommas = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return (
        <>
            
            <div className='header' >
                <LogoHeader/>
                <div className="button-group">
                    <div className="buttons normal-group">

                        <a target="_blank" href="https://rarible.com/mooningmonkey" className="purple border-0 buy-monkey">
                            BUY AN NFT & EARN
                        </a>
                        {
                            nextVersion &&
                            <button className="purple border-0 join-bankroll"  onClick={() => showBankRollModal()}>
                                JOIN THE BANKROLL & EARN
                            </button>
                        }
                        <button className="image-back border-0 leaderboard" onClick={() => clickLeaderboardBtn()}>
                        
                            <div className='mask'>
                                <span>LEADERBOARD</span>
                            </div>
                        </button>
                        <button className="image-back border-0 stats" onClick={() => clickStatsBtn()}>
                        <div className='mask'><span>STATS</span></div>
                            
                        </button>
                        {/*<button className="image-back border-0 help" onClick={()=>showHelpModal()}>
                            <div className='mask'><span>HELP</span></div>
                            
                        </button>*/}
                    </div>
                    <a target="_blank" href="https://mooningmonkey.com/" className="middle-logo">
                        <img src={MooningLogo}></img>
                    </a>
                    <div className="buttons money-group wnd-show">
                        {
                            nextVersion &&
                            <a target="_blank" href="https://pancakeswap.finance/swap" className="purple buy-now border-0">
                                <img className="" src={TakCoinImg} alt="Italian Trulli"></img>
                                BUY $BNB NOW
                            </a>
                        }        
                        
                        <InfoBox className='relative' outSideClickFunc={setMoneyType}>
                            <button className="money-type" onClick={() => setMoneyType(!moneyType)}>
                                <div className="type">
                                    <img className="" src={TakCoinImg} alt="Italian Trulli"></img>
                                    <p>Available Bits</p>
                                </div>
                                <p className="price">
                                    {formatNumberWithCommas(Number(maxCredits).toFixed(2))}
                                    {
                                        nextVersion &&
                                        <FaAngleDoubleDown className="drop-icon"/>
                                    }
                                </p>
                            </button>
                            {
                                nextVersion &&
                            
                                <div className={`absolute drop-profile-section ${!moneyType ? 'hidden' : 'show'}`}>
                                    <div className="c-row " style={{backgroundColor: "#3c3c9577"}}>
                                        <div className="c-img">
                                            <img src={USDTImg} alt="" width="22" />
                                        </div>
                                        <div className="c-text">
                                            USDT
                                        </div>
                                        </div>
                                        <div className="c-row">
                                        <div className="c-img">
                                            <img src={CakeImg} alt="" width="22" />
                                        </div>
                                        <div className="c-text">
                                            Cake
                                        </div>
                                        </div>
                                        <div className="c-row" style={{backgroundColor: "#3c3c9577"}}>
                                        <div className="c-img">
                                            <img src={BUSDImg} alt="" width="22" />
                                        </div>
                                        <div className="c-text">
                                            BUSD
                                        </div>
                                    </div>
                                </div>
                            }
                        </InfoBox>
                        <button className="purple deposit" onClick={() => clickDepositBtn()}>
                        
                            DEPOSIT
                        </button>
                        <button className="image-back border-0 withdraw" onClick={() => clickWithdrawBtn()}>
                            <div className='mask'><span>WITHDRAW</span></div>
                            
                        </button>
                        {
                            nextVersion &&
                            <button className="select-net border-0" onClick={() => showBankRollModal()}>
                                <FaAngleDoubleDown className="drop-icon"/>
                                <img className="net-icon" src={cryptoImg} alt="Italian Trulli"></img>
                            </button>
                        }
                        <WalletConnectBtn/>
                    </div>
                    <div className="buttons money-group ph-show">
                        <button className="money-type border-0">
                            <div className="type">
                                <img className="" src={TakCoinImg} alt="Italian Trulli"></img>
                                Bits
                            </div>
                            <div className="price">
                                {formatNumberWithCommas(Number(maxCredits).toFixed(2))}
                                {
                                    nextVersion &&
                                    <FaAngleDoubleDown className="drop-icon"/>
                                }
                            </div>
                        </button>
                        <button className="dark-blue border-0 plus" onClick={() => clickDepositBtn()}>
                            +
                        </button>
                        <button className="dark-blue border-0 minus" onClick={() => clickWithdrawBtn()}>
                            -
                        </button>
                        
                        {
                            nextVersion &&
                            <button className="select-net border-0">
                                <FaAngleDoubleDown className="drop-icon"/>
                                <img className="net-icon" src={cryptoImg} alt="Italian Trulli"></img>
                            </button>
                        }
                            <WalletConnectBtn/>      
                    </div>
                    
                </div>
                {children}
            </div>
            
            <ToastContainer />
            
        </>
    )
}

const mapStateToProps  = (state) => (
    {
        logged: state.userData.logged,
        displayLoginModal: state.betGameData.displayLoginModal,
        displayStatsModal: state.betGameData.displayStatsModal,
        displayHelpModal: state.betGameData.displayHelpModal,
        displayHelpDetailModal: state.betGameData.displayHelpDetailModal,
        displayHistoryModal: state.betGameData.displayHistoryModal,
        displayForgotPasswordModal: state.betGameData.displayForgotPasswordModal,
        displayResetPasswordModal: state.betGameData.displayResetPasswordModal,
        displayTxSignModal: state.betGameData.displayTxSignModal,
        signed: state.userData.signed,
        
        displayLeaderboardModal: state.betGameData.displayLeaderboardModal,
        useChainData: state.userData.useChainData,
        currentChainId: state.userData.currentChainId,
        userName: state.userData.userName,
        maxCredits: state.betData.maxCredits
    }
)
export default connect(mapStateToProps, {setPublicKey, logout,
    getRegisteredState, changeCurrentChainID, 
    hideLoginModal, showStatsModal, showLeaderboardModal, showDepositModal, showBankRollModal, showSelectNetworkModal,
    showHelpModal, showWithdrawModal})(Header)