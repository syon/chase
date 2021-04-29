<template>
  <div class="screen">
    <img src="~/assets/logo.png" alt="Chase" class="logo" />
    <button @click="getRequestToken">Connect to Pocket</button>
  </div>
</template>

<script>
export default {
  methods: {
    async getRequestToken() {
      const authUri = await this.$store.dispatch(
        'pocket/auth/getRequestToken',
        this.$cookie
      )
      if (authUri) {
        window.location = authUri
      } else {
        window.alert('Error on getting request token.')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  .logo {
    width: 128px;
    height: 128px;
  }
  button {
    margin: 1.5rem;
  }
}
</style>
