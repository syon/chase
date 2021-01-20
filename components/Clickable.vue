<template>
  <div class="v-clickable">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Clickable',
}
</script>

<style lang="scss" scoped>
.v-clickable {
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.v-clickable:hover {
  background-color: rgba(36, 41, 46, 0.05);
}
</style>
