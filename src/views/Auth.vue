<template>
  <v-app>
    <v-main class="min-h-screen pa-0">
      <!-- POČETNA STRANICA -->
      <div
        v-if="!showForm"
        class="welcome-page d-flex justify-center align-center"
      >
        <div class="text-center text-white">
          <h1 class="display-2 font-weight-bold mb-6">Dobrodošli u Roomie Balkan</h1>
          <v-btn color="primary" large @click="showForm = true">
            Prijavi se / Registriraj se
          </v-btn>
        </div>
      </div>

      <!-- LOGIN / REGISTER LAYOUT -->
      <v-container fluid v-else class="pa-0" style="height: 100vh;">
        <v-row no-gutters class="h-100">
          <!-- LEFT IMAGE -->
          <v-col
            cols="12"
            md="6"
            :style="`background-image: url(${bgImage}); background-size: cover; background-position: center;`"
          >
            <div class="overlay"></div>
          </v-col>

          <!-- RIGHT FORM -->
          <v-col
            cols="12"
            md="6"
            class="d-flex justify-center align-center"
          >
            <v-card elevation="10" class="pa-6" width="400">
              <h2 class="text-center mb-4">{{ activeTab === 'register' ? 'Registracija' : 'Prijava' }}</h2>

              <!-- FORM -->
              <div v-if="activeTab === 'register'">
                <RegisterForm @register-success="handleRegisterSuccess"/>
              </div>
              <div v-else>
                <LoginForm @login-success="handleLoginSuccess"/>
              </div>

              <v-divider class="my-4"></v-divider>

              <!-- SWITCH LINK -->
              <div class="text-center">
                <span>
                  {{ activeTab === 'register' ? 'Već imate račun?' : 'Nemate račun?' }}
                </span>
                <v-btn text color="primary" @click="toggleTab">
                  {{ activeTab === 'register' ? 'Prijavi se' : 'Registriraj se' }}
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'

const router = useRouter()
const bgImage = 'https://media.vrbo.com/lodging/20000000/19010000/19007600/19007589/ad366bb5.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill'

const showForm = ref(false)
const activeTab = ref('register') // default otvoreno registracija

const handleLoginSuccess = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user))

    router.push('/ads')
  }


const handleRegisterSuccess = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user))

    router.push('/ads')
  }

const toggleTab = () => {
  activeTab.value = activeTab.value === 'register' ? 'login' : 'register'
}
</script>

<style scoped>
.welcome-page {
  background-image: url('https://media.vrbo.com/lodging/20000000/19010000/19007600/19007589/ad366bb5.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  position: relative;
}

.welcome-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
}

.welcome-page .text-center {
  position: relative;
  z-index: 1;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
}
</style>