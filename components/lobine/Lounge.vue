<template>
  <div>
    <section class="area-audiencetoolbar">
      <audience-toolbar mode="lounge" />
    </section>

    <section class="area-audience">
      <audience-tabs />
    </section>
  </div>
</template>

<script>
import AudienceToolbar from '@/components/hatena/AudienceToolbar'
import AudienceTabs from '@/components/hatena/AudienceTabs'

export default {
  components: {
    AudienceToolbar,
    AudienceTabs,
  },
}
</script>
