<template lang="pug">
.screen.page-container
  nav.page-nav
    sidebar
  article.page-content
    .entries
      .entry(v-for="e in catalog" :data-eid="e.eid" :key="e.eid")
        entry(:obj="e")
  section.page-interlude
    interlude
</template>

<script>
import { mapGetters } from 'vuex';
import Sidebar from '@/components/Sidebar';
import Interlude from '@/components/Interlude';
import Entry from '@/components/Entry';

export default {
  components: {
    Sidebar,
    Entry,
    Interlude,
  },
  computed: {
    ...mapGetters({
      filteredCatalog: 'filteredCatalog',
    }),
    mode() {
      return this.$route.name;
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
</style>
