<template>
  <div class="bookmarklist">
    <div v-if="bookmarksForRender.length === 0">
      <div class="nodata">No Data</div>
    </div>
    <div
      v-for="b in bookmarksForRender"
      v-else
      :key="b.user"
      class="bucome"
      :class="{ active: isActive(b) }"
    >
      <div class="bucome-left">
        <img :src="userImageURL(b.user)" class="bucome-avatar" />
      </div>
      <div class="bucome-right" @click="handleClickBody(b)">
        <div class="bucome-right-top">
          <p>
            <a :href="bookmarkUserPageURL(b.user)" class="bucome-user">{{
              b.user
            }}</a>
            <span>{{ b.comment }}</span>
            <span v-for="(t, i) in b.tags" :key="i" class="bucome-tag"
              >#{{ t }}</span
            >
          </p>
        </div>
        <div class="bucome-right-bottom">
          <a
            :href="makeCommentPageUrl(b)"
            target="_blank"
            class="bucome-timestamp"
          >
            {{ b.timestamp }}
          </a>
          <hatena-stars :stars="b.stars" />
        </div>
        <div v-if="isActive(b)" class="activePanel">
          <ul v-for="(url, i) in urlsInComment(b)" :key="i" class="bucome-urls">
            <li>
              <a :href="url">{{ url }}</a>
            </li>
          </ul>
          <div v-if="isHatenaLogin">
            <button
              class="button is-small is-warning"
              :disabled="isAlreadyStarred(b)"
              @click="addStar(b)"
            >
              ★ スターを付ける
            </button>
          </div>
          <div v-else>
            <a :href="urlHatenaLogin" target="_blank"
              >はてなアカウントでログイン</a
            >
          </div>
        </div>
      </div>
    </div>
    <div>
      <Button
        v-if="hasManyBookmarks && !pleaseShowAll"
        long
        @click="handlePleaseShowAll"
      >
        残り {{ moreCount }} 件を表示
      </Button>
      <div class="area-takeabreak">☕️</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import HatenaStars from '@/components/hatena/HatenaStars'
import EP from '@/store/hatena/endpoint'
import HatenaAPI from '@/lib/HatenaAPI'

export default {
  components: { HatenaStars },
  props: {
    mode: { type: String, required: true },
    isFilterNoComment: { type: Boolean, default: false },
  },
  data() {
    return {
      pleaseShowAll: false,
      focusUser: '',
      starredUsers: [],
    }
  },
  computed: {
    ...mapState('hatena/bookmark', {
      entry: (state) => state.entry,
    }),
    ...mapState('hatena/hatena', {
      user: (state) => state.user,
    }),
    ...mapGetters({
      isHatenaLogin: 'hatena/hatena/isHatenaLogin',
      gBookmarks: 'hatena/bookmark/gBookmarks',
      gBookmarksPopular: 'hatena/bookmark/gBookmarksPopular',
      gBookmarksRace: 'hatena/bookmark/gBookmarksRace',
      gBookmarksNew: 'hatena/bookmark/gBookmarksNew',
    }),
    selectedBookmarks() {
      let bookmarks = []
      switch (this.mode) {
        case 'POPULAR':
          bookmarks = this.gBookmarksPopular
          break
        case 'RACE':
          bookmarks = this.gBookmarksRace
          break
        case 'NEW':
          bookmarks = this.gBookmarksNew
          break
        default:
          bookmarks = this.gBookmarksRace
      }
      return bookmarks
    },
    bookmarksForRender() {
      if (this.hasManyBookmarks && !this.pleaseShowAll) {
        return this.selectedBookmarks.filter((x, i) => i < 20)
      }
      return this.selectedBookmarks
    },
    hasManyBookmarks() {
      return this.selectedBookmarks.length > 20
    },
    moreCount() {
      return this.selectedBookmarks.length - 20
    },
    urlHatenaLogin() {
      return `${EP.HATENA}/login`
    },
  },
  mounted() {},
  methods: {
    commentedBookmarks(bookmarks) {
      if (this.isFilterNoComment) {
        return bookmarks.filter((x) => x.comment)
      }
      return bookmarks
    },
    bookmarkUserPageURL(user) {
      // TODO
      // return Hatena.Bookmark.getUserPageURL(user)
    },
    userImageURL(user) {
      return HatenaAPI.User.getProfileImageURL(user)
    },
    urlsInComment(user) {
      return user.comment.match(/(https?:\/\/[\x21-\x7E]+)/g)
    },
    makeCommentPageUrl(b) {
      // TODO: Make the data on js-hatena
      const user = b.user
      const eid = this.entry.eid
      const url = `http://b.hatena.ne.jp/entry/${eid}/comment/${user}`
      return url
    },
    makePermalink(b) {
      // TODO: Make the data on js-hatena
      const user = b.user
      const ymd = b.timestamp.match(/(\d{0,4})\/(\d{0,2})\/(\d{0,2})/)
      const yyyymmdd = `${ymd[1]}${ymd[2]}${ymd[3]}`
      const eid = this.entry.eid
      const link = `http://b.hatena.ne.jp/${user}/${yyyymmdd}#bookmark-${eid}`
      return link
    },
    isActive(b) {
      return this.focusUser === b.user
    },
    isAlreadyStarred(b) {
      return this.starredUsers.includes(b.user)
    },
    async checkAlreadyStarred(b) {
      // const loginUserId = this.user.profile.id
      // const se = await Hatena.Star.getStarEntry(this.entry.eid, b)
      // if (se.entries[0]) {
      //   return se.entries[0].stars.some((x) => x.name === loginUserId)
      // }
      await 0
      return false
    },
    handleClickBody(b) {
      this.focusUser = b.user
    },
    async addStar(b) {
      const already = await this.checkAlreadyStarred(b)
      if (already) {
        window.alert('すでにスターを付けています。')
      } else {
        // TODO
        // const url = this.makePermalink(b)
        // await Hatena.Star.addStar(url)
      }
      this.starredUsers.push(b.user)
    },
    handlePleaseShowAll() {
      this.pleaseShowAll = true
      this.$store.dispatch('bookmark/adjustTabsHeight')
    },
  },
}
</script>

<style lang="scss" scoped>
.bookmarklist {
  min-height: 300px;
  padding: 0 8px;
}

.nodata {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hatebu-count {
  font-size: 1.5rem;
}
.bucome {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #ececec;
  font-size: 0.85rem;
  word-break: break-all;
}
.bucome.active {
  background-color: rgba(121, 87, 213, 0.05);
}
.bucome-right {
  flex: 1;
}
.bucome-right-bottom {
  line-height: 1;
}
.bucome-avatar {
  width: 32px;
  height: 32px;
  margin: 0 8px 0 0;
  border-radius: 3px;
}
.bucome-user {
  display: inline-block;
  margin: 0 4px 0 0;
  text-decoration: none;
  letter-spacing: -0.015em;
}
.bucome-tag {
  color: #b3b3b3;
  font-size: 0.8rem;
  margin-right: 0.5em;
}
.bucome-urls {
  text-align: left;
  margin: 0 0 1em;
}
.bucome-timestamp {
  font-size: 0.7rem;
  color: #999;
  margin-right: 8px;
}
.activePanel {
  padding: 8px 16px;
  text-align: center;
}

.area-takeabreak {
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #c5c8ce;
}
</style>
