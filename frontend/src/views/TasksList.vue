<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Tareas</h2>
      <router-link
        to="/dashboard/tasks/new"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Nueva Tarea
      </router-link>
    </div>

    <div v-if="loading" class="text-center">
      <p class="text-gray-600">Cargando tareas...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-else-if="tasks.length === 0" class="text-center">
      <p class="text-gray-600">No hay tareas registradas</p>
    </div>

    <div v-else class="bg-white shadow-md rounded my-6">
      <table class="min-w-full table-auto">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">Título</th>
            <th class="py-3 px-6 text-left">Proyecto</th>
            <th class="py-3 px-6 text-left">Estado</th>
            <th class="py-3 px-6 text-left">Prioridad</th>
            <th class="py-3 px-6 text-left">Fecha Límite</th>
            <th class="py-3 px-6 text-left">Asignado a</th>
            <th class="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="task in tasks" :key="task.id" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6 text-left">
              <div class="flex items-center">
                <span>{{ task.title }}</span>
              </div>
            </td>
            <td class="py-3 px-6 text-left">{{ task.project?.name || '-' }}</td>
            <td class="py-3 px-6 text-left">
              <span :class="getStatusClass(task.status)" class="py-1 px-3 rounded-full text-xs">
                {{ task.status }}
              </span>
            </td>
            <td class="py-3 px-6 text-left">
              <span :class="getPriorityClass(task.priority)" class="py-1 px-3 rounded-full text-xs">
                {{ task.priority }}
              </span>
            </td>
            <td class="py-3 px-6 text-left">{{ formatDate(task.due_date) }}</td>
            <td class="py-3 px-6 text-left">{{ task.assigned_to?.name || '-' }}</td>
            <td class="py-3 px-6 text-center">
              <div class="flex item-center justify-center">
                <button 
                  @click="toggleTaskStatus(task)" 
                  class="w-4 mr-4 transform hover:text-green-500 hover:scale-110"
                  :title="task.status === 'Completada' ? 'Marcar como pendiente' : 'Marcar como completada'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <router-link 
                  :to="`/dashboard/tasks/${task.id}/edit`" 
                  class="w-4 mr-4 transform hover:text-blue-500 hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </router-link>
                <button @click="deleteTask(task.id)" class="w-4 mr-2 transform hover:text-red-500 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'TasksList',
  setup() {
    const tasks = ref([])
    const loading = ref(true)
    const error = ref(null)

    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks')
        if (!response.ok) {
          throw new Error('Error al cargar las tareas')
        }
        tasks.value = await response.json()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const deleteTask = async (id) => {
      if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        return
      }

      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Error al eliminar la tarea')
        }

        tasks.value = tasks.value.filter(task => task.id !== id)
      } catch (err) {
        error.value = err.message
      }
    }

    const toggleTaskStatus = async (task) => {
      try {
        const newStatus = task.status === 'Completada' ? 'Pendiente' : 'Completada'
        const response = await fetch(`/api/tasks/${task.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        })

        if (!response.ok) {
          throw new Error('Error al actualizar el estado de la tarea')
        }

        task.status = newStatus
      } catch (err) {
        error.value = err.message
      }
    }

    const formatDate = (date) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString()
    }

    const getStatusClass = (status) => {
      const classes = {
        'Pendiente': 'bg-yellow-200 text-yellow-600',
        'En Progreso': 'bg-blue-200 text-blue-600',
        'Completada': 'bg-green-200 text-green-600',
        'Cancelada': 'bg-red-200 text-red-600'
      }
      return classes[status] || 'bg-gray-200 text-gray-600'
    }

    const getPriorityClass = (priority) => {
      const classes = {
        'Alta': 'bg-red-200 text-red-600',
        'Media': 'bg-yellow-200 text-yellow-600',
        'Baja': 'bg-blue-200 text-blue-600'
      }
      return classes[priority] || 'bg-gray-200 text-gray-600'
    }

    onMounted(() => {
      fetchTasks()
    })

    return {
      tasks,
      loading,
      error,
      deleteTask,
      toggleTaskStatus,
      formatDate,
      getStatusClass,
      getPriorityClass
    }
  }
}
</script>