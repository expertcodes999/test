
import {GET_MAX_CREDITS, GET_MAX_CREDITS_ERROR, BET_REQUEST, BET_SUCCESS, BET_ERROR, END_BET, 
    STOP_BET_SUCCESS, STOP_BET_ERROR, SET_AUTO_BET, STOP_AUTO_BET} from '../utils/types'
import axios from 'axios'

import {serverUrl} from '../utils/constant'
import {setPopUp, getAllBets} from "./gameActions";
import {getMyRecentWins} from "./userActions";
import BetRequestSuccess from "../components/BetRequestSuccess";

export const getMaxCredits = () => async dispatch => {
    
    
    try{
        const res = await axios.get(`getCredits.php`);
        dispatch( {
            type: GET_MAX_CREDITS,
            payload: res.data
        })
        /*dispatch( {
            type: GET_MAX_CREDITS,
            payload: 100
        })*/
    }
    catch(e){
        dispatch( {
            type: GET_MAX_CREDITS_ERROR,
            //payload: console.log(e),
        })
    }

}

export const setMaxCredits = (value) => dispatch => {
    dispatch( {
        type: GET_MAX_CREDITS,
        payload: value
    })
}
export const betRequest = (username, amount, multiplier) => async dispatch => {

    try{
        dispatch( {
            type: BET_REQUEST
        })
        const res = await axios.get(`bet.php?amount=${amount}&multiplier=${multiplier}`);
        console.log("~~~~~~~~~betResult:", res.data)
        if(res.data === "Success"){
            setPopUp(BetRequestSuccess)
            dispatch( {
                type: BET_SUCCESS,
                payload: {username, amount, multiplier}
            })
            dispatch(getAllBets())
        }
        else if(res.data === "Already placed a bet"){
            setPopUp("Already placed a bet");
            dispatch( {
                type: BET_SUCCESS,
                payload: {username, amount, multiplier}
            })
        }
        
        else {
            //setPopUp(res.data)
            dispatch( {
                type: BET_ERROR
            })
        }
    }
    catch(e){
        //setPopUp("You can't bet to this round")
        dispatch( {
            type: BET_ERROR,
            payload: console.log(e),
        })
    }
}

export const stopBet = (stopedValue) => async dispatch => {
    //console.log("~~~~~~~~~stopBet")
    try{
        const res = await axios.get("stopBet.php");
        //console.log("~~~~~~~~~stopBet:", res)
        if(res.data === "Success"){
            dispatch( {
                type: STOP_BET_SUCCESS,
                payload: stopedValue
            })
            dispatch(getAllBets())
            return true
        }
        else {
            setPopUp(res.data)
            dispatch( {
                type: STOP_BET_ERROR
            })
            return true
        }
    }
    catch(e){
        dispatch( {
            type: BET_ERROR
            //payload: console.log(e),
        })
    }
}

export const endBet = () => async dispatch => {
    
    dispatch( {
        type: END_BET
    })
    dispatch(getMyRecentWins())
}
export const setAutoBet = () => async dispatch => {
    dispatch( {
        type: SET_AUTO_BET
    })
}
export const stopAutoBet = () => async dispatch => {
    dispatch( {
        type: STOP_AUTO_BET
    })
}
