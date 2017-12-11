<template lang="pug">
.screen.page-container
  nav.page-nav
    sidebar
  article.page-content
    h2 Config
    section.scene
      label
        span chase:a
        input(v-model="chaseA")
      hr
      label
        span chase:b
        input(v-model="chaseB")
      hr
      label
        span chase:c
        input(v-model="chaseC")
      hr
      button(@click="doSceneEdit") OK
</template>

<script>
import { mapGetters } from 'vuex';
import Sidebar from '@/components/Sidebar';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      sceneEditing: false,
      chaseA: null,
      chaseB: null,
      chaseC: null,
    };
  },
  mounted() {
    this.chaseA = this.myScenesTags[0].label;
    this.chaseB = this.myScenesTags[1].label;
    this.chaseC = this.myScenesTags[2].label;
  },
  computed: {
    ...mapGetters([
      'myScenesTags',
    ]),
    mode() {
      return this.$route.name;
    },
  },
  methods: {
    doSceneEdit() {
      const scenes = { a: this.chaseA, b: this.chaseB, c: this.chaseC };
      this.$store.dispatch('doSceneEdit', { $cookie: this.$cookie, scenes });
      this.sceneEditing = false;
      this.$router.push({ name: 'Inbox' });
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
</style>
