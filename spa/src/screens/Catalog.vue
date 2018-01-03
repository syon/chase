<template lang="pug">
.screen.page-container
  nav.page-nav
    sidebar
  article.page-content
    header
      h2 {{ mode }}
      input(v-model="filterTxt" type="search" placeholder="Filter")
    .entries
      .entry(v-for="e in catalog" :data-eid="e.eid" :key="e.eid")
        entry(:obj="e")
  section.page-interlude
    interlude(v-if="entry.eid")
  section.page-hatebu
    hatebu(v-if="entry.eid")
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
  data() {
    return {
      filterTxt: '',
    };
  },
  computed: {
    ...mapGetters({
      filteredCatalog: 'filteredCatalog',
      entry: 'activeEntry',
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
      return this.filteredCatalog(route.name, route.params.tag, this.filterTxt);
    },
  },
};
</script>

<style lang="stylus" scoped>
.page-container
  width 100%
  display flex
  .page-nav
    width 165px
  .page-content
    flex 1
    padding 0 15px
  .page-interlude
    width 320px
  .page-hatebu
    width 320px

.page-content header
  display flex
  align-items center
  justify-content space-between
</style>
