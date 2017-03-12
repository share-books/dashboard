import axios from 'axios';

let base = '';

export const fetchList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const addUser = params => { return axios.post(`${base}/user/add`, params); };

export const editUser = params => { return axios.post(`${base}/user/edit`, params); };

export const removeUser = params => { return axios.post(`${base}/user/remove`, params); };

export const postError = params => { return axios.get(`${base}/error`, { params: params }); };

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const fetchSchoolList = params => { return axios.get(`${base}/schools`).then(res => res.data); };

export const fetchWorkDurationOptions = params => { return axios.get(`${base}/work_durations`).then(res => res.data); };

export const fetchAcademicOptions = params => { return axios.get(`${base}/academics`).then(res => res.data); };

export const postResume = params => { return axios.post(`${base}/resume`, params).then(res => res.data); };

export const createResume = params => { return axios.post(`${base}/resume/add`).then(res => res.data); };

const _products = [
    { "id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2 },
    { "id": 2, "title": "H&M T-Shirt White", "price": 10.99, "inventory": 10 },
    { "id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "inventory": 5 }
]

export const getProducts = cb => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(_products), 100)
    })
}

export const buyProducts = (products) => {
     return new Promise((resolve, reject) => {
      setTimeout(() => {
          if ( Math.random() > 0.1)
            resolve("OK")
          else
            reject('network too slow')
      }, 100)
    })

}
