<template>
  <v-card-text>
    <v-text-field v-model="email" label="Email" />
    <v-text-field v-model="password" label="Lozinka" type="password" />
    <v-btn color="primary" block @click="login">Prijava</v-btn>
  </v-card-text>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const emits = defineEmits(['login-success'])

const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const login = async () => {
  if (!email.value || !password.value) {
    alert('Popuni sva polja!')
    return
  }

  const success = await authStore.login(email.value, password.value)

  if (success) {
    emits('login-success', authStore.user)
  }
}
</script>