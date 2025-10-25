import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Importar vistas
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import DashboardHome from './views/DashboardHome.vue'
import DataList from './views/DataList.vue'
import DataForm from './views/DataForm.vue'

// Configurar rutas
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/dashboard', 
    component: Dashboard,
    children: [
      { path: '', component: DashboardHome },
      { path: 'clients', component: () => import('./views/ClientsList.vue') },
      { path: 'clients/new', component: () => import('./views/ClientForm.vue') },
      { path: 'clients/:id/edit', component: () => import('./views/ClientForm.vue') },
      { path: 'projects', component: () => import('./views/ProjectsList.vue') },
      { path: 'projects/new', component: () => import('./views/ProjectForm.vue') },
      { path: 'projects/:id/edit', component: () => import('./views/ProjectForm.vue') },
      { path: 'tasks', component: () => import('./views/TasksList.vue') },
      { path: 'tasks/new', component: () => import('./views/TaskForm.vue') },
      { path: 'tasks/:id/edit', component: () => import('./views/TaskForm.vue') },
      { path: 'quotes', component: () => import('./views/QuotesList.vue') },
      { path: 'quotes/new', component: () => import('./views/QuoteForm.vue') },
      { path: 'quotes/:id/edit', component: () => import('./views/QuoteForm.vue') },
      { path: 'reports', component: () => import('./views/Reports.vue') }
    ]
  },
  { path: '/data', component: DataList },
  { path: '/data/new', component: DataForm },
  { path: '/data/:id/edit', component: DataForm }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Middleware de autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.path === '/login') {
    if (token) {
      next('/dashboard')
    } else {
      next()
    }
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
