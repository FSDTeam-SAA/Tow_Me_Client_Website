const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1').replace(/\/$/, '')

const TOKEN_KEY = 'towme_customer_access_token'
const USER_KEY = 'towme_customer_user'

export function getStoredSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY) || ''
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    return { token, user }
  } catch {
    return { token: '', user: null }
  }
}

export function storeSession(data) {
  localStorage.setItem(TOKEN_KEY, data.accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify({
    id: data._id,
    name: data.name,
    phoneNumber: data.phoneNumber,
    email: data.email,
  }))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

async function request(path, options = {}) {
  const { token } = getStoredSession()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.success === false) {
    const error = new Error(payload.message || 'לא ניתן להשלים את הפעולה כרגע')
    error.status = response.status
    error.payload = payload
    throw error
  }
  return payload.data
}

export const api = {
  baseUrl: API_BASE_URL,
  async login(phoneNumber, password) {
    const data = await request('/auth/customer/login', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, password }),
    })
    storeSession(data)
    return data
  },
  getManufacturers() {
    return request('/vehicles/manufacturers')
  },
  getModels(manufacturerId) {
    return request(`/vehicles/models?manufacturerId=${encodeURIComponent(manufacturerId)}`)
  },
  estimateTrip(payload) {
    return request('/trips/estimate', { method: 'POST', body: JSON.stringify(payload) })
  },
  createTrip(payload) {
    return request('/trips', { method: 'POST', body: JSON.stringify(payload) })
  },
  getDriverLocation(tripId) {
    return request(`/trips/${tripId}/driver-location`)
  },
  cancelTrip(tripId, reason = 'ביטול על ידי הלקוח מהאתר') {
    return request(`/trips/${tripId}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) })
  },
}
