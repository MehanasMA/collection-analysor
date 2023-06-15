const initialState={
    ALLUSERS:[ ]
}

export const usersReducer=(state=initialState,action)=>{
    
    switch(action.type){

        case'GET_ALL_USERS' :

    // console.log("stte",state);

            return{
                ...state,

               ALLUSERS:action.payload
            }
        
        default:
            return state
    }
}

