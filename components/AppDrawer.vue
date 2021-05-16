<template>
  <v-navigation-drawer
    v-model="drawer"
    right
    absolute
    bottom
    temporary
    width="50vw"
  >
    <app-stats />
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'
import AppStats from '@/components/AppStats'

export default {
  components: {
    AppStats,
  },
  computed: {
    ...mapState('chase', {
      isSettingMode: (state) => state.isSettingMode,
    }),
    drawer: {
      get() {
        return this.isSettingMode
      },
      set(bool) {
        this.$store.commit('chase/SET_IsSettingMode', bool)
      },
    },
  },
}
</script>
