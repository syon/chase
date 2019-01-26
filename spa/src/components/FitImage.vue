<template lang="pug">
figure(:class="figureClass" :style="figureStyle" :data-aspect="orderAsprect")
  img(:src="src" ref="picture" :style="imgStyle" :data-aspect="naturalAsprect" @error="onLoadImageError")
</template>

<script>
export default {
  name: 'FitImage',
  props: ['src', 'w', 'h', 'size', 'onloaderror'],
  data() {
    return {
      figureClass: '',
      imgStyle: {},
      cachedSrc: '',
      orderAsprect: '',
      naturalAsprect: '',
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.checkLoaded();
    });
  },
  updated() {
    if (this.cachedSrc !== this.src) {
      this.cachedSrc = this.src;
      this.checkLoaded();
    }
  },
  computed: {
    figureStyle() {
      return { width: `${this.w}px`, height: `${this.h}px` };
    },
  },
  methods: {
    checkLoaded() {
      const pic = this.$refs.picture;
      if (pic.complete) {
        this.onLoadImageComplete();
        this.judgeOrientation(pic);
      } else {
        pic.addEventListener('load', () => {
          this.onLoadImageComplete();
          this.judgeOrientation(pic);
        });
      }
    },
    judgeOrientation(pic) {
      const nw = pic.naturalWidth;
      const nh = pic.naturalHeight;
      this.orderAsprect = Math.round((this.w / this.h) * 100) / 100;
      this.naturalAsprect = Math.round((nw / nh) * 100) / 100;
      const isCover = this.size === 'cover';
      if (isCover) {
        if (nw > nh) {
          this.figureClass = 'landscape';
          if ((nw / nh) < (this.w / this.h)) {
            this.imgStyle = {
              width: `${this.w}px`,
            };
          } else {
            this.imgStyle = {
              minHeight: `${this.h}px`,
              maxHeight: `${this.h}px`,
            };
          }
        } else {
          this.figureClass = 'portrait';
          if ((nw / nh) > (this.w / this.h)) {
            this.imgStyle = {
              height: `${this.h}px`,
            };
          } else {
            this.imgStyle = {
              minWidth: `${this.w}px`,
              maxWidth: `${this.w}px`,
            };
          }
        }
      }
    },
    onLoadImageComplete() {
      if (!this.onloadsuccess) return;
      this.onloadsuccess();
    },
    onLoadImageError() {
      if (!this.onloaderror) return;
      this.onloaderror();
    },
  },
};
</script>

<style lang="stylus" scoped>
figure
  margin 0
  display flex
  align-items center
  justify-content center
  overflow hidden
</style>
