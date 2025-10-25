<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <button
              @click="$router.push('/dashboard')"
              class="text-indigo-600 hover:text-indigo-500 mr-4"
            >
              ← Volver al Dashboard
            </button>
            <h1 class="text-2xl font-bold text-indigo-600">Datos</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="$router.push('/data/new')"
              class="btn-primary"
            >
              <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Nuevo Dato
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Filters -->
        <div class="card mb-6">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-64">
              <label class="form-label">Buscar</label>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Buscar por título..."
                class="form-input"
                @input="debouncedSearch"
              />
            </div>
            <div class="min-w-48">
              <label class="form-label">Categoría</label>
              <select v-model="selectedCategory" @change="applyFilters" class="form-input">
                <option value="">Todas las categorías</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <div class="min-w-32">
              <label class="form-label">Estado</label>
              <select v-model="selectedStatus" @change="applyFilters" class="form-input">
                <option value="">Todos</option>
                <option value="1">Activos</option>
                <option value="0">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div class="card">
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-gray-500">Cargando datos...</p>
          </div>

          <div v-else-if="data.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay datos</h3>
            <p class="mt-1 text-sm text-gray-500">Comienza creando tu primer dato.</p>
            <div class="mt-6">
              <button
                @click="$router.push('/data/new')"
                class="btn-primary"
              >
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Crear Primer Dato
              </button>
            </div>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in data" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ item.title }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">{{ item.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">{{ item.category || 'Sin categoría' }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    >
                      {{ item.is_active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(item.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <button
                        @click="$router.push(`/data/${item.id}/edit`)"
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar
                      </button>
                      <button
                        @click="confirmDelete(item)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.last_page > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="changePage(pagination.current_page - 1)"
                :disabled="pagination.current_page <= 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                @click="changePage(pagination.current_page + 1)"
                :disabled="pagination.current_page >= pagination.last_page"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando
                  <span class="font-medium">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span>
                  a
                  <span class="font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span>
                  de
                  <span class="font-medium">{{ pagination.total }}</span>
                  resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    @click="changePage(pagination.current_page - 1)"
                    :disabled="pagination.current_page <= 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="changePage(page)"
                    :class="page === pagination.current_page ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="changePage(pagination.current_page + 1)"
                    :disabled="pagination.current_page >= pagination.last_page"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="mt-2 text-center">
            <h3 class="text-lg font-medium text-gray-900">Eliminar Dato</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                ¿Estás seguro de que quieres eliminar "{{ itemToDelete?.title }}"? Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-4">
            <button
              @click="showDeleteModal = false"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button
              @click="handleDelete"
              :disabled="deleteLoading"
              class="btn-danger"
            >
              <span v-if="deleteLoading">Eliminando...</span>
              <span v-else>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useDataStore } from '../stores/data'
import { debounce } from 'lodash-es'

export default {
  name: 'DataList',
  setup() {
    const dataStore = useDataStore()
    
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const selectedStatus = ref('')
    const showDeleteModal = ref(false)
    const itemToDelete = ref(null)
    const deleteLoading = ref(false)

    const data = computed(() => dataStore.data)
    const loading = computed(() => dataStore.loading)
    const pagination = computed(() => dataStore.pagination)

    const categories = computed(() => {
      const cats = new Set()
      data.value.forEach(item => {
        if (item.category) cats.add(item.category)
      })
      return Array.from(cats)
    })

    const visiblePages = computed(() => {
      const current = pagination.value.current_page
      const last = pagination.value.last_page
      const pages = []
      
      const start = Math.max(1, current - 2)
      const end = Math.min(last, current + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })

    const debouncedSearch = debounce(() => {
      applyFilters()
    }, 500)

    const applyFilters = async () => {
      const params = {
        page: 1
      }
      
      if (searchQuery.value) {
        params.search = searchQuery.value
      }
      
      if (selectedCategory.value) {
        params.category = selectedCategory.value
      }
      
      if (selectedStatus.value !== '') {
        params.is_active = selectedStatus.value
      }
      
      await dataStore.fetchData(params)
    }

    const changePage = async (page) => {
      if (page < 1 || page > pagination.value.last_page) return
      
      const params = {
        page,
        ...(searchQuery.value && { search: searchQuery.value }),
        ...(selectedCategory.value && { category: selectedCategory.value }),
        ...(selectedStatus.value !== '' && { is_active: selectedStatus.value })
      }
      
      await dataStore.fetchData(params)
    }

    const confirmDelete = (item) => {
      itemToDelete.value = item
      showDeleteModal.value = true
    }

    const handleDelete = async () => {
      if (!itemToDelete.value) return
      
      deleteLoading.value = true
      const result = await dataStore.deleteData(itemToDelete.value.id)
      
      if (result.success) {
        showDeleteModal.value = false
        itemToDelete.value = null
      } else {
        alert(result.message)
      }
      
      deleteLoading.value = false
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    onMounted(() => {
      dataStore.fetchData()
    })

    return {
      data,
      loading,
      pagination,
      searchQuery,
      selectedCategory,
      selectedStatus,
      categories,
      visiblePages,
      showDeleteModal,
      itemToDelete,
      deleteLoading,
      debouncedSearch,
      applyFilters,
      changePage,
      confirmDelete,
      handleDelete,
      formatDate
    }
  }
}
</script>
