import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useHistory } from "react-router-dom";
import './index.scss';
import { changeNetwork, getCurrentChainID } from '../../utils/interact';
import {connect} from 'react-redux'
import { useWeb3React } from "@web3-react/core";
import MetamaskBrowserModal from '../MetamaskBrowserModal';
import { detectMob } from '../../utils/globalActions';
import { nextVersion } from '../../utils/constant'
import avalanchePng from '../../assets/images/connect wallet/networkIcons/avalanche.png';
import bnbPng from '../../assets/images/connect wallet/networkIcons/bnb.png';
import fantomPng from '../../assets/images/connect wallet/networkIcons/fantom.png';
import harmonyPng from '../../assets/images/connect wallet/networkIcons/harmony.png';
import okexPng from '../../assets/images/connect wallet/networkIcons/okex.png';
import polygonPng from '../../assets/images/connect wallet/networkIcons/polygon.png';
import solPng from '../../assets/images/connect wallet/networkIcons/sol.png';

import binanceWalletPng from '../../assets/images/connect wallet/walletIcons/binanceWallet.png';
import bitKeepPng from '../../assets/images/connect wallet/walletIcons/bitKeep.png';
import coin98Png from '../../assets/images/connect wallet/walletIcons/coin98.png';
import mathWalletPng from '../../assets/images/connect wallet/walletIcons/mathWallet.png';
import metamaskPng from '../../assets/images/connect wallet/walletIcons/metamask.png';
import safePalPng from '../../assets/images/connect wallet/walletIcons/safePal.png';
import tokenPocketPng from '../../assets/images/connect wallet/walletIcons/tokenPocket.png';
import trustWalletPng from '../../assets/images/connect wallet/walletIcons/trustWallet.png';
import walletConnectPng from '../../assets/images/connect wallet/walletIcons/walletConnect.png';
import TrustWalletBrowserModal from "../TrustWalletBrowserModal";

const NETWORKS = {
    BNB: 'BNB',
    SOLANA: 'SOLANA',
    AVALANCHE: 'AVALANCHE',
    FANTOM: 'FANTOM',
    POLYGON: 'POLYGON',
    OKEX: 'OKEX',
    HARMONY: 'HARMONY',
    NONE: 'NONE',
}
const WALLETS = {
    METAMASK: 'BNB',
    WALLETCONNECT: 'WALLETCONNECT',
    TRUSTWALLET: 'TRUSTWALLET',
    MATHWALLET: 'MATHWALLET',
    SAFEPAL: 'SAFEPAL',
    BINANCEWALLET: 'BINANCEWALLET',
    TOKENPOCKET: 'TOKENPOCKET',
    COIN98: 'COIN98',
    BITKEEP: 'BITKEEP',
}

const SelectWalletModal = (props) => {
    const { show, onHide, login, registered, register, showForgotPasswordModal } = props;
    const { activate, deactivate } = useWeb3React();
    const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS.NONE)
    const [selectedWallet, setSelectedWallet] = useState(WALLETS.NONE)
    const [isMobile, setIsMobile] = useState(false)
    const [account, setAccount] = useState()
    const [provider, setProvider] = useState()
    const [displayMetamaskBrowserModal, setDisplayMetamaskBrowserModal] = useState(false)
    const [displayTrustWalletBrowserModal, setDisplayTrustWalletBrowserModal] = useState(false)
    const [curLocation, setCurLocation] = useState("")
    const history = useHistory();
    useEffect(async () => {

    }, [])
    useEffect(async () => {
        if(show) {
            setIsMobile(detectMob());
            setSelectedNetwork(NETWORKS.NONE);
            setSelectedWallet(WALLETS.NONE);
        }        
    }, [show])

    const clickMetamaskBtn = async () => {
        console.log("click metamask btn")
        // Check if it is a mobile device and metamask is not installed
        if(isMobile && window.ethereum === undefined) {
            setDisplayMetamaskBrowserModal(true)
            onHide()
        }
        else {   
            const currentWalletChainId = await getCurrentChainID()
            if(currentWalletChainId.chainId !== "") {
                const injectedConnector = new InjectedConnector({
                    supportedChainIds: [parseInt(currentWalletChainId.chainId, 16)]
                })
                activate(injectedConnector, async (error) => {
                    console.log(error);
                });
            }
            setSelectedWallet(WALLETS.METAMASK)
            onHide()
        }
    }
    const resetWalletConnector = (connector) => {
        console.log("resetWalletConnector")
          connector.walletConnectProvider = undefined
      }
    const clickWalletConnectBtn =() => {
        const BSCWalletConnect = new WalletConnectConnector({
            rpcUrl: `https://bsc-dataseed.binance.org/`,
            bridge: "https://bridge.walletconnect.org",
            qrcode: true,
            supportedChainIds: [56],
           });
        resetWalletConnector(BSCWalletConnect)
        setSelectedWallet(WALLETS.WALLETCONNECT)
        activate(BSCWalletConnect)
        onHide()
    }
    const clickTrustWalletBtn = async () => {
        // const injectedConnector = new InjectedConnector({
        //     supportedChainIds: [parseInt(56, 16), 1]
        // })
        // activate(injectedConnector, async (error) => {
        //     console.log(error);
        // });
        window.location = (`https://link.trustwallet.com/open_url?coin_id=20000714&url=${window.location.href}?trust_wallet_browser=true`)
        setSelectedWallet(WALLETS.METAMASK)
        onHide()
    }


    const clickTestTrustWalletBtn = async () => {
        
        
        /*// Check if trust wallet is installed
        if(window.ethereum === undefined) {
            setDisplayMetamaskBrowserModal(true)
        }

        try{
            const injectedConnector = new InjectedConnector({
                supportedChainIds: [0x1, 0x4, 0x38]
            })
            await activate(injectedConnector, async (error) => {
                setCurLocation(error)
            });
            console.log('connector', injectedConnector)
            console.log('account', await injectedConnector.getAccount())
            console.log('provider', await injectedConnector.getProvider())
            setAccount(await injectedConnector.getAccount())
            setProvider(await injectedConnector.getProvider())
        }
        catch (error) {
            setCurLocation(error)
        }*/


        // Check if it is a mobile device and TrustWallet is not installed
        if(isMobile && window.ethereum === undefined) {
            setDisplayTrustWalletBrowserModal(true)
            onHide()
        }
        else {   
            const currentWalletChainId = await getCurrentChainID()
            if(currentWalletChainId.chainId !== "") {
                const injectedConnector = new InjectedConnector({
                    supportedChainIds: [parseInt(currentWalletChainId.chainId, 16)]
                })
                activate(injectedConnector, async (error) => {
                    console.log(error);
                });
                console.log('connector', injectedConnector)
                console.log('account', await injectedConnector.getAccount())
                console.log('provider', await injectedConnector.getProvider())
                setAccount(await injectedConnector.getAccount())
                setProvider(await injectedConnector.getProvider())
            }
            setSelectedWallet(WALLETS.TRUSTWALLET)
            onHide()
        }


    }

    return (
        <>
            <Modal show={show} onHide={onHide} className="monkey-modal wallet-select-modal">
                <Modal.Header closeButton closeVariant='white'>
                    <Modal.Title><span>Connect Wallet</span></Modal.Title>
                    
                </Modal.Header>
                <Modal.Body>
                    <div className="network-group">
                        <p className="title"><span className="group-number">1</span>Select Network</p>
                        <div className="network-list">
                            <div
                                onClick={()=>setSelectedNetwork(NETWORKS.BNB)} 
                                className={`network-item ${selectedNetwork===NETWORKS.BNB? "selected": ""}`}>
                                <img className="logo" src={bnbPng}/>
                                BNB Chain
                            </div>
                            <div className="network-item disabled">
                                <img className="logo" src={solPng}/>Solana</div>
                            <div className="network-item disabled">
                                <img className="logo" src={avalanchePng}/>Avalanche</div>
                            <div className="network-item disabled">
                                <img className="logo" src={fantomPng}/>Fantom</div>
                            <div className="network-item disabled">
                                <img className="logo" src={polygonPng}/>Polygon</div>
                            <div className="network-item disabled">
                                <img className="logo" src={okexPng}/>OKEx</div>
                            <div className="network-item disabled">
                                <img className="logo" src={harmonyPng}/>Harmony</div>
                        </div>
                    </div>
                    <div className="wallet-group">
                        <p className="title"><span className="group-number">2</span>Select Wallet</p>
                        <div className="wallet-list">
                            <div
                                onClick={clickMetamaskBtn} 
                                className={`wallet-item ${selectedWallet===WALLETS.METAMASK? "selected": ""} ${selectedNetwork === NETWORKS.NONE ? 'disabled' : ''}`}>
                                <img className="logo" src={metamaskPng}/>Metamask</div>
                            
                            {/*<div
                                onClick={clickTrustWalletBtn}  
                                className={`wallet-item ${selectedWallet===WALLETS.TRUSTWALLET? "selected": ""} ${selectedNetwork === NETWORKS.NONE ? 'disabled' : ''}`}>
                                <img className="logo" src={trustWalletPng}/>TrustWallet</div>*/}
                            <div
                                onClick={clickTestTrustWalletBtn}  
                                className={`wallet-item ${selectedWallet===WALLETS.TRUSTWALLET ? "selected": ""} ${selectedNetwork === NETWORKS.NONE ? 'disabled' : ''}`}>
                                <img className="logo" src={trustWalletPng}/>TrustWallet</div>
                            <div
                                onClick={nextVersion ? clickWalletConnectBtn : () => {}} 
                                className={`wallet-item ${selectedWallet===WALLETS.WALLETCONNECT? "selected": ""} ${selectedNetwork === NETWORKS.NONE || !nextVersion ? 'disabled' : ''}`}>
                                <img className="logo" src={walletConnectPng}/>WalletConnect</div>
                            <div className="wallet-item disabled">
                                <img className="logo" src={mathWalletPng}/>MathWallet</div>
                            <div className="wallet-item disabled">
                                <img className="logo" src={safePalPng}/>SafePal</div>
                            <div className="wallet-item disabled">
                                <img className="logo" src={binanceWalletPng}/>Binance Wallet</div>
                            <div className="wallet-item disabled">
                                <img className="logo" src={tokenPocketPng}/>TokenPocket</div>
                            <div className="wallet-item disabled">
                                <img className="logo" src={coin98Png}/>Coin98</div>
                            <div className="wallet-item disabled">
                                <img className="logo" src={bitKeepPng}/>BitKeep</div>
                        </div>
                        {
                            selectedNetwork === NETWORKS.NONE &&
                            <div className="content-mask"></div>
                        }
                        <div>{account}</div>
                        <div style={{'fontSize': '8px', overflow: 'auto'}}>{JSON.stringify(provider)}</div>
                        
                    </div>
                    <div className="acocunt-anager">
                        <p>{curLocation}</p>
                    </div>
                </Modal.Body>
            </Modal>
            <MetamaskBrowserModal show={displayMetamaskBrowserModal} onHide={()=>setDisplayMetamaskBrowserModal(false)}/>
            <TrustWalletBrowserModal show={displayTrustWalletBrowserModal} onHide={()=>setDisplayTrustWalletBrowserModal(false)}/>
        </>
    );
}

export default SelectWalletModal