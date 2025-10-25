<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Editar Cotización' : 'Nueva Cotización' }}</h2>
    
    <form @submit.prevent="handleSubmit" class="max-w-lg">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="client">
          Cliente
        </label>
        <select
          id="client"
          v-model="form.client_id"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Seleccionar Cliente</option>
          <option v-for="client in clients" :key="client.id" :value="client.id">
            {{ client.name }}
          </option>
        </select>
      </div>

      <!-- Items de la cotización -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <label class="block text-gray-700 text-sm font-bold">
            Items
          </label>
          <button
            type="button"
            @click="addItem"
            class="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-1 px-2 rounded"
          >
            + Agregar Item
          </button>
        </div>

        <div v-for="(item, index) in form.items" :key="index" class="bg-gray-50 p-3 mb-2 rounded">
          <div class="grid grid-cols-12 gap-2">
            <div class="col-span-6">
              <input
                type="text"
                v-model="item.description"
                placeholder="Descripción"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="col-span-2">
              <input
                type="number"
                v-model="item.quantity"
                placeholder="Cant."
                min="1"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="col-span-2">
              <input
                type="number"
                v-model="item.price"
                placeholder="Precio"
                min="0"
                step="0.01"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                required
              >
            </div>
            <div class="col-span-1 flex items-center">
              ${{ calculateItemTotal(item) }}
            </div>
            <div class="col-span-1">
              <button
                type="button"
                @click="removeItem(index)"
                class="bg-red-500 hover:bg-red-700 text-white rounded p-1"
                title="Eliminar item"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Totales -->
      <div class="mb-4 bg-gray-100 p-4 rounded">
        <div class="flex justify-between mb-2">
          <span class="font-bold">Subtotal:</span>
          <span>${{ calculateSubtotal }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-bold">IVA (16%):</span>
          <span>${{ calculateTax }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${{ calculateTotal }}</span>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="notes">
          Notas
        </label>
        <textarea
          id="notes"
          v-model="form.notes"
          rows="3"
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
          @click="$router.push('/dashboard/quotes')"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'QuoteForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isEditing = ref(false)
    const clients = ref([])
    const form = ref({
      client_id: '',
      items: [
        { description: '', quantity: 1, price: 0 }
      ],
      notes: ''
    })

    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients')
        if (!response.ok) throw new Error('Error al cargar los clientes')
        clients.value = await response.json()
      } catch (error) {
        console.error('Error fetching clients:', error)
      }
    }

    const calculateItemTotal = (item) => {
      return (parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)
    }

    const calculateSubtotal = computed(() => {
      return form.value.items.reduce((total, item) => {
        return total + (parseFloat(item.quantity) * parseFloat(item.price))
      }, 0).toFixed(2)
    })

    const calculateTax = computed(() => {
      return (parseFloat(calculateSubtotal.value) * 0.16).toFixed(2)
    })

    const calculateTotal = computed(() => {
      return (parseFloat(calculateSubtotal.value) + parseFloat(calculateTax.value)).toFixed(2)
    })

    const addItem = () => {
      form.value.items.push({ description: '', quantity: 1, price: 0 })
    }

    const removeItem = (index) => {
      if (form.value.items.length > 1) {
        form.value.items.splice(index, 1)
      }
    }

    onMounted(async () => {
      await fetchClients()
      
      if (route.params.id) {
        isEditing.value = true
        try {
          const response = await fetch(`/api/quotes/${route.params.id}`)
          if (!response.ok) throw new Error('Error al cargar la cotización')
          const data = await response.json()
          form.value = data
        } catch (error) {
          console.error('Error fetching quote:', error)
        }
      }
    })

    const handleSubmit = async () => {
      try {
        const url = isEditing.value 
          ? `/api/quotes/${route.params.id}`
          : '/api/quotes'
        
        const method = isEditing.value ? 'PUT' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...form.value,
            subtotal: parseFloat(calculateSubtotal.value),
            tax: parseFloat(calculateTax.value),
            total: parseFloat(calculateTotal.value)
          })
        })

        if (!response.ok) {
          throw new Error('Error al guardar la cotización')
        }

        router.push('/dashboard/quotes')
      } catch (error) {
        console.error('Error saving quote:', error)
      }
    }

    return {
      form,
      clients,
      isEditing,
      handleSubmit,
      addItem,
      removeItem,
      calculateItemTotal,
      calculateSubtotal,
      calculateTax,
      calculateTotal
    }
  }
}
</script>