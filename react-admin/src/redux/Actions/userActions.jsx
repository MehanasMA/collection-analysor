// import axios from 'axios'
// import { Message } from "yup";



// export const addUser=(FormData)=> async dispatch => {

//     try {

//         await axios.post('/api/users/addUser', FormData)
//         Message.success("user add successfully")


        
//     } catch (error) {
//         console.log(error);
//         Message.success("not added")
        
//     }
// }
// import axios from 'axios'
// import { ActionTypes } from "../Constants/actionTypes"

// export const addUser = (data) => {

//   const response= axios.post('/users/addUser')

// console.log('date action',data);

//   return {
//     type: ActionTypes.ADD_USER,
//     payload: response.data,
//   };
// };

import axios from 'axios';
import { ActionTypes } from "../Constants/actionTypes";

export const addUser = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('http://localhost:5000/users/addUser', data);
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

                                         