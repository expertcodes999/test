import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import './index.scss';
import TrustWalletIcon from '../../assets/images/wallet_trustwallet_icon.png';
const TrustWalletBrowserModal = (props) => {
    const { show, onHide } = props;
    const [buttonText, setButtonText] = useState("Copy URL")

    useEffect(async () => {
        setButtonText("Copy URL")
    }, [show])
    
    const clickCopyURLBtn = () => {
        var dummy = document.createElement('input')
        var text = window.location.href;

        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        setButtonText("copied!")
    }
    return (
        <>
            <Modal show={show} onHide={onHide} className="monkey-modal trust-wallet-browser-modal">
                <Modal.Header>
                    <img src={TrustWalletIcon} className="icon"/>
                </Modal.Header>
                <Modal.Body>
                    <p className="title"><b>Wallet app required</b></p>
                    <p className="body">MoonCrash.com requires an ETH wallet to work. Please <a target="_blank" href="https://trustwallet.com/">install</a> or open it within the TrustWallet in app browser.</p>
                    <button className="purple-gradient-btn copy-button" onClick={clickCopyURLBtn}>{buttonText}</button>
                </Modal.Body>
            </Modal>
            
        </>
    );
}

export default TrustWalletBrowserModal