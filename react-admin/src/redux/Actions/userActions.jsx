import axios from 'axios';
import { ActionTypes } from "../Constants/actionTypes";

export const addUser = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('http://localhost:3000/users/addUser', data);
      console.log('data action', data);

      dispatch({
        type: ActionTypes.ADD_CUSTOMER,
        payload: response.data,
      });
    } catch (error) {
      // Handle any error that occurs during the request
      console.error('Error adding user:', error);
    }
  };
};


export const allUsers =(reqObj) => async dispatch=>{
    try {
        const response = await axios.get('http://localhost:3000/users/allUsers')
          
       console.log("response: " , response.data);

    }catch(error){
        console.log(error);
    }
}

                                         