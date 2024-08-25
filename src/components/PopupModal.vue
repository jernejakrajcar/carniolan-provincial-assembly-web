<script setup>
import {ref} from "vue";

const isVisible = ref(false);
const open = () => {
  isVisible.value = true
}

const close = () => {
  isVisible.value = false
}

defineExpose({ open, close });
</script>

<template>
  <transition name="fade">
    <div class="popup-modal" v-if="isVisible">
      <div class="window">
        <div class="d-flex justify-content-between">
          <slot name="header"></slot>
          <button type="button" class="btn-close btn-close-white" @click="close"></button>
        </div>
        <hr />
        <slot name="content"></slot>
        <hr />
        <slot name="footer"></slot>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.popup-modal {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  padding: 0.5rem;
}

.window {
  background: #1c1e1f;
  border-radius: 5px;
  padding: 1rem;
  width: 50vw;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>