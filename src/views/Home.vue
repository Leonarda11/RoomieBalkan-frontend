<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/ads')
})
</script>

<template>
  <!-- Namjerno prazno: samo redirect na /ads -->
</template>
