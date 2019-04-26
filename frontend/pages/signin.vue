<template>
  <div>
    <Loading v-if='loading' />
    <Header />
    <div class='Container'>
      <div class='logo'>
        <img src='~/assets/Logo.png'>
      </div>
      <div class='article'>
        <el-input class='Bottom' size='small' placeholder='ID' v-model='username' autofocus />
        <el-input class='Bottom' size='small' placeholder='비밀번호' v-model='password' show-password />
        <el-button-group>
          <el-button type='danger' size='small' @click='signIn'>
            <font-awesome-icon icon='pencil-alt' />
            로그인
          </el-button>
          <el-button type='info' size='small' @click='signUp'>계정 생성</el-button>
        </el-button-group>
        <div class='Right'>
          <el-tooltip class='item' effect='dark' content='로그인 ID를 저장합니다.' placement='top'>
            <el-switch
              v-model='save'
              active-color='#f78989' />
          </el-tooltip>
          ID 저장
        </div>
      </div>
    </div>
    <Footer class='Footer' />
  </div>
</template>

<script>
  import Header from '~/components/header.vue'
  import Footer from '~/components/footer.vue'
  import Loading from '~/components/loading.vue'
  import axios from 'axios'
  
  export default {
    name: 'App',
    extends: {},
    data() {
      return {
        username: '',
        password: '',
        save: false,
        loading: false
      }
    },
    methods: {
      signIn: async function() {
        if (this.loading) return
        if (this.username === '') return this.$message.error('ID를 입력하세요.')
        if (this.password === '') return this.$message.error('비밀번호를 입력하세요.')
        this.loading = true
        const { data } = await axios.post('/api/auth/signin', { username: this.username, password: this.password })
        if (data.redirect === 'accept') return location.href = `/accept/${this.username}`
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message)
        }
        localStorage.token = data.token
        this.$message.success('로그인 성공')
        this.loading = false
        location.href = '/'
      },
      signUp() {
        location.href = '/signup'
      }
    },
    created() {
      if (process.browser) {
        this.save = (localStorage.save === 'true') || false
        if (this.save) this.username = localStorage.username || ''
      }
    },
    updated() {
      if (process.browser) {
        if ((localStorage.save === 'true') !== this.save) {
          localStorage.save = this.save
          if (!this.save) localStorage.removeItem('username')
        }
        if (localStorage.save === 'true' && localStorage.username !== this.username)
          localStorage.username = this.username
      }
    },
    components: {
      Header,
      Footer,
      Loading
    }
  }
</script>

<style>
  .header-menu {
    margin-bottom: 1rem;
  }

  .grid-content {
    min-height: 0.02px;
  }

  .Container {
    width: 330px;
    margin: 0 auto;
  }

  .logo {
    width: 300px;
    margin: 5rem auto 1rem;
  }

  .article {
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    width: 100%;
    padding: .5rem;
    margin-bottom: 4rem;
    background: #FFF;
  }

  .Right {
    margin-top: 10px;
    color: #333;
    font-size: .8rem;
    float: right;
  }

  .Bottom {
    margin-bottom: .5rem;
  }

  .Footer {
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: -1;
  }
</style>