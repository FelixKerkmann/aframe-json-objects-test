import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8888/api',
})

export const insertModel = payload => api.post(`/model`, payload)
export const getAllModels = () => api.get(`/models`)
export const updateModelById = (id, payload) => api.put(`/model/${id}`, payload)
export const deleteModelById = id => api.delete(`/model/${id}`)
export const getModelById = id => api.get(`/model/${id}`)

const apis = {
    insertModel,
    getAllModels,
    updateModelById,
    deleteModelById,
    getModelById,
}

export default apis