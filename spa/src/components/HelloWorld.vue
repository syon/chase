<template lang="pug">
.screen
  pre
    code {{ apiResult }}
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      apiResult: 'apiResult',
    }),
  },
};
</script>
