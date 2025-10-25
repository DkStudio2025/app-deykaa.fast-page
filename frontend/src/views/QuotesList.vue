<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Cotizaciones</h2>
      <router-link
        to="/dashboard/quotes/new"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Nueva Cotización
      </router-link>
    </div>

    <div v-if="loading" class="text-center">
      <p class="text-gray-600">Cargando cotizaciones...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-else-if="quotes.length === 0" class="text-center">
      <p class="text-gray-600">No hay cotizaciones registradas</p>
    </div>

    <div v-else class="bg-white shadow-md rounded my-6">
      <table class="min-w-full table-auto">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">#</th>
            <th class="py-3 px-6 text-left">Cliente</th>
            <th class="py-3 px-6 text-left">Total</th>
            <th class="py-3 px-6 text-left">Estado</th>
            <th class="py-3 px-6 text-left">Fecha</th>
            <th class="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="quote in quotes" :key="quote.id" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6 text-left">{{ quote.id }}</td>
            <td class="py-3 px-6 text-left">{{ quote.client?.name || '-' }}</td>
            <td class="py-3 px-6 text-left">{{ formatCurrency(quote.total) }}</td>
            <td class="py-3 px-6 text-left">{{ quote.status }}</td>
            <td class="py-3 px-6 text-left">{{ formatDate(quote.created_at) }}</td>
            <td class="py-3 px-6 text-center">
              <div class="flex item-center justify-center">
                <router-link :to="`/dashboard/quotes/${quote.id}/edit`" class="w-4 mr-4 transform hover:text-blue-500 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </router-link>
                <button @click="deleteQuote(quote.id)" class="w-4 mr-2 transform hover:text-red-500 hover:scale-110">
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
  name: 'QuotesList',
  setup() {
    const quotes = ref([])
    const loading = ref(true)
    const error = ref(null)

    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/quotes')
        if (!response.ok) throw new Error('Error al cargar las cotizaciones')
        quotes.value = await response.json()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const deleteQuote = async (id) => {
      if (!confirm('¿Estás seguro de que deseas eliminar esta cotización?')) return
      try {
        const response = await fetch(`/api/quotes/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Error al eliminar la cotización')
        quotes.value = quotes.value.filter(q => q.id !== id)
      } catch (err) {
        error.value = err.message
      }
    }

    const formatDate = (date) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString()
    }

    const formatCurrency = (amount) => {
      if (amount == null) return '-'
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount)
    }

    onMounted(() => {
      fetchQuotes()
    })

    return {
      quotes,
      loading,
      error,
      deleteQuote,
      formatDate,
      formatCurrency
    }
  }
}
</script>