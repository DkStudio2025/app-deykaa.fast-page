<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <button
              @click="$router.push('/data')"
              class="text-indigo-600 hover:text-indigo-500 mr-4"
            >
              ← Volver a Datos
            </button>
            <h1 class="text-2xl font-bold text-indigo-600">
              {{ isEdit ? 'Editar Dato' : 'Nuevo Dato' }}
            </h1>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
            
            <div class="space-y-4">
              <div>
                <label class="form-label">Título *</label>
                <input
                  type="text"
                  v-model="form.title"
                  required
                  class="form-input"
                  placeholder="Ingresa el título"
                  :class="{ 'border-red-500': errors.title }"
                />
                <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
              </div>

              <div>
                <label class="form-label">Descripción</label>
                <textarea
                  v-model="form.description"
                  rows="4"
                  class="form-input"
                  placeholder="Describe el dato..."
                  :class="{ 'border-red-500': errors.description }"
                ></textarea>
                <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Categoría</label>
                  <input
                    type="text"
                    v-model="form.category"
                    class="form-input"
                    placeholder="Ej: Productos, Ventas, etc."
                    :class="{ 'border-red-500': errors.category }"
                  />
                  <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
                </div>

                <div>
                  <label class="form-label">Estado</label>
                  <select
                    v-model="form.is_active"
                    class="form-input"
                    :class="{ 'border-red-500': errors.is_active }"
                  >
                    <option :value="true">Activo</option>
                    <option :value="false">Inactivo</option>
                  </select>
                  <p v-if="errors.is_active" class="mt-1 text-sm text-red-600">{{ errors.is_active }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Metadatos</h3>
            <p class="text-sm text-gray-500 mb-4">
              Puedes agregar información adicional en formato JSON
            </p>
            
            <div>
              <label class="form-label">Metadatos (JSON)</label>
              <textarea
                v-model="metadataJson"
                rows="6"
                class="form-input font-mono text-sm"
                placeholder='{"clave": "valor", "otro": "dato"}'
                :class="{ 'border-red-500': errors.metadata }"
              ></textarea>
              <p v-if="errors.metadata" class="mt-1 text-sm text-red-600">{{ errors.metadata }}</p>
              <p class="mt-1 text-xs text-gray-500">
                Formato JSON válido. Deja vacío si no necesitas metadatos.
              </p>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error</h3>
                <div class="mt-2 text-sm text-red-700">
                  {{ error }}
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$router.push('/data')"
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary"
            >
              <span v-if="loading">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isEdit ? 'Actualizando...' : 'Creando...' }}
              </span>
              <span v-else>
                {{ isEdit ? 'Actualizar' : 'Crear' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '../stores/data'

export default {
  name: 'DataForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const dataStore = useDataStore()
    
    const form = ref({
      title: '',
      description: '',
      category: '',
      metadata: null,
      is_active: true
    })
    
    const metadataJson = ref('')
    const errors = ref({})
    const error = ref('')
    const loading = ref(false)

    const isEdit = computed(() => !!route.params.id)

    const parseMetadata = () => {
      if (!metadataJson.value.trim()) {
        return null
      }
      
      try {
        return JSON.parse(metadataJson.value)
      } catch (e) {
        throw new Error('Formato JSON inválido en metadatos')
      }
    }

    const handleSubmit = async () => {
      loading.value = true
      errors.value = {}
      error.value = ''

      try {
        // Validar metadatos JSON
        form.value.metadata = parseMetadata()
      } catch (e) {
        errors.value.metadata = e.message
        loading.value = false
        return
      }

      if (isEdit.value) {
        const result = await dataStore.updateData(route.params.id, form.value)
        if (result.success) {
          router.push('/data')
        } else {
          if (result.message.includes('Validation errors')) {
            errors.value = result.errors || {}
          } else {
            error.value = result.message
          }
        }
      } else {
        const result = await dataStore.createData(form.value)
        if (result.success) {
          router.push('/data')
        } else {
          if (result.message.includes('Validation errors')) {
            errors.value = result.errors || {}
          } else {
            error.value = result.message
          }
        }
      }
      
      loading.value = false
    }

    const loadData = async () => {
      if (!isEdit.value) return
      
      loading.value = true
      const result = await dataStore.getDataById(route.params.id)
      
      if (result.success) {
        const data = result.data
        form.value = {
          title: data.title,
          description: data.description,
          category: data.category,
          metadata: data.metadata,
          is_active: data.is_active
        }
        
        if (data.metadata) {
          metadataJson.value = JSON.stringify(data.metadata, null, 2)
        }
      } else {
        error.value = result.message
      }
      
      loading.value = false
    }

    onMounted(() => {
      loadData()
    })

    return {
      form,
      metadataJson,
      errors,
      error,
      loading,
      isEdit,
      handleSubmit
    }
  }
}
</script>
