<template>
  <v-card-text>
    <v-text-field v-model="name" label="Name" />
    <v-text-field v-model="email" label="Email" />
    <v-select v-model="role" :items="['user','admin']" label="Role" />
    <v-btn color="primary" block @click="register">Register</v-btn>
  </v-card-text>
</template>

<script setup>
import { ref } from 'vue'
import { defineEmits } from 'vue'
import axios from 'axios'

const emits = defineEmits(['register-success'])

const name = ref('')
const email = ref('')
const role = ref('user')

const register = async () => {
  if (!name.value || !email.value) {
    alert('Popuni sva polja!')
    return
  }

  try {
    const response = await axios.post('http://pzi122026.studenti.sum.ba/backend/api/register', {
      name: name.value,
      email: email.value,
      role: role.value
    })

    emits('register-success', response.data.user)
  } catch (error) {
    alert(error.response?.data?.message || 'Greška pri registraciji')
  }
}
</script>