<template>
  <clickable class="v-iconbutton" :class="{ loading, disabled }"
    ><button :disabled="{ disabled: 'disabled' }">
      <i :class="iconName"></i></button
  ></clickable>
</template>

<script>
import Clickable from '@/components/Clickable'

export default {
  components: {
    Clickable,
  },
  props: {
    icon: { type: String, required: true },
    loading: { type: Boolean, required: true },
    disabled: { type: Boolean, default: false },
    iconDisabled: { type: String, default: '' },
  },
  computed: {
    iconName() {
      if (this.loading) {
        return 'ion-load-d'
      } else if (this.disabled) {
        return this.iconDisabled ? this.iconDisabled : this.icon
      }
      return this.icon
    },
  },
}
</script>

<style lang="scss" scoped>
.v-iconbutton {
  display: flex;
  justify-content: center;
  line-height: 1;
}

.v-iconbutton button {
  display: flex;
  justify-content: center;
  color: inherit;
  font: inherit;
  margin: 0;
  padding: 3px;
  text-align: inherit;
  line-height: 1;
  background: none;
  overflow: visible;
  border: none;
  cursor: pointer;
}

.v-iconbutton button i {
  min-width: 1em;
  text-align: center;
}
</style>
