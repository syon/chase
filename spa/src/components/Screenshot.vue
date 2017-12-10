<template lang="pug">
.screenshot
  template(v-if="entry.ready")
    fit-image(:src="filmDesktopSrc" w="193" h="145" size="cover" :onloadsuccess="() => onFilmSuccess(entry)" :onloaderror="() => onFilmError(entry)")
    fit-image(:src="filmMobileSrc" w="82" h="145" size="cover" :onloaderror="() => onFilmError(entry)")
</template>

<script>
import { mapGetters } from 'vuex';
import FitImage from '@/components/FitImage';

export default {
  components: {
    FitImage,
  },
  computed: {
    ...mapGetters({
      entry: 'activeEntry',
    }),
    filmDesktopSrc() {
      if (!this.entry) return '';
      const { eid } = this.entry;
      return `https://s3.amazonaws.com/syon-chase/films/${eid}/desktop.png`;
    },
    filmMobileSrc() {
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
  // background-color #eee
  // border 4px solid #eee
</style>
