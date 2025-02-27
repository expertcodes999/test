import {
    GET_ALL_BET_SUCCESS, 
    GET_ALL_BET_ERROR,
    GET_ONLINE_PLEYERS_SUCCESS,
    GET_ONLINE_PLEYERS_ERROR,
    BET_SUCCESS
} from '../../utils/types';

const initialState = {
    allBets: [],
    loading: false,
    onlinePlayerCount: 0,
}
const usersBetDataReducer = (state = initialState, action) => {
    
    switch(action.type){
        case BET_SUCCESS:
        return {
            ...state,
            allBets: state.allBets.push({ 
                username: action.payload.username, 
                amount: action.payload.amount,
                multiplier: action.payload.multiplier})
        }
        case GET_ALL_BET_SUCCESS:
        return {
            ...state,
            allBets: action.payload.map(betData => 
                {
                    return { username: betData[0], amount: betData[1], multiplier:betData[2]}
                }),
            onlinePlayerCount: Math.max(action.payload.length, state.onlinePlayerCount),
            loading: false
        }
        case GET_ALL_BET_ERROR:
            //console.log("set all bet test value")
            let curValue = 20
            return {
                ...state,
                allBets:
                //     [{username: curValue.toString(), amount: curValue, multiplier: 1.1},
                //     {username: (curValue+1).toString(), amount: curValue+1, multiplier: 2.12},
                //     {username: (curValue+2).toString(), amount: curValue+1, multiplier: 2.13},
                //     {username: (curValue+3).toString(), amount: curValue+1, multiplier: 2.14},
                //     {username: (curValue+4).toString(), amount: curValue+1, multiplier: 2.15},
                //     {username: (curValue+5).toString(), amount: curValue+1, multiplier: 2.2},
                //     {username: (curValue+6).toString(), amount: curValue+1, multiplier: 2.3},
                //     {username: (curValue+7).toString(), amount: curValue+1, multiplier: 2.4},
                //     {username: (curValue+8).toString(), amount: curValue+1, multiplier: 1.2},
                //     ],
                [],
                loading: false
            }
        case GET_ONLINE_PLEYERS_SUCCESS:
        return {
            ...state,
            onlinePlayerCount: Math.max(action.payload, state.allBets.length)
        }
        case GET_ONLINE_PLEYERS_ERROR:
        return {
            ...state,
            onlinePlayerCount: 0
        }
        default: return state
    }

}


export default usersBetDataReducer;