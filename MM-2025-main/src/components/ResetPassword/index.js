import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { setNewPassword } from '../../actions/userActions'
import { setPopUp, showLoginModal } from '../../actions/gameActions'

import './index.scss';
import BottomLineInputComponent from "../../components/BottomLineInputComponent";
import {connect} from 'react-redux'

const ResetPassword = (props) => {
    const { show, onHide, setPopUp, passwordResetData, showLoginModal } = props;
    const {account} = useWeb3React();
    const [userData, setUserData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [inputErrors, setInputErrors] = useState({
        password: false,
        confirmPassword: false
    })
    useEffect(async () => {
        setUserData({
            password: "",
            confirmPassword: ""
        })
        setInputErrors({
            password: false,
            confirmPassword: false
        })
    }, [show])
    const setPassword = async () => {
        if (userData.password === "" || userData.confirmPassword === "" || inputErrors.password ||
            inputErrors.confirmPassword || userData.confirmPassword !== userData.password) {
            setPopUp('Input all field correctly!')
            return;
        }
        const resetResult = await setNewPassword(passwordResetData.userHash, passwordResetData.publicKey, userData.password)
        if(resetResult) {
            onHide()
            showLoginModal()
        }
        else {

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
    return (
        <>
            <Modal show={show} onHide={onHide} className="monkey-modal reset-password-modal">
                <Modal.Header closeButton closeVariant='white'>
                    <Modal.Title><span>RESET PASSWORD</span></Modal.Title>
                    
                </Modal.Header>
                <Modal.Body>
                    <BottomLineInputComponent label="Password" className="fill-input moon-bet-input purple-bg-input-child" type="password" prefix=""
                        valueChangeHandler={(value) => {inputPasswordValue("password", value)}} defaultValue={userData.password} />
                    {
                        inputErrors.password &&
                        <p className="validate-rule">(Passwords too weak. It needs to contain at least 8 letters and numbers)</p>
                    }
                    <BottomLineInputComponent label="Confirm Password" className="fill-input moon-bet-input purple-bg-input-child" type="password" prefix=""
                        valueChangeHandler={(value) => {inputPasswordValue("confirmPassword", value)}} defaultValue={userData.confirmPassword} />
                    {
                        inputErrors.confirmPassword &&
                        <p className="validate-rule">(Passwords too weak. It needs to contain at least 8 letters and numbers)</p>
                    }
                    <button disabled={userData.password === "" || userData.confirmPassword === "" || inputErrors.password ||
                            inputErrors.confirmPassword || userData.confirmPassword !== userData.password} className="purple-gradient-btn" 
                            onClick={setPassword}>SET NEW PASSWORD</button>
                </Modal.Body>
            </Modal>
            
        </>
    );
}

const mapStateToProps  = (state) => (
    {
        passwordResetData: state.userData.passwordResetData
    }
)
export default connect(mapStateToProps, {setPopUp, showLoginModal})(ResetPassword)