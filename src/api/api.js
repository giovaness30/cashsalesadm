import axios from 'axios'
import { parseCookies } from 'nookies'

const { 'sales-token': token } = parseCookies()

export default axios.create({
  baseURL: `http://api4.lyacamargo.com.br`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  }
})
