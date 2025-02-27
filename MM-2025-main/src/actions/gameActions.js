import { toast } from 'react-toastify';

import {
        GET_GAME_COINS,
        GET_ALL_BET_SUCCESS, 
        GET_ALL_BET_ERROR, 
        SET_GAME_RESULT, 
        CHANGE_GAME_STATE,
        GAME_HISTORY_TYPE,
        GET_GAME_HISTORY_SUCCESS,
        GET_GAME_HISTORY_ERROR,
        GET_PRIZE,
        GET_LEADERBOARD_SUCCESS,
        GET_LEADERBOARD_ERROR ,
        SET_POPUP,
        GET_ONLINE_PLEYERS_SUCCESS,
        GET_ONLINE_PLEYERS_ERROR,
        SHOW_LOGIN_MODAL,
        HIDE_LOGIN_MODAL,
        HIDE_STATS_MODAL,
        SHOW_STATS_MODAL,
        SHOW_HELP_MODAL,
        HIDE_HELP_MODAL,
        SHOW_HISTORY_MODAL,
        HIDE_HISTORY_MODAL,
        SHOW_HELP_DETAIL_MODAL,
        HIDE_HELP_DETAIL_MODAL,
        HIDE_LEADERBOARD_MODAL,
        SHOW_LEADERBOARD_MODAL,
        SHOW_FORGOT_PASSWORD_MODAL,
        HIDE_FORGOT_PASSWORD_MODAL,
        SHOW_RESET_PASSWORD_MODAL,
        HIDE_RESET_PASSWORD_MODAL,
        HIDE_TX_SIGN_MODAL,
        SHOW_TX_SIGN_MODAL,

        SHOW_BANKROLL_MODAL,
        HIDE_BANKROLL_MODAL,
        SHOW_WITHDRAW_MODAL,
        HIDE_WITHDRAW_MODAL,
        SHOW_SELECT_NETWORK_MODAL,
        HIDE_SELECT_NETWORK_MODAL,
        SHOW_DEPOSIT_MODAL,
        HIDE_DEPOSIT_MODAL,
        SHOW_DAILY_BONUS_MODAL,
        HIDE_DAILY_BONUS_MODAL,
        SHOW_SELECT_WALLET_MODAL,
        HIDE_SELECT_WALLET_MODAL,
        SHOW_WHEEL_PRIZE_SPIN_MODAL,
        HIDE_WHEEL_PRIZE_SPIN_MODAL,
        SHOW_WHEEL_PRIZE_WIN_MODAL,
        HIDE_WHEEL_PRIZE_WIN_MODAL,

        SET_LATEST_RESULTS,
        SET_BACK_AUDIO_VOLUME,
        SET_EFFECT_AUDIO_VOLUME,
        SET_BET_BUTTON_VOLUME,
        SET_MUTE_AUDIO,
        SET_TIME_TO_START,
        SET_ROUND_WIN,
        GET_LAST_RESULTS,
        GET_MAX_PROFIT,
        BOOK_BET,
        STOP_BOOK_BET,
        CHANGE_CURRENT_BET_COION,
        PLAY_BETBUTTON_CLICK_SOUND,
        PLAY_CLOSEBUTTON_CLICK_SOUND,
        PLAY_BET_SOUND,
        PLAY_SPIN_BTN_CLICK_SOUND,

        SET_FINGER_PRINTER,
        SET_DISPLAY_VALUE
    } from '../utils/types'
import axios from 'axios'

import {serverUrl} from '../utils/constant'

export const setDisplayValue = (value) => dispatch => {
    dispatch({
        type: SET_DISPLAY_VALUE,
        payload: value
    })
}
export const getReferralStats = async () => {
    try{
        const res = await axios.get(`getReferallsStats.php`);
        console.log("~~~~~~~~~getReferralStats:", res.data)
        if(res.data.message === "Success")
        {
            return res.data.data
        }
        return []
    }
    catch(e){
        //console.log("Error: getLeaderBoards")
        return [];
    }
}
export const claimReferral = async () => {
    try{
        const res = await axios.get(`claimReferalls.php`);
        console.log("~~~~~~~~~claimReferral:", res.data)
        return res.data
    }
    catch(e){
        //console.log("Error: getLeaderBoards")
        return "claim failed!";
    }
}
export const gerReferralBalance = async () => {
    try{
        const res = await axios.get(`getReferallsBalance.php`);
        console.log("~~~~~~~~~gerReferralBalance:", res.data)
        if(res.data !== "Not logged in!")
        {
            return res.data
        }
        return 0
    }
    catch(e){
        //console.log("Error: getLeaderBoards")
        return 0;
    }
}
export const gerReferralsHistory = async () => {
    try{
        const res = await axios.get(`getReferallsHistory.php`);
        console.log("~~~~~~~~~gerReferralsHistory:", res.data)
        if(res.data.message === "Success") {
            return res.data.data
        }
    }
    catch(e){
        //console.log("Error: getLeaderBoards")
        return [];
    }
}
export const copyTextToClipboard = (value) => {
    var dummy = document.createElement('input')
    document.body.appendChild(dummy);
    dummy.value = value;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
}
export const setFingerPrinter = (value) => dispatch => {
    dispatch( {
        type: SET_FINGER_PRINTER,
        payload: value
    })
}
export const playBetSoundAction = (betSoundType) => dispatch => {
    dispatch( {
        type: PLAY_BET_SOUND,
        payload: {
            play: true,
            soundType: betSoundType
        }
    })
}
export const betSoundPlayed = () => dispatch => {
    dispatch( {
        type: PLAY_BET_SOUND,
        payload: {
            play: false,
            soundType: null
        }
    })
}
export const changeBetCoin = (betCoin) => dispatch => {
    dispatch( {
        type: CHANGE_CURRENT_BET_COION,
        payload: betCoin
    })
}
export const stopBookBet = () => dispatch => {
    dispatch( {
        type: STOP_BOOK_BET
    })
}
export const bookBet = (amount, multiplier) => dispatch => {
    dispatch( {
        type: BOOK_BET,
        payload: {
            bookAmount: amount,
            bookMultiplier: multiplier
        }
    })
}
export const playBetButtonClickSoundAction = (value) => dispatch => {
    console.log("playBetButtonClickSoundAction")
    dispatch( {
        type: PLAY_BETBUTTON_CLICK_SOUND,
        payload: value
    })
}
export const playCloseButtonClickSoundAction = (value) => dispatch => {
    dispatch( {
        type: PLAY_CLOSEBUTTON_CLICK_SOUND,
        payload: value
    })
}
export const playSpinBtnClickSoundAction = (value) => dispatch => {
    dispatch( {
        type: PLAY_SPIN_BTN_CLICK_SOUND,
        payload: value
    })
}

export const setBackAudioVolume = (value) => dispatch => {
    dispatch( {
        type: SET_BACK_AUDIO_VOLUME,
        payload: value
    })
}
export const setEffectAudioVolume = (value) => dispatch => {
    dispatch( {
        type: SET_EFFECT_AUDIO_VOLUME,
        payload: value
    })
}
export const setBetButtonVolume = (value) => dispatch => {
    dispatch( {
        type: SET_BET_BUTTON_VOLUME,
        payload: value
    })
}
export const setMuteAudio = (value) => dispatch => {
    dispatch( {
        type: SET_MUTE_AUDIO,
        payload: value
    })
}
export const setRoundWin = (win) => dispatch => {
    dispatch( {
        type: SET_ROUND_WIN,
        payload: win
    })
}
export const getBankroll = () => async dispatch => {
    try{
        const res = await axios.get(`getBankroll.php`);
        //console.log("~~~~~~~~~getBankroll:", res.data)
        dispatch({
            type: GET_MAX_PROFIT,
            payload: res.data
        })
    }
    catch(e){
        //console.log("Error: getGameCoins")
    }
}
export const getLastResults = () => async dispatch => {
    try{
        const res = await axios.get(`getLastResults.php`);
        //console.log("~~~~~~~~~getLastResults:", res.data)
        if(res.data.message === "Success") {
            dispatch({
                type: GET_LAST_RESULTS,
                payload: res.data.data
            })
        }
        else {
            dispatch({
                type: GET_LAST_RESULTS,
                payload: []
            })
        }
    }
    catch(e){
        //console.log("Error: getGameCoins")
        return [];
    }
}

export const getGameCoins = () => async dispatch => {
    try{
        const res = await axios.get(`getTokens.php`);
        //console.log("~~~~~~~~~getGameCoins:", res.data)
        if(res.data.message === "Success") {
            dispatch({
                type: GET_GAME_COINS,
                payload: res.data.data
            })
        }
        else {
            dispatch({
                type: GET_GAME_COINS,
                payload: []
            })
        }
    }
    catch(e){
        //console.log("Error: getGameCoins")
        return [];
    }
}

export const getTimeLeft = async () => {
    try{
        console.log("~~~~~~~~~getTimeLeft")
        const res = await axios.get(`wheel/getTimeleft.php`);
        console.log("~~~~~~~~~getTimeLeft:", res.data)
        return res.data
    }
    catch(e){
        //console.log("Error: getLeaderBoards")
        return false;
    }
}

export const getPrize = () => async dispatch => {
    try{
        const res = await axios.get(`wheel/getPrize.php`);
        console.log("~~~~~~~~~getPrize:", res.data)
        dispatch( {
            type: GET_PRIZE,
            payload: res.data
        })
        return res.data
    }
    catch(e){
        //console.log("Error: getLeaderBoards")
        return false;
    }
}

export const getDailyBonusRecentWins = async () => {
    try{
        const res = await axios.get(`wheel/getLastResults.php`);
        console.log("~~~~~~~~~getDailyBonusRecentWins:", res.data)
        if(res.data.message === "Success") {
            return res.data.data;    
        }
        else {
            return []
        }
    }
    catch(e){
        //console.log("Error: getLeaderBoards")
        return []
    }
}

export const getLeaderBoards = async () => {
    try{
        const res = await axios.get(`getLeaderboard.php`);
        //console.log("~~~~~~~~~all getLeaderBoards:", res.data)
        if(res.data.message === "Success") {
            return res.data.data;
        }
        else {
            return [];
        }
    }
    catch(e){
        //console.log("Error: getLeaderBoards")
        return [];
    }
}

export const getAllBets = () => async dispatch => {
    try{
        const res = await axios.get(`getBets.php`);
        //console.log("~~~~~~~~~all bet:", res.data)
        if(res.data.message === "Success") {
            dispatch( {
                type: GET_ALL_BET_SUCCESS,
                payload: res.data.data
            })
        }
    }
    catch(e){
        //console.log("~~~~~~")
        dispatch( {
            type: GET_ALL_BET_ERROR
        })
    }
}
export const getOnlinePlayerCount = () => async dispatch => {
    try{
        const res = await axios.get(`getOnline.php`);
        //console.log("~~~~~~~~~getOnlinePlayerCount:", res.data)
        dispatch( {
            type: GET_ONLINE_PLEYERS_SUCCESS,
            payload: res.data
        })
        
    }
    catch(e){
        dispatch( {
            type: GET_ONLINE_PLEYERS_ERROR
        })
    }
}
export const getHistoryData = (historyType) => async (dispatch) => {
    let apiUrl = "";
    switch(historyType) {
        case GAME_HISTORY_TYPE.ALL:
            apiUrl = "getAllWins.php";
            break;
        case GAME_HISTORY_TYPE.HIGH_WINS:
            apiUrl = "getHighWins.php";
            break;
        case GAME_HISTORY_TYPE.LUCKY_WINS:
            apiUrl = "getLuckyWins.php";
            break;
        case GAME_HISTORY_TYPE.MY_WAGER:
            apiUrl = "getWagers.php";
            break;
    }
    try{
        const res = await axios.get(`${apiUrl}`);
        if(res.data.message === "Success") {
            dispatch( {
                type: GET_GAME_HISTORY_SUCCESS,
                payload: res.data.data,
                historyType: historyType
            })
        }
    }
    catch(e){
        dispatch( {
            type: GET_GAME_HISTORY_ERROR
            //payload: console.log(e),
        })
    }
}

export const removeAllBets = () => async dispatch => {
    dispatch( {
        type: GET_ALL_BET_SUCCESS,
        payload: []
    })
}

export const setGameResult = (result) => async dispatch => {
    dispatch( {
        type: SET_GAME_RESULT,
        payload: result
    })

}

export const setTimeToStart = (leftTime) => dispatch => {
    dispatch( {
        type: SET_TIME_TO_START,
        payload: leftTime
    })
}

export const changeGameState = (gameState) => async dispatch => {
    dispatch( {
        type: CHANGE_GAME_STATE,
        payload: gameState
    })

}
export const setPopUp = (popup) => {
    toast.info(popup, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
    // dispatch( {
    //     type: SET_POPUP,
    //     payload: popup
    // })

}
export const showLoginModal = () => dispatch => {
    //console.log("showLoginModal")
    dispatch( {
        type: SHOW_LOGIN_MODAL
    })
}
export const hideLoginModal = () => dispatch => {
    //console.log("hideLoginModal")
    dispatch( {
        type: HIDE_LOGIN_MODAL
    })
}
export const showStatsModal = () => dispatch => {
    //console.log("showStatsModal")
    dispatch( {
        type: SHOW_STATS_MODAL
    })
}
export const hideStatsModal = () => dispatch => {
    //console.log("hideStatsModal")
    dispatch( {
        type: HIDE_STATS_MODAL
    })
}
export const showHelpModal = () => dispatch => {
    //console.log("showHelpModal")
    dispatch( {
        type: SHOW_HELP_MODAL
    })
}
export const hideHelpModal = () => dispatch => {
    //console.log("hideHelpModal")
    dispatch( {
        type: HIDE_HELP_MODAL
    })
}
export const showHelpDetailModal = (data) => dispatch => {
    //console.log("showHelpDetailModal")
    dispatch( {
        type: SHOW_HELP_DETAIL_MODAL,
        payload: data
    })
}
export const hideHelpDetailModal = () => dispatch => {
    //console.log("hideHelpDetailModal")
    dispatch( {
        type: HIDE_HELP_DETAIL_MODAL
    })
}
export const showHisotyModal = () => dispatch => {
    //console.log("showHisotyModal")
    dispatch( {
        type: SHOW_HISTORY_MODAL
    })
}
export const hideHisotyModal = () => dispatch => {
    //console.log("hideHisotyModal")
    dispatch( {
        type: HIDE_HISTORY_MODAL
    })
}
export const showForgotPasswordModal = () => dispatch => {
    //console.log("showForgotPasswordModal")
    dispatch( {
        type: SHOW_FORGOT_PASSWORD_MODAL
    })
}
export const hideForgotPasswordModal = () => dispatch => {
    //console.log("hideForgotPasswordModal")
    dispatch( {
        type: HIDE_FORGOT_PASSWORD_MODAL
    })
}
export const showResetPasswordModal = () => dispatch => {
    //console.log("showResetPasswordModal")
    dispatch( {
        type: SHOW_RESET_PASSWORD_MODAL
    })
}
export const hideResetPasswordModal = () => dispatch => {
    //console.log("hideResetPasswordModal")
    dispatch( {
        type: HIDE_RESET_PASSWORD_MODAL
    })
}
export const setLatestResults = (crashedValue) => dispatch => {
    //console.log("setLatestResults")
    dispatch( {
        type: SET_LATEST_RESULTS,
        payload: crashedValue
    })
}
export const hideLeaderboardModal = () => dispatch => {
    //console.log("hideLeaderboardModal")
    dispatch( {
        type: HIDE_LEADERBOARD_MODAL
    })
}
export const showLeaderboardModal = () => dispatch => {
    //console.log("showLeaderboardModal")
    dispatch( {
        type: SHOW_LEADERBOARD_MODAL
    })
}
export const hideTxSignModal = () => dispatch => {
    //console.log("hideTxSignModal")
    dispatch( {
        type: HIDE_TX_SIGN_MODAL
    })
}
export const showTxSignModal = () => dispatch => {
    //console.log("showTxSignModal")
    dispatch( {
        type: SHOW_TX_SIGN_MODAL
    })
}
export const showBankRollModal = () => dispatch => {
    //console.log("showTxSignModal")
    dispatch( {
        type: SHOW_BANKROLL_MODAL
    })
}
export const hideBankRollModal = () => dispatch => {
    //console.log("hideTxSignModal")
    dispatch( {
        type: HIDE_BANKROLL_MODAL
    })
}
export const showWithdrawModal = () => dispatch => {
    //console.log("showTxSignModal")
    dispatch( {
        type: SHOW_WITHDRAW_MODAL
    })
}
export const hideWithdrawModal = () => dispatch => {
    //console.log("hideTxSignModal")
    dispatch( {
        type: HIDE_WITHDRAW_MODAL
    })
}
export const showSelectNetworkModal = () => dispatch => {
    //console.log("showTxSignModal")
    dispatch( {
        type: SHOW_SELECT_NETWORK_MODAL
    })
}
export const hideSelectNetworkModal = () => dispatch => {
    //console.log("hideTxSignModal")
    dispatch( {
        type: HIDE_SELECT_NETWORK_MODAL
    })
}
export const showDepositModal = () => dispatch => {
    //console.log("showTxSignModal")
    dispatch( {
        type: SHOW_DEPOSIT_MODAL
    })
}
export const hideDepositModal = () => dispatch => {
    //console.log("hideTxSignModal")
    dispatch( {
        type: HIDE_DEPOSIT_MODAL
    })
}
export const showDailyBonusModal = () => dispatch => {
    //console.log("showTxSignModal")
    dispatch( {
        type: SHOW_DAILY_BONUS_MODAL
    })
}
export const hideDailyBonusModal = () => dispatch => {
    //console.log("hideTxSignModal")
    dispatch( {
        type: HIDE_DAILY_BONUS_MODAL
    })
}
export const showSelectWalletModal = () => dispatch => {
    //console.log("showTxSignModal")
    dispatch( {
        type: SHOW_SELECT_WALLET_MODAL
    })
}
export const hideSelectWalletModal = () => dispatch => {
    //console.log("hideTxSignModal")
    dispatch( {
        type: HIDE_SELECT_WALLET_MODAL
    })
}
export const showWheelPrizeSpinModal = () => dispatch => {
    //console.log("showTxSignModal")
    dispatch( {
        type: SHOW_WHEEL_PRIZE_SPIN_MODAL
    })
}
export const hideWheelPrizeSpinModal = () => dispatch => {
    //console.log("hideTxSignModal")
    dispatch( {
        type: HIDE_WHEEL_PRIZE_SPIN_MODAL
    })
}
export const showWheelPrizeWinModal = () => dispatch => {
    //console.log("showTxSignModal")
    dispatch( {
        type: SHOW_WHEEL_PRIZE_WIN_MODAL
    })
}
export const hideWheelPrizeWinModal = () => dispatch => {
    //console.log("hideTxSignModal")
    dispatch( {
        type: HIDE_WHEEL_PRIZE_WIN_MODAL
    })
}
