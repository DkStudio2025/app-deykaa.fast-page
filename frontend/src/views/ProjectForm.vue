<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h2>
    <form @submit.prevent="handleSubmit" class="max-w-lg">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
          Nombre del Proyecto
        </label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="client">
          Cliente
        </label>
        <select
          id="client"
          v-model="form.client_id"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Seleccionar Cliente</option>
          <option v-for="client in clients" :key="client.id" :value="client.id">
            {{ client.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="status">
          Estado
        </label>
        <select
          id="status"
          v-model="form.status"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En Progreso">En Progreso</option>
          <option value="Completado">Completado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="start_date">
          Fecha de Inicio
        </label>
        <input
          type="date"
          id="start_date"
          v-model="form.start_date"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="end_date">
          Fecha de Finalización
        </label>
        <input
          type="date"
          id="end_date"
          v-model="form.end_date"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
          Descripción
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>

      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {{ isEditing ? 'Actualizar' : 'Crear' }}
        </button>
        <button
          type="button"
          @click="$router.push('/dashboard/projects')"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'ProjectForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isEditing = ref(false)
    const clients = ref([])
    const form = ref({
      name: '',
      client_id: '',
      status: 'Pendiente',
      start_date: '',
      end_date: '',
      description: ''
    })

    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients')
        if (!response.ok) throw new Error('Error al cargar los clientes')
        clients.value = await response.json()
      } catch (error) {
        console.error('Error fetching clients:', error)
      }
    }

    onMounted(async () => {
      await fetchClients()
      
      if (route.params.id) {
        isEditing.value = true
        try {
          const response = await fetch(`/api/projects/${route.params.id}`)
          if (!response.ok) throw new Error('Error al cargar el proyecto')
          const data = await response.json()
          
          // Format dates for input[type="date"]
          form.value = {
            ...data,
            start_date: data.start_date ? data.start_date.split('T')[0] : '',
            end_date: data.end_date ? data.end_date.split('T')[0] : ''
          }
        } catch (error) {
          console.error('Error fetching project:', error)
        }
      }
    })

    const handleSubmit = async () => {
      try {
        const url = isEditing.value 
          ? `/api/projects/${route.params.id}`
          : '/api/projects'
        
        const method = isEditing.value ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.value)
        })

        if (!response.ok) {
          throw new Error('Error al guardar el proyecto')
        }

        router.push('/dashboard/projects')
      } catch (error) {
        console.error('Error saving project:', error)
      }
    }

    return {
      form,
      clients,
      isEditing,
      handleSubmit
    }
  }
}
</script>