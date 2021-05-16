<template>
  <v-card>
    <v-card-title>
      <h4>Domains</h4>
    </v-card-title>
    <v-divider />
    <v-list dense>
      <v-list-item
        v-for="(x, idx) of gDomainSummary"
        :key="idx"
        @click="handleClick(x)"
      >
        <v-list-item-content>{{ x.domain }}</v-list-item-content>
        <v-list-item-content class="align-end">
          {{ x.count }}
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      gDomainSummary: 'summary/gDomainSummary',
    }),
  },
  mounted() {
    this.$store.dispatch('summary/load')
  },
  methods: {
    handleClick(item) {
      const spell = item.domain
      this.$store.dispatch('stream/filter/applySpell', spell)
    },
  },
}
</script>
