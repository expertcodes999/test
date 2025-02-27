import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { AiFillCheckSquare } from 'react-icons/ai';
import Web3 from "web3";
import {connect} from 'react-redux'
import { useWeb3React } from "@web3-react/core";

import './index.scss';

import { signWallet } from '../../utils/interact'
import { setSigned, getLoginMessage, checkLoginMessage, setRegisteredState } from '../../actions/userActions'
import {setPopUp, showDailyBonusModal} from '../../actions/gameActions'
import CheckOrange from '../../../src/assets/images/check_mark_orange.png';

//import Fingerprinter from 'fingerprinter';
// let fp = new Fingerprinter();
// let fingerStr = ""
// fp.get(function(err, fingerprint) {
//     fingerStr = fingerprint
//     console.log("~~!!! finger print: ", fingerStr)
// });

const TxSignModal = (props) => {
    const { show, onHide, setSigned, fingerPrinterValue, checkLoginMessage, showDailyBonusModal, setRegisteredState } = props;
    const [isLoading, setIsLoading] = useState(false);
    const { active, account, library, chainId, connector, activate, deactivate } = useWeb3React();    
    useEffect(() => {
        setIsLoading(false)
    }, [show])
    const signToWallet = async () => {
        setIsLoading(true)
        let web3 = new Web3(library.provider);
        const accounts = await web3.eth.getAccounts()
        // const accounts = await window.ethereum.request({
        //     method: "eth_requestAccounts",
        //   });
        var msg = await getLoginMessage(accounts[0])
        if(msg === "No User with that Public Key exists!") {
            onHide()
            setIsLoading(false)
            setPopUp(msg);
            setRegisteredState(false)
            return
        }
        // const result = await signWallet(accounts[0], web3.utils.fromUtf8(msg))
        // setIsLoading(false)
        // if(result !== false) {
        //     checkLoginMessage(account, result.result)
        //     console.log("~~~~sign address: ", result)
        //     onHide()
        //     setSigned(true)
        // }
        await web3.eth.personal.sign(web3.utils.fromUtf8(msg), accounts[0], (err, result) => {
            setIsLoading(false)
            if(err) {
                console.log(err);
            }
            else {
                //let recoveredAddress = web3.eth.personal.ecRecover(msg, result);
                //console.log(recoveredAddress);

                checkLoginMessage(accounts[0], result, fingerPrinterValue)
                showDailyBonusModal()
                onHide()
                setSigned(true)
            }
        })

    }
    return (
        <>
            <Modal show={show} onHide={onHide} className="monkey-modal tx-sign-modal">
                <Modal.Header closeButton closeVariant='white'>
                    
                </Modal.Header>
                <Modal.Body>
                    <img src={CheckOrange} className="check-logo" />
                    <p className="body-title">Signing with this address:</p>
                    {
                        account &&
                        <p className="wallet-address">{`${account.substring(0, 8)}...${account.slice(-4)}`}</p>
                    }
                    
                    <p className="description">You need to sign a message on your wallet to prove ownership of the address you are connected with.</p>
                    <button className="purple sign-button" disabled={isLoading} onClick={signToWallet}>
                        {
                        isLoading
                            ?   <>
                                    <Spinner className="pending-spinner" animation="border" variant="secondary" />
                                    <p className="body-title">Waiting for Signature</p>
                                </>
                            :   <p className="body-title">Sign Message</p>
                        }
                    </button>
                </Modal.Body>
            </Modal>
            
        </>
    );
}

const mapStateToProps  = (state) => (
    {
        fingerPrinterValue: state.betGameData.fingerPrinterValue
    }
  )
  export default connect(mapStateToProps, { setSigned, showDailyBonusModal, checkLoginMessage, setRegisteredState })(TxSignModal)