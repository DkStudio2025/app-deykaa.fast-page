<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">¡Bienvenido, {{ user?.name }}!</h2>
          <p class="text-indigo-100 mt-1">Aquí tienes un resumen de tu startup de diseño web</p>
        </div>
        <div class="hidden md:block">
          <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Clientes -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Clientes</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalClients || 0 }}</p>
            <p class="text-sm text-green-600 flex items-center mt-1">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
              </svg>
              +12% este mes
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Proyectos Activos -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Proyectos Activos</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.activeProjects || 0 }}</p>
            <p class="text-sm text-orange-600 flex items-center mt-1">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ stats.overdueProjects || 0 }} vencidos
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Tareas Pendientes -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Tareas Pendientes</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.pendingTasks || 0 }}</p>
            <p class="text-sm text-red-600 flex items-center mt-1">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              {{ stats.urgentTasks || 0 }} urgentes
            </p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Ingresos del Mes -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Ingresos del Mes</p>
            <p class="text-3xl font-bold text-gray-900">${{ formatCurrency(stats.monthlyRevenue || 0) }}</p>
            <p class="text-sm text-green-600 flex items-center mt-1">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
              </svg>
              +8% vs mes anterior
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Proyectos Recientes -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Proyectos Recientes</h3>
              <router-link to="/projects" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Ver todos
              </router-link>
            </div>
          </div>
          <div class="p-6">
            <div v-if="recentProjects.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
              <p class="mt-1 text-sm text-gray-500">Comienza creando tu primer proyecto.</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="project in recentProjects" :key="project.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900">{{ project.name }}</p>
                    <p class="text-sm text-gray-500">{{ project.client?.name || 'Sin cliente' }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span :class="getStatusColor(project.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(project.status) }}
                  </span>
                  <span class="text-sm text-gray-500">{{ formatDate(project.deadline) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Recent Activity -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div class="space-y-3">
              <router-link to="/clients/new" class="flex items-center p-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Nuevo Cliente
              </router-link>
              <router-link to="/projects/new" class="flex items-center p-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                Nuevo Proyecto
              </router-link>
              <router-link to="/quotes/new" class="flex items-center p-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                Nueva Cotización
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
            <div class="space-y-4">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start">
                <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-900">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500">{{ formatTime(activity.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'DashboardHome',
  setup() {
    const authStore = useAuthStore()
    
    const stats = ref({
      totalClients: 0,
      activeProjects: 0,
      pendingTasks: 0,
      urgentTasks: 0,
      overdueProjects: 0,
      monthlyRevenue: 0
    })
    
    const recentProjects = ref([])
    const recentActivity = ref([])

    const user = computed(() => authStore.user)

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(amount)
    }

    const formatDate = (date) => {
      if (!date) return 'Sin fecha'
      return new Date(date).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric'
      })
    }

    const formatTime = (date) => {
      return new Date(date).toLocaleString('es-ES', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getStatusColor = (status) => {
      const colors = {
        'planning': 'bg-blue-100 text-blue-800',
        'in_progress': 'bg-yellow-100 text-yellow-800',
        'review': 'bg-purple-100 text-purple-800',
        'completed': 'bg-green-100 text-green-800',
        'on_hold': 'bg-gray-100 text-gray-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
      return colors[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusText = (status) => {
      const texts = {
        'planning': 'Planificación',
        'in_progress': 'En Progreso',
        'review': 'Revisión',
        'completed': 'Completado',
        'on_hold': 'En Pausa',
        'cancelled': 'Cancelado'
      }
      return texts[status] || status
    }

    const loadDashboardData = async () => {
      // Simular datos por ahora - aquí conectarías con la API real
      stats.value = {
        totalClients: 24,
        activeProjects: 8,
        pendingTasks: 15,
        urgentTasks: 3,
        overdueProjects: 2,
        monthlyRevenue: 12500
      }

      recentProjects.value = [
        {
          id: 1,
          name: 'E-commerce para Tienda Online',
          client: { name: 'María González' },
          status: 'in_progress',
          deadline: '2024-02-15'
        },
        {
          id: 2,
          name: 'Landing Page Corporativa',
          client: { name: 'Carlos Rodríguez' },
          status: 'review',
          deadline: '2024-02-10'
        },
        {
          id: 3,
          name: 'App Móvil React Native',
          client: { name: 'Ana Martínez' },
          status: 'planning',
          deadline: '2024-03-01'
        }
      ]

      recentActivity.value = [
        {
          id: 1,
          description: 'Nuevo cliente agregado: María González',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 2,
          description: 'Proyecto "E-commerce" actualizado',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000)
        },
        {
          id: 3,
          description: 'Cotización enviada a Carlos Rodríguez',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000)
        }
      ]
    }

    onMounted(() => {
      loadDashboardData()
    })

    return {
      user,
      stats,
      recentProjects,
      recentActivity,
      formatCurrency,
      formatDate,
      formatTime,
      getStatusColor,
      getStatusText
    }
  }
}
</script>
