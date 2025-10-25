<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Clientes</h1>
        <p class="text-gray-600">Gestiona tu base de datos de clientes</p>
      </div>
      <router-link to="/dashboard/clients/new" class="btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Nuevo Cliente
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="form-label">Buscar</label>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Nombre, email o empresa..."
            class="form-input"
          />
        </div>
        <div>
          <label class="form-label">Estado</label>
          <select v-model="selectedStatus" class="form-input">
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="potential">Potencial</option>
          </select>
        </div>
        <div>
          <label class="form-label">Ordenar por</label>
          <select v-model="sortBy" class="form-input">
            <option value="name">Nombre</option>
            <option value="created_at">Fecha de creación</option>
            <option value="status">Estado</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="applyFilters" class="btn-primary w-full">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
            </svg>
            Filtrar
          </button>
        </div>
      </div>
    </div>

    <!-- Clients Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span class="ml-3 text-gray-600">Cargando clientes...</span>
      </div>

      <div v-else-if="clients.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay clientes</h3>
        <p class="mt-1 text-sm text-gray-500">Comienza agregando tu primer cliente.</p>
        <div class="mt-6">
          <router-link to="/dashboard/clients/new" class="btn-primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Agregar Cliente
          </router-link>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proyectos
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in clients" :key="client.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-indigo-600">{{ client.name.charAt(0) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ client.name }}</div>
                    <div class="text-sm text-gray-500">{{ client.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ client.company || 'Sin empresa' }}</div>
                <div v-if="client.website" class="text-sm text-gray-500">
                  <a :href="client.website" target="_blank" class="text-indigo-600 hover:text-indigo-700">
                    {{ client.website }}
                  </a>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ client.phone || 'Sin teléfono' }}</div>
                <div class="text-sm text-gray-500">{{ client.address || 'Sin dirección' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusColor(client.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getStatusText(client.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ client.projects_count || 0 }} proyectos
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <router-link :to="`/dashboard/clients/${client.id}/edit`" class="text-indigo-600 hover:text-indigo-900">
                    Editar
                  </router-link>
                  <button @click="confirmDelete(client)" class="text-red-600 hover:text-red-900">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ClientsList',
  setup() {
    const clients = ref([])
    const loading = ref(false)
    const searchQuery = ref('')
    const selectedStatus = ref('')
    const sortBy = ref('name')

    const getStatusColor = (status) => {
      const colors = {
        'active': 'bg-green-100 text-green-800',
        'inactive': 'bg-red-100 text-red-800',
        'potential': 'bg-yellow-100 text-yellow-800'
      }
      return colors[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusText = (status) => {
      const texts = {
        'active': 'Activo',
        'inactive': 'Inactivo',
        'potential': 'Potencial'
      }
      return texts[status] || status
    }

    const applyFilters = () => {
      // Implementar lógica de filtrado
      console.log('Aplicando filtros:', { searchQuery: searchQuery.value, selectedStatus: selectedStatus.value, sortBy: sortBy.value })
    }

    const confirmDelete = (client) => {
      if (confirm(`¿Estás seguro de que quieres eliminar a ${client.name}?`)) {
        // Implementar eliminación
        console.log('Eliminando cliente:', client.id)
      }
    }

    const loadClients = () => {
      loading.value = true
      
      // Simular datos por ahora
      setTimeout(() => {
        clients.value = [
          {
            id: 1,
            name: 'María González',
            email: 'maria@empresa.com',
            phone: '+1 234 567 8900',
            company: 'Tech Solutions',
            website: 'https://techsolutions.com',
            address: 'Calle Principal 123, Ciudad',
            status: 'active',
            projects_count: 3
          },
          {
            id: 2,
            name: 'Carlos Rodríguez',
            email: 'carlos@startup.io',
            phone: '+1 234 567 8901',
            company: 'Startup Inc',
            website: 'https://startup.io',
            address: 'Avenida Central 456, Ciudad',
            status: 'potential',
            projects_count: 1
          },
          {
            id: 3,
            name: 'Ana Martínez',
            email: 'ana@consulting.com',
            phone: '+1 234 567 8902',
            company: 'Consulting Group',
            website: null,
            address: 'Plaza Mayor 789, Ciudad',
            status: 'inactive',
            projects_count: 0
          }
        ]
        loading.value = false
      }, 1000)
    }

    onMounted(() => {
      loadClients()
    })

    return {
      clients,
      loading,
      searchQuery,
      selectedStatus,
      sortBy,
      getStatusColor,
      getStatusText,
      applyFilters,
      confirmDelete
    }
  }
}
</script>
