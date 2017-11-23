<template lang="pug">
.entry
  dl.meta
    dt eid
    dd {{ obj.eid }}
    dt fqdn
    dd {{ obj.fqdn }}
    dt sortId
    dd {{ obj.sortId }}
    dt date
    dd {{ obj.date }}
  dl
    dt title
    dd {{ obj.title }}
    dt site_name
    dd {{ obj.site_name }}
    dt url
    dd {{ obj.url }}
    dt image_suggested
    dd {{ obj.image_suggested }}
    dt image_s3_url
    dd {{ obj.image_s3_url }}
    img(:src="obj.image_s3_url" @error="onLoadImageError")
    dt excerpt
    dd {{ obj.excerpt }}
    dt description
    dd {{ obj.description }}
    dt tags
    dd {{ obj.tags }}
</template>

<script>
import Libra from '@/adaptors/LibraAdaptor';

export default {
  props: ['obj'],
  methods: {
    onLoadImageError() {
      const o = this.obj;
      // eslint-disable-next-line
      console.log('★Libra.thumb★', o);
      Libra.thumb({ eid: o.eid, url: o.url, image_suggested: o.image_suggested });
      if (o.image_suggested) {
        o.image_s3_url = o.image_suggested;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.entry
  dl
    dt
      font-size 12px
  dl.meta
    dt, dd
      display inline-block
      padding 0 8px
    dt
      background-color black
      color white
    dd
      margin 0 1em 0 0
</style>
