import axios from 'axios'

const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'https://ecommerce.bdboibazer.com/api/v1'

export const axiosClient = axios.create({
  baseURL: apiBase,
  withCredentials: true, // send cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Response interceptor to normalize errors
axiosClient.interceptors.response.use(
  res => res,
  err => {
    const response = err.response
    if (response && response.data) {
      return Promise.reject(response.data)
    }
    return Promise.reject(err)
  }
)

export default axiosClient
