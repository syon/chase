<template>
  <div class="area-page">
    <v-container fluid>
      <v-row>
        <v-col cols="5">
          <header>
            <appbar />
            <filter-toolbar />
            <app-stats />
          </header>
          <v-card>
            <v-list>
              <template v-for="e in gShowingCatalog" :data-eid="e.eid">
                <template v-if="showMode === 'rack'">
                  <rack-entry :key="e.eid" :obj="e" />
                </template>
                <template v-else-if="showMode === 'slim'">
                  <slim-entry :key="e.eid" :obj="e" />
                </template>
              </template>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="7">
          <v-row class="area-lounge">
            <v-col cols="6">
              <interlude v-if="entry.eid" />
            </v-col>
            <v-col cols="6">
              <lounge />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <app-snackbar />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Appbar from '@/components/Appbar'
import AppStats from '@/components/AppStats'
import AppSnackbar from '@/components/AppSnackbar'
import FilterToolbar from '@/components/FilterToolbar'
import Interlude from '@/components/Interlude'
import Lounge from '@/components/lobine/Lounge'
import RackEntry from '@/components/RackEntry'
import SlimEntry from '@/components/SlimEntry'

export default {
  components: {
    Appbar,
    AppStats,
    AppSnackbar,
    FilterToolbar,
    RackEntry,
    SlimEntry,
    Interlude,
    Lounge,
  },
  computed: {
    ...mapState('stream/filter', {
      showMode: (state) => state.showMode,
    }),
    ...mapGetters({
      gShowingCatalog: 'chase/gShowingCatalog',
      entry: 'chase/activeEntry',
    }),
  },
  watch: {
    gShowingCatalog(arr) {
      if (!this.entry.eid) {
        if (arr.length > 0) {
          this.$store.dispatch('chase/activate', arr[0])
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.area-page {
  background-color: #f9fafb;
}

.area-lounge {
  position: fixed;
  max-width: inherit;
  width: 100%;
  height: 100%;

  > .col {
    height: 100%;
    overflow: auto;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
