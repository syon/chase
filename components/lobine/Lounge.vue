<template>
  <div>
    <div>count: {{ count }}</div>
    <div>bookmarks: {{ bookmarks.length }}</div>
    <!-- <div v-for="(b, idx) in bookmarks" :key="idx">
      {{ b }}
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      gLounge: 'lobine/lounge/gLounge',
    }),
    hatebu() {
      return this.gLounge.hatebu || {}
    },
    count() {
      return this.hatebu.count
    },
    bookmarks() {
      return this.hatebu.bookmarks
    },
  },
}
</script>
