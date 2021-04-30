<template>
  <div class="tables-hatebu">
    <v-card class="ma-2 elevation-1">
      <v-data-table
        dense
        :headers="tableHeaders"
        :items="gHatebuRecords"
        item-key="eid"
        :search="searchquery"
        :items-per-page="10"
        show-expand
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>
              Hatebu entries
              <v-chip>{{ gHatebuRecords.length }}</v-chip>
            </v-toolbar-title>
            <span class="mx-2">/</span>
            <span>{{ gPocketRecords.length }}</span>
            <v-spacer />
            <v-btn @click="fetchPartly">partly</v-btn>
            <span>{{ taskCnt }}</span>
            <v-spacer />
            <v-text-field
              v-model="searchquery"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-toolbar>
        </template>
        <template #expanded-item="{ headers, item }">
          <td :colspan="headers.length">{{ item }}</td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    allUnreads: [],
    tableHeaders: [
      { text: 'eid', value: 'eid', width: 120 },
      { text: 'wid', value: 'wid', width: 400 },
      { text: 'cnt', value: 'cnt' },
      { text: 'update_at', value: 'update_at', width: 150 },
    ],
    searchquery: null,
    taskCnt: null,
  }),
  computed: {
    ...mapGetters({
      gHatebuRecords: 'hatena/table/gHatebuRecords',
      gPocketRecords: 'pocket/table/gPocketRecords',
    }),
  },
  async mounted() {
    await this.$store.dispatch('hatena/table/prepareRecords')
    await this.$store.dispatch('pocket/table/prepareRecords')
  },
  methods: {
    async fetchPartly() {
      this.taskCnt = await this.$duty.fetchHatebuCacheTasks()
      this.loopCacheTasks() // No await
    },
    async loopCacheTasks() {
      while (this.taskCnt > 0) {
        await this.$duty.doHatebuCacheTaskPartly()
        await new Promise((resolve) => setTimeout(resolve, 1000))
        this.taskCnt = this.taskCnt - 3
      }
    },
  },
}
</script>
