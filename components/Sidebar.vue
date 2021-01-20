<template>
  <div class="sidebar">
    <section>
      <h1 class="logo">
        <a href="/"><img src="~/assets/logo.png" alt="Chase" /></a>
      </h1>
    </section>
    <section v-if="login.accessToken" class="menu">
      <div class="menu-title">Progress</div>
      <span>{{ progress.unread }}</span
      ><span> / </span><span>{{ progress.all }}</span
      ><span> (</span
      ><span>{{ Math.floor((progress.unread / progress.all) * 100) }}</span
      ><span> %)</span>
    </section>
    <section v-if="login.accessToken" class="menu">
      <div class="menu-title">Recent {{ catalogCount }}</div>
      <div class="link-item">
        <nuxt-link to="/">
          <clickable class="menu-item">
            <div class="label">
              <i class="ion-ios-filing-outline"></i><span>Inbox</span>
            </div>
            <div class="cnt">{{ filteredCatalog('Inbox').length }}</div>
          </clickable>
        </nuxt-link>
      </div>
      <div class="link-item">
        <nuxt-link to="/favorite">
          <clickable class="menu-item">
            <div class="label">
              <i class="ion-ios-star-outline"></i><span>Favorite</span>
            </div>
            <div class="cnt">{{ filteredCatalog('Favorite').length }}</div>
          </clickable>
        </nuxt-link>
      </div>
      <div v-for="(sce, idx) in myScenesTags" :key="idx" class="link-item">
        <nuxt-link to="{ name: 'tag', params: { tag: sce.tag } }">
          <clickable class="menu-item">
            <div class="label">
              <i class="ion-ios-arrow-right"></i><span>{{ sce.label }}</span>
            </div>
            <div class="cnt">{{ filteredCatalog('Tag', sce.tag).length }}</div>
          </clickable>
        </nuxt-link>
      </div>
    </section>
    <section class="tags">
      <template v-for="tag in recentTags">
        <div :key="tag" class="link-item font-smaller">
          <nuxt-link :to="{ name: 'Tag', params: { tag } }">
            <clickable class="menu-item">
              <div class="label">
                <i class="ion-ios-pricetags-outline"></i><span>{{ tag }}</span>
              </div>
              <div class="cnt">{{ filteredCatalog('Tag', tag).length }}</div>
            </clickable>
          </nuxt-link>
        </div>
      </template>
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
      <div class="userinfo">
        <template v-if="login.accessToken"
          ><span class="username">{{ login.username }}</span>
          <clickable class="disconnect" @click.native="logout"
            ><i class="ion-ios-close-empty"></i
          ></clickable>
        </template>
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
    ...mapState('chase', {
      login: 'login',
      progress: 'progress',
      mytags: 'mytags',
      myscenes: 'myscenes',
    }),
    ...mapGetters({
      catalogCount: 'chase/catalogCount',
      filteredCatalog: 'chase/filteredCatalog',
      recentTags: 'chase/recentTags',
      myScenesTags: 'chase/myScenesTags',
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
  },
}
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  width: inherit;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  font-size: 0.75rem;
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
