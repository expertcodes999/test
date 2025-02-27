import { GiTurret } from 'react-icons/gi';
import {GET_MAX_CREDITS, BET_SUCCESS, BET_ERROR, END_BET, STOP_BET_SUCCESS, STOP_BET_ERROR, BET_REQUEST,
    SET_AUTO_BET, STOP_AUTO_BET} from '../../utils/types';

const initialState = {
    maxCredits: 0,
    betState: false,
    autoBetState: false,
    betAmount: 1,
    multiplier: 1,
    loading: false,
    loadingBetRequest: false,
}

const betReducer = (state = initialState, action) => {

    switch(action.type){

        case GET_MAX_CREDITS:
        return {
            ...state,
            maxCredits: action.payload
        }
        case BET_REQUEST:
        return {
            ...state,
            loadingBetRequest: true,
        }   
        case BET_SUCCESS:
        return {
            ...state,
            betState: true,
            betAmount: action.payload.amount,
            multiplier: action.payload.multiplier,
            loadingBetRequest: false,

        }
        case BET_ERROR:
        return {
            ...state,
            betState: false,
            loadingBetRequest: false

        }
        case STOP_BET_SUCCESS:
        return {
            ...state,
            betState: false,
            loading: false,
            multiplier: action.payload
        }
        case STOP_BET_ERROR:
        return {
            ...state,
            loading: false

        }
        case END_BET:
        return {
            ...state,
            betState: false,
            loading: false,
        }
        case SET_AUTO_BET:
        return {
            ...state,
            autoBetState: true

        }
        case STOP_AUTO_BET:
        return {
            ...state,
            autoBetState: false

        }
        
        default: return state
    }

}

export default betReducer;