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
        <el-input class='Bottom' size='small' placeholder='닉네임' v-model='nickname' />
        <el-input class='Bottom input-with-select' size='small' placeholder='이메일 주소' v-model='email'>
          <el-button slot='append' @click='accept'>전송</el-button>
        </el-input>
        <el-input class='Bottom' size='small' placeholder='인증 코드' v-model='authCode' />
        <el-button type='success' size='small' @click='signUp'>
          <font-awesome-icon icon='user-edit' />
          계정 생성
        </el-button>
      </div>
      <div class='article'>
        <div class='signin' @click='signIn'>계정이 있으시다면 로그인하세요</div>
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
        nickname: '',
        email: '',
        authCode: '',
        password: '',
        loading: false
      }
    },
    methods: {
      signIn() {
        location.href = '/signin'
      },
      signUp: async function() {
        if (this.loading) return
        if (this.username === '') return this.$message.error('ID를 입력하세요.')
        if (this.nickname === '') return this.$message.error('닉네임을 입력하세요.')
        if (this.email === '') return this.$message.error('이메일 주소를 입력하세요.')
        if (this.authCode === '') return this.$message.error('ID를 입력하세요.')
        if (this.password === '') return this.$message.error('인증 코드를 입력하세요.')
        this.loading = true
        const { data } = await axios.post('/api/auth/signup', { username: this.username, nickname: this.nickname, email: this.email, authCode: this.authCode, password: this.password })
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message)
        }
        this.$message.success('계정 생성 성공')
        this.loading = false
        location.href = '/signin'
      },
      accept: async function() {
        if (this.loading) return
        if (this.email === '') return this.$message.error('이메일 주소를 입력하세요.')
        this.loading = true
        const { data } = await axios.post('/api/auth/accept', { email: this.email })
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message)
        }
        this.$message.success('인증 코드를 전송했습니다.')
        this.loading = false
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
    margin-bottom: 1rem;
    background: #FFF;
  }

  .signin {
    width: 100%;
    padding: .5rem 0;
    border-radius: .5rem;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    color: #67C23A;
    font-size: .8rem;
    text-align: center;
    cursor: pointer;
  }
  .signin:hover {
    background: rgba(103, 194, 58, 0.1);
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