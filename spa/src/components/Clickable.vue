<template lang="pug">
button.compo.clickable
  slot
</template>

<script>
export default {
  name: 'Clickable',
};
</script>

<style lang="stylus" scoped>
.compo
  color #0366d6
  display inline
  border 0
  border-radius initial
  cursor pointer
  padding 0
  font-family inherit
  font-size inherit
  text-align left
  outline none
  &:hover
    text-decoration underline
</style>
