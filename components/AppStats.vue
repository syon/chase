<template>
  <div class="appstats">
    <v-btn icon x-small @click="aaaaa"><v-icon>mdi-refresh</v-icon></v-btn>
    <span>B! {{ hatebuTable.length }}</span>
  </div>
</template>

<script>
export default {
  data: () => ({
    hatebuTable: [],
  }),
  methods: {
    async aaaaa() {
      this.hatebuTable = await this.$cache.getHatebuTable()
    },
  },
}
</script>

<style lang="scss" scoped>
.appstats {
  display: flex;
  align-items: center;
}
</style>
