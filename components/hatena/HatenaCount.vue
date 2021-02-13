<template>
  <span class="cc-hatenacount">
    <template v-if="url">
      <a
        :style="countStyle"
        :href="url"
        class="xx-hatebu-count"
        target="_blank"
      >
        {{ count }}
      </a>
    </template>
    <template v-else>
      <span>{{ count }}</span>
    </template>
  </span>
</template>

<script>
export default {
  props: {
    count: { type: Number, default: null },
    url: { type: String, default: null },
    showUsers: { type: Boolean, default: true },
  },
  computed: {
    countStyle() {
      const cnt = this.count
      if (!(cnt >= 0)) return {}
      let style
      switch (true) {
        case cnt >= 500:
          style = { color: '#F50057', fontWeight: 900 }
          break
        case cnt >= 100:
          style = { color: '#FF4081', fontWeight: 600 }
          break
        case cnt >= 10:
          style = { color: '#FF4081', fontWeight: 300 }
          break
        default:
          style = { color: '#9E9E9E', fontWeight: 200 }
      }
      return style
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.cc-hatenacount {
  letter-spacing: -0.03em;
}
.xx-hatebu-count {
  &:hover {
    text-decoration: underline;
  }
}
</style>
