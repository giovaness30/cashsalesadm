import { createStore } from 'redux';

const INICIAL_STATE = {
    select: '99999999999999'
}

function reducer(state= INICIAL_STATE, action ) {
    if (action.type === 'SET_SELECT'){
        return{...state, select: action.select}
    }
    return state
}

const store = createStore(reducer);

export default store;