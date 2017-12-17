<template lang="pug">
.v-clickable
  slot
</template>

<script>
export default {
  name: 'Clickable',
};
</script>

<style lang="stylus" scoped>
.v-clickable
  cursor pointer
  font-family inherit
  font-size inherit
  &:hover
    background-color rgba(36, 41, 46, 0.05)
</style>
