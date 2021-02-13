<template>
  <div class="area-page">
    <v-container fluid>
      <v-row>
        <v-col cols="6">
          <header>
            <appbar />
            <filter-toolbar />
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
          <v-container class="area-lobby">
            <v-row>
              <v-col cols="6">
                <interlude v-if="entry.eid" />
              </v-col>
              <v-col cols="6">
                <lounge />
                <hatebu v-if="entry.eid" />
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Appbar from '@/components/Appbar'
import FilterToolbar from '@/components/FilterToolbar'
import Interlude from '@/components/Interlude'
import Lounge from '@/components/lobine/Lounge'
import Hatebu from '@/components/Hatebu'
import RackEntry from '@/components/RackEntry'
import SlimEntry from '@/components/SlimEntry'

export default {
  components: {
    Appbar,
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

.area-lobby {
  position: fixed;
  width: inherit;
  max-width: inherit;
}
</style>
