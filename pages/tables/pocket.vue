<template>
  <div class="tables-pocket">
    <v-card class="ma-2 elevation-1">
      <v-data-table
        dense
        :headers="tableHeaders"
        :items="gPocketRecords"
        item-key="eid"
        :search="searchquery"
        :items-per-page="10"
        show-expand
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>
              Pocket entries
              <v-chip>{{ gPocketRecords.length }}</v-chip>
            </v-toolbar-title>
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
      { text: 'title', value: 'title', width: 400 },
      { text: 'url', value: 'url' },
      { text: 'update_at', value: 'update_at', width: 150 },
    ],
    searchquery: null,
  }),
  computed: {
    ...mapGetters({
      gPocketRecords: 'pocket/table/gPocketRecords',
    }),
  },
  async mounted() {
    await this.$store.dispatch('pocket/table/prepareRecords')
  },
}
</script>
