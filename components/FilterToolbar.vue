<template>
  <div>
    <sidebar />
    <v-row>
      <v-col>
        <v-checkbox v-model="filterIsFav" hide-details class="mt-0 ml-8">
          <template #label>
            <v-icon>mdi-star</v-icon>
          </template>
        </v-checkbox>
      </v-col>
      <v-col>
        <v-text-field
          v-model="filterTxt"
          label="Filter"
          dense
          outlined
          clearable
          prepend-icon="mdi-filter-variant"
          hide-details
        />
      </v-col>
      <v-col>
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
      </v-col>
    </v-row>
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
  },
}
</script>
