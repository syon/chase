<template>
  <div class="interlude">
    <fit-image
      class="thumbnail"
      :src="entry.image_s3_url"
      w="290"
      h="193"
      size="cover"
    />
    <section>
      <div class="link">
        <a :href="entry.url" target="_blank">{{ linkTitle }}</a>
      </div>
    </section>
    <section>
      <div class="meta">
        <div>{{ entry.site_name }} ({{ entry.fqdn }})</div>
      </div>
      <div class="desc">{{ entry.description }}</div>
      <hr />
      <div class="action">
        <icon-button
          class="c-archive"
          icon="ion-ios-checkmark-empty"
          :loading="ingArchive"
          :disabled="entry.archived"
          icon-disabled="ion-ios-checkmark"
          @click.native="mArchive(entry.eid)"
        ></icon-button>
        <div class="fav">
          <v-btn
            v-if="entry.favorite"
            icon
            color="orange"
            :loading="ingFavorite"
            @click.native="mUnfavorite(entry.eid)"
          >
            <v-icon>mdi-star</v-icon>
          </v-btn>
          <v-btn
            v-else
            icon
            color="grey"
            :loading="ingFavorite"
            @click.native="mFavorite(entry.eid)"
          >
            <v-icon>mdi-star</v-icon>
          </v-btn>
        </div>
        <div class="c-added">{{ entry.added }}</div>
      </div>
      <hr />
      <div class="tags">
        <clickable
          v-for="tag in recentTags"
          :key="tag"
          class="tag"
          :class="{ applied: Object.keys(entry.tags).includes(tag) }"
          @click.native="handleTagClick(tag)"
          >{{ tag }}</clickable
        >
      </div>
      <div class="newtag">
        <input
          v-model="newtag"
          placeholder="New Tag"
          @keyup.enter="handleNewTag"
        />
      </div>
    </section>
    <section class="area-screenshots">
      <screenshots :wid="info.wid" />
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import IconButton from '@/components/IconButton'
import Clickable from '@/components/Clickable'
import FitImage from '@/components/FitImage'
import Screenshots from '@/components/lobine/Screenshots'

export default {
  components: {
    IconButton,
    Clickable,
    FitImage,
    Screenshots,
  },
  data: () => ({
    newtag: '',
    ingArchive: false,
    ingFavorite: false,
  }),
  computed: {
    ...mapGetters({
      info: 'chase/activeInfo',
      entry: 'chase/activeEntry',
      recentTags: 'chase/recentTags',
    }),
    linkTitle() {
      return this.entry.title ? this.entry.title : this.entry.url
    },
    shotMobileSrc() {
      if (!this.entry) return ''
      const { eid } = this.entry
      return `https://s3.amazonaws.com/syon-chase/shots/${eid}/mobile.png`
    },
  },
  watch: {
    entry() {
      const { wid } = this.info
      this.$store.dispatch('lobine/lounge/setup', { wid })
    },
  },
  methods: {
    ...mapActions(['addTag']),
    handleTagClick(tag) {
      if (Object.keys(this.entry.tags).includes(tag)) {
        return
      }
      const eid = this.entry.eid
      this.$store.dispatch('addTag', { eid, tag }).then(() => {
        this.entry.tags[tag] = { item_id: eid, tag }
      })
    },
    handleNewTag() {
      this.handleTagClick(this.newtag)
    },
    onShotSuccess() {
      // console.log(entry.eid);
    },
    onShotError(entry) {
      if (entry.shotOrdered) return
      this.$store.dispatch('chase/fetchShot', entry)
    },
    mArchive(eid) {
      this.ingArchive = true
      this.$store.dispatch('chase/archive', eid).then(() => {
        this.ingArchive = false
      })
    },
    async mFavorite(eid) {
      this.ingFavorite = true
      await this.$store.dispatch('chase/favorite', eid)
      this.ingFavorite = false
    },
    async mUnfavorite(eid) {
      this.ingFavorite = true
      await this.$store.dispatch('chase/unfavorite', eid)
      this.ingFavorite = false
    },
  },
}
</script>

<style lang="scss" scoped>
.interlude {
  position: fixed;
  width: inherit;
  height: 100vh;
  padding: 0 15px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}

.interlude .thumbnail {
  border: 1px solid #eee;
}

.interlude .link {
  margin: 0.5em 0;
  line-height: 1.3;
  word-break: break-word;
}

.interlude .link a {
  font-weight: bold;
  text-decoration: none;
  color: #24292e;
}

.interlude .link a:hover {
  text-decoration: underline;
}

.interlude .desc {
  margin: 1em 0 0.5em;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.75em;
}

.interlude .meta {
  font-size: 0.75em;
  color: #757575;
}

.interlude .action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #757575;
}

.interlude .action .c-archive {
  font-size: 1.5em;
}

.interlude .action .c-added {
  font-size: 0.75em;
}

.interlude .addscenes {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.interlude .addscenes .scene {
  flex: 1;
}

.interlude .mobile-screenshot {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
  padding: 8px;
  border: 1px solid #eee;
}

.tags .tag {
  display: inline-flex;
  margin: 0 0.5em 0.5em 0;
  padding: 0 0.5em;
  font-weight: bold;
  font-size: 0.75em;
  border-radius: 2px;
  align-items: center;
  line-height: 1.5;
  color: #9ea8b3;
  background-color: transparent;
  border: 1px solid #9ea8b3;
}

.tags .tag.applied {
  color: #fff;
  background-color: #9ea8b3;
  cursor: auto;
  text-decoration: none;
}

.todo {
  font-size: 0.75rem;
}

.showcase {
  display: flex;
  justify-content: space-between;
  background-color: #eee;
  border: 4px solid #eee;
}
</style>
