<template lang="pug">
.screen
  .entries
    h2 {{ mode }} :: {{ filteredCatalog.length }}
    .entry(v-for="e in filteredCatalog" :data-eid="e.eid" :key="e.eid")
      entry(:obj="e")
</template>

<script>
import { mapGetters } from 'vuex';
import Entry from '@/components/Entry';

export default {
  components: {
    Entry,
  },
  computed: {
    ...mapGetters({
      catalog: 'catalog',
    }),
    mode() {
      return this.$route.name;
    },
    filteredCatalog() {
      const route = this.$route.name;
      let catalog = this.catalog;
      if (route === 'Favorite') {
        catalog = this.catalog.filter(d => d.favorite);
      } else if (route === 'Inbox') {
        catalog = this.catalog.filter(d => Object.keys(d.tags).length === 0);
      }
      return catalog;
    },
  },
};
</script>
