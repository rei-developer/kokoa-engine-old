<template>
  <div>
    <div v-if='postsCount > 0'>
      <div class='containerSubject marginTop'>
        <font-awesome-icon icon='comment-dots' />
        댓글 ({{ numberWithCommas(postsCount) }})
      </div>
      <div class='postList'>
        <div
          :ref='`post${item.id}`'
          v-for='(item, index) in posts' :key='index'>
          <div :class='"item" + (item.tagUserId ? " reply" : "") + (item.id == viewPostId ? " view" : "")'>
            <div class='reply' v-if='item.tagUserId'>
              <font-awesome-icon icon='chevron-right' />
            </div>
            <div class='image'>
              <img :src='item.profile ? "https://hawawa.co.kr/profile/" + item.profile : "/profile.png"'>
            </div>
            <div class='info'>
              <div class='author'>
                <span class='best' v-if='item.likes >= 1'>BEST</span>
                <img :src='item.admin > 0 ? "/admin.png" : "/user.png"'>
                {{ item.author }}
                <span class='regdate'>
                  <font-awesome-icon icon='clock' />
                  {{ item.created }}
                </span>
              </div>
              <div class='desciption'>
                <span class='tagUser' v-if='item.tagUserId'>{{ item.tagAuthor }}</span>
                <span :class='item.userId === topic.userId ? "writer" : ""' v-html='item.content' />
              </div>
            </div>
            <el-dropdown class='more' trigger='click' @command='handleCommand' v-if='$store.state.user.isLogged'>
              <span class='el-dropdown-link'>
                <font-awesome-icon icon='ellipsis-v' />
              </span>
              <el-dropdown-menu slot='dropdown'>
                <el-dropdown-item :command='["reply", item.id]'>댓글</el-dropdown-item>
                <el-dropdown-item :command='["remove", item.id]' v-if='item.userId === $store.state.user.id'>삭제</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class='postReplyWrite' v-if='item.id === tempPostReplyId'>
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
      class='newestPost'
      type='info'
      v-if='newPostsCount > 0'
      @click='getData'
      round>
      <font-awesome-icon class='fa-spin' icon='sync-alt' />
      새 댓글 불러오기 ({{ numberWithCommas(newPostsCount) }})
    </el-button>
    <div class='postBox'>
      <PostWrite
        :id='id'
        :topicUserId='topic.userId'
        :postUserId='null'
        :postRootId='null'
        :postParentId='null' />
    </div>
    <div class='marginVertical'>
      <el-pagination
        layout='prev, pager, next'
        :page-size='20'
        :total='postsCount'
        :current-page='postsPage'
        @current-change='currentChange' />
    </div>
  </div>
</template>

<script>
  import PostWrite from '~/components/post/write.vue'
  import axios from 'axios'

  export default {
    components: { PostWrite },
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
    watch: {
      '$store.state.forceUpdate': function() {
        this.getData()
      }
    },
    beforeMount() {
      this.$socket.on('newPost', () => {
        this.playSound('https://soundbible.com/mp3/Blop-Mark_DiAngelo-79054334.mp3')
        this.newPostsCount++
      })
    },
    mounted() {
      this.viewPostId = this.$route.query.postId
      this.getData()
    },
    methods: {
      getData: async function() {
        if (this.loading) return
        this.loading = true
        const { data } = await axios.post('/api/topic/list/post', { id: this.id, page: this.postsPage - 1 })
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message)
        }
        this.postsCount = data.count
        this.newPostsCount = 0
        this.tempPostReplyId = 0
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
      currentChange(page) {
        this.postsPage = page
        this.getData()
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
      playSound(sound) {
        if (!sound) return
        const audio = new Audio(sound)
        audio.play()
      },
      numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    }
  }
</script>

<style>
  /* Newest Post */
  .newestPost { margin-top: 1rem }

  /* Post Box */
  .postBox {
    margin-top: 1rem;
    padding: .5rem;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    background: rgba(255, 255, 255, .5);
  }
  .postReplyWrite {
    padding: .5rem;
    border-bottom: 1px solid #F5F5F5;
    background: rgba(255, 255, 255, .5);
  }

  /* Post List */
  .postList {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
  }
  .postList .item {
    display: flex;
    border-bottom: 1px solid #F5F5F5;
    background: rgba(255, 255, 255, .5);
  }
  .postList .item.view {
    border-left: .25rem solid #29313D;
  }
  .postList .item.view,
  .postList .item.reply {
    background: rgba(245, 245, 245, .5);
  }
  .postList .item .reply {
    display: flex;
    flex-direction: column;
    margin: 0 .25rem 0 .5rem;
    padding: .25rem;
    color: #CCC;
    justify-content: center;
    align-items: center;
  }
  .postList .item .image {
    display: flex;
    flex-direction: column;
    padding: .25rem;
  }
  .postList .item .image img {
    width: 3rem;
    height: 3rem;
    margin: .25rem;
    padding: 2px;
    border: 1px solid #CCC;
    border-radius: 500rem;
  }
  .postList .item .info {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: .25rem;
    padding-left: 0;
  }
  .postList .item .info .author {
    color: #333;
    font-size: .8rem;
    font-weight: bold;
  }
  .postList .item .info .author span.best {
    margin-right: .1rem;
    padding: 0 .25rem;
    background: #ED1C24;
    border-radius: .1rem;
    color: #FFF;
    font-size: .7rem;
  }
  .postList .item .info .author span.regdate {
    margin-left: .25rem;
    color: #999;
    font-size: .7rem;
    font-weight: normal;
  }
  .postList .item .info .desciption {
    color: #333;
    font-size: .8rem;
  }
  .postList .item .info .desciption span.writer {
    color: #4183C4;
    font-weight: bold;
  }
  .postList .item .info .desciption span.tagUser {
    margin-right: .1rem;
    padding: 0 .5rem;
    background: #29313D;
    border-radius: 500rem;
    color: #FFF;
    font-size: .75rem;
  }
  .postList .item .more {
    display: flex;
    flex-direction: column;
    width: 2rem;
    background: #F5F5F5;
    justify-content: center;
    align-items: center;
  }
  .postList .item .more:hover {
    background: #FAFAFA;
    cursor: pointer;
  }
</style>