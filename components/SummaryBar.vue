<template>
  <div class="d-flex align-center justify-space-between">
    <div class="d-flex align-center mr-4">
      <v-icon color="grey" class="mr-1">mdi-view-list-outline</v-icon>
      {{ entryCountLabel }}
    </div>
    <v-btn icon class="mr-4" @click="handleFiltering">
      <v-icon :color="isFiltering ? 'primary' : null">mdi-filter</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState('stream/filter', {
      isFiltering: (state) => state.isFiltering,
    }),
    ...mapGetters({
      catalogCount: 'chase/catalogCount',
      filteredCatalog: 'chase/filteredCatalog',
    }),
    entryCountLabel() {
      const fl = this.filteredCatalog.length
      const cl = this.catalogCount
      if (fl === cl) {
        return fl
      }
      return `${fl} / ${cl}`
    },
  },
  methods: {
    handleFiltering() {
      this.$store.commit('stream/filter/SET_IsFiltering', !this.isFiltering)
    },
  },
}
</script>
