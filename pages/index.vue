<template>
  <div class="screen page-container">
    <nav class="page-nav">
      <sidebar></sidebar>
    </nav>
    <article class="page-content">
      <header>
        <h2>{{ mode }}</h2>
        <input v-model="filterTxt" type="search" placeholder="Filter" />
      </header>
      <div class="entries">
        <div v-for="e in catalog" :key="e.eid" :data-eid="e.eid" class="entry">
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
  data() {
    return {
      filterTxt: '',
    }
  },
  computed: {
    ...mapGetters({
      filteredCatalog: 'chase/filteredCatalog',
      entry: 'chase/activeEntry',
    }),
    mode() {
      let mode = this.$route.name
      if (this.$route.name === 'Tag') {
        mode = this.$cookie.get(this.$route.params.tag)
      }
      return mode
    },
    catalog() {
      const route = this.$route
      return this.filteredCatalog(route.name, route.params.tag, this.filterTxt)
    },
  },
}
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  display: flex;

  .page-nav {
    width: 165px;
  }
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

.page-content header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
