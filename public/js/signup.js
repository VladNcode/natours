/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// {
//   "name": "Puma Krasotka",
//   "email": "shikakadurila@mailsac.com",
//   "password": "test1234",
//   "passwordConfirm": "test1234"
// }

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Thanks for signin up!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
