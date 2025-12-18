/* This is implementation of Axios Interceptors to handle the error responses 401 & 403 and redirect to the login page if the user is not authenticated.
  Author : Shweta Vyas    
*/

// axiosSetup.js
import axios from 'axios';
import { Auth } from 'aws-amplify';

export default function setupAxiosInterceptors() {
  axios.interceptors.response.use(
    (response) => {
      // Handle successful responses
      return response;
    },
    async (error) => {
      // Handle error responses
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Unauthorized request, redirect to login page
        try {
          await Auth.signOut();
          window.location.replace('/');
        } catch (e) {
          console.error('Error signing out: ', e);
        }
        // Do not propagate the error further
        return new Promise(() => { });
      }
      else if (error.message === 'Token expired' || error.message === 'Refresh Token has been revoked') {
        console.log('Your session has expired. Please log in again.');
        window.location.replace('/');
      } else {
        console.log(error.message);
      }
      return Promise.reject(error);
    }
  );
}
