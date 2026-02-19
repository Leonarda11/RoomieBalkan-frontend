<template>
  <v-card-text>
    <v-text-field v-model="name" label="Ime" />
    <v-text-field v-model="email" label="Email" />
    <v-text-field v-model="password" label="Lozinka" type="password" />
    <v-text-field v-model="passwordConfirmation" label="Potvrdi lozinku" type="password" />
    <v-select v-model="role" :items="['user','admin']" label="Rola" />
    <v-btn color="primary" block @click="register">Registracija</v-btn>
  </v-card-text>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const emits = defineEmits(['register-success'])

const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const role = ref('user')

const register = async () => {
  if (!name.value || !email.value || !password.value) {
    alert('Popuni sva polja!')
    return
  }

  if (password.value !== passwordConfirmation.value) {
    alert('Lozinke se ne podudaraju!')
    return
  }

  const success = await authStore.register(name.value, email.value, password.value, role.value)
  
  if (success) {
    emits('register-success', authStore.user)
  }
}
</script>