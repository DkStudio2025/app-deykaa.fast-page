<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Accede a tu cuenta de Deykaa
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="form.email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="form.password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading">Iniciando sesión...</span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            ¿No tienes cuenta?
            <button
              type="button"
              @click="showRegister = true"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </form>

      <!-- Modal de Registro -->
      <div v-if="showRegister" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Registrarse</h3>
            
            <form @submit.prevent="handleRegister">
              <div class="space-y-4">
                <div>
                  <label class="form-label">Nombre</label>
                  <input
                    type="text"
                    v-model="registerForm.name"
                    required
                    class="form-input"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    v-model="registerForm.email"
                    required
                    class="form-input"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label class="form-label">Contraseña</label>
                  <input
                    type="password"
                    v-model="registerForm.password"
                    required
                    class="form-input"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                
                <div>
                  <label class="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    v-model="registerForm.password_confirmation"
                    required
                    class="form-input"
                    placeholder="Repite tu contraseña"
                  />
                </div>
              </div>

              <div v-if="registerError" class="text-red-600 text-sm mt-2">
                {{ registerError }}
              </div>

              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  @click="showRegister = false"
                  class="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="registerLoading"
                  class="btn-primary"
                >
                  <span v-if="registerLoading">Registrando...</span>
                  <span v-else>Registrarse</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      email: '',
      password: ''
    })
    
    const registerForm = ref({
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    })
    
    const error = ref('')
    const registerError = ref('')
    const loading = ref(false)
    const registerLoading = ref(false)
    const showRegister = ref(false)

    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      
      const result = await authStore.login(form.value)
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        error.value = result.message
      }
      
      loading.value = false
    }

    const handleRegister = async () => {
      registerLoading.value = true
      registerError.value = ''
      
      const result = await authStore.register(registerForm.value)
      
      if (result.success) {
        showRegister.value = false
        router.push('/dashboard')
      } else {
        registerError.value = result.message
      }
      
      registerLoading.value = false
    }

    return {
      form,
      registerForm,
      error,
      registerError,
      loading,
      registerLoading,
      showRegister,
      handleLogin,
      handleRegister
    }
  }
}
</script>
