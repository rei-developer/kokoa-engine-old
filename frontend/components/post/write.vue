<template>
  <div>
    <el-input
      type='textarea'
      :autosize='{ minRows: 4, maxRows: 12 }'
      maxlength='1000'
      placeholder='이곳에 할 말을 입력해주세요.'
      v-model='content'
      show-word-limit />
    <el-button class='Top' type='danger' size='small' @click='write'>
      <span v-if='loading'>
        <font-awesome-icon class='fa-spin' icon='circle-notch' />
      </span>
      <span v-else>
        작성
      </span>
    </el-button>
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
        // this.$router.go({ force: true })
        this.content = ''
        this.loading = false
      }
    }
  }
</script>