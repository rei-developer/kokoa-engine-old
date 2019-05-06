<template>
  <div>
    <div v-if='$store.state.user.isLogged'>
      <div class='postWrite'>
        <div class='item'>
          <div class='profile'>
            <img :src='$store.state.user.profileImageUrl'>
          </div>
          <div class='inputbox'>
            <textarea
              rows='3'
              placeholder='이곳에 내용을 입력해주세요.'
              v-model='content' />
          </div>
          <div class='send' @click='write'>
            <span v-if='loading'>
              <font-awesome-icon class='fa-spin' icon='circle-notch' />
            </span>
            <span v-else>
              <font-awesome-icon icon='paper-plane' />
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <nuxt-link to='/signin'>
        <div class='signIn'>계정이 있으시다면 로그인하세요</div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
  import PostWrite from '~/components/post/write.vue'
  import axios from 'axios'

  export default {
    props: ['id', 'topicUserId', 'postUserId', 'postRootId', 'postParentId'],
    data() {
      return {
        content: '',
        loading: false
      }
    },
    methods: {
      write: async function() {
        if (this.loading) return
        if (this.content === '') return this.$message.error('내용을 입력하세요.')
        if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
        const token = this.$store.state.user.token
        this.loading = true
        const { data } = await axios.post('/api/topic/write/post', {
          topicId: this.id,
          topicUserId: this.topicUserId,
          postUserId: this.postUserId,
          postRootId: this.postRootId,
          postParentId: this.postParentId,
          content: this.content
        }, {
          headers: { 'x-access-token': token }
        })
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message)
        }
        this.$store.commit('forceUpdate')
        this.content = ''
        this.loading = false
      }
    }
  }
</script>

<style>
  /* Post Write */
  .postWrite {
    display: flex;
    flex-direction: column;
  }
  .postWrite .item {
    display: flex;
    border-bottom: 0 !important;
  }
  .postWrite .item .profile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .postWrite .item .profile img {
    width: 4rem;
    height: 4rem;
    padding: 2px;
    border: 1px solid #CCC;
    border-radius: 500rem;
  }
  .postWrite .item .inputbox {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 0 .5rem;
  }
  .postWrite .item .inputbox textarea {
    padding: .5rem;
    border: 2px solid #CCC;
    outline: none !important;
  }
  .postWrite .item .send {
    display: flex;
    flex-direction: column;
    width: 4.5rem;
    border-radius: .25rem;
    background: #F78989;
    color: #FFF;
    font-size: 1.5rem;
    justify-content: center;
    align-items: center;
  }
  .postWrite .item .send:hover {
    opacity: .8;
    cursor: pointer;
  }

  /* Sign In */
  .signIn {
    width: 100%;
    padding: .5rem 0;
    border-radius: .5rem;
    color: #67C23A;
    font-size: .8rem;
    text-align: center;
    cursor: pointer;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }
  .signIn:hover {
    background: rgba(103, 194, 58, 0.1);
  }
</style>