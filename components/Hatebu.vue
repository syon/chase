<template>
  <div class="hatebu">
    <header>
      <h4>
        <span>{{ hatebu.count }}</span>
        <span>&nbsp;({{ comments.length }} comments)</span>
      </h4>
    </header>
    <div class="bookmarks">
      <div v-for="(b, idx) in voices" :key="idx" class="voice">
        <div class="meta">
          <div class="meta-left">
            <img class="avatar" :src="avatarUrl(b)" />
            <div class="username">{{ b.user }}</div>
          </div>
          <div class="meta-right">
            <div class="star">{{ starCount(b) }}</div>
            <div class="date">{{ commentDate(b) }}</div>
          </div>
        </div>
        <div class="comment">{{ b.comment }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      mode: 'recent',
    }
  },
  computed: {
    ...mapState('chase', {
      hatebuStarSet: (state) => state.hatebuStarSet,
    }),
    ...mapGetters({
      entry: 'chase/activeEntry',
    }),
    hatebu() {
      const eid = this.entry.eid
      return this.$store.state.chase.hatebuSet[eid] || {}
    },
    comments() {
      if (!this.hatebu.bookmarks) return []
      return this.hatebu.bookmarks.filter((d) => d.comment.length !== 0)
    },
    voices() {
      if (!this.hatebu.bookmarks) return []
      const eid = this.entry.eid
      const starSet = this.$store.state.chase.hatebuStarSet[eid] || {}
      const voices = this.comments
      voices.sort((a, b) => {
        const aStar = isNaN(Number(starSet[a.user]))
          ? 0
          : Number(starSet[a.user])
        const bStar = isNaN(Number(starSet[b.user]))
          ? 0
          : Number(starSet[b.user])
        if (aStar > bStar) return -1
        if (aStar < bStar) return 1
        if (a.timestamp > b.timestamp) return -1
        if (a.timestamp < b.timestamp) return 1
        return 0
      })
      return voices
    },
  },
  methods: {
    avatarUrl(b) {
      return `//cdn1.www.st-hatena.com/users/${b.user}/profile_l.gif`
    },
    commentDate(b) {
      const ymd = b.timestamp.match(/^(20..\/..\/..)/)[1]
      return ymd.replace(/\//g, '.')
    },
    starCount(b) {
      if (!b.stars) return ''
      const cnt = b.stars.yellow
      return cnt > 0 ? `★${cnt}` : ''
    },
  },
}
</script>

<style lang="scss" scoped>
.hatebu {
  // position: fixed;
  width: inherit;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 15px;
}

.imageframe {
  border: 1px solid #eee;
}

.bookmarks {
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
  padding-bottom: 100px;
  .voice {
    padding: 0 0 0.75em;
    font-size: 0.8rem;
    word-break: break-all;
    .meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.6rem;
      color: #757575;

      .meta-left,
      .meta-right {
        display: flex;
        align-items: center;
      }

      .avatar {
        width: 16px;
        height: 16px;
        border-radius: 1.5px;
      }

      .username {
        padding: 0 0.5em;
      }

      .star {
        padding: 0 0.5em;
        color: #ffa500;
        font-size: 0.8rem;
        font-weight: bold;
      }
    }

    .comment {
      margin: 0.25em 0 0.5em;
    }
  }
}
</style>
