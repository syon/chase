import ChaseDuty from '@/lib/ChaseDuty'

const chaseDuty = new ChaseDuty()

export default ({ app }, inject) => {
  // Inject $duty in Vue, context and store.
  inject('duty', chaseDuty)
  window.$duty = chaseDuty
}
