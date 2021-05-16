<template>
  <div>
    <v-overlay :value="busy" absolute color="white">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
    <v-autocomplete
      v-model="appliedTags"
      :search-input.sync="query"
      :items="recentTags"
      outlined
      dense
      chips
      small-chips
      label="Tags"
      multiple
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    busy: false,
    query: null,
  }),
  computed: {
    ...mapGetters({
      entry: 'chase/activeEntry',
      recentTags: 'chase/recentTags',
    }),
    appliedTags: {
      get() {
        return Object.keys(this.entry.tags)
      },
      async set(tags) {
        this.busy = true
        const eid = this.entry.eid
        const cnt = Object.keys(this.entry.tags).length
        if (tags.length > cnt) {
          const tag = tags.slice().pop()
          await this.$store.dispatch('chase/addTag', { eid, tags: [tag] })
        } else {
          await this.$store.dispatch('chase/clearTags', { eid })
          await this.$store.dispatch('chase/addTag', { eid, tags })
        }
        this.busy = false
      },
    },
  },
  methods: {
    async handleTagsEnter(ev) {
      this.busy = true
      const eid = this.entry.eid
      const tags = [this.query]
      await this.$store.dispatch('chase/addTag', { eid, tags })
      this.query = ''
      this.busy = false
    },
  },
}
</script>
