
import {SET_PUBLICKEY, GET_MY_RECENT_WINS_SUCCESS, GET_MY_RECENT_WINS_ERROR,
    CHANGE_CURRENT_PAGE, GET_LOGIN_REQUEST_SUCCESS, GET_LOGIN_REQUEST_ERROR,
    GET_REGISTERED_STATUS_REQUEST, GET_REGISTERED_STATUS_SUCCESS, GET_REGISTERED_STATUS_ERROR, LOGOUT_REQUEST, 
    GET_STATS_REQUEST, GET_STATS_SUCCESS, GET_STATS_ERROR, SET_PASSWORD_RESET_DATA,
    GET_USER_STATS_REQUEST, GET_USER_STATS_SUCCESS, GET_USER_STATS_ERROR, REMOVE_FRIEND,
    GET_USERNAME_SUCCESS, GET_PUBLICKEY_SUCCESS, ADD_FRIEND, MY_STATS_CHART_TYPE, CHANGE_USE_CHAIN_ID, SET_SIGNED,
    CHANGE_CURRENT_CHAIN_ID} from '../utils/types'
import axios from 'axios'

import {serverUrl} from '../utils/constant'
import {getMaxCredits} from './betActions'
import {setPopUp} from "./gameActions";
// const SocialPost = require("social-post-api");

// export const postSocialMedia = async (postStr, platforms, mediaUrls) => {
//     const social = new SocialPost("FNGA1JK-ZS7MHXP-KGWQA3D-YTK9J6J");
//     const post = await social.post({
//         post: postStr,
//         platforms: platforms,
//         mediaUrls: mediaUrls
//     }).catch(console.error);
//     console.log(post);
// }
export const sendReferralCode = async (refCode) => {
    try{
        const res = await axios.get(`checkRegisterMessage.php?refCode=${refCode}`);
        console.log("~~~~~~~~~sendReferralCode:", res.data)
        return res.data
    }
    catch(e){
        
    }
}
export const getReferralCode = async () => {
    try{
        const res = await axios.get(`getReferallCode.php`);
        console.log("~~~~~~~~~getReferralCode:", res.data)
        return res.data
    }
    catch(e){
        //console.log("Error: getGameCoins")
        return "error"
    }
}
export const getWithdrawableAmount = async () => {
    try{
        const res = await axios.get(`getWithdrawableCredits.php`);
        console.log("~~~~~~~~~getWithdrawableAmount:", res.data)
        return res.data
    }
    catch(e){
        //console.log("Error: getGameCoins")
        return 0
    }
}
export const setSigned = (signed) => dispatch => {
    //console.log("~~~~~~~setSigned", signed)
    dispatch( {
        type: SET_SIGNED,
        payload: signed
    })

}
export const setPublicKey = (publicKey) => async dispatch => {
    //console.log("~~~~~~~publickey", publicKey)
    dispatch( {
        type: SET_PUBLICKEY,
        payload: publicKey
    })

}

export const changeUseChainData = (chainData) => dispatch => {
    
    dispatch( {
        type: CHANGE_USE_CHAIN_ID,
        payload: chainData
    })
}

export const changeCurrentChainID = (chainID) => dispatch => {
    
    dispatch( {
        type: CHANGE_CURRENT_CHAIN_ID,
        payload: chainID
    })
}

export const changeCurrentPage = (targetPage) => dispatch => {
    
    dispatch( {
        type: CHANGE_CURRENT_PAGE,
        payload: targetPage
    })
}

export const setPasswordResetData = (userHash, publicKey) => dispatch => {
    
    dispatch( {
        type: SET_PASSWORD_RESET_DATA,
        payload: {userHash, publicKey}
    })
}

export const login = (userData) => async dispatch => {
    try{
        const res = await axios.post(`check.php`, {
            data: userData
        });
        
        //console.log("~~~~~~~~~login:", res, userData)
        if(res.data === "Login success") {
            dispatch(loginSuccessAction(userData.publicKey));
        }
        else {
            setPopUp("Login failed")
            dispatch( {
                type: GET_LOGIN_REQUEST_ERROR,
                //payload: console.log(res.data)
            })    
        }
    }
    catch(e){
        setPopUp("Login failed")
        dispatch( {
            type: GET_LOGIN_REQUEST_ERROR,
            //payload: console.log(e)
        })
    }
}
export const loginSuccessAction = (publicKey) => async dispatch => {
    setPopUp("Login success")
    dispatch( {
        type: GET_LOGIN_REQUEST_SUCCESS
    })
    dispatch(setPublicKey(publicKey));
    dispatch(getMaxCredits());
    dispatch(getMyRecentWins());
    dispatch(getUserName());
    dispatch(setSigned(true));
}
export const logout = () => dispatch => {
    dispatch( {
        type: LOGOUT_REQUEST
    })
    //console.log("~~~~~~~~~logout")
}
function makeRandomStr(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
export const getPriceForResetPassword = async (userHash, walletAddress) => {
    try {
        const res = await axios.get(`requestPasswordReset.php?userHash=${userHash}&publicKey=${walletAddress}`);
        //console.log("~~~~~~~~~getPriceForResetPassword:", res.data)
        return Number(res.data)
    }
    catch {
        return 0
    }
}
export const getLoginMessage = async (walletAddress) => {
    try {
        const res = await axios.get(`getLoginMessage.php?publicKey=${walletAddress}`);
        //console.log("~~~~~~~~~getLoginMessage:", res.data)
        return res.data
    }
    catch {
        return 0
    }
}
export const getRegisterMessage = async (walletAddress) => {
    try {
        const res = await axios.get(`getRegisterMessage.php?publicKey=${walletAddress}`);
        //console.log("~~~~~~~~~getRegisterMessage:", res.data)
        return res.data
    }
    catch {
        return 0
    }
}
export const checkLoginMessage = (walletAddress, signedMessage, fingerPrintStr) => async dispatch => {
    try{
        const res = await axios.get(`checkLoginMessage.php?publicKey=${walletAddress}&signedMessage=${signedMessage}&print=${fingerPrintStr}`);
        console.log("checkLoginMessage fingerprint: ", fingerPrintStr)
        if(res.data === "Login success") {
            dispatch(loginSuccessAction(walletAddress));
        }
        else {
            console.log("check login failed: ", res)
            setPopUp("Login failed")
            dispatch({
                type: GET_LOGIN_REQUEST_ERROR,
                //payload: console.log(res.data)
            })
        }
    }
    catch(e){
        setPopUp("Login failed")
        dispatch( {
            type: GET_LOGIN_REQUEST_ERROR,
            //payload: console.log(e)
        })
    }

    setSigned(true);

}
export const checkRegisterMessage = (walletAddress, signedMessage, userName, fingerPrintStr, refCode) => async dispatch => {
    try{
        let res;
        if(refCode) {
            res = await axios.get(`checkRegisterMessage.php?publicKey=${walletAddress}&signedMessage=${signedMessage}&username=${userName}&print=${fingerPrintStr}&refCode=${refCode}`);
        }
        else {
            res = await axios.get(`checkRegisterMessage.php?publicKey=${walletAddress}&signedMessage=${signedMessage}&username=${userName}&print=${fingerPrintStr}`);
        }
        console.log("~~~~~~~~~checkRegisterMessage:", res.data)
        if(res.data === "register success") {
            setPopUp("register success")
            dispatch( {
                type: GET_LOGIN_REQUEST_SUCCESS
            })
            dispatch(setPublicKey(walletAddress));
            dispatch(getMaxCredits());
            dispatch(getMyRecentWins());
            dispatch(getUserName());
            dispatch(setSigned(true));
            return true
        }
        else {
            if(res.data === "Username already exists!") {
                setPopUp("Username already exists!")
            }
            else {
                setPopUp("register failed")
            }
            dispatch( {
                type: GET_LOGIN_REQUEST_ERROR,
                //payload: console.log(res.data)
            })    
        }
    }
    catch(e){
        setPopUp("register failed")
        dispatch( {
            type: GET_LOGIN_REQUEST_ERROR,
            //payload: console.log(e)
        })
    }
    return false
    

}
export const sendTXForResetPassword = async (userHash, walletAddress, txHash) => {
    try {
        const res = await axios.get(`updatePasswordReset.php?userHash=${userHash}&publicKey=${walletAddress}&txHash=${txHash}`);
        //console.log("~~~~~~~~~sendTXForResetPassword:", res.data)
        return true
    }
    catch {
        return false
    }
}
export const checkPasswordResetConfirmed = async (userHash, walletAddress) => {
    try {
        const res = await axios.get(`checkPasswordResetConfirmed.php?userHash=${userHash}&publicKey=${walletAddress}`);
        //console.log("~~~~~~~~~checkPasswordResetConfirmed:", res.data)
        if(res.data === "Confirmed") {
            return true
        }
        else {
            return false
        }
    }
    catch {
        return false
    }
}
export const setNewPassword = async (userHash, walletAddress, newPassword) => {
    try {
        const res = await axios.get(`setNewPassword.php?userHash=${userHash}&publicKey=${walletAddress}&password=${newPassword}`);
        //console.log("~~~~~~~~~setNewPassword:", res.data)
        setPopUp(res.data)
        if(res.data === "Password was changed successfully") {
            return true
        }
        else {
            return false
        }
    }
    catch {
        return false
    }
}
export const register = (userData) => async dispatch => {
    try{
        //console.log("~~~~~~~~~register:", userData)
        const res = await axios.post(`check.php`, {
            data: userData
        });
        //console.log("~~~~~~~~~register:", res.data)
        
        if(res.data === "register success") {
            setPopUp("register success")
            dispatch( {
                type: GET_LOGIN_REQUEST_SUCCESS
            })
            dispatch(setPublicKey(userData.publicKey));
            dispatch(getMaxCredits());
            dispatch(getMyRecentWins());
            dispatch(getUserName());
        }
        else {
            setPopUp(res.data)
            dispatch( {
                type: GET_LOGIN_REQUEST_ERROR,
                //payload: console.log(res.data)
            })    
        }
    }
    catch(e){
        setPopUp("register failed")
        dispatch( {
            type: GET_LOGIN_REQUEST_ERROR,
            //payload: console.log(e)
        })
    }
}
export const setRegisteredState = (registeredState) => dispatch => {
    dispatch( {
        type: GET_REGISTERED_STATUS_SUCCESS,
        payload: registeredState
    })
}
export const getRegisteredState = (walletAddress) => async dispatch => {
    try{
        const res = await axios.get(`account.php?publicKey=${walletAddress}`);
        //console.log("~~~~~~~~~getRegisteredState:", res)
        if (res.data === "Doesnt Exist") {
            dispatch( {
                type: GET_REGISTERED_STATUS_SUCCESS,
                payload: false
            })
            return false;
        }
        
        if (res.data === "Exists") {
            dispatch( {
                type: GET_REGISTERED_STATUS_SUCCESS,
                payload: true
            })
            return true;
        }
    }
    catch(e){
        dispatch( {
            type: GET_REGISTERED_STATUS_ERROR,
            //payload: console.log("GET_REGISTERED_STATUS_SUCCESS")
        })
    }
}
export const getMyRecentWins = () => async dispatch => {
    try{
        const res = await axios.get(`getWins.php`);
        //console.log("~~~~~~~~~getMyRecentWins:", res.data)
        if(res.data.message === "Success") {
            dispatch( {
                type: GET_MY_RECENT_WINS_SUCCESS,
                payload: res.data.data
            })
        }
        else {
            dispatch( {
                type: GET_MY_RECENT_WINS_ERROR
            })
        }
    }
    catch(e){
        dispatch( {
            type: GET_MY_RECENT_WINS_ERROR,
            //payload: console.log(e),
        })
    }
}
export const getStats = () => async dispatch => {
    try{
        const res = await axios.get(`getStats.php`);
        //console.log("~~~~~~~~~getStats:", res.data)
        if(res.data.message === "Success") {
            dispatch( {
                type: GET_STATS_SUCCESS,
                payload: res.data.data
            })
        }
        else {
            dispatch( {
                type: GET_STATS_ERROR
            })
        }
    }
    catch(e){
        dispatch( {
            type: GET_STATS_ERROR,
            //payload: console.log(e),
        })
    }
}
export const getUserStats = async (userName) => {
    try{
        const res = await axios.get(`getUserStats.php?username=${userName}`);
        //console.log("~~~~~~~~~getUserStats:", res.data)
        if(res.data.message === "Success") {
            return res.data.data
        }
        else {
            return []
        }
    }
    catch(e){
        //console.log(e)
        return []
    }
}
export const getMyStatsChartData = async (chartType, timeFrame, username) => {
    try{
        let url = '';
        switch(chartType) {
            case MY_STATS_CHART_TYPE.GAME_PLAYED:
                url = 'getGamesPlayed.php'
                break;
            case MY_STATS_CHART_TYPE.TOTAL_WAGERED:
                url = 'getWagered.php'
                break;
            case MY_STATS_CHART_TYPE.NET_PROFIT:
                url = 'getProfit.php'
                break;
        }
        const res = await axios.get(`${url}?timeframe=${timeFrame}&username=${username}`);
        //console.log("~~~~~~~~~getMyStatsChartData:", res.data)
        if(res.data.message === "Success") {
            return res.data.data
        }
        else {
            return []
        }
    }
    catch(e){
        //console.log(e)
        return []
    }
}
export const getStakingRewards = async (timeFrame, username) => {
    try{
        const res = await axios.get(`getStakingRewards.php?timeframe=${timeFrame}&username=${username}`);
        //console.log("~~~~~~~~~getStakingRewards:", res.data)
        if(res.data.message === "Success") {
            return res.data.data
        }
        else {
            return []
        }
    }
    catch(e){
        //console.log(e)
        return []
    }
}
export const getTakUsdValue = async (timeFrame) => {
    try{
        const res = await axios.get(`getTAKUSDValue.php?timeframe=${timeFrame}`);
        //console.log("~~~~~~~~~getTakUsdValue:", res.data)
        if(res.data.message === "Success") {
            return res.data.data
        }
        else {
            return []
        }
    }
    catch(e){
        //console.log(e)
        return []
    }
}
export const getPublicKey = async () => {
    try{
        const res = await axios.get(`getPublickey.php`);
        return res.data;
    }
    catch(e){
        return "Not logged in"
    }
}
export const getUserName = () => async dispatch => {
    try{
        const res = await axios.get(`getUsername.php`);
        //console.log("~~~~~~~~~getUsername:", res.data)
        if(res.data === "Not logged in" || res.data === "Doesnt Exist") {
            
        }
        else {
            dispatch( {
                type: GET_USERNAME_SUCCESS,
                payload: res.data
            })
        }
    }
    catch(e){
        console.log("~~~~~~~~~getUsername error:", e)
    }
}
export const addFriend = (userName) => dispatch => {
    try{
        //console.log("~~~~~~~~~addFriend:", userName)
        dispatch( {
            type: ADD_FRIEND,
            payload: userName
        })
    }
    catch(e){

    }
}
export const removeFriend = (userName) => dispatch => {
    try{
        //console.log("~~~~~~~~~removeFriend:", userName)
        dispatch( {
            type: REMOVE_FRIEND,
            payload: userName
        })
    }
    catch(e){

    }
}

export const deposit = async (tx) => {
    try{
        //console.log("~~~~~~~~~deposit:")
        const res = await axios.get(`deposit.php?tx=${tx}`);
        //console.log("~~~~~~~~~deposit:", res.data)
    }
    catch(e){
        
    }
}