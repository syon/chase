<template>
  <div class="xx-audiencetoolbar">
    <div cols="2" class="xx-dash-cell xx-hatena-count">
      <hatena-count :count="hatebu.count" :url="hatenaCountUrl" />
    </div>
    <div cols="3" class="xx-dash-cell xx-hatebu-comment-count">
      <v-icon>mdi-forum</v-icon><span>{{ commentCount }}</span>
    </div>
    <div cols="3" class="xx-dash-cell">
      <comment-rate />
    </div>
    <div cols="4" class="xx-dash-cell xx-mute-checkbox">
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on">
            <v-checkbox v-model="isFilterNoComment" dense label="無言を隠す" />
          </span>
        </template>
        <span>公開ブクマ15以上かつ<br />コメント1件以上で自動ON</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import CommentRate from '@/components/hatena/CommentRate'
import HatenaCount from '@/components/hatena/HatenaCount'

export default {
  components: {
    CommentRate,
    HatenaCount,
  },
  computed: {
    ...mapState('hatena/bookmark', {
      hatebu: (state) => state.entry,
      ifnc: (state) => state.isFilterNoComment,
    }),
    ...mapGetters({
      lg: 'lobine/lounge/gLounge',
      commentCount: 'hatena/bookmark/gCommentCount',
    }),
    hatenaCountUrl() {
      return this.lg.loungeUrl
    },
    isFilterNoComment: {
      get() {
        return this.ifnc
      },
      set(bool) {
        this.$store.dispatch('hatena/bookmark/adjustTabsHeight')
        this.$store.commit('hatena/bookmark/setFilterNoComment', bool)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.xx-audiencetoolbar {
  display: flex;
  align-items: center;
  justify-content: space-around;

  .xx-hatebu-comment-count {
    font-size: 1rem;
    i {
      margin-right: 8px;
    }
  }

  .xx-dash-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .xx-hatena-count {
    font-size: 1.3rem;
  }

  .xx-mute-checkbox ::v-deep label {
    font-size: 12px;
  }
}
</style>
