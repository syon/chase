<template lang="pug">
.screen
  img.logo(src="../assets/logo.png" alt="Chase")
  button(@click="getRequestToken") Connect to Pocket
</template>

<script>
export default {
  methods: {
    getRequestToken() {
      this.$store.dispatch('getRequestToken', this.$cookie)
        .then((authUri) => {
          window.location = authUri;
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
.screen
  display flex
  flex-direction column
  align-items center
  justify-content center
  height 100vh
  .logo
    width 128px
    height 128px
  button
    margin 1.5rem
</style>
