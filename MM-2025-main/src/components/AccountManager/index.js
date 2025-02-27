import { useState, useEffect, useRef } from "react";
import {connect} from 'react-redux'
import { withRouter, useLocation } from 'react-router-dom';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from '@web3-react/injected-connector';
import getBrowserFingerprint from 'get-browser-fingerprint';
import './index.scss';

import {logout, getRegisteredState, getPublicKey, loginSuccessAction} from '../../actions/userActions'
import {setPopUp, showTxSignModal, showLoginModal, setFingerPrinter} from '../../actions/gameActions'
import { connectWallet, getCurrentWalletConnected, changeNetwork } from '../../utils/interact';

const AccountManager = (props) => {
    const { useChainData, signed, logout, currentChainId, setFingerPrinter, getRegisteredState, loginSuccessAction, showLoginModal, showTxSignModal } = props;
    const { active, account, library, chainId, connector, activate, deactivate } = useWeb3React(); 
    const [curLocation, setCurlocation] = useState("none")   
    const location = useLocation()
    useEffect(async () => {
      const _fingerprint = getBrowserFingerprint();
      console.log("hello, fingerprint: ", _fingerprint);
      setFingerPrinter(_fingerprint)

      const serverPublicKey = await getPublicKey();
      if(serverPublicKey === "Not logged in") {
        deactivate()
      }
      else {
        const injectedConnector = new InjectedConnector({
          supportedChainIds: [1, 4, 56]
        })
        injectedConnector
        .isAuthorized()
        .then((isAuthorized) => {
          if(isAuthorized) {
            console.log("~~~~~wallet is alrady connected.")
            activate(injectedConnector, async (error) => {
              console.log(error);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        })
      }
    }, [])
    useEffect(() => {
      if(location.search.includes("?")) {
        let queryParams = location.search.split("?")[1]
        if(queryParams.includes("trust_wallet_browser")) {
          const injectedConnector = new InjectedConnector({
              supportedChainIds: [1, 4, 56]
          })
          activate(injectedConnector, async (error) => {
              console.log(error);
              setCurlocation(error.toString)
          });
        }
      }
    
    }, [location])
    useEffect(async () => {
      if (account && account !== "") {
          if(currentChainId !== useChainData.chainId) {
              const walletResponse = await changeNetwork(useChainData);
          }
          logout()
          const serverPublicKey = await getPublicKey();
          console.log("account changed: ", account, serverPublicKey)
          if(serverPublicKey === "Not logged in" || serverPublicKey !== account) {
            const isRegistered = await getRegisteredState(account)
            if(isRegistered) {
                setPopUp("Please login");
                showTxSignModal()
            }
            else {
                setPopUp("Please register");
                showLoginModal()
            }
          }
          else {
            loginSuccessAction(account)
          }
          
      }
      else {
          setPopUp("Click the “Wallet Icon” to connect your crypto wallet");
      }
  }, [account]);
  useEffect(() => {
    if(signed) {
      
    }
  }, [signed]);
    return (
        <>
            <div className="account-manager">
              
            </div>
        </>    
    );
}

const mapStateToProps  = (state) => (
  {
    winOnRound: state.betGameData.winOnRound,
    effectAudioVolume: state.betGameData.effectAudioVolume,
    useChainData: state.userData.useChainData,
    currentChainId: state.userData.currentChainId,
    signed: state.userData.signed,
    muteAudio: state.betGameData.muteAudio
  }
)

export default withRouter(connect(mapStateToProps, {logout, getRegisteredState, loginSuccessAction, showTxSignModal, setFingerPrinter, showLoginModal })(AccountManager))