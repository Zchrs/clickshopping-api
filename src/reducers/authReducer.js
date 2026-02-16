
import { types } from "../types/types";

const initialState = {
    checking: true,
    // uid: null,
    // name: null
}
const initialStateAdmin = {
    checking: true,
    // uid: null,
    // name: null
}

export const authReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        
        case types.authLogin:
            return {
                ...state,
                ...action. payload,
                checking: false
            }
           
        case types.authCheckingFInish:
            return {
                ...state,
                checking: false
            }

        case types.authLogout:
            return {
                checking: true,
                state: initialState
            }


        default:
            return state;
    }

}
export const authReducerAdmin = ( state = initialStateAdmin, action ) => {

    switch ( action.type ) {
        
        case types.authAdminLogin:
            return {
                ...state,
                ...action. payload,
                checking: false
            }
           
        case types.adminCheckingFinish:
            return {
                ...state,
                checking: false
            }

        case types.authAdminLogout:
            return {
                checking: true,
                state: initialStateAdmin
            }


        default:
            return state;
    }

}

export const authReducerActions = ( state = {}, action ) => {
    switch (action.type) {
        case types.authLogin:
            return {
                ...state,
                checking: false,
                ...action.payload
            }
        case types.logout:
            return {}
    
        default:
            return state;
    }
}
