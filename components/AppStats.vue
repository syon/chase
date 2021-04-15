<template>
  <div class="appstats">
    <v-btn icon x-small @click="getCnt"><v-icon>mdi-refresh</v-icon></v-btn>
    <span>B! {{ hatebuTable.length }}</span>
    <span style="margin: 0 1em">/</span>
    <span style="margin-right: 1em">{{ pocketTable.length }}</span>
    <v-btn icon x-small @click="refresh">
      <v-icon>mdi-database-refresh-outline</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    hatebuTable: [],
    pocketTable: [],
  }),
  methods: {
    async getCnt() {
      this.hatebuTable = await this.$cache.getHatebuTable()
      this.pocketTable = await this.$cache.selectAllPocketUnread()
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
