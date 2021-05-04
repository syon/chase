<template>
  <picture>
    <source :srcset="webpUrl" type="image/webp" />
    <img
      ref="picture"
      :src="orgUrl"
      @load="handleOnLoad"
      @error="handleOnError"
    />
  </picture>
</template>

<script>
import debug from 'debug'
import Utils from '@/lib/Utils'

const dg = debug('@:InstantImage')

export default {
  props: {
    url: { type: String, required: true },
    errorurl: { type: String, default: '' },
    onsuccess: { type: Function, default: () => {} },
    onerror: { type: Function, default: () => {} },
  },
  data() {
    return {
      remoteReady: true,
      isTriggered: false,
      intervalIds: [],
    }
  },
  computed: {
    webpUrl() {
      if (!this.remoteReady) {
        return `${this.errorurl.replace(/\.(jpe?g|png)$/, '')}.webp`
      }
      return `${this.url.replace(/\.(jpe?g|png)$/, '')}.webp`
    },
    orgUrl() {
      if (!this.remoteReady) return `${this.errorurl}`
      return `${this.url}`
    },
  },
  watch: {
    url(newVal) {
      dg('[#watch:url]', { newVal })
      this.remoteReady = true
      this.isTriggered = false
      this.intervalIds.forEach((id) => clearInterval(id))
    },
  },
  methods: {
    handleOnLoad() {
      if (!this.onsuccess) return
      if (this.remoteReady) {
        this.onsuccess()
      }
    },
    handleOnError() {
      this.remoteReady = false
      if (this.isTriggered) return
      this.isTriggered = true
      if (this.onerror) this.onerror()
      // clear old intervals
      this.intervalIds.forEach((id) => {
        clearInterval(id)
      })
      // register check interval event
      this.intervalIds.push(
        setInterval(async () => {
          this.remoteReady = await Utils.isHeadSuccess(this.webpUrl)
        }, 3000)
      )
      // remove check event on complete
      this.$refs.picture.addEventListener('load', () => {
        if (this.remoteReady) {
          this.intervalIds.forEach((id) => {
            clearInterval(id)
          })
        }
      })
    },
  },
}
</script>
