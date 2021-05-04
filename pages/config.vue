<template>
  <div class="screen page-container">
    <nav class="page-nav">
      <v-btn @click="deleteDB">deleteDB</v-btn>
    </nav>
    <article class="page-content">
      <h2>Config</h2>
      <section>
        <h3>You</h3>
        <p>
          <span class="username">{{ login.username }}</span>
        </p>
        <p>
          <code>{{ login.accessToken }}</code>
        </p>
      </section>
      <section>
        <h3>About</h3>
        <div class="meta">
          <a class="author" href="https://github.com/syon"
            ><img src="../assets/syon.png" alt="syon" target="_blank" /><span
              >syon</span
            ></a
          >
          <div class="repo">
            <a
              href="https://github.com/syon/chase"
              target="_blank"
              style="font-size: 24px"
              ><i class="ion-social-github"></i></a
            ><a
              class="wercker-badge"
              href="https://app.wercker.com/project/byKey/a85109629f315de1a3cf4e0521775121"
              ><img
                alt="Wercker status"
                src="https://app.wercker.com/status/a85109629f315de1a3cf4e0521775121/s/master"
            /></a>
          </div>
          <div class="twitter-btn">
            <a
              href="https://twitter.com/intent/tweet?screen_name=syonxv&ref_src=twsrc%5Etfw"
              class="twitter-mention-button"
              data-show-count="false"
              >Tweet to @syonxv</a
            >
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('pocket/auth', {
      login: (state) => state.login,
    }),
  },
  methods: {
    deleteDB() {
      this.$store.dispatch('chase/deleteDB')
    },
  },
}
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  display: flex;
}

.page-container .page-nav {
  width: 180px;
}

.page-container .page-content {
  flex: 1;
  padding: 0 15px;
}

.twitter-btn {
  padding: 16px;
  line-height: 1;
}

.meta {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  height: 50px;
  font-size: 12px;
  font-family: sans-serif;
  color: #7e888b;
}

.author {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.author img {
  width: 30px;
  height: 30px;
  margin-right: 0.4rem;
  border-radius: 100%;
}

.repo {
  display: flex;
}

.repo a {
  margin-left: 15px;
  color: #7e888b;
  text-decoration: none;
}

.repo .wercker-badge {
  align-self: center;
  line-height: 1;
}
</style>
