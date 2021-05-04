<template>
  <div class="xx-audience">
    <v-overlay :value="isFetching" absolute color="white">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>

    <v-tabs v-model="currentTab">
      <v-tab>先着</v-tab>
      <v-tab>人気</v-tab>
      <v-tab>新着</v-tab>
      <v-tab>設定</v-tab>
    </v-tabs>

    <v-tabs-items v-model="currentTab">
      <v-tab-item>
        <bookmark-list mode="RACE" />
      </v-tab-item>
      <v-tab-item>
        <bookmark-list mode="POPULAR" />
      </v-tab-item>
      <v-tab-item>
        <bookmark-list mode="NEW" />
      </v-tab-item>
      <v-tab-item>
        <p>
          Hatena Bookmark eid: <code>{{ hatebu.eid }}</code>
        </p>
        <div v-if="isHatenaLogin">
          <img :src="hatenaUser.profile.photos[0].value" alt="hatena avatar" />
          <span>{{ hatenaUser.profile.displayName }}</span>
          <p><a :href="hatenaLogoutUrl">Logout</a></p>
        </div>
        <div v-else>
          <p>
            <a :href="hatenaLoginUrl" target="_blank">
              Login -- {{ hatenaLoginUrl }}
            </a>
          </p>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import EP from '@/store/hatena/endpoint' // TODO: in store
import BookmarkList from '@/components/hatena/BookmarkList'

const HATENA_API_URL = EP.HATENA

export default {
  components: {
    BookmarkList,
  },
  computed: {
    ...mapState('hatena/hatena', {
      hatenaUser: (state) => state.user,
    }),
    ...mapState('hatena/bookmark', {
      hatebu: (state) => state.entry,
      isFetching: (state) => state.isFetching,
      isFilterNoComment: (state) => state.isFilterNoComment,
      tabsStyle: (state) => state.tabsStyle,
    }),
    ...mapState('hatena/bucome', {
      tabIndex: (state) => state.tabIndex,
    }),
    ...mapGetters({
      isHatenaLogin: 'hatena/hatena/isHatenaLogin',
      popularCnt: 'hatena/bookmark/gBookmarksPopularCount',
    }),
    currentTab: {
      // https://jp.vuejs.org/v2/guide/computed.html#%E7%AE%97%E5%87%BA-Setter-%E9%96%A2%E6%95%B0
      get() {
        return this.tabIndex
      },
      set(tabIndex) {
        this.$store.commit('hatena/bucome/setTabIndex', { tabIndex })
      },
    },
    hatenaLoginUrl() {
      return `${HATENA_API_URL}/login`
    },
    hatenaLogoutUrl() {
      return `${HATENA_API_URL}/logout`
    },
  },
  methods: {
    tabLabelPopular(h) {
      // eslint-disable-next-line no-new-wrappers
      const text = new String(this.popularCnt || '...')
      return h('span', [
        h('span', '人気'),
        h('Badge', { props: { text, type: 'normal' } }),
      ])
    },
    handleTabClick() {
      this.$refs.audience.$el.scrollTop = 0
      this.$store.dispatch('bookmark/adjustTabsHeight')
    },
  },
}
</script>

<style lang="scss" scoped>
.xx-audience {
  position: relative;

  &.sidebar {
    .xx-hatena-count {
      font-size: 1rem;
    }
    .xx-hatebu-comment-count {
      font-size: 1rem;
    }
  }

  ::v-deep .ivu-tabs-bar {
    margin-bottom: 0;
  }
  ::v-deep .ivu-tabs-nav-scroll {
    display: flex;
    justify-content: center;
  }
  ::v-deep .ivu-tabs-tabpane {
    padding: 0;
  }
  ::v-deep .ivu-badge {
    margin-left: 6px;
    .ivu-badge-count {
      display: inline-flex;
      align-items: center;
      height: 16px;
      font-size: 10px;
    }
  }
}
</style>
