<template>
  <div class="area-page">
    <v-container fluid>
      <v-row>
        <v-col cols="6">
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
                  <slim-entry :key="e.eid" :obj="e" :no="idx + 1" />
                </template>
              </template>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-row class="area-lounge">
            <v-col cols="5">
              <interlude v-if="entry.eid" />
            </v-col>
            <v-col cols="7">
              <lounge />
              <hatebu v-if="entry.eid" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Appbar from '@/components/Appbar'
import AppStats from '@/components/AppStats'
import FilterToolbar from '@/components/FilterToolbar'
import Interlude from '@/components/Interlude'
import Lounge from '@/components/lobine/Lounge'
import Hatebu from '@/components/Hatebu'
import RackEntry from '@/components/RackEntry'
import SlimEntry from '@/components/SlimEntry'

export default {
  components: {
    Appbar,
    AppStats,
    FilterToolbar,
    RackEntry,
    SlimEntry,
    Interlude,
    Hatebu,
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
}
</script>

<style lang="scss" scoped>
.area-page {
  background-color: #f9fafb;
}

.area-lounge {
  position: fixed;
  max-width: inherit;
  height: 100%;

  > .col {
    height: 100%;
    overflow: auto;
    padding: 0;
  }
}
</style>
