<template>
  <div class="screen page-container">
    <article class="page-content">
      <header>
        <filter-toolbar />
      </header>
      <div class="entries">
        <div
          v-for="e in filteredCatalog"
          :key="e.eid"
          :data-eid="e.eid"
          class="entry"
        >
          <entry :obj="e"></entry>
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
import { mapGetters } from 'vuex'
import FilterToolbar from '@/components/FilterToolbar'
import Interlude from '@/components/Interlude'
import Hatebu from '@/components/Hatebu'
import Entry from '@/components/Entry'

export default {
  components: {
    FilterToolbar,
    Entry,
    Interlude,
    Hatebu,
  },
  computed: {
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
