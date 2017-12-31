<template lang="pug">
.sidebar
  section
    h1.logo
      a(href="/chase/")
        img(src="../assets/logo.png" alt="Chase")

  section.menu(v-if="login.accessToken")
    .menu-title Progress
    span {{ progress.unread }}
    span= ' / '
    span {{ progress.all }}
    span= ' ('
    span {{ Math.floor(progress.unread / progress.all * 100) }}
    span= ' %)'

  section.menu(v-if="login.accessToken")
    .menu-title Recent {{ catalogCount }}
    .link-item
      router-link(:to="{ name: 'Inbox' }")
        clickable.menu-item
          .label
            i.ion-ios-filing-outline
            span Inbox
          .cnt {{ filteredCatalog('Inbox').length }}
    .link-item
      router-link(:to="{ name: 'Favorite' }")
        clickable.menu-item
          .label
            i.ion-ios-star-outline
            span Favorite
          .cnt {{ filteredCatalog('Favorite').length }}
    .link-item(v-for="sce in myScenesTags")
      router-link(:to="{ name: 'Tag', params: { tag: sce.tag } }")
        clickable.menu-item
          .label
            i.ion-ios-arrow-right
            span {{ sce.label }}
          .cnt {{ filteredCatalog('Tag', sce.tag).length }}

  section.tags
    template(v-for="tag in recentTags")
      .link-item.font-smaller
        router-link(:to="{ name: 'Tag', params: { tag } }")
          clickable.menu-item
            .label
              i.ion-ios-pricetags-outline
              span {{ tag }}

  section
    .todo
      em ToDo:
      ul(style="padding-left: 2em;")
        li ランキングまわり
        li コード名前整理
        li 主要サイトOGP
        li 消化進捗

  section
    .misc
      .link-item.font-smaller
        a(href="https://getpocket.com/" target="_blank")
          clickable.menu-item
            .label
              i.ion-ios-world-outline
              span Pocket
    .config
      .link-item.font-smaller
        router-link(:to="{ name: 'Config' }")
          clickable.menu-item
            .label
              i.ion-ios-settings
              span Config
    .userinfo
      template(v-if="login.accessToken")
        span.username {{ login.username }}
        clickable.disconnect(@click.native="logout")
          i.ion-ios-close-empty
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Clickable from '@/components/Clickable';

export default {
  name: 'Sidebar',
  components: {
    Clickable,
  },
  computed: {
    ...mapState({
      login: 'login',
      progress: 'progress',
      mytags: 'mytags',
      myscenes: 'myscenes',
    }),
    ...mapGetters([
      'catalogCount',
      'filteredCatalog',
      'recentTags',
      'myScenesTags',
    ]),
  },
  mounted() {
    const ph = this.$cookie.get('phase');
    if (!ph) {
      this.$router.push('welcome');
    } else {
      this.$store.dispatch('actByPhase', this.$cookie);
    }
  },
  methods: {
    getAccessToken() {
      this.$store.dispatch('getAccessToken', this.$cookie);
    },
    showScenesEditor() {
      this.sceneEditing = true;
    },
    logout() {
      this.$store.dispatch('logout', this.$cookie);
      this.$router.push('welcome');
    },
  },
};
</script>

<style lang="stylus" scoped>
.sidebar
  position fixed
  width inherit
  height 100vh
  display flex
  flex-direction column
  justify-content space-between
  padding 15px
  font-size 0.75rem

.flex-aic-jcsb
  display flex
  align-items center
  justify-content space-between

.refresh i
  font-size 1.5rem

.menu
  margin 1rem 0
  .menu-title
    font-size .6rem
    font-style italic
    color #757575
    margin .5em 0

.link-item
  height 2rem
  display flex
  align-items center
  font-size 1rem
  i
    width 1em
    display inline-block
    margin-right .5em
    text-align center
  > a
    flex 1
    height inherit
    display flex
    align-items center
    justify-content space-between
    font-size .9rem

.menu-item
  flex 1
  height 2rem
  display flex
  align-items center
  justify-content space-between
  border-radius 2px
  padding 5px
  margin 0 -5px
  .cnt
    font-size .75rem

.logo
  display flex
  align-items center
  margin 0
  img
    width 32px
    height 32px

.tags
  .link-item
    height 1.5rem
    a
      font-size .8rem

.font-smaller
  font-size 0.8rem

.userinfo
  display flex
  align-items center
  .username
    margin-right .5em
    font-size .6rem
  .disconnect
    padding 0 .5rem
    font-size 1.25rem
</style>
