export const state = () => ({
  topic: [],
  aside: false,
  loading: false
})

export const mutations = {
  setTopic: (state, topic) => state.topic = topic,
  setAside: state => state.aside = !state.aside,
  setLoading: (state, toggle) => state.loading = toggle
}