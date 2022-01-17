import axios from 'axios';
import { parseCookies } from 'nookies';

const { 'sales-token': token } = parseCookies();

export default axios.create({
    baseURL: `http://localhost:3333`,
    headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    }
});