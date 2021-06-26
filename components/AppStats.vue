<template>
  <div class="appstats">
    <div class="d-flex">
      <v-btn :loading="busyPocket" @click="fullPocket">
        <v-icon left>mdi-cloud-sync</v-icon>
        Pocket 未読全件同期
      </v-btn>
      {{ pocketCnt }}
    </div>
    <v-divider class="my-4" />
    <div class="d-flex">
      <span>B! {{ hatebuCnt }}</span>
      <span style="margin: 0 1em">/</span>
      <span style="margin-right: 1em">{{ pocketCnt }}</span>
      <v-btn :loading="busyHatebu" @click="fullHatebu">
        <v-icon left>mdi-database-refresh-outline</v-icon>
        Hatebu 不足分同期
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    hatebuTable: [],
    pocketTable: [],
    busyPocket: false,
    busyHatebu: false,
  }),
  computed: {
    pocketCnt() {
      return this.pocketTable.length
    },
    hatebuCnt() {
      return this.hatebuTable.length
    },
  },
  async mounted() {
    await this.getCnt()
  },
  methods: {
    async getCnt() {
      this.hatebuTable = await this.$cache.getHatebuTable()
      this.pocketTable = await this.$cache.selectAllPocketUnread()
    },
    async fullPocket() {
      await this.getCnt()
      this.busyPocket = true
      await this.$store.dispatch('chase/fetchAllEntries')
      this.busyPocket = false
      await this.getCnt()
    },
    async fullHatebu() {
      await this.getCnt()
      this.busyHatebu = true
      await this.$cache.prepareHatebuTableFull()
      this.busyHatebu = false
      await this.getCnt()
    },
  },
}
</script>
