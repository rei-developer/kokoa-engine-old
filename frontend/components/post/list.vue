<template>
  <div>
    <div v-if='postsCount > 0'>
      <div class='post-list'>
        <div
          :class='"item" + (item.tagUserId ? " reply" : "") + (item.id == viewPostId ? " view" : "")'
          :ref='`post${item.id}`'
          v-for='(item, index) in posts' :key='index'>
          <div class='reply' v-if='item.tagUserId'>
            <font-awesome-icon icon='chevron-right' />
          </div>
          <div class='image'>
            <img :src='item.profile ? "https://hawawa.co.kr/img/" + item.profile : "/profile.png"'>
          </div>
          <div class='info'>
            <div class='content'>
              <span class='tagUser' v-if='item.tagUserId'>{{ item.tagAuthor }}</span>
              <span :class='item.userId === topic.userId ? "writer" : ""' v-html='item.content' />
            </div>
            <div class='author'>
              <img :src='item.admin > 0 ? "/admin.png" : "/user.png"'>
              {{ item.author }}
              <span class='regdate'>
                <font-awesome-icon icon='clock' />
                {{ item.created }}
              </span>
            </div>
          </div>
          <el-dropdown class='DropdownMenu' trigger='click' @command='handleCommand' v-if='$store.state.user.isLogged'>
            <span class='el-dropdown-link'>
              <div class='More'>
                <font-awesome-icon icon='ellipsis-v' />
              </div>
            </span>
            <el-dropdown-menu slot='dropdown'>
              <el-dropdown-item :command='["reply", item.id]'>댓글</el-dropdown-item>
              <el-dropdown-item :command='["remove", item.id]' v-if='item.userId === $store.state.user.id'>삭제</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class='post-box-reply' v-if='item.id === tempPostReplyId'>
            <PostWrite
              :id='id'
              :topicUserId='topic.userId'
              :postUserId='item.userId'
              :postRootId='item.postRootId || item.id'
              :postParentId='item.id' />
          </div>
        </div>
      </div>
    </div>
    <el-button
      class='newPosts'
      type='info'
      v-if='newPostsCount > 0'
      @click='getPosts'
      round>
      <font-awesome-icon class='fa-spin' icon='sync-alt' />
      새 댓글 불러오기 ({{ numberWithCommas(newPostsCount) }})
    </el-button>
    <div class='Blank' />
    <div class='post-box'>
      <PostWrite
        :id='id'
        :topicUserId='topic.userId'
        :postUserId='null'
        :postRootId='null'
        :postParentId='null' />
    </div>
    <el-pagination
      layout='prev, pager, next'
      :page-size='20'
      :total='postsCount'
      :current-page='postsPage'
      @current-change='currentChange' />
  </div>
</template>

<script>
  import PostWrite from '~/components/post/write.vue'
  import axios from 'axios'

  export default {
    props: ['id', 'topic'],
    data() {
      return {
        posts: [],
        postsCount: 0,
        postsPage: 1,
        newPostsCount: 0,
        viewPostId: 0,
        tempPostReplyId: 0,
        loading: false
      }
    },
    methods: {
      getPosts: async function() {
        if (this.loading) return
        this.loading = true
        const { data } = await axios.post('/api/topic/list/post', { id: this.id, page: this.postsPage - 1 })
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message)
        }
        this.postsCount = data.count
        this.newPostsCount = 0
        if (data.posts) {
          this.posts = data.posts.map(i => {
            i.created = this.$moment(i.created).fromNow()
            return i
          })
        }
        if (this.viewPostId > 0) this.scrollTo()
        this.loading = false
      },
      handleCommand(command) {
        switch (command[0]) {
          case 'reply':
            this.reply(command[1])
            break
          case 'remove':
            this.remove(command[1])
            break
        }
      },
      reply(id) {
        this.tempPostReplyId = id
      },
      remove: async function(id) {
        if (id < 1) return
        if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
        const token = this.$store.state.user.token
        this.$store.commit('setLoading', true)
        const { data } = await axios.delete(
          '/api/topic/delete/post',
          {
            data: { id, page: this.postsPage },
            headers: { 'x-access-token': token }
          }
        )
        if (data.status === 'fail') return this.$message.error(data.message)
        this.posts = this.posts.filter(post => post.id !== id)
        this.$message.success('댓글 삭제 성공!')
        this.$store.commit('setLoading')
      },
      scrollTo() {
        const el = this.posts.find(p => p.id == this.viewPostId)
        if (!el) return
        this.$nextTick(() => {
          window.scrollTo({
            top: this.$refs[`post${this.viewPostId}`][0].offsetTop,
            behavior: 'smooth'
          })
        })
      },
      numberWithCommas: x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      currentChange(page) {
        this.postsPage = page
        this.getPosts()
      },
      playSound(sound) {
        if (!sound) return
        const audio = new Audio(sound)
        audio.play()
      }
    },
    watch: {
      '$store.state.forceUpdate': function() {
        this.getPosts()
      }
    },
    created() {
      this.getPosts()
    },
    beforeMount() {
      this.$socket.on('newPost', () => {
        this.playSound("http://soundbible.com/mp3/Blop-Mark_DiAngelo-79054334.mp3")
        this.newPostsCount++
      })
    },
    mounted() {
      this.viewPostId = this.$route.query.postId
    },
    components: {
      PostWrite
    }
  }
</script>

<style>
  .newPosts {
    margin: 1rem 0;
    float: right;
  }

  .post-box {
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    width: 100%;
    margin: 0 0 .5rem;
    padding: .5rem;
    background: #FFF;
  }
  .post-box-reply {
    width: 100%;
    padding: .5rem;
    padding-left: 4rem;
  }

  .post-list {
    min-height: 5rem;
    margin: 1rem 0;
  }
  .post-list .item {
    width: 100%;
    margin-bottom: .4rem;
    background: #FFF;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    float: left;
  }
  .post-list .item.reply {
    background: #FAFAFA;
    padding-left: 1rem;
  }
  .post-list .item.view {
    border-left: 5px solid #f78989;
  }
  .post-list .item .reply {
    position: absolute;
    margin-top: 1.25rem;
    margin-left: -.5rem;
    color: #f78989;
  }
  .post-list .item .image {
    display: inline-block;
    width: 3rem;
    margin: .5rem;
    margin-right: 0;
    padding: 2px;
    border: 1px solid #DDD;
    border-radius: 500rem;
    float: left;
  }
  .post-list .item .image img {
    width: calc(3rem - 6px);
    height: calc(3rem - 6px);
    border-radius: 500rem;
  }
  .post-list .item .info {
    display: inline-block;
    padding: .5rem;
    font-size: .8rem;
  }
  .post-list .item .info .content {
    margin: 0;
    color: #333;
  }
  .post-list .item .info .content span.star img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
  .post-list .item .info .author {
    color: #333;
    font-size: .8rem;
    font-weight: bold;
  }
  .post-list .item .info span.regdate {
    color: #999;
    font-size: .7rem;
    font-weight: normal;
  }
  .post-list .item .info .content span.writer {
    color: #f78989;
    font-weight: bold;
  }
  .post-list .item .info .content span.tagUser {
    display: block;
    margin-right: .25rem;
    padding: 0 .5rem;
    background: #f78989;
    border-radius: 500rem;
    color: #FFF;
    font-size: .75rem;
    float: left;
  }
  .post-list .DropdownMenu {
    margin: .5rem .5rem 0;
    float: right !important;
  }
  .post-list .More {
    width: 1.6rem;
    height: 1.6rem;
    line-height: 1.5rem;
    background: #FFF;
    border: 1px solid #E5E5E5;
    border-radius: 500rem;
    text-align: center;
    font-size: .8rem;
    cursor: pointer;
  }
  .post-list .More:hover {
    border: 1px solid #CCC;
  }

  .Top {
    width: 100%;
    margin-top: .5rem;
    font-weight: bold;
  }
</style>