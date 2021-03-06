<template>
  <div class="interlude">
    <v-img
      class="thumbnail"
      max-height="300"
      max-width="100%"
      :src="entry.image_s3_url"
      lazy-src="/placeholder/blank.jpg"
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
        <div class="archive">
          <v-btn v-if="entry.archived" icon color="primary">
            <v-icon>mdi-check</v-icon>
          </v-btn>
          <v-btn
            v-else
            icon
            color="grey"
            :loading="ingArchive"
            @click.native="mArchive(entry.eid)"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </div>
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
            <v-icon>mdi-star-outline</v-icon>
          </v-btn>
        </div>
        <div class="c-added">{{ entry.added }}</div>
      </div>
      <hr />
      <div class="tags">
        <tag-editor />
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TagEditor from '@/components/TagEditor'

export default {
  components: {
    TagEditor,
  },
  data: () => ({
    ingArchive: false,
    ingFavorite: false,
  }),
  computed: {
    ...mapGetters({
      entry: 'stream/filter/activeEntry',
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
  methods: {
    mArchive(eid) {
      this.ingArchive = true
      this.$store.dispatch('stream/filter/archive', eid).then(() => {
        this.ingArchive = false
      })
    },
    async mFavorite(eid) {
      this.ingFavorite = true
      await this.$store.dispatch('stream/filter/favorite', eid)
      this.ingFavorite = false
    },
    async mUnfavorite(eid) {
      this.ingFavorite = true
      await this.$store.dispatch('stream/filter/unfavorite', eid)
      this.ingFavorite = false
    },
  },
}
</script>

<style lang="scss" scoped>
.interlude {
  // position: fixed;
  width: inherit;
  height: 100vh;
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
