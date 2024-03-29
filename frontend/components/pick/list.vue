<template>
  <div>
    <div v-if='postsCount > 0'>
      <div class='containerSubject marginTop'>
        <font-awesome-icon icon='comment-dots' />
        댓글 ({{ numberWithCommas(postsCount) }})
      </div>
      <div class='pickPostList'>
        <div
          :ref='`post${item.id}`'
          v-for='(item, index) in posts' :key='index'>
          <div :class='"item" + (item.tagUserId ? " reply" : "") + (item.id == viewPostId ? " view" : "")'>
            <div class='reply' v-if='item.tagUserId'>
              <font-awesome-icon icon='chevron-right' />
            </div>
            <div class='image'>
              <img :src='item.profile ? "https://idolboard.com/profile/" + item.profile : "/profile.png"'>
            </div>
            <div class='info'>
              <div class='author'>
                <img :src='`/level/${item.level}.png`'>
                <img class='icon' :src='`https://idolboard.com/icon/${item.icon}`' v-if='item.icon !== ""'>
                <span class='userTitle' v-if='item.userTitle'>{{ item.userTitle }}</span>
                {{ item.author }}
                <span class='event'>
                  <font-awesome-icon icon='history' />
                  {{ $moment(item.updated).fromNow() }}
                </span>
                <span class='event' v-if='item.hates > 0'>
                  <font-awesome-icon icon='heart-broken' />
                  -{{ numberWithCommas(item.hates) }}
                </span>
              </div>
              <div class='desciption'>
                <span class='tagUser' v-if='item.tagUserId'>
                  <font-awesome-icon icon='at' />
                  {{ item.tagAuthor }}
                </span>
                <div class='sticker' v-if='item.stickerId > 0'>
                  <img :src='`https://idolboard.com/sticker/${item.stickerId}/${item.stickerSelect}`'>
                </div>
                <span :class='item.userId === pick.userId ? "writer" : ""' v-html='item.content' />
              </div>
            </div>
            <el-dropdown class='more' trigger='click' @command='handleCommand' v-if='$store.state.user.isLogged'>
              <span class='el-dropdown-link'>
                <font-awesome-icon icon='ellipsis-h' />
              </span>
              <el-dropdown-menu slot='dropdown'>
                <el-dropdown-item :command='["reply", item.id]'>댓글</el-dropdown-item>
                <el-dropdown-item :command='["update", item]' v-if='$store.state.user.isAdmin > 0 || item.userId === $store.state.user.id'>수정</el-dropdown-item>
                <el-dropdown-item :command='["remove", item.id]' v-if='$store.state.user.isAdmin > 0 || item.userId === $store.state.user.id'>삭제</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class='postReplyWrite' v-if='item.id === tempPostReplyId'>
            <PickPostWrite
              :id='id'
              :pureContent='""'
              :author='item.author'
              :pickUserId='pick.userId'
              :postUserId='item.userId'
              :postRootId='item.postRootId || item.id'
              :postParentId='item.id' />
          </div>
          <div class='postUpdate' v-if='item.id === tempPostUpdateId'>
            <PickPostWrite
              :id='item.id'
              :edit='true'
              :pureContent='item.content.replace(/<br>+/g, "\n")' />
          </div>
        </div>
      </div>
    </div>
    <div class='postBox'>
      <PickPostWrite
        :id='id'
        :pureContent='""'
        :pickUserId='pick.userId' />
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
  import PickPostWrite from '~/components/pick/write.vue'
  
  export default {
    components: { PickPostWrite },
    props: ['id', 'pick'],
    data() {
      return {
        posts: [],
        postsCount: 0,
        postsPage: 1,
        newPostsCount: 0,
        viewPostId: 0,
        tempPostReplyId: 0,
        tempPostUpdateId: 0,
        loading: false
      }
    },
    watch: {
      '$store.state.forceUpdate': function() {
        this.getData()
      }
    },
    mounted() {
      this.viewPostId = this.$route.query.postId
      this.getData()
    },
    methods: {
      getData: async function() {
        if (this.loading) return
        this.loading = true
        const data = await this.$axios.$post('/api/pick/list/post', { id: this.id, page: this.postsPage - 1 })
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message || '오류가 발생했습니다.')
        }
        this.postsCount = data.count
        this.newPostsCount = 0
        this.tempPostReplyId = 0
        this.tempPostUpdateId = 0
        const regex = /(((http(s)?:\/\/)\S+(\.[^(\n|\t|\s,)]+)+)|((http(s)?:\/\/)?(([a-zA-z\-_]+[0-9]*)|([0-9]*[a-zA-z\-_]+)){2,}(\.[^(\n|\t|\s,)]+)+))+/gi
        if (data.posts) {
          this.posts = data.posts.map(item => {
            item.content = item.content.replace(regex, '<a href="$&" target="_blank">$&</a>')
            return item
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
          case 'update':
            this.update(command[1])
            break
          case 'remove':
            this.removeHandler(command[1])
            break
        }
      },
      reply(id) {
        this.tempPostReplyId = id
        this.tempPostUpdateId = 0
      },
      update(item) {
        if (item.id < 1) return
        if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
        this.tempPostReplyId = 0
        this.tempPostUpdateId = item.id
      },
      removeHandler: async function(id) {
        if (id < 1) return
        this.$confirm('정말로 삭제하시겠습니까?', '알림', {
          confirmButtonText: '삭제',
          cancelButtonText: '취소'
        }).then(() => {
          this.remove(id)
        })
      },
      remove: async function(id) {
        if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
        const token = this.$store.state.user.token
        this.$store.commit('setLoading', true)
        const data = await this.$axios.$delete(
          '/api/pick/delete/post',
          {
            data: { id, page: this.postsPage },
            headers: { 'x-access-token': token }
          }
        )
        if (data.status === 'fail') return this.$message.error(data.message || '오류가 발생했습니다.')
        this.posts = this.posts.filter(post => post.id !== id)
        --this.postsCount
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
    border: 1px solid #EEE;
    background: #FFF;
  }
  .postReplyWrite,
  .postUpdate {
    padding: .5rem;
    border-bottom: 1px solid #EEE;
    background: #FFF;
  }

  /* Post List */
  .pickPostList {
    display: flex;
    margin-top: 1rem;
    border: 1px solid #EEE;
    flex-direction: column;
  }
  .pickPostList .item {
    display: flex;
    border-bottom: 1px solid #EEE;
    background: #FFF;
  }
  .pickPostList .item.view {
    border-left: .25rem solid #3D5AFE;
  }
  .pickPostList .item.view,
  .pickPostList .item.reply {
    background: #FBFBFB;
  }
  .pickPostList .item .reply {
    display: flex;
    flex-direction: column;
    margin-left: .5rem;
    padding: .25rem;
    color: #CCC;
    justify-content: center;
    align-items: center;
  }
  .pickPostList .item .image {
    display: flex;
    flex-direction: column;
    padding: .25rem;
    justify-content: center;
    align-items: center;
  }
  .pickPostList .item .image img {
    width: 3rem;
    height: 3rem;
    margin: .25rem;
    padding: 2px;
    border: 1px solid #CCC;
    border-radius: 500rem;
  }
  .pickPostList .item .info {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: .25rem;
    padding-left: 0;
  }
  .pickPostList .item .info .author {
    color: #333;
    font-size: .8rem;
    font-weight: bold;
  }
  .pickPostList .item .info .author span.best {
    margin-right: .1rem;
    padding: 0 .25rem;
    background: #ED1C24;
    border-radius: .1rem;
    color: #FFF;
    font-size: .7rem;
  }
  .pickPostList .item .info .author img.icon {
    width: 23px;
    height: 23px;
    vertical-align: text-top;
  }
  .pickPostList .item .info .author span.userTitle {
    padding: 0 .25rem;
    background: #3D5AFE;
    border-radius: .25rem;
    color: #FFF;
    font-size: .7rem;
  }
  .pickPostList .item .info .author span.event {
    margin-left: .25rem;
    color: #999;
    font-size: .7rem;
    font-weight: normal;
  }
  .pickPostList .item .info .desciption {
    color: #333;
    font-size: .8rem;
  }
  .pickPostList .item .info .desciption .sticker img {
    width: 100px;
    height: 100px;
    border-radius: .25rem;
  }
  .pickPostList .item .info .desciption span.writer {
    color: rgba(61, 90, 254, .5);
    font-weight: bold;
  }
  .pickPostList .item .info .desciption span.tagUser {
    margin-right: .25rem;
    padding: 0 .5rem;
    background: #3D5AFE;
    border-radius: 500rem;
    color: #FFF;
    font-size: .75rem;
  }
  .pickPostList .item .more {
    display: flex;
    flex-direction: column;
    width: 2rem;
    background: #F5F5F5;
    justify-content: center;
    align-items: center;
  }
  .pickPostList .item .more:hover {
    background: #FAFAFA;
    cursor: pointer;
  }
</style>