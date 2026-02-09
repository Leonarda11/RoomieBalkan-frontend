<template>
  <v-card-text>
    <v-text-field v-model="name" label="Name" />
    <v-text-field v-model="email" label="Email" />
    <v-select v-model="role" :items="['user','admin']" label="Role" />
    <v-btn color="primary" block @click="login">Login</v-btn>
  </v-card-text>
</template>

<script setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'
import axios from 'axios'

const emits = defineEmits(['login-success'])

const name = ref('')
const email = ref('')
const role = ref('user')

const login = async () => {
  if (!name.value || !email.value) {
    alert('Popuni sva polja!')
    return
  }

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      name: name.value,
      email: email.value,
      role: role.value
    })

    const user = response.data.user


    if (user.role !== role.value) {
      alert('Neispravna rola za ovog korisnika!')
      return
    }

    emits('login-success', user)
  } catch (error) {
    alert(error.response?.data?.message || 'Greška pri prijavi')
  }
}
</script>