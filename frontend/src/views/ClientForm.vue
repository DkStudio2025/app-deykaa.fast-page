<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Editar Cliente' : 'Nuevo Cliente' }}</h2>
    <form @submit.prevent="handleSubmit" class="max-w-lg">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
          Nombre
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
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">
          Teléfono
        </label>
        <input
          type="tel"
          id="phone"
          v-model="form.phone"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
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
          @click="$router.push('/dashboard/clients')"
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
  name: 'ClientForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isEditing = ref(false)
    const form = ref({
      name: '',
      email: '',
      phone: ''
    })

    onMounted(async () => {
      if (route.params.id) {
        isEditing.value = true
        try {
          const response = await fetch(`/api/clients/${route.params.id}`)
          const data = await response.json()
          form.value = data
        } catch (error) {
          console.error('Error fetching client:', error)
        }
      }
    })

    const handleSubmit = async () => {
      try {
        const url = isEditing.value 
          ? `/api/clients/${route.params.id}`
          : '/api/clients'
        
        const method = isEditing.value ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.value)
        })

        if (!response.ok) {
          throw new Error('Error saving client')
        }

        router.push('/dashboard/clients')
      } catch (error) {
        console.error('Error saving client:', error)
      }
    }

    return {
      form,
      isEditing,
      handleSubmit
    }
  }
}
</script>