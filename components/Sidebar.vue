<template>
  <div class="sidebar">
    <section>
      <h1 class="logo">
        <a href="/"><img src="~/assets/logo.png" alt="Chase" /></a>
      </h1>
    </section>
    <section>
      <v-btn @click="more">more</v-btn>
      <v-btn @click="deleteDB">deleteDB</v-btn>
    </section>
    <section>
      <div class="misc">
        <div class="link-item font-smaller">
          <a href="https://getpocket.com/" target="_blank">
            <clickable class="menu-item">
              <div class="label">
                <i class="ion-ios-world-outline"></i><span>Pocket</span>
              </div>
            </clickable>
          </a>
        </div>
      </div>
      <div class="config">
        <div class="link-item font-smaller">
          <nuxt-link to="/config">
            <clickable class="menu-item">
              <div class="label">
                <i class="ion-ios-settings"></i><span>Config</span>
              </div>
            </clickable>
          </nuxt-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Clickable from '@/components/Clickable'

export default {
  components: {
    Clickable,
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
    getAccessToken() {
      this.$store.dispatch('chase/getAccessToken', this.$cookie)
    },
    showScenesEditor() {
      this.sceneEditing = true
    },
    logout() {
      this.$store.dispatch('chase/logout', this.$cookie)
      this.$router.push({ path: '/welcome' })
    },
    more() {
      this.$store.dispatch('chase/moreEntries')
    },
    deleteDB() {
      this.$store.dispatch('chase/deleteDB')
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar {
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
