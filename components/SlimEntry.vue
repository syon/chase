<template>
  <div
    class="v-entry"
    :data-eid="obj.eid"
    :class="compoClasses"
    @click="activate(obj)"
  >
    <div class="pnl">
      <div class="pnl-body">
        <div class="mr-4">
          {{ no }}
        </div>
        <div class="link">
          <a :href="obj.url" target="_blank">{{ linkTitle }}</a>
        </div>
        <template v-if="Object.keys(obj.tags).length > 0">
          <div class="tags">
            <span v-for="tag in Object.keys(obj.tags)" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </template>
      </div>
      <div class="pnl-action">
        <div class="hatebu">
          <div class="hatebu-cnt" :style="hatebuCntStyle">
            {{ obj.hatebuCnt }}
          </div>
        </div>
        <div class="archive">
          <v-btn
            icon
            x-small
            :loading="ingArchive"
            :disabled="obj.archived"
            class="c-archive"
            @click="mArchive(obj.eid)"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    obj: { type: Object, required: true },
    no: { type: Number, required: true },
  },
  data() {
    return {
      imgSrc: this.obj.image_s3_url,
      ingArchive: false,
    }
  },
  computed: {
    ...mapState(['activeEid']),
    compoClasses() {
      return {
        archived: this.obj.archived,
        active: this.obj.eid === this.activeEid,
      }
    },
    linkTitle() {
      return this.obj.title ? this.obj.title : this.obj.url
    },
    hatebuCntStyle() {
      const cnt = this.obj.hatebuCnt
      let style
      switch (true) {
        case cnt >= 500:
          style = { color: '#F50057', fontWeight: 900 }
          break
        case cnt >= 100:
          style = { color: '#FF4081', fontWeight: 600 }
          break
        case cnt >= 10:
          style = { color: '#FF4081', fontWeight: 100 }
          break
        default:
          style = { color: '#9E9E9E' }
      }
      return style
    },
  },
  methods: {
    ...mapActions({
      activate: 'chase/activate',
    }),
    async handleLoadImageError() {
      const etag = await this.$store.dispatch('chase/fetchLibraThumb', this.obj)
      const imgUrl = this.imgSrc.replace(/\?etag=.*/, '')
      this.imgSrc = `${imgUrl}?etag=${etag}`
    },
    async mArchive(eid) {
      this.ingArchive = true
      await this.$store.dispatch('chase/archive', eid)
      this.ingArchive = false
    },
  },
}
</script>

<style lang="scss" scoped>
.pnl {
  display: flex;
  width: 100%;

  .pnl-thumb {
    margin: 0 15px 0 0;

    figure {
      display: flex;
      width: 100px;
      height: 80px;
      overflow: hidden;
      align-items: center;
      justify-content: center;
    }
  }

  .pnl-body {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .pnl-action {
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    > div {
      margin: 0 0.5em;
      padding: 3px 0;
    }
  }
}

.v-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  color: #757575;
  border-bottom: 1px solid #f5f5f5;
  &.active {
    background-color: #fffacd;
  }

  &.archived {
    background-color: #eee;
  }

  .loading {
    font-size: 1.5rem;
  }

  .thumb {
    width: 100px;
    height: 80px;
  }

  .link {
    line-height: 1;
    word-break: break-all;
  }

  .link a {
    text-decoration: none;
    color: #24292e;
  }

  .link a:hover {
    text-decoration: underline;
  }

  .meta {
    margin: 0 0 0.5em;
    font-size: 0.67em;
  }

  .meta span {
    margin-right: 1em;
  }

  .excerpt {
    font-size: 0.67em;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }

  .tags .tag {
    display: inline-flex;
    margin: 0 0.5em 0 0;
    padding: 0 0.5em;
    font-weight: bold;
    font-size: 0.67em;
    border-radius: 2px;
    align-items: center;
    line-height: 1.5;
    border: 1px solid #9ea8b3;
    color: #fff;
    background-color: #9ea8b3;
  }

  .pnl-action button {
    color: inherit;
    font: inherit;
    margin: 0;
    padding: 0;
    text-align: inherit;
    line-height: inherit;
    display: inline;
    background: none;
    overflow: visible;
    border: none;
    cursor: pointer;
  }

  .hatebu .hatebu-cnt {
    line-height: 1;
    font-size: 0.75rem;
    letter-spacing: -0.05em;
  }

  .fav {
    line-height: 1;
  }

  .fav .v-clickable button {
    padding: 3px;
    line-height: 1;
  }

  .fav span {
    font-size: 1.25rem;
    cursor: pointer;
  }

  .archive {
    line-height: 1;
  }

  .archive .v-clickable button {
    padding: 3px;
    line-height: 1;
  }

  .archive span {
    font-size: 1.25rem;
    cursor: pointer;
    color: #9ea8b3;
  }
}
</style>
