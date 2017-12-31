<template lang="pug">
.screenshot
  template(v-if="entry.ready")
    template(v-if="isDesktop")
      fit-image(:src="desktopUrl" w="257" h="193" size="cover" :onloadsuccess="() => onFilmSuccess(entry)" :onloaderror="() => onFilmError(entry)")
    template(v-else)
      fit-image(:src="mobileUrl" w="214" h="380" size="cover" :onloaderror="() => onFilmError(entry)")
</template>

<script>
import { mapGetters } from 'vuex';
import FitImage from '@/components/FitImage';

export default {
  props: ['target'],
  components: {
    FitImage,
  },
  computed: {
    ...mapGetters({
      entry: 'activeEntry',
    }),
    isDesktop() {
      return this.target === 'desktop';
    },
    desktopUrl() {
      if (!this.entry) return '';
      const { eid } = this.entry;
      return `https://s3.amazonaws.com/syon-chase/films/${eid}/desktop.png`;
    },
    mobileUrl() {
      if (!this.entry) return '';
      const { eid } = this.entry;
      return `https://s3.amazonaws.com/syon-chase/films/${eid}/mobile.png`;
    },
  },
  methods: {
    onFilmSuccess() {
      // console.log(entry.eid);
    },
    onFilmError(entry) {
      if (entry.filmOrdered) return;
      this.$store.dispatch('fetchFilm', entry);
    },
  },
};
</script>

<style lang="stylus" scoped>
.screenshot
  height 193px
  display flex
  align-items center
  justify-content space-around
</style>
