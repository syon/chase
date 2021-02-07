import DB from '@/lib/DB'

const db = new DB()

export default ({ app }, inject) => {
  // Inject $cache in Vue, context and store.
  inject('cache', db)
  window.$cache = db
}
