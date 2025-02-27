import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import validator from 'validator'
import Cookies from 'universal-cookie';
import './index.scss';
import Web3 from "web3";
import {connect} from 'react-redux'
import { useWeb3React } from "@web3-react/core";
import getBrowserFingerprint from 'get-browser-fingerprint';

import {setPublicKey, login, register, getRegisterMessage, checkRegisterMessage} from '../../actions/userActions'
import {setPopUp, showForgotPasswordModal} from '../../actions/gameActions'
import TermsOfService from './TermsOfService'

import MooningBottomLineInput from "../../components/BottomLineInputWithValidate";

const LoginModal = (props) => {
    const { show, onHide, login, registered, fingerPrinterValue, showForgotPasswordModal, checkRegisterMessage } = props;
    const { active, account, library, chainId, connector, activate, deactivate } = useWeb3React();   
    const [userData, setUserData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [displayTermService, setDisplayTermService] = useState(false)
    const [termAgreed, setTermAgreed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [inputErrors, setInputErrors] = useState({
        password: false,
        confirmPassword: false,
        username: false        
    })
    const cookies = new Cookies();
    const onHideAction = () => {
        onHide()
    }
    const clickLoginBtn = async () => {
        if (userData.password === "") {
            setPopUp('Input all field correctly!')
            return;
        } 
        const data = {
            userName: null,
            password: userData.password,
            publicKey: account,
            refCode: null
        }
        login(data);
    }
    useEffect(() => {
        setUserData({
            userName: "",
            password: "",
            email: "",
            confirmPassword: ""
        })
        setTermAgreed(false)
        setDisplayTermService(false)
    }, [show])
    const clickRegisterBtn = async () => {
        if (userData.userName === "") {
            setPopUp('Input all field correctly!')
            return;
        } 
        setIsLoading(true)
        var msg = await getRegisterMessage(account)
        if(msg !== 0) {
            let web3 = new Web3(library.provider);
            await web3.eth.personal.sign(web3.utils.fromUtf8(msg), account, async (err, result) => {
                if(err) {
                    console.log(err);
                }
                else {
                    const refCode = cookies.get("refCode")
                    
                    let _registered = await checkRegisterMessage(account, result, userData.userName, fingerPrinterValue, refCode)
                    if(_registered) {
                        localStorage.setItem('account', account);
                        onHide()
                    }
                    setIsLoading(false)
                }
            })
        }
        else {
            console.log("Register failed!", msg);
            setPopUp('Register failed!')
            setIsLoading(false)
        }
    }
    const inputPasswordValue = (valueName, value) => {
        let regExBig = /[A-Z]/g
        let regExSmall = /[a-z]/g
        let regExNumber = /[0-9]/g
        setUserData({
            ...userData,
            [valueName]: value
        })
        if(value === "") {
            setInputErrors({
                ...inputErrors,
                [valueName]: false
            })
        }
        else {
            if((value.search(regExBig) != -1 || value.search(regExSmall) != -1) && value.search(regExNumber) != -1 && value.length >= 8) {
                setInputErrors({
                    ...inputErrors,
                    [valueName]: false
                })
            }
            else {
                setInputErrors({
                    ...inputErrors,
                    [valueName]: true
                })
            }
        }
    }
    const onClickTermBtn = () => {
        setDisplayTermService(true)
    }
    const onClickCloseTermBtn = () => {
        setDisplayTermService(false)
    }
    const clickForgotPasswordBtn = () => {
        showForgotPasswordModal()
        onHideAction()
    }
    return (
        <>
            <Modal show={show} onHide={onHideAction} className="monkey-modal login-modal">
                <Modal.Header closeButton closeVariant='white'>
                    <Modal.Title><span>{registered ?"Login":"Register"}</span></Modal.Title>
                    
                </Modal.Header>
                <Modal.Body>
                    {
                        !registered &&
                        <>
                            <MooningBottomLineInput label="Username" maxLength={20} className="fill-input moon-bet-input purple-bg-input-child" type="text" prefix=""
                                valueChangeHandler={(value)=>{setUserData({
                                    ...userData,
                                    userName: value
                                })}} removeRegex={/[^a-z0-9 ]/gi} defaultValue={userData.userName} valid={!inputErrors.username}/>
                            {
                                inputErrors.username &&
                                <p className="validate-rule">(asdfasdf)</p>
                            }
                        </>
                    }
                    {/* <>
                        <MooningBottomLineInput label="Password" className="fill-input moon-bet-input purple-bg-input-child" type="password" prefix=""
                            valueChangeHandler={(value) => {inputPasswordValue("password", value)}} defaultValue={userData.password} 
                            valid={!inputErrors.password}/>
                        {
                            inputErrors.password &&
                            <p className="validate-rule">(Passwords too weak. It needs to contain at least 8 letters and numbers)</p>
                        }
                    </>
                    {
                        !registered &&
                        <>
                            <MooningBottomLineInput label="Confirm Password" className="fill-input moon-bet-input purple-bg-input-child" type="password" prefix=""
                                valueChangeHandler={(value)=>{inputPasswordValue("confirmPassword", value)}} defaultValue={userData.confirmPassword} 
                                valid={!inputErrors.confirmPassword}/>
                            {
                                inputErrors.confirmPassword &&
                                <p className="validate-rule">(Passwords too weak. It needs to contain at least 8 letters and numbers)</p>
                            }
                        </>
                    } */}
                    {
                        registered ?
                            <>
                                <button className="purple-gradient-btn" onClick={clickLoginBtn}>Login</button>
                                <button className="forgot-password-btn" onClick={clickForgotPasswordBtn}>Forgot Password</button>
                            </>
                            :
                            <>
                                <label className="agree-term">
                                    <input type="checkbox" checked={termAgreed} onChange={()=>{setTermAgreed(!termAgreed)}}></input>
                                    I have read and agreed to the 
                                    <button onClick={()=>onClickTermBtn()} className="term-service-btn">terms of service
                                    </button>.
                                </label>
                                <button className="purple-gradient-btn" disabled={!termAgreed||isLoading} onClick={clickRegisterBtn}>
                                    {
                                        isLoading &&
                                        <Spinner className="pending-spinner" animation="border" variant="secondary" />
                                    }
                                    Register</button>
                            </>
                    }
                    
                    
                </Modal.Body>
                {
                    displayTermService &&
                    <TermsOfService clickCloseBtn={onClickCloseTermBtn}/>
                }
            </Modal>
            
        </>
    );
}

const mapStateToProps  = (state) => (
    {
        registered: state.userData.registered,
        fingerPrinterValue: state.betGameData.fingerPrinterValue
    }
)
export default connect(mapStateToProps, {setPublicKey, checkRegisterMessage, login, register, showForgotPasswordModal})(LoginModal)