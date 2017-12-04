<template lang="pug">
.screen
  .entries
    .entry(v-for="e in catalog" :data-eid="e.eid" :key="e.eid")
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
