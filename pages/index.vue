<template>
  <div class="screen page-container">
    <article class="page-content">
      <header>
        <sidebar />
        <input v-model="filterTxt" type="search" placeholder="Filter" />
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
import { mapState, mapGetters } from 'vuex'
import Sidebar from '@/components/Sidebar'
import Interlude from '@/components/Interlude'
import Hatebu from '@/components/Hatebu'
import Entry from '@/components/Entry'

export default {
  components: {
    Sidebar,
    Entry,
    Interlude,
    Hatebu,
  },
  computed: {
    ...mapState('stream/filter', {
      spell: (state) => state.spell,
    }),
    ...mapGetters({
      filteredCatalog: 'chase/filteredCatalog',
      entry: 'chase/activeEntry',
    }),
    filterTxt: {
      get() {
        return this.spell
      },
      set(v) {
        this.$store.commit('stream/filter/SET_Spell', v)
      },
    },
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
