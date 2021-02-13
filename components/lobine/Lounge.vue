<template>
  <div>
    <div>count: {{ count }}</div>
    <div>bookmarks: {{ bookmarks.length }}</div>
    <bookmark-list mode="POPULAR" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BookmarkList from '@/components/hatena/BookmarkList'

export default {
  components: {
    BookmarkList,
  },
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
      return this.hatebu.bookmarks || []
    },
  },
}
</script>
