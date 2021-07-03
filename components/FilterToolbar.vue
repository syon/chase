<template>
  <div v-if="isFiltering" class="px-8 py-4">
    <div class="d-flex">
      <v-checkbox v-model="filterIsFav" hide-details class="mt-0 mr-6">
        <template #label>
          <v-icon color="orange">mdi-star</v-icon>
        </template>
      </v-checkbox>
      <v-text-field
        v-model="filterTxt"
        label="Search Text"
        dense
        outlined
        clearable
        prepend-icon="mdi-text-box-search-outline"
        hide-details
        class="mx-6"
        @keyup.enter="handleTextSubmit"
        @blur="handleTextSubmit"
      />
      <v-select
        v-model="pickedTags"
        :items="recentTags"
        chips
        clearable
        label="Tags"
        multiple
        outlined
        dense
        hide-details
      />
    </div>
    <div>Max Count: 100</div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data: () => ({
    filterTxt: '',
  }),
  computed: {
    ...mapState('stream/filter', {
      isFav: (state) => state.isFav,
      tags: (state) => state.tags,
      showMode: (state) => state.showMode,
      isFiltering: (state) => state.isFiltering,
    }),
    ...mapGetters({
      recentTags: 'chase/recentTags',
      gSpell: 'stream/filter/gSpell',
    }),
    filterIsFav: {
      get() {
        return this.isFav
      },
      set(v) {
        this.$store.commit('stream/filter/SET_IsFav', v)
      },
    },
    pickedTags: {
      get() {
        return this.tags
      },
      set(tags) {
        this.$store.commit('stream/filter/SET_Tags', tags)
      },
    },
  },
  watch: {
    gSpell(after) {
      this.filterTxt = after
    },
  },
  methods: {
    handleTextSubmit() {
      this.$store.commit('stream/filter/SET_Spell', this.filterTxt)
    },
  },
}
</script>
