<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
    <form @submit.prevent="handleSubmit" class="max-w-lg">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
          Título de la Tarea
        </label>
        <input
          type="text"
          id="title"
          v-model="form.title"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="project">
          Proyecto
        </label>
        <select
          id="project"
          v-model="form.project_id"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Seleccionar Proyecto</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="assigned_to">
          Asignar a
        </label>
        <select
          id="assigned_to"
          v-model="form.assigned_to_id"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Seleccionar Usuario</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
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
          <option value="Completada">Completada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="priority">
          Prioridad
        </label>
        <select
          id="priority"
          v-model="form.priority"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="due_date">
          Fecha Límite
        </label>
        <input
          type="date"
          id="due_date"
          v-model="form.due_date"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
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
          @click="$router.push('/dashboard/tasks')"
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
  name: 'TaskForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isEditing = ref(false)
    const projects = ref([])
    const users = ref([])
    const form = ref({
      title: '',
      project_id: '',
      assigned_to_id: '',
      status: 'Pendiente',
      priority: 'Media',
      due_date: '',
      description: ''
    })

    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) throw new Error('Error al cargar los proyectos')
        projects.value = await response.json()
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) throw new Error('Error al cargar los usuarios')
        users.value = await response.json()
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    onMounted(async () => {
      await Promise.all([fetchProjects(), fetchUsers()])
      
      if (route.params.id) {
        isEditing.value = true
        try {
          const response = await fetch(`/api/tasks/${route.params.id}`)
          if (!response.ok) throw new Error('Error al cargar la tarea')
          const data = await response.json()
          
          // Format date for input[type="date"]
          form.value = {
            ...data,
            due_date: data.due_date ? data.due_date.split('T')[0] : ''
          }
        } catch (error) {
          console.error('Error fetching task:', error)
        }
      }
    })

    const handleSubmit = async () => {
      try {
        const url = isEditing.value 
          ? `/api/tasks/${route.params.id}`
          : '/api/tasks'
        
        const method = isEditing.value ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.value)
        })

        if (!response.ok) {
          throw new Error('Error al guardar la tarea')
        }

        router.push('/dashboard/tasks')
      } catch (error) {
        console.error('Error saving task:', error)
      }
    }

    return {
      form,
      projects,
      users,
      isEditing,
      handleSubmit
    }
  }
}
</script>