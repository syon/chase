<template>
  <div class="screenshot">
    <template v-if="entry.ready"
      ><template v-if="isDesktop">
        <fit-image
          :src="desktopUrl"
          w="257"
          h="193"
          size="cover"
          :onloadsuccess="() => onShotSuccess(entry)"
          :onloaderror="() => onShotError(entry)"
        ></fit-image> </template
      ><template v-else>
        <fit-image
          :src="mobileUrl"
          w="214"
          h="380"
          size="cover"
          :onloaderror="() => onShotError(entry)"
        ></fit-image> </template
    ></template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FitImage from '@/components/FitImage'

export default {
  components: {
    FitImage,
  },
  props: { target: { type: String, required: true } },
  computed: {
    ...mapGetters({
      entry: 'chase/activeEntry',
    }),
    isDesktop() {
      return this.target === 'desktop'
    },
    desktopUrl() {
      if (!this.entry) return ''
      const { eid } = this.entry
      return `https://s3.amazonaws.com/syon-chase/shots/${eid}/desktop.png`
    },
    mobileUrl() {
      if (!this.entry) return ''
      const { eid } = this.entry
      return `https://s3.amazonaws.com/syon-chase/shots/${eid}/mobile.png`
    },
  },
  methods: {
    onShotSuccess() {
      // console.log(entry.eid);
    },
    onShotError(entry) {
      if (entry.shotOrdered) return
      this.$store.dispatch('chase/fetchShot', entry)
    },
  },
}
</script>

<style lang="scss" scoped>
.screenshot {
  height: 193px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
