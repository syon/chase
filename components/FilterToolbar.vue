<template>
  <div v-if="isFiltering" class="d-flex px-8 py-4">
    <v-checkbox v-model="filterIsFav" hide-details class="mt-0 mr-6">
      <template #label>
        <v-icon color="orange">mdi-star</v-icon>
      </template>
    </v-checkbox>
    <v-text-field
      v-model="filterTxt"
      label="Filter"
      dense
      outlined
      clearable
      prepend-icon="mdi-filter-variant"
      hide-details
      class="mx-6"
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
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState('stream/filter', {
      spell: (state) => state.spell,
      isFav: (state) => state.isFav,
      tags: (state) => state.tags,
      showMode: (state) => state.showMode,
      isFiltering: (state) => state.isFiltering,
    }),
    ...mapGetters({
      recentTags: 'chase/recentTags',
    }),
    filterTxt: {
      get() {
        return this.spell
      },
      set(v) {
        this.$store.commit('stream/filter/SET_Spell', v)
      },
    },
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
}
</script>
