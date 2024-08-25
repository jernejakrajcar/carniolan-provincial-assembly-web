<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="my-1 text-center px-3">
    <h6 class="text-uppercase fw-bold py-0 m-0">{{ msg }}</h6>
  </div>
</template>

<style scoped>
</style>
