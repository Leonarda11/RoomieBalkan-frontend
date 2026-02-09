<template>
  <v-app>
    <!-- TOP BAR -->
    <v-app-bar flat color="white">
      <v-container class="d-flex align-center">
        <v-toolbar-title class="font-weight-bold">Roomie Balkan</v-toolbar-title>

    <!-- Gumb Dodaj oglas - samo za admina -->
        <v-btn
        v-if="currentUser && ['admin','super_admin'].includes(currentUser.role)"
        color="primary"
        class="ms-3"
        @click="handleAddAdClick"
        >
        Dodaj oglas
        </v-btn>

        <v-spacer />
        <v-text-field
          density="compact"
          label="Pretraži grad ili državu"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          rounded
          hide-details
          style="max-width: 300px"
          v-model="searchQuery"
        />
        <v-btn icon class="ms-3">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- MAIN CONTENT -->
    <v-main class="bg-grey-lighten-4">
      <v-container>
        <!-- FILTER & SORT -->
        <v-row class="mb-6" align="center">
          <v-col cols="12" md="4">
            <v-select
              label="Sortiraj po cijeni"
              :items="[
                { title: 'Najniža cijena', value: 'asc' },
                { title: 'Najviša cijena', value: 'desc' }
              ]"
              variant="outlined"
              clearable
              v-model="sortPrice"
            />
          </v-col>
          <v-col cols="12" md="8" class="d-flex justify-end">
            <span class="text-grey">Pronađeno oglasa: {{ filteredAds.length }}</span>
          </v-col>
        </v-row>

        <v-row>
          <!-- SIDEBAR -->
          <v-col cols="12" md="3">
            <v-sheet rounded="lg" class="pa-4">
              <h3 class="mb-2">Filtriraj rezultate</h3>
              <p class="text-grey mb-4">Suzi pretragu prema svojim željama</p>

              <v-select
                label="Država"
                :items="countries"
                clearable
                variant="outlined"
                v-model="filters.country"
              />
              <v-select
                label="Grad"
                :items="cities"
                clearable
                variant="outlined"
                v-model="filters.city"
              />
              <v-text-field
                label="Maks. cijena (€)"
                type="number"
                variant="outlined"
                v-model.number="filters.maxPrice"
                min="0"
              />
              <v-btn block color="secondary" class="mt-4" @click="resetFilters">
                Resetiraj filtere
              </v-btn>
            </v-sheet>
          </v-col>

          <!-- ADS GRID -->
          <v-col cols="12" md="9">
            <!-- HEADER -->
            <div class="mb-6">
              <h2 class="font-weight-bold">
                Smještaji u {{ filters.city || 'odabranoj lokaciji' }}
              </h2>
              <p class="text-grey mt-2">
                Pronađi sobe i apartmane prilagođene studentima, radnicima i putnicima.
                Svi oglasi su provjereni, bez skrivenih troškova i dodatnih naknada.
              </p>
            </div>

            <!-- HIGHLIGHT OGLAS -->
            <v-row v-if="highlightAd">
              <v-col cols="12">
                <v-card class="pa-3 mb-4" color="yellow lighten-4" elevation="2">
                  <v-card-title>⭐ Najbolja cijena: {{ highlightAd.title }}</v-card-title>
                  <v-card-subtitle>{{ highlightAd.city }}, {{ highlightAd.country }}</v-card-subtitle>
                  <v-card-text>Cijena: {{ highlightAd.price }} €</v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" rounded @click="openDetails(highlightAd)">
                      Prikaži detalje
                    </v-btn>
                    <v-btn
                      v-if="highlightAd.isLocal"
                      color="red"
                      text
                      @click="deleteAd(highlightAd)"
                    >
                      Obriši
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <!-- OSTATI OGLASI -->
            <v-row>
              <v-col v-for="ad in otherAds" :key="ad.id" cols="12" sm="6" md="4">
                <v-card rounded="lg" elevation="2" class="pa-2 hoverable">
                  <v-img :src="ad.image_url || defaultImage" height="180" cover class="rounded-lg">
                    <template #placeholder>
                      <v-skeleton-loader type="image"></v-skeleton-loader>
                    </template>
                  </v-img>

                  <v-card-title class="text-subtitle-1 font-weight-bold">{{ ad.title }}</v-card-title>
                  <v-card-subtitle class="text-grey">
                    <v-icon size="16">mdi-map-marker</v-icon> {{ ad.city }}, {{ ad.country }}
                  </v-card-subtitle>

                  <v-card-text>
                    <div class="d-flex justify-space-between align-center">
                      <span class="text-grey">Cijena po noći</span>
                      <span class="text-h6 font-weight-bold">{{ ad.price }} €</span>
                    </div>
                  </v-card-text>

                  <v-card-actions class="justify-end">
                    <v-btn color="primary" rounded @click="openDetails(ad)">Prikaži detalje</v-btn>
                    <v-btn
                      v-if="ad.isLocal"
                      color="red"
                      text
                      @click="deleteAd(ad)"
                    >
                      Obriši
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <!-- PREPORUČENI OGLASI -->
            <v-sheet class="pa-6 mt-8" rounded="lg" v-if="recommendedAds.length">
              <h3 class="font-weight-bold mb-3">Preporučeni oglasi</h3>
              <p class="text-grey mb-4">
                Pogledaj 3 random oglasa iz naše ponude.
              </p>
              <v-row>
                <v-col v-for="ad in recommendedAds" :key="ad.id + '-recommended'" cols="12" sm="4">
                  <v-card rounded="lg" elevation="2" hoverable @click="openDetails(ad)">
                    <v-img :src="ad.image_url || defaultImage" height="150" cover />
                    <v-card-title class="text-subtitle-2 font-weight-bold">{{ ad.title }}</v-card-title>
                    <v-card-text>
                      <span class="text-h6 font-weight-bold">{{ ad.price }} €</span>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- DETALJI MODAL -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          {{ selectedAd.title }}
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-carousel v-if="selectedAd.images && selectedAd.images.length" hide-delimiters height="300">
            <v-carousel-item v-for="(img, i) in selectedAd.images" :key="i">
              <v-img :src="img" cover />
            </v-carousel-item>
          </v-carousel>
          <v-img v-else :src="selectedAd.image_url || defaultImage" height="300" cover />

          <v-divider class="my-3" />
          <p><strong>Grad:</strong> {{ selectedAd.city }}</p>
          <p><strong>Država:</strong> {{ selectedAd.country }}</p>

          <v-divider class="my-2" />
          <p><strong>Cijena:</strong> {{ selectedAd.price }} €</p>
          <p v-if="selectedAd.description"><strong>Opis oglasa:</strong> {{ selectedAd.description }}</p>

          <v-divider class="my-3" />
          <v-btn color="success" block @click="contactOwner(selectedAd)">Kontaktiraj vlasnika</v-btn>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text @click="dialog = false">Zatvori</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SNACKBAR ZA KONTAKT -->
    <v-snackbar v-model="contactSnackbar" :timeout="6000" bottom right color="green lighten-2">
      {{ contactMessage }}
      <template #action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="contactSnackbar = false">Zatvori</v-btn>
      </template>
    </v-snackbar>

    <!-- LOGIN / REGISTER MODAL -->
    <v-dialog v-model="loginDialog" max-width="450">
      <v-card>
        <v-card-title class="text-h5">
          {{ activeTab === 'login' ? 'Prijava' : 'Registracija' }}
        </v-card-title>

        <v-card-text>
          <div v-if="activeTab === 'login'">
            <v-text-field label="Email" v-model="loginForm.email" type="email" />
            <v-text-field label="Lozinka" v-model="loginForm.password" type="password" />
          </div>

          <div v-else>
            <v-text-field label="Ime" v-model="registerForm.name" />
            <v-text-field label="Email" v-model="registerForm.email" type="email" />
            <v-text-field label="Lozinka" v-model="registerForm.password" type="password" />
          </div>
        </v-card-text>

        <v-card-actions class="d-flex justify-space-between">
          <v-btn text color="blue" @click="toggleTab">
            {{ activeTab === 'login' ? 'Ili registriraj se' : 'Ili prijavi se' }}
          </v-btn>

          <div>
            <v-btn color="green" v-if="activeTab === 'login'" @click="login">Prijavi se</v-btn>
            <v-btn color="blue" v-else @click="register">Registriraj se</v-btn>
            <v-btn color="red" text @click="loginDialog = false">Zatvori</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'

const router = useRouter()

// Current user
const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')))

// Logout
const logout = () => {
  localStorage.removeItem('currentUser')
  currentUser.value = null
  router.push('/auth')
}

// Ads
const ads = ref([])
const defaultImage = 'https://images.adsttc.com/media/images/6284/92d6/3e4b/3151/c500/0001/newsletter/Alamy_photo_H8HH7G.jpg?1652855490'

// Filters & search
const filters = ref({ country: null, city: null, maxPrice: null })
const searchQuery = ref('')
const sortPrice = ref(null)
const countries = ref([])
const cities = ref([])

// Details modal
const dialog = ref(false)
const selectedAd = ref({})

// Contact snackbar
const contactSnackbar = ref(false)
const contactMessage = ref('')

// Login / Register modal
const loginDialog = ref(false)
const activeTab = ref('register') // default otvoreno registracija
const intendedRoute = ref(null)
const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })
const dummyUsers = ref(currentUser.value ? [currentUser.value] : [])

// --- Oglas functions ---
const contactOwner = (ad) => {
  const randomEmail = `kontakt${Math.floor(Math.random() * 1000)}@roomiebalkan.com`
  const randomPhone = `+387 6${Math.floor(Math.random() * 9000000 + 1000000)}`
  contactMessage.value = `Email: ${randomEmail} | Tel: ${randomPhone}`
  contactSnackbar.value = true
}

const deleteAd = (ad) => {
  if (!ad.isLocal) return
  ads.value = ads.value.filter(a => a.id !== ad.id)
  const stored = JSON.parse(localStorage.getItem('addedAds') || '[]')
  const updated = stored.filter(a => a.id !== ad.id)
  localStorage.setItem('addedAds', JSON.stringify(updated))
}

// Fetch ads
const fetchAds = async () => {
  try {
    const params = {
      country: filters.value.country,
      city: filters.value.city,
      maxPrice: filters.value.maxPrice,
      search: searchQuery.value
    }
    const res = await api.get('/ads', { params })
    ads.value = res.data.map(ad => ({ ...ad, isLocal: false }))


    const addedAds = JSON.parse(localStorage.getItem('addedAds') || '[]')
    if (addedAds.length) {
      ads.value = [...addedAds.map(ad => ({ ...ad, isLocal: true })), ...ads.value]
    }
  } catch (err) {
    console.error(err)
  }
}

// Filters
const fetchFilters = async (country = null) => {
  try {
    const params = country ? { country } : {}
    const res = await api.get('/ads/filters', { params })
    countries.value = res.data.countries
    cities.value = res.data.cities
  } catch (err) {
    console.error(err)
  }
}

// Computed
const filteredAds = computed(() => {
  return ads.value.filter(ad => {
    if (filters.value.country && ad.country !== filters.value.country) return false
    if (filters.value.city && ad.city !== filters.value.city) return false
    if (filters.value.maxPrice && ad.price > filters.value.maxPrice) return false
    if (searchQuery.value && !ad.title.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    return true
  })
})

const highlightAd = computed(() => {
  if (!sortPrice.value) return null
  const sorted = [...filteredAds.value].sort((a,b) => sortPrice.value === 'asc' ? a.price - b.price : b.price - a.price)
  return sorted[0]
})

const otherAds = computed(() => filteredAds.value.filter(a => a.id !== highlightAd.value?.id))
const recommendedAds = computed(() => {
  if (!ads.value.length) return []
  const shuffled = [...ads.value].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 3)
})

// Lifecycle
onMounted(() => {
  fetchFilters()
  fetchAds()
})

// Watchers
watch(() => filters.value.country, (newCountry) => {
  filters.value.city = null
  fetchFilters(newCountry)
})
watch([filters, searchQuery], fetchAds, { deep: true })

// Reset
const resetFilters = () => {
  filters.value.country = null
  filters.value.city = null
  filters.value.maxPrice = null
  searchQuery.value = ''
  fetchFilters()
  fetchAds()
}

// Open details
const openDetails = (ad) => {
  selectedAd.value = ad
  dialog.value = true
}

// --- LOGIN / REGISTER ---
const toggleTab = () => {
  activeTab.value = activeTab.value === 'login' ? 'register' : 'login'
}

const login = () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    alert('Unesi email i lozinku!')
    return
  }

  const existingUser = dummyUsers.value.find(u => u.email === loginForm.value.email)
  if (!existingUser) {
    alert('Korisnik ne postoji! Registriraj se.')
    return
  }

  currentUser.value = existingUser
  localStorage.setItem('currentUser', JSON.stringify(existingUser))
  loginDialog.value = false
  if (intendedRoute.value) {
    router.push(intendedRoute.value)
    intendedRoute.value = null
  }
}

const register = () => {
  if (!registerForm.value.name || !registerForm.value.email || !registerForm.value.password) {
    alert('Popuni sva polja!')
    return
  }

  const newUser = {
    id: Date.now(),
    role: 'user',
    name: registerForm.value.name,
    email: registerForm.value.email
  }
  dummyUsers.value.push(newUser)
  currentUser.value = newUser
  localStorage.setItem('currentUser', JSON.stringify(newUser))

  loginDialog.value = false
  if (intendedRoute.value) {
    router.push(intendedRoute.value)
    intendedRoute.value = null
  }

  registerForm.value = { name: '', email: '', password: '' }
}

// Handle add ad click
const handleAddAdClick = () => {
  if (!currentUser.value || !['admin', 'super_admin'].includes(currentUser.value.role)) {
    intendedRoute.value = '/add-ad'
    activeTab.value = 'register'
    loginDialog.value = true
  } else {
    router.push('/add-ad')
  }
}
</script>