<template>
  <v-app>
    <v-container class="py-8">
      <v-card
        class="mx-auto pa-6"
        max-width="900"
        elevation="3"
        rounded="lg"
      >
        <v-card-title class="text-h5 font-weight-bold justify-center">
          Dodaj novi oglas
        </v-card-title>

        <v-divider class="my-4" />

        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row dense>
            <!-- Lijeva strana -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Naslov oglasa"
                v-model="ad.title"
                :rules="[v => !!v || 'Naslov je obavezan']"
                prepend-inner-icon="mdi-text"
                outlined
                dense
                class="mb-3"
              />

              <v-text-field
                label="Grad"
                v-model="ad.city"
                :rules="[v => !!v || 'Grad je obavezan']"
                prepend-inner-icon="mdi-city"
                outlined
                dense
                class="mb-3"
              />

              <v-text-field
                label="Država"
                v-model="ad.country"
                :rules="[v => !!v || 'Država je obavezna']"
                prepend-inner-icon="mdi-earth"
                outlined
                dense
                class="mb-3"
              />

              <v-text-field
                label="Cijena (€)"
                type="number"
                v-model.number="ad.price"
                :rules="[v => !!v || 'Cijena je obavezna']"
                prepend-inner-icon="mdi-currency-eur"
                outlined
                dense
                class="mb-3"
                min="0"
              />
            </v-col>

            <!-- Desna strana -->
            <v-col cols="12" md="6">
              <v-textarea
                label="Opis oglasa"
                v-model="ad.description"
                prepend-inner-icon="mdi-note-text"
                outlined
                dense
                rows="6"
                class="mb-3"
              />

              <!-- Drag & Drop za slike -->
              <v-file-input
                v-model="ad.imageFile"
                label="Odaberi slike (drag & drop podržano)"
                accept="image/*"
                prepend-inner-icon="mdi-image"
                outlined
                dense
                multiple
                show-size
                truncate-length="25"
                @change="handleFiles"
              />

              <v-row class="mt-3" dense>
                <v-col
                  v-for="(img, index) in ad.imagePreview"
                  :key="index"
                  cols="6"
                  sm="4"
                >
                  <v-img
                    :src="img"
                    height="120"
                    rounded="lg"
                    class="elevation-2"
                    cover
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-card-actions class="justify-center mt-4">
            <v-btn
              color="primary"
              class="white--text"
              rounded
              large
              @click="submitAd"
              :disabled="!valid"
            >
              Dodaj oglas
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-container>

    <v-snackbar v-model="snackbar" timeout="4000" top right color="green lighten-2">
      {{ snackbarMessage }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Zatvori</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const valid = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')

const ad = ref({
  title: '',
  city: '',
  country: '',
  price: null,
  description: '',
  imageFile: [],
  imagePreview: [],
  id: Date.now(),
  isLocal: true
})

// Preview slika
const handleFiles = (files) => {
  ad.value.imagePreview = []
  if (!files || !files.length) return
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader()
    reader.onload = e => ad.value.imagePreview.push(e.target.result)
    reader.readAsDataURL(files[i])
  }
}

// Submit ad
const submitAd = () => {
  if (!valid.value) return

  const stored = JSON.parse(localStorage.getItem('addedAds') || '[]')
  stored.push(ad.value)
  localStorage.setItem('addedAds', JSON.stringify(stored))

  snackbarMessage.value = 'Oglas je uspješno dodan!'
  snackbar.value = true

  // Reset forme
  ad.value = { title: '', city: '', country: '', price: null, description: '', imageFile: [], imagePreview: [], id: Date.now(), isLocal: true }

  setTimeout(() => router.push('/ads'), 1200)
}
</script>

<style scoped>
/* Hover efekti na preview slike */
.v-img.elevation-2:hover {
  transform: scale(1.05);
  transition: transform 0.3s;
}
</style>