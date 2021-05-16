<template>
  <div class="appbar my-2">
    <section>
      <h1 class="logo">
        <a href="/"><img src="~/assets/logo.png" alt="Chase" /></a>
      </h1>
    </section>
    <section>
      <summary-bar />
    </section>
    <section class="d-flex">
      <div class="misc">
        <v-btn href="https://getpocket.com/" target="_blank" text small>
          <v-icon small>mdi-web</v-icon>
          <span>Pocket</span>
        </v-btn>
      </div>
      <div>
        <v-btn text small @click="handleRefresh">
          <v-icon small>mdi-refresh</v-icon>
        </v-btn>
      </div>
      <div>
        <v-btn text small @click="handleCloudSync">
          <v-icon small>mdi-cloud-sync</v-icon>
        </v-btn>
      </div>
      <div class="config">
        <v-btn text small @click="handleConfig">
          <v-icon small>mdi-cog</v-icon>
        </v-btn>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SummaryBar from '@/components/SummaryBar'

export default {
  components: {
    SummaryBar,
  },
  computed: {
    ...mapState('pocket/auth', {
      login: 'login',
    }),
    ...mapGetters({
      gPreparedCatalog: 'chase/gPreparedCatalog',
    }),
  },
  mounted() {
    const ph = this.$cookie.get('phase')
    if (!ph) {
      this.$router.push('welcome')
    } else {
      this.$store.dispatch('chase/actByPhase', this.$cookie)
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('chase/logout', this.$cookie)
      this.$router.push({ path: '/welcome' })
    },
    handleRefresh() {
      this.$store.dispatch('chase/fetchEntries')
    },
    handleCloudSync() {
      this.$store.dispatch('chase/fetchAllEntries')
    },
    handleConfig() {
      this.$store.commit('chase/SET_IsSettingMode', true)
    },
  },
}
</script>

<style lang="scss" scoped>
.appbar {
  display: flex;
  justify-content: space-between;
}

.flex-aic-jcsb {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.refresh i {
  font-size: 1.5rem;
}

.menu {
  margin: 1rem 0;
  .menu-title {
    font-size: 0.6rem;
    font-style: italic;
    color: #757575;
    margin: 0.5em 0;
  }
}

.link-item {
  height: 2rem;
  display: flex;
  align-items: center;
  font-size: 1rem;

  i {
    width: 1em;
    display: inline-block;
    margin-right: 0.5em;
    text-align: center;
  }

  > a {
    flex: 1;
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9rem;
  }
}

.menu-item {
  flex: 1;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 2px;
  padding: 5px;
  margin: 0 -5px;
  .cnt {
    font-size: 0.75rem;
  }
}

.logo {
  display: flex;
  align-items: center;
  margin: 0;

  img {
    width: 32px;
    height: 32px;
  }
}

.tags .link-item {
  height: 1.5rem;
  a {
    font-size: 0.8rem;
  }
}

.font-smaller {
  font-size: 0.8rem;
}

.userinfo {
  display: flex;
  align-items: center;
  .username {
    margin-right: 0.5em;
    font-size: 0.6rem;
  }

  .disconnect {
    padding: 0 0.5rem;
    font-size: 1.25rem;
  }
}
</style>
