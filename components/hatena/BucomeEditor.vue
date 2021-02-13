<template>
  <div class="xx-bucome-editor">
    <div>
      <Button
        v-if="isActive"
        class="button is-fullwidth"
        long
        @click="isActive = false"
      >
        キャンセル
      </Button>
      <Button
        v-else
        :disabled="!isHatenaLogin"
        type="primary"
        class="button is-link is-fullwidth"
        long
        @click="isActive = true"
      >
        ブックマーク
      </Button>
    </div>
    <div v-if="isActive">
      <div class="xx-bucome-editor-head">
        <div>
          <p v-if="myBookmark">{{ myBookmark.timestamp }} にブックマーク済み</p>
          <p v-else>まだブックマークしていません</p>
        </div>
        <img
          :src="hatenaUser.profile.photos[0].value"
          :alt="hatenaUser.profile.displayName"
          class="xx-hatena-avatar"
        />
      </div>
      <div>
        <Input
          v-model="commentText"
          :maxlength="100"
          type="textarea"
          :autosize="{ minRows: 3 }"
        ></Input>
      </div>
      <Row type="flex" align="middle" class="xx-action">
        <Col :span="4">
          <Checkbox v-model="isTwitter" size="large" class="xx-twitter">
            <Icon type="logo-twitter" />
          </Checkbox>
        </Col>
        <Col :span="20">
          <Button
            class="button is-primary is-fullwidth"
            type="primary"
            long
            @click="postHatebuComment"
          >
            送信
          </Button>
        </Col>
      </Row>
      <Spin v-if="isCommentBusy" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  props: {
    count: { type: Number, default: null },
    url: { type: String, default: null },
    showUsers: { type: Boolean, default: true },
  },
  data() {
    return {
      isTwitter: false,
    }
  },
  computed: {
    ...mapState('hatena', {
      hatenaUser: (state) => state.user,
    }),
    ...mapState('bookmark', {
      isCommentBusy: (state) => state.isCommentBusy,
    }),
    ...mapGetters({
      isHatenaLogin: 'hatena/isHatenaLogin',
      getMyBookmark: 'bookmark/getMyBookmark',
    }),
    isActive: {
      get() {
        return this.$store.state.bookmark.isBucomeEditor
      },
      set(bool) {
        this.$store.commit('bookmark/setBucomeEditor', bool)
      },
    },
    commentText: {
      get() {
        return this.$store.state.bookmark.commentText
      },
      set(text) {
        this.$store.commit('bookmark/setCommentText', text)
      },
    },
    myBookmark() {
      if (!(this.hatenaUser && this.hatenaUser.profile)) return {}
      return this.getMyBookmark(this.hatenaUser.profile.id)
    },
  },
  methods: {
    ...mapActions('bucome', ['jumpTabByName']),
    ...mapActions('remocon', ['scrollToId']),
    async postHatebuComment() {
      const isTwitter = this.isTwitter
      const data = { isTwitter }
      await this.$store.dispatch('bookmark/postHatebuComment', data)
      this.$Message.info('コメントしました。')
      this.scrollToId('remo-bucome')
      this.jumpTabByName({ tabName: 'NEW' })
      await this.$store.dispatch('refresh')
    },
  },
}
</script>

<style lang="scss" scoped>
.xx-bucome-editor {
  position: relative;
  font-size: 1rem;

  .xx-action {
    margin-top: 1.5rem;
  }
}
.xx-twitter {
  width: 80px;
  display: flex;
  align-items: center;
  font-size: 1.5rem;

  ::v-deep .ivu-checkbox {
    display: inline-flex;
    align-items: center;
    margin-right: 8px;
  }
}
.xx-bucome-editor-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
}
.xx-hatena-avatar {
  width: 32px;
  height: 32px;
  margin: 0 8px 0 0;
  border-radius: 3px;
}
</style>
