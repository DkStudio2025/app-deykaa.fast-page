<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-6">Reportes y Estadísticas</h2>

    <!-- Tarjetas de Resumen -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Proyectos Activos</h3>
        <p class="text-3xl font-bold text-gray-700">{{ statistics.activeProjects }}</p>
        <div class="text-sm text-gray-400">
          {{ statistics.completedProjects }} completados este mes
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Tareas Pendientes</h3>
        <p class="text-3xl font-bold text-gray-700">{{ statistics.pendingTasks }}</p>
        <div class="text-sm text-gray-400">
          {{ statistics.completedTasks }} completadas esta semana
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Cotizaciones del Mes</h3>
        <p class="text-3xl font-bold text-gray-700">${{ formatNumber(statistics.monthlyQuotesTotal) }}</p>
        <div class="text-sm text-gray-400">
          {{ statistics.monthlyQuotesCount }} cotizaciones
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">Clientes Activos</h3>
        <p class="text-3xl font-bold text-gray-700">{{ statistics.activeClients }}</p>
        <div class="text-sm text-gray-400">
          {{ statistics.newClients }} nuevos este mes
        </div>
      </div>
    </div>

    <!-- Gráficas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Proyectos por Estado -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Proyectos por Estado</h3>
        <div class="h-64 flex items-center justify-center" v-if="loading">
          <p class="text-gray-500">Cargando datos...</p>
        </div>
        <div class="h-64" v-else>
          <!-- Aquí puedes integrar una librería de gráficos como Chart.js -->
          <div class="space-y-4">
            <div v-for="(count, status) in projectsByStatus" :key="status" class="flex items-center">
              <div class="w-32 text-sm text-gray-600">{{ status }}</div>
              <div class="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full"
                  :class="getStatusColor(status)"
                  :style="{ width: calculatePercentage(count, getTotalProjects) + '%' }"
                ></div>
              </div>
              <div class="w-12 text-right text-sm text-gray-600">{{ count }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cotizaciones Mensuales -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Cotizaciones Mensuales</h3>
        <div class="h-64 flex items-center justify-center" v-if="loading">
          <p class="text-gray-500">Cargando datos...</p>
        </div>
        <div class="h-64" v-else>
          <!-- Aquí puedes integrar una librería de gráficos como Chart.js -->
          <div class="space-y-4">
            <div v-for="(month, index) in monthlyQuotes" :key="index" class="flex items-center">
              <div class="w-32 text-sm text-gray-600">{{ month.name }}</div>
              <div class="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-500 rounded-full"
                  :style="{ width: calculatePercentage(month.amount, getMaxMonthlyQuote) + '%' }"
                ></div>
              </div>
              <div class="w-24 text-right text-sm text-gray-600">${{ formatNumber(month.amount) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'Reports',
  setup() {
    const loading = ref(true)
    const statistics = ref({
      activeProjects: 0,
      completedProjects: 0,
      pendingTasks: 0,
      completedTasks: 0,
      monthlyQuotesTotal: 0,
      monthlyQuotesCount: 0,
      activeClients: 0,
      newClients: 0
    })

    const projectsByStatus = ref({})
    const monthlyQuotes = ref([])

    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/statistics')
        if (!response.ok) throw new Error('Error al cargar estadísticas')
        const data = await response.json()
        statistics.value = data.summary
        projectsByStatus.value = data.projectsByStatus
        monthlyQuotes.value = data.monthlyQuotes
      } catch (error) {
        console.error('Error fetching statistics:', error)
      } finally {
        loading.value = false
      }
    }

    const formatNumber = (number) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(number)
    }

    const getStatusColor = (status) => {
      const colors = {
        'Pendiente': 'bg-yellow-500',
        'En Progreso': 'bg-blue-500',
        'Completado': 'bg-green-500',
        'Cancelado': 'bg-red-500'
      }
      return colors[status] || 'bg-gray-500'
    }

    const calculatePercentage = (value, total) => {
      return ((value / total) * 100).toFixed(1)
    }

    const getTotalProjects = computed(() => {
      return Object.values(projectsByStatus.value).reduce((a, b) => a + b, 0)
    })

    const getMaxMonthlyQuote = computed(() => {
      return Math.max(...monthlyQuotes.value.map(m => m.amount))
    })

    onMounted(() => {
      fetchStatistics()
    })

    return {
      loading,
      statistics,
      projectsByStatus,
      monthlyQuotes,
      formatNumber,
      getStatusColor,
      calculatePercentage,
      getTotalProjects,
      getMaxMonthlyQuote
    }
  }
}
</script>