import { Modal } from "react-bootstrap";
import './index.scss';
import {connect} from 'react-redux'
import { useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from '@web3-react/injected-connector';

import { useMediaQuery } from 'react-responsive'

import { showLoginModal, showTxSignModal, showSelectWalletModal } from '../../actions/gameActions'
import { changeNetwork, getCurrentChainID } from '../../utils/interact';
import LoggedUserBtn from '../LoggedUserBtn';
import walletPng from '../../assets/images/wallet.png'

const WalletConnectBtn = (props) => {

    const { showLoginModal, showSelectWalletModal, logged, useChainData, currentChainId, userName, registered,
        signed, showTxSignModal, isOnSideBar } = props;

    const { active, account, library, chainId, connector, activate, deactivate } = useWeb3React();
    const desktopSize = useMediaQuery({ query: '(min-width: 800px)' })
    const smallSize = useMediaQuery({ query: '(max-width: 400px)' })
    const onClickNotLoggedBtn = () => {
        if(!registered) {
            showLoginModal()
        }
        else {
            showTxSignModal()
        }
    };
    const clickConnectWalletBtn = () => {
        showSelectWalletModal()
    }
    const clickNotSignedWalletBtn = () => {
        if(!registered) {
            showLoginModal()
        }
        else {
            showTxSignModal()
        }
    }
    const handleConnectWallet = async () => {
        const currentWalletChainId = await getCurrentChainID()
        console.log("handleConnectWallet", currentWalletChainId)
        if(currentWalletChainId.chainId !== "") {
            const injectedConnector = new InjectedConnector({
            
                supportedChainIds: [parseInt(currentWalletChainId.chainId, 16)]
            })
            activate(injectedConnector, async (error) => {
                console.log(error);
            });
        }
    }
    const handleChangeNetwork = async () => {
        const walletResponse = await changeNetwork(useChainData);
        console.log("~handleChangeNetwork", walletResponse)
    }
    return (
        <>
            {
                account 
                ?   
                // Number(currentChainId).toString(16) === Number(useChainData.chainId).toString(16)
                //     ?   
                    signed
                        ?   logged
                            ?   <LoggedUserBtn userName={userName} walletAddress={account} isOnSideBar={isOnSideBar}/>
                            :   <button className="purple border-0 wallet-address" onClick={() => onClickNotLoggedBtn()}>
                                    {`${account.substring(0, 5)}...${account.slice(-3)}`}
                                    <p className="username">
                                        not logged in
                                    </p>
                                </button>    
                        :   <button className="purple border-0 wallet-address" onClick={clickNotSignedWalletBtn}>
                                <img className="wallet-img" src={walletPng}/>
                                {
                                    desktopSize || isOnSideBar?
                                        "CONNECT WALLET"
                                        : smallSize ? "": "CONNECT"
                                }
                            </button>                                     
                    // :   <button className="purple border-0 wallet-address" onClick={handleChangeNetwork}>
                    //         Change Network
                    //     </button> 
                :   <button className="purple border-0 wallet-address" onClick={clickConnectWalletBtn}>
                        <img className="wallet-img" src={walletPng}/>
                        {
                            desktopSize || isOnSideBar?
                                "CONNECT WALLET"
                                : smallSize ? "": "CONNECT"
                        }
                    </button>
            }
        </>
    );
}

const mapStateToProps  = (state) => (
    {
      logged: state.userData.logged,
      registered: state.userData.registered,
      useChainData: state.userData.useChainData,
      signed: state.userData.signed,
      userName: state.userData.userName,
      currentChainId: state.userData.currentChainId
    }
  )
  export default connect(mapStateToProps, { showLoginModal, showSelectWalletModal, showTxSignModal })(WalletConnectBtn)
  