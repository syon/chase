<template>
  <v-app>
    <v-main>
      <nuxt />
    </v-main>
    <app-drawer />
  </v-app>
</template>

<script>
import AppDrawer from '@/components/AppDrawer'

export default {
  components: {
    AppDrawer,
  },
}
</script>
