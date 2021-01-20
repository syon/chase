<template>
  <figure :class="figureClass" :style="figureStyle" :data-aspect="orderAsprect">
    <img
      ref="picture"
      :src="src"
      :style="imgStyle"
      :data-aspect="naturalAsprect"
      @error="onLoadImageError"
    />
  </figure>
</template>

<script>
export default {
  props: {
    src: { type: String, required: true },
    w: { type: String, required: true },
    h: { type: String, required: true },
    size: { type: String, required: true },
    onloaderror: { type: Function, default: null },
  },
  data() {
    return {
      figureClass: '',
      imgStyle: {},
      cachedSrc: '',
      orderAsprect: '',
      naturalAsprect: '',
    }
  },
  computed: {
    figureStyle() {
      return { width: `${this.w}px`, height: `${this.h}px` }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.checkLoaded()
    })
  },
  updated() {
    if (this.cachedSrc !== this.src) {
      this.cachedSrc = this.src
      this.checkLoaded()
    }
  },
  methods: {
    checkLoaded() {
      const pic = this.$refs.picture
      if (pic.complete) {
        this.onLoadImageComplete()
        this.judgeOrientation(pic)
      } else {
        pic.addEventListener('load', () => {
          this.onLoadImageComplete()
          this.judgeOrientation(pic)
        })
      }
    },
    judgeOrientation(pic) {
      const nw = pic.naturalWidth
      const nh = pic.naturalHeight
      this.orderAsprect = Math.round((this.w / this.h) * 100) / 100
      this.naturalAsprect = Math.round((nw / nh) * 100) / 100
      const isCover = this.size === 'cover'
      if (isCover) {
        if (nw > nh) {
          this.figureClass = 'landscape'
          if (nw / nh < this.w / this.h) {
            this.imgStyle = {
              width: `${this.w}px`,
            }
          } else {
            this.imgStyle = {
              minHeight: `${this.h}px`,
              maxHeight: `${this.h}px`,
            }
          }
        } else {
          this.figureClass = 'portrait'
          if (nw / nh > this.w / this.h) {
            this.imgStyle = {
              height: `${this.h}px`,
            }
          } else {
            this.imgStyle = {
              minWidth: `${this.w}px`,
              maxWidth: `${this.w}px`,
            }
          }
        }
      }
    },
    onLoadImageComplete() {
      if (!this.onloadsuccess) return
      this.onloadsuccess()
    },
    onLoadImageError() {
      if (!this.onloaderror) return
      this.onloaderror()
    },
  },
}
</script>

<style lang="scss" scoped>
figure {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
