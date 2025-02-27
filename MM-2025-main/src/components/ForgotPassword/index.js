import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { getPriceForResetPassword, sendTXForResetPassword, 
    checkPasswordResetConfirmed, setPasswordResetData } from '../../actions/userActions'
import { showResetPasswordModal } from '../../actions/gameActions'

import { ethers } from 'ethers';
import { getSigner } from "../../utils/interact";
import { passwordResetWalletAddress } from "../../utils/constant";
import './index.scss';

import {connect} from 'react-redux'

function makeRandomStr(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
let userHash = ""
const ForgotPassword = (props) => {
    const { show, onHide, showResetPasswordModal, setPasswordResetData } = props;
    const {account} = useWeb3React();
    const [resetPrice, setResetPrice] = useState(0)
    const [sendingCryptoForReset, setSendingCryptoForReset] = useState(false)
    const [checkingResetPasswordConfirmed, setCheckingResetPasswordConfrimed] = useState(false)
    useEffect(async () => {
        userHash = makeRandomStr(50)
        setSendingCryptoForReset(false)
        const _price = await getPriceForResetPassword(userHash, account)
        setResetPrice(_price)
    }, [show])
    const clickSendBtn = async () => {
        setSendingCryptoForReset(true)
        try {
            const signer = getSigner();
            let tx;
            tx = await signer.sendTransaction({
                to: passwordResetWalletAddress, 
                value: ethers.utils.parseEther(resetPrice.toString())});
            const res = await tx.wait();
            setSendingCryptoForReset(false)
            setCheckingResetPasswordConfrimed(true)
            const sentTX = await sendTXForResetPassword(userHash, account, res.transactionHash)
            if(!sentTX) {
                failedChecking()
            }
        }
        catch(e) {
            setSendingCryptoForReset(false)
            failedChecking()
        }
    }
    const checkConfirmed = async () => {
        const confirmed = await checkPasswordResetConfirmed(userHash, account)
        if(confirmed) {
            successChecking()
            
            
        }
        else {
            setTimeout(() => {checkConfirmed()}, 5000)
        }
    }
    const successChecking = () => {
        setCheckingResetPasswordConfrimed(false)
        setPasswordResetData(userHash, account)
        showResetPasswordModal()
        onHide()
    }
    const failedChecking = () => {
        setCheckingResetPasswordConfrimed(false)
    }
    useEffect(async () => {
        if(checkingResetPasswordConfirmed) {
            checkConfirmed()
        }
    }, [checkingResetPasswordConfirmed])
    return (
        <>
            <Modal show={show} onHide={onHide} className="monkey-modal fotgot-password-modal">
                <Modal.Header closeButton closeVariant='white'>
                    <Modal.Title><span>FORGOT PASSWORD</span></Modal.Title>
                    
                </Modal.Header>
                <Modal.Body>
                    <h1 className="reset-price">{resetPrice} BNB</h1>
                    <p>I agree to send the following amount of BNB to confirm my Ownership of this wallet and reset my password.</p>
                    {
                        !checkingResetPasswordConfirmed &&
                            (
                                sendingCryptoForReset ?
                                    <button className="purple-gradient-btn" disabled>
                                        <Spinner className="pending-spinner" animation="border" variant="secondary" />SENDING
                                    </button>        
                                :   <button className="purple-gradient-btn" onClick={clickSendBtn}>SEND</button>
                            )
                    }
                    {
                        checkingResetPasswordConfirmed &&
                        <button className="purple-gradient-btn" disabled>
                            <Spinner className="pending-spinner" animation="border" variant="secondary" />CHECKING
                        </button>        
                    }
                </Modal.Body>
            </Modal>
            
        </>
    );
}

const mapStateToProps  = (state) => (
    {

    }
)
export default connect(mapStateToProps, {showResetPasswordModal, setPasswordResetData})(ForgotPassword)