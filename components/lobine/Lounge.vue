<template>
  <div>
    <section class="area-audiencetoolbar">
      <audience-toolbar mode="lounge" />
    </section>

    <section class="area-audience">
      <!-- <audience-tabs /> -->
      <bookmark-list mode="POPULAR" />
    </section>
  </div>
</template>

<script>
import AudienceToolbar from '@/components/hatena/AudienceToolbar'
import BookmarkList from '@/components/hatena/BookmarkList'

export default {
  components: {
    AudienceToolbar,
    BookmarkList,
  },
}
</script>
