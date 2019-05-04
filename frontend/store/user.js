export const state = () => ({
  token: '',
  id: 0,
  username: '',
  nickname: '',
  email: '',
  profileImageUrl: '',
  registerDate: null,
  blockDate: null,
  level: 0,
  exp: 0,
  point: 0,
  isAdmin: false,
  noticeCount: 0,
  isLogged: false
})

export const mutations = {
  setUser: (state, data) => {
    state.token = data.token
    state.id = data.user.id
    state.username = data.user.username
    state.nickname = data.user.nickname
    state.email = data.user.email
    state.profileImageUrl = `https://hawawa.co.kr/img/${data.user.profileImageUrl}`
    state.registerDate = data.user.registerDate
    state.blockDate = data.user.blockDate
    state.level = data.user.level
    state.exp = data.user.exp
    state.point = data.user.point
    state.isAdmin = data.user.isAdmin
    state.isLogged = true
  },
  setNoticeCount: (state, count) => state.noticeCount = count,
  signOut: state => {
    state.token = ''
    state.isLogged = false
    localStorage.removeItem('token')
  }
}