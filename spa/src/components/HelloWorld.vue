<template lang="pug">
.screen
  .entries
    .entry(v-for="e in catalog" :key="e.eid")
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
  },
};
</script>
