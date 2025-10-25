import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/api'

export const useDataStore = defineStore('data', () => {
  const data = ref([])
  const loading = ref(false)
  const pagination = ref({})

  const fetchData = async (params = {}) => {
    loading.value = true
    try {
      const response = await api.get('/data', { params })
      data.value = response.data.data.data
      pagination.value = {
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
        total: response.data.data.total
      }
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      }
    } finally {
      loading.value = false
    }
  }

  const createData = async (formData) => {
    loading.value = true
    try {
      const response = await api.post('/data', formData)
      data.value.unshift(response.data.data)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al crear datos' 
      }
    } finally {
      loading.value = false
    }
  }

  const updateData = async (id, formData) => {
    loading.value = true
    try {
      const response = await api.put(`/data/${id}`, formData)
      const index = data.value.findIndex(item => item.id === id)
      if (index !== -1) {
        data.value[index] = response.data.data
      }
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar datos' 
      }
    } finally {
      loading.value = false
    }
  }

  const deleteData = async (id) => {
    loading.value = true
    try {
      await api.delete(`/data/${id}`)
      data.value = data.value.filter(item => item.id !== id)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al eliminar datos' 
      }
    } finally {
      loading.value = false
    }
  }

  const getDataById = async (id) => {
    try {
      const response = await api.get(`/data/${id}`)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      }
    }
  }

  return {
    data,
    loading,
    pagination,
    fetchData,
    createData,
    updateData,
    deleteData,
    getDataById
  }
})
