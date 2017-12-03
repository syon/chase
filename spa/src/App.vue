<template lang="pug">
#app.page-container
  nav.page-nav
    sidebar
  article.page-content
    router-view
  section.page-interlude
    interlude
</template>

<script>
import Sidebar from '@/components/Sidebar';
import Interlude from '@/components/Interlude';

export default {
  name: 'app',
  components: {
    Sidebar,
    Interlude,
  },
  data() {
    return {
      loading: false,
    };
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const crr = window.scrollY + window.innerHeight;
      const max = document.body.scrollHeight;
      if (!this.loading && (crr / max) > 0.7) {
        this.loading = true;
        this.$store.dispatch('fetchMoreEntries')
          .then(() => { this.loading = false; });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.page-container
  // width 1140px
  width 100%
  display flex
  .page-nav
    width 240px
  .page-content
    flex 1
    padding 0 15px
  .page-interlude
    width 320px
</style>
