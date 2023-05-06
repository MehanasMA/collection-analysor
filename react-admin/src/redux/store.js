import {createStore,applyMiddleware, combineReducers} from 'redux'
// import { userReducer } from './Reducers/userReducer'
import thunk from 'redux-thunk';


const rootReducer=combineReducers({})

const store = createStore( rootReducer,applyMiddleware(thunk))



export default store

