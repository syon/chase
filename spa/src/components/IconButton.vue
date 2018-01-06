<template lang="pug">
clickable.v-iconbutton(:class="{ loading, disabled }")
  button(:disabled="{ disabled: 'disabled' }")
    i(:class="iconName")
</template>

<script>
import Clickable from '@/components/Clickable';

export default {
  name: 'IconButton',
  props: ['icon', 'loading', 'disabled', 'icon-disabled'],
  components: {
    Clickable,
  },
  computed: {
    iconName() {
      if (this.loading) {
        return 'ion-load-d';
      } else if (this.disabled) {
        return this.iconDisabled ? this.iconDisabled : this.icon;
      }
      return this.icon;
    },
  },
};
</script>

<style lang="stylus" scoped>
.v-iconbutton
  display flex
  justify-content center
  line-height 1
  button
    display flex
    justify-content center
    color inherit
    font inherit
    margin 0
    padding 3px
    text-align inherit
    line-height 1
    background none
    overflow visible
    border none
    cursor pointer
    i
      min-width 1em
      text-align center
</style>
