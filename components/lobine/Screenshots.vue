<template>
  <div class="screenshots">
    <figure class="screenshots-desktop">
      <instant-image
        :url="desktopImg"
        :errorurl="desktopErrImg"
        :onsuccess="desktopOnSuccess"
        :onerror="desktopOnError"
      />
      <v-overlay absolute :value="!desktopReady">
        <v-progress-circular indeterminate />
      </v-overlay>
    </figure>
    <figure class="screenshots-mobile">
      <instant-image
        :url="mobileImg"
        :errorurl="mobileErrImg"
        :onsuccess="mobileOnSuccess"
      />
      <v-overlay absolute :value="!mobileReady">
        <v-progress-circular indeterminate />
      </v-overlay>
    </figure>
  </div>
</template>

<script>
import debug from 'debug'
import InstantImage from '@/components/lobine/InstantImage'

const dg = debug('@:Screenshots')
const s3bucket = 'https://d3o218h5wwcfo8.cloudfront.net'

export default {
  components: {
    InstantImage,
  },
  props: {
    wid: { type: String, default: '' },
  },
  data() {
    return {
      desktopReady: false,
      mobileReady: false,
    }
  },
  computed: {
    desktopImg() {
      if (!this.wid) return `/placeholder/desktop.png`
      return `${s3bucket}/shot/${this.wid}/desktop.png`
    },
    desktopErrImg() {
      return `/placeholder/desktop.png`
    },
    mobileImg() {
      if (!this.wid) return `/placeholder/mobile.png`
      return `${s3bucket}/shot/${this.wid}/mobile.png`
    },
    mobileErrImg() {
      return `/placeholder/mobile.png`
    },
  },
  updated() {
    dg(`[#updated] wid:(${this.wid})`)
  },
  methods: {
    desktopOnSuccess() {
      this.desktopReady = true
    },
    desktopOnError() {
      console.log('[#desktopOnError]', this.wid)
      dg('[#desktopOnError]', this.wid)
      this.desktopReady = false
      this.$store.dispatch('lobine/lounge/emitDoubleshot')
    },
    mobileOnSuccess() {
      this.mobileReady = true
    },
  },
}
</script>

<style>
.screenshots {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 225px;
  max-height: 225px;
}
.screenshots figure {
  display: flex;
}
.screenshots picture img {
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.05);
}
.screenshots-desktop {
  position: relative; /* for b-loading */
  flex: 1280;
}
.screenshots-mobile {
  position: relative; /* for b-loading */
  display: flex;
  justify-content: flex-end;
  flex: 500;
}
.screenshots-mobile picture {
  text-align: right;
}

.screenshots .ivu-spin {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 768px) {
  .screenshots {
    height: 190px;
    max-height: 190px;
  }
  .screenshots-mobile {
    flex: 540;
    margin-left: 10px;
  }
}
</style>
