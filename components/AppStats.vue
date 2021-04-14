<template>
  <div class="appstats">
    <v-btn icon x-small @click="getCnt"><v-icon>mdi-refresh</v-icon></v-btn>
    <span>B! {{ hatebuTable.length }}</span>
    <v-btn icon x-small @click="refresh">
      <v-icon>mdi-database-refresh-outline</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    hatebuTable: [],
  }),
  methods: {
    async getCnt() {
      this.hatebuTable = await this.$cache.getHatebuTable()
    },
    async refresh() {
      await this.$cache.prepareHatebuTableFull()
      await this.getCnt()
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
