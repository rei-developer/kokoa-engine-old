<template>
  <div>
    <no-ssr>
      <Loading v-if='$store.state.loading' />
    </no-ssr>
    <el-container>
      <el-aside width='200px' v-if='$store.state.aside'>
        <SideMenu />
      </el-aside>
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <nuxt />
        </el-main>
      </el-container>
    </el-container>
    <div class='popupMenu hidden-desktop' @click='aside' round>
      <font-awesome-icon icon='bars' />
    </div>
  </div>
</template>

<script>
  import Loading from '~/components/loading.vue'
  import Header from '~/components/header.vue'
  import SideMenu from '~/components/sideMenu.vue'
  import Footer from '~/components/footer.vue'
  import axios from 'axios'

  export default {
    methods: {
      checkLogged: async function() {
        const token = localStorage.token
        if (!token) return
        const { data } = await axios.get(
          '/api/auth/check',
          { headers: { 'x-access-token': token } }
        )
        if (data.status === 'fail') return
        data.token = token
        this.$store.commit('user/setUser', data)
      },
      getNotices: async function() {
        const token = localStorage.token
        if (!token) return
        const { data } = await axios.get(
          '/api/notice',
          { headers: { 'x-access-token': token } }
        )
        if (data.count) this.$store.commit('user/setNoticeCount', data.count)
      },
      updateNotices() {
        setTimeout(async () => {
          this.getNotices()
          this.updateNotices()
        }, 10000)
      },
      aside() {
        this.$store.commit('setAside')
      },
      playSound(sound) {
        if (!sound) return
        const audio = new Audio(sound)
        audio.play()
      }
    },
    beforeMount() {
      this.$socket.on('newBest', data => {
        this.$notify({
          title: data.title,
          message: '새로운 인기글이 나타났습니다!',
          position: 'bottom-right'
        })
        this.playSound('https://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3')
      })
      this.$socket.on('newTopic', data => {
        this.$notify({
          title: data.title,
          message: '새로운 글이 작성되었습니다.',
          position: 'bottom-right'
        })
        this.playSound('https://soundbible.com/mp3/Air Plane Ding-SoundBible.com-496729130.mp3')
      })
    },
    mounted() {
      this.checkLogged()
      this.getNotices()
      this.updateNotices()
    },
    beforeDestroy() {
      this.$socket.removeAllListeners()
      this.$socket.clear()
    },
    components: {
      Loading,
      Header,
      SideMenu,
      Footer
    }
  }
</script>

<style>
  .popupMenu {
    position: fixed;
    right: 2rem;
    bottom: 6rem;
    width: 3rem;
    height: 3rem;
    line-height: 3rem;
    border-radius: 500rem;
    background: #29313D;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.1);
    color: #FFF;
    text-align: center;
    cursor: pointer;
    z-index: 10000;
  }
  .popupMenu:hover {
    opacity: .8;
  }
</style>