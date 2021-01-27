<template>
  <div class="screen page-container">
    <article class="page-content">
      <header>
        <sidebar />
        <nav class="d-flex align-center">
          <v-text-field
            v-model="filterTxt"
            label="Filter"
            dense
            outlined
            clearable
            prepend-icon="mdi-filter-variant"
            hide-details
          />
          <v-checkbox v-model="filterIsFav" hide-details class="mt-0 ml-8">
            <template #label>
              <v-icon>mdi-star</v-icon>
            </template>
          </v-checkbox>
        </nav>
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
      isFav: (state) => state.isFav,
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
    filterIsFav: {
      get() {
        return this.isFav
      },
      set(v) {
        this.$store.commit('stream/filter/SET_IsFav', v)
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
