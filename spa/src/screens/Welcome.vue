<template lang="pug">
.screen
  img.logo(src="../assets/logo.png" alt="Chase")
  button(@click="getRequestToken") Connect to Pocket
</template>

<script>
export default {
  methods: {
    async getRequestToken() {
      const authUri = await this.$store.dispatch(
        "getRequestToken",
        this.$cookie
      );
      if (authUri) {
        window.location = authUri;
      } else {
        window.alert("Error on getting request token.");
      }
    }
  }
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
