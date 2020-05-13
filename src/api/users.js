//import axiosInstance from '@/utils/request'
import axios from 'axios'
export function getUserList (data) {
  return axios.get('http://www.reddays.kr/reviews.json')
}
