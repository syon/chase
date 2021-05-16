<template>
  <v-snackbar v-model="isSnackbar">
    <v-progress-circular indeterminate color="primary" />
    <span class="ml-2">{{ gBgMessage }}</span>
  </v-snackbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    isSnackbar: false,
  }),
  computed: {
    ...mapGetters({
      gBgMessage: 'chase/gSnackMessage',
    }),
  },
  watch: {
    gBgMessage(after) {
      this.isSnackbar = after.length > 0
    },
  },
}
</script>
