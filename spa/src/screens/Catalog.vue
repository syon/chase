<template lang="pug">
.screen.page-container
  nav.page-nav
    sidebar
  article.page-content
    h2 {{ mode }}
    .entries
      .entry(v-for="e in catalog" :data-eid="e.eid" :key="e.eid")
        entry(:obj="e")
  section.page-interlude
    interlude
  section.page-hatebu
    hatebu
</template>

<script>
import { mapGetters } from 'vuex';
import Sidebar from '@/components/Sidebar';
import Interlude from '@/components/Interlude';
import Hatebu from '@/components/Hatebu';
import Entry from '@/components/Entry';

export default {
  components: {
    Sidebar,
    Entry,
    Interlude,
    Hatebu,
  },
  computed: {
    ...mapGetters({
      filteredCatalog: 'filteredCatalog',
    }),
    mode() {
      let mode = this.$route.name;
      if (this.$route.name === 'Tag') {
        mode = this.$cookie.get(this.$route.params.tag);
      }
      return mode;
    },
    catalog() {
      const route = this.$route;
      return this.filteredCatalog(route.name, route.params.tag);
    },
  },
};
</script>

<style lang="stylus" scoped>
.page-container
  width 100%
  display flex
  .page-nav
    width 180px
  .page-content
    flex 1
    padding 0 15px
  .page-interlude
    width 320px
  .page-hatebu
    width 250px
</style>
