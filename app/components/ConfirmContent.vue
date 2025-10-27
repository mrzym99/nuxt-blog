<template>
  <div class="modal" @click.stop>
    <div class="title">{{ title }}</div>
    <div class="modal-footer">
      <button @click="cancel" class="action-button cancel">取消</button>
      <button @click="submit" class="submit-button">确定</button>
    </div>
  </div>
  <Teleport to="body">
    <div class="modal-overlay" @click="cancel"></div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  submit: {
    type: Function,
    default: () => { },
  },
  cancel: {
    type: Function,
    default: () => { },
  },
  isPaused: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['closeToast'])

function submit() {
  props.submit()
  emits('closeToast')
}

function cancel() {
  props.cancel()
  emits('closeToast')
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: $z-index-mask;
}

.modal {
  background: var(--bg-color);
  border-radius: 8px;
  padding: 1rem;
  width: 20rem;
  box-sizing: border-box;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
