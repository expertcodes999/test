import {
    SET_DISPLAY_VALUE
} from '../../utils/types';

const initialState = {
    value: 1
}
const displayValueReducer = (state = initialState, action) => {
    
    switch(action.type){
        case SET_DISPLAY_VALUE:
            return {
                value: action.payload
            }
        default: return state
    }

}


export default displayValueReducer;