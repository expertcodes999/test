import {
    GAME_STATE, 
    CHANGE_GAME_STATE,
    SET_GAME_RESULT
} from '../../utils/types';

const initialState = {
    gameState: GAME_STATE.NONE,
    gameResult: 1
}
const gameValueReducer = (state = initialState, action) => {
    
    switch(action.type){
        case SET_GAME_RESULT:
            return {
                ...state,
                gameResult: action.payload
            }
            break;
        case CHANGE_GAME_STATE:
            return {
                ...state,
                gameState: action.payload
            }
        default: return state
    }

}


export default gameValueReducer;