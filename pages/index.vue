<template>
  <div class="screen page-container">
    <article class="page-content">
      <header>
        <filter-toolbar />
      </header>
      <div class="entries">
        <div
          v-for="(e, idx) in filteredCatalog"
          :key="e.eid"
          :data-eid="e.eid"
          class="entry"
        >
          <template v-if="showMode === 'rack'">
            <rack-entry :obj="e" />
          </template>
          <template v-else-if="showMode === 'slim'">
            <slim-entry :obj="e" :no="idx + 1" />
          </template>
        </div>
      </div>
    </article>
    <section class="page-interlude">
      <interlude v-if="entry.eid"></interlude>
    </section>
    <section class="page-hatebu">
      <hatebu v-if="entry.eid"></hatebu>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import FilterToolbar from '@/components/FilterToolbar'
import Interlude from '@/components/Interlude'
import Hatebu from '@/components/Hatebu'
import RackEntry from '@/components/RackEntry'
import SlimEntry from '@/components/SlimEntry'

export default {
  components: {
    FilterToolbar,
    RackEntry,
    SlimEntry,
    Interlude,
    Hatebu,
  },
  computed: {
    ...mapState('stream/filter', {
      showMode: (state) => state.showMode,
    }),
    ...mapGetters({
      filteredCatalog: 'chase/filteredCatalog',
      entry: 'chase/activeEntry',
    }),
  },
}
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  display: flex;

  .page-content {
    flex: 1;
    padding: 0 15px;
  }

  .page-interlude {
    width: 320px;
  }

  .page-hatebu {
    width: 320px;
  }
}
</style>
