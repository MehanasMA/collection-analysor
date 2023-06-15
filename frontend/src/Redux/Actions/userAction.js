import axios from "axios";

import {message} from 'antd'


export const addUser =(reqObj)=>async dispatch => {
    try {

        console.log("response",reqObj);
        const response = await axios.post('/users/addUser',reqObj)
       localStorage.setItem('User',JSON.stringify(response.data))

       console.log(response.data,"respoooo");
        
    } catch (error) {
        console.log(error);
        
    }
}


export const allUsers =(reqObj) => async dispatch=>{
    try {
        const response = await axios.get('/users/allUsers')
          
    //    console.log("response: " , response.data);

       dispatch({type:"GET_ALL_USERS",payload:response.data})


    }catch(error){
        console.log(error);
    }
}

// export const collectionList=(reqObj)=> async dispatch=>{
//     try {
//         const response= await axios.get('/api/user/collectionList',reqObj);
        
//     } catch (error) {
//         console.log(error);
//     }
// }

// export const allUsers = () => {
//     return axios.get('/api/user/allUsers')
//     .then(response => response.data)
//     .catch(error => {
//         throw error;
//     });
// };

// Pay API 

export const handlePaymentRequest =(reqObj)=>async dispatch=>{
    const paymentResponse = await axios.post("http://localhost:5000/users/pay",reqObj)
    console.log("paymentResponse",paymentResponse);
    message.success(paymentResponse.data);
    message.error(paymentResponse.data);
    



}

