<template>
  <div class="d-flex align-center justify-space-between">
    <div class="cc-bar-left d-flex">
      <div class="d-flex align-center mr-4">
        <v-icon color="grey" class="mr-1">mdi-view-list-outline</v-icon>
        {{ entryCountLabel }}
      </div>
      <div>
        <v-btn icon @click="handleFiltering">
          <v-icon :color="isFiltering ? 'primary' : null">mdi-filter</v-icon>
        </v-btn>
      </div>
    </div>

    <div class="cc-bar-right">
      <v-btn-toggle v-model="pickedShowMode" mandatory>
        <v-btn value="rack" small>
          <v-icon small>mdi-format-align-left</v-icon>
        </v-btn>
        <v-btn value="slim" small>
          <v-icon small>mdi-format-align-center</v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState('stream/filter', {
      showMode: (state) => state.showMode,
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
    pickedShowMode: {
      get() {
        return this.showMode
      },
      set(v) {
        this.$store.commit('stream/filter/SET_ShowMode', v)
      },
    },
  },
  methods: {
    handleFiltering() {
      this.$store.commit('stream/filter/SET_IsFiltering', !this.isFiltering)
    },
  },
}
</script>
