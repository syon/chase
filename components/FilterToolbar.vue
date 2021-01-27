<template>
  <div>
    <sidebar />
    <nav class="d-flex align-center">
      <v-text-field
        v-model="filterTxt"
        label="Filter"
        dense
        outlined
        clearable
        prepend-icon="mdi-filter-variant"
        hide-details
      />
      <v-checkbox v-model="filterIsFav" hide-details class="mt-0 ml-8">
        <template #label>
          <v-icon>mdi-star</v-icon>
        </template>
      </v-checkbox>
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
    </nav>
    <div>
      <v-btn-toggle v-model="pickedShowMode" mandatory>
        <v-btn value="rack">
          <v-icon>mdi-format-align-left</v-icon>
        </v-btn>
        <v-btn value="slim">
          <v-icon>mdi-format-align-center</v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>
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
    pickedShowMode: {
      get() {
        return this.showMode
      },
      set(v) {
        this.$store.commit('stream/filter/SET_ShowMode', v)
      },
    },
  },
}
</script>
