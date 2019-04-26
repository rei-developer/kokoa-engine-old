<template>
  <div>
    <Loading v-if='loading' />
    <Header />
    <div class='Container'>
      <el-row :gutter='0'>
        <el-col :xl='4' hidden-lg-and-down><div class='grid-content'></div></el-col>
        <el-col :xl='16'>
          <el-row :gutter='20'>
            <el-col :xl='19'>
              <el-button type='info' size='small' @click='list'>목록</el-button>
              <el-button class='Right' type='danger' size='small' @click='write'>
                <font-awesome-icon icon='pencil-alt' />
                글 작성
              </el-button>
              <div class='Blank' />
              <div class='article-header'>
                <div class='item'>
                  <div class='grade'>
                    <font-awesome-icon icon='arrow-up' />
                    {{ topic.likes }}
                    <el-button type='danger' size='mini' round @click='votes(true)'><font-awesome-icon icon='seedling' /></el-button>
                  </div>
                  <div class='image'>
                    <img :src='topic.profile ? "https://hawawa.co.kr/img/" + topic.profile : "/default.png"'>
                  </div>
                  <div class='info'>
                    <div class='subject'>
                      <span class='star' v-if='topic.isBest > 0'>
                        <img :src='topic.isBest > 1 ? "/star.svg" : "/burn.svg"'>
                      </span>
                      {{ topic.title }}
                      <span v-if='postsCount > 0'>[{{ postsCount }}]</span>
                    </div>
                    <div class='author'>
                      <img :src='topic.admin > 0 ? "/admin.png" : "/user.png"'>
                      {{ topic.author }}
                    </div>
                    <div class='regdate'>{{ topic.created }} | 조회 {{ topic.hits }}</div>
                  </div>
                </div>
              </div>
              <div class='article'>
                <span v-html='topic.content' />
                <div class='ArticleMenu'>
                  <el-button-group>
                    <el-button type='danger' size='small' round @click='votes(true)'>
                      <img src='/up.png'>
                      데뷔 {{ topic.likes }}
                    </el-button>
                    <el-button type='info' size='small' round @click='votes(false)'>
                      탈락 {{ topic.hates }}
                      <img src='/down.png'>
                    </el-button>
                  </el-button-group>
                </div>
              </div>
              <div v-if='postsCount > 0'>
                <div class='comment-list'>
                  <div
                    :class='item.tagUserId ? "item reply" : "item"'
                    v-for='(item, index) in posts' :key='index'>
                    <div class='reply' v-if='item.tagUserId'>
                      <font-awesome-icon icon='chevron-right' />
                    </div>
                    <div class='image'>
                      <img :src='item.profile ? "https://hawawa.co.kr/img/" + item.profile : "/default.png"'>
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
                  </div>
                </div>
                <div class='Blank' />
                <el-pagination
                  layout='prev, pager, next'
                  :page-size='20'
                  :total='postsCount'
                  :current-page='postsPage'
                  @current-change='currentChange' />
              </div>
              <div class='Blank' />
              <el-button-group>
                <el-button type='info' size='small' @click='list'>목록</el-button>
                <el-button type='info' size='small' @click='remove'>삭제</el-button>
              </el-button-group>
              <el-button class='Right' type='danger' size='small' @click='write'>
                <font-awesome-icon icon='pencil-alt' />
                글 작성
              </el-button>
              <div class='Blank' />
            </el-col>
            <el-col :xl='5' hidden-xl-only>
              <Recent />
            </el-col>
          </el-row>
        </el-col>
        <el-col :xl='4' hidden-lg-and-down><div class='grid-content'></div></el-col>
      </el-row>
    </div>
    <Footer />
  </div>
</template>

<script>
  import Header from '~/components/header.vue'
  import Recent from '~/components/recent.vue'
  import Footer from '~/components/footer.vue'
  import Loading from '~/components/loading.vue'
  import axios from 'axios'
  
  export default {
    name: 'App',
    extends: {},
    data() {
      return {
        domain: '',
        id: 0,
        topic: {
          userId: 0,
          boardDomain: '',
          originBoardDomain: '',
          category: '',
          author: '',
          title: '',
          content: '',
          ip: '',
          header: '',
          created: '',
          updated: '',
          hits: 0,
          likes: 0,
          hates: 0,
          isImage: false,
          isBest: false,
          isNotice: false,
          profile: '',
          admin: 0
        },
        posts: [],
        postsCount: 0,
        postsPage: 1,
        loading: false
      }
    },
    methods: {
      getTopic: async function() {
        if (this.loading) return
        this.loading = true
        const token = localStorage.token
        const { data } = await axios.get(
          `/api/topic/read/${this.id}`,
          {
            headers: { 'x-access-token': token }
          }
        )
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message)
        }
        window.scrollTo(0, 0)
        this.topic = data.topic
        this.topic.created = this.$moment(this.topic.created).fromNow()
        this.loading = false
        this.getPosts()
      },
      getPosts: async function() {
        if (this.loading) return
        this.loading = true
        const { data } = await axios.post('/api/topic/list/post', { id: this.id, page: this.postsPage - 1 })
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message)
        }
        this.postsCount = data.count
        if (data.posts) {
          this.posts = data.posts.map(i => {
            i.created = this.$moment(i.created).fromNow()
            return i
          })
        }
        this.loading = false
      },
      currentChange: function(page) {
        this.postsPage = page
        this.getPosts()
      },
      votes: async function(flag) {
        if (this.loading || this.id < 1) return
        const token = localStorage.token
        if (!token) return this.$message.error('로그인하세요.')
        this.loading = true
        const { data } = await axios.post(
          '/api/topic/vote',
          { id: this.id, likes: flag },
          { headers: { 'x-access-token': token } }
        )
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message)
        }
        if (data.move === 'BEST') this.$message.success('베스트로 보냈습니다.')
        this.$message('투표했습니다.')
        this.loading = false
      },
      list() {
        location.href = `/b/${this.domain}`
      },
      remove: async function() {
        if (this.loading || this.id < 1) return
        const token = localStorage.token
        if (!token) return this.$message.error('로그인하세요.')
        this.loading = true
        const { data } = await axios.delete(
          '/api/topic/delete',
          {
            data: { id: this.id },
            headers: { 'x-access-token': token }
          }
        )
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message)
        }
        this.loading = false
        this.$router.go(-1)
      },
      write() {
        location.href = `/b/${this.domain}/write`
      }
    },
    created() {
      this.domain = this.$nuxt._route.params.domain
      this.id = this.$nuxt._route.params.id
      this.getTopic()
    },
    components: {
      Header,
      Recent,
      Footer,
      Loading
    }
  }
</script>

<style>
  .Container {
    
  }

  .AD {
    width: 960px;
    margin: 0 auto;
    margin-bottom: 1rem;
  }
  .AD img {
    width: 960px;
    height: auto;
  }

  .header-menu {
    margin-bottom: 1rem;
  }

  .grid-content {
    min-height: 0.02px;
  }

  .widget-title {
    display: block;
    color: #202020;
    font-size: 20px;
    line-height: 40px;
  }

  .article-header {
    line-height: 1.8;
  }
  .article-header .item {
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 1rem;
    float: left;
    width: 100%;
    min-height: 5rem;
  }
  .article-header .item .grade {
    display: inline-block;
    position: absolute;
    width: 4rem;
    height: 5.5rem;
    background: #F5F5F5;
    padding: .5rem;
    font-size: .8rem;
    font-weight: bold;
    text-align: center;
    float: left;
  }
  .article-header .item .image {
    display: inline-block;
    width: 4.5rem;
    margin-top: .5rem;
    margin-left: 4.5rem;
    padding: 2px;
    box-shadow: 1px 1px 5px rgba(247, 137, 137, 0.6);
    border-radius: 500rem;
    float: left;
  }
  .article-header .item .image img {
    width: calc(4.5rem - 4px);
    height: calc(4.5rem - 4px);
    border-radius: 500rem;
  }
  .article-header .item .info {
    display: inline-block;
    padding: .5rem;
    font-size: .8rem;
    float: left;
  }
  .article-header .item .info .subject {
    color: #f78989;
    font-size: 1rem;
    font-weight: bold;
  }
  .article-header .item .info .subject span.star img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
  .article-header .item .info .author {
    color: #333;
    font-size: .8rem;
    font-weight: bold;
  }
  .article-header .item .info .regdate {
    color: #999;
    font-size: .7rem;
  }

  .article {
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    width: 100%;
    margin-top: 6rem;
    padding: .5rem;
    background: #FFF;
  }
  .article img {
    max-width: 100%;
    height: auto;
  }
  .article iframe {
    max-width: calc(100vw - 1rem);
    border: 0;
  }

  .ArticleMenu {
    width: 180px;
    margin: 2rem auto .5rem;
  }

  .Blank {
    height: .5rem;
    clear: both;
  }

  .Right {
    float: right;
  }

  .comment-list {
    min-height: 5rem;
    margin: 1rem 0;
  }
  .comment-list .item {
    width: 100%;
    margin-bottom: .4rem;
    background: #FFF;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    float: left;
  }
  .comment-list .item.reply {
    background: #FAFAFA;
    padding-left: 1rem;
  }
  .comment-list .item .reply {
    position: absolute;
    margin-top: 1.25rem;
    margin-left: -.5rem;
    color: #f78989;
  }
  .comment-list .item .image {
    display: inline-block;
    width: 3rem;
    margin: .5rem;
    margin-right: 0;
    padding: 2px;
    border: 1px solid #DDD;
    border-radius: 500rem;
    float: left;
  }
  .comment-list .item .image img {
    width: calc(3rem - 6px);
    height: calc(3rem - 6px);
    border-radius: 500rem;
  }
  .comment-list .item .info {
    display: inline-block;
    padding: .5rem;
    font-size: .8rem;
    float: left;
  }
  .comment-list .item .info .content {
    margin: 0;
    color: #333;
  }
  .comment-list .item .info .content span.star img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
  .comment-list .item .info .author {
    color: #333;
    font-size: .8rem;
    font-weight: bold;
  }
  .comment-list .item .info span.regdate {
    color: #999;
    font-size: .7rem;
    font-weight: normal;
  }
  .comment-list .item .info .content span.writer {
    color: #f78989;
    font-weight: bold;
  }
  .comment-list .item .info .content span.tagUser {
    display: block;
    margin-right: .25rem;
    padding: 0 .5rem;
    background: #f78989;
    border-radius: 500rem;
    color: #FFF;
    font-size: .75rem;
    float: left;
  }
</style>