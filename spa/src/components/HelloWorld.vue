<template lang="pug">
.screen
  .entries
    .entry(v-for="e in sort(entries)")
      entry(:obj="e")
</template>

<script>
import { mapState } from 'vuex';
import Entry from '@/components/Entry';

export default {
  components: {
    Entry,
  },
  computed: {
    ...mapState({
      entries: 'entries',
    }),
  },
  methods: {
    sort(entries) {
      const arr = Object.keys(entries).map(key => entries[key]);
      return arr.sort((a, b) => {
        if (a.sortId > b.sortId) return 1;
        if (a.sortId < b.sortId) return -1;
        return 0;
      });
    },
  },
};
</script>
