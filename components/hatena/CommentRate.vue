<template>
  <div class="xx-peity">
    <peity
      :type="'pie'"
      :options="{
        fill: ['#7957d5', '#eeeeee'],
        width: 20,
        height: 20,
        innerRadius: 0,
        radius: 20,
      }"
      :data="commentRatePie"
    />
    <span class="rateText">{{ commentRate }}%</span>
  </div>
</template>

<script>
import Peity from 'vue-peity'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    Peity,
  },
  computed: {
    ...mapState('hatena/bookmark', {
      hatebu: (state) => state.entry,
    }),
    ...mapGetters({
      commentCount: 'hatena/bookmark/gCommentCount',
      commentRate: 'hatena/bookmark/gCommentRate',
    }),
    commentRatePie() {
      if (!this.hatebu.bookmarks) return ''
      return [
        this.commentCount,
        this.hatebu.count - this.commentCount,
      ].toString()
    },
  },
}
</script>

<style lang="scss" scoped>
.xx-peity {
  display: flex;
  align-items: center;

  .rateText {
    margin-left: 0.5em;
    font-size: 1rem;
  }
}
</style>
