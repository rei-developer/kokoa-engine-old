<template>
  <div>
    <div>
      <el-row :gutter='0'>
        <el-col :xl='4' hidden-lg-and-down><div class='grid-content'></div></el-col>
        <el-col :xl='16'>
          <el-row>
            <el-col :xl='19'>
              <div class='AD'>
                <adsbygoogle ad-slot='1882412178' />
              </div>
              <nuxt-link :to='`/b/${domain}`'>
                <el-button type='info' size='small'>목록</el-button>
              </nuxt-link>
              <nuxt-link :to='`/b/${domain}/write`' v-if='$store.state.user.isLogged && domain !== "all" && domain !== "best"'>
                <el-button class='Right' type='danger' size='small'>
                  <font-awesome-icon icon='pencil-alt' />
                  글 작성
                </el-button>
              </nuxt-link>
              <div class='Blank' />
              <div class='article-header'>
                <div class='item'>
                  <div class='grade'>
                    <font-awesome-icon icon='arrow-up' />
                    {{ topic.likes }}
                    <el-button type='danger' size='mini' round @click='votes(true)'><font-awesome-icon icon='seedling' /></el-button>
                  </div>
                  <div class='image'>
                    <img :src='topic.profile ? "https://hawawa.co.kr/profile/" + topic.profile : "/profile.png"'>
                  </div>
                  <div class='info'>
                    <div class='subject'>
                      <span class='star' v-if='topic.isBest > 0'>
                        <img :src='topic.isBest > 1 ? "/star.svg" : "/burn.svg"'>
                      </span>
                      {{ topic.title }}
                    </div>
                    <div class='author'>
                      <img :src='topic.admin > 0 ? "/admin.png" : "/user.png"'>
                      {{ topic.author }}
                    </div>
                    <div class='regdate'>{{ $moment(topic.created).fromNow() }} | 조회 {{ numberWithCommas(topic.hits) }}</div>
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
              <PostList :id='id' :topic='topic' />
              <nuxt-link :to='`/b/${domain}`'>
                <el-button type='info' size='small'>목록</el-button>
              </nuxt-link>
              <el-button
                type='info'
                size='small'
                @click='remove'
                v-if='$store.state.user.isLogged && ($store.state.user.isAdmin > 0 || topic.userId === $store.state.user.id)'>
                삭제
              </el-button>
              <nuxt-link :to='`/b/${domain}/write`' v-if='$store.state.user.isLogged && domain !== "all" && domain !== "best"'>
                <el-button class='Right' type='danger' size='small'>
                  <font-awesome-icon icon='pencil-alt' />
                  글 작성
                </el-button>
              </nuxt-link>
              <div class='Blank' />
              <div class='Blank' />
              <TopicList :id='id' />
            </el-col>
            <el-col class='subMenu hidden-mobile' :xl='5' hidden-xl-only>
              <Recent />
              <adsbygoogle />
            </el-col>
          </el-row>
        </el-col>
        <el-col :xl='4' hidden-lg-and-down><div class='grid-content'></div></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import TopicList from '~/components/topic/list.vue'
  import PostList from '~/components/post/list.vue'
  import Recent from '~/components/recent.vue'
  import axios from 'axios'
  
  export default {
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
        loading: true
      }
    },
    async asyncData ({ app, params, store }) {
      const domain = params.domain
      const id = params.id
      const token = store.state.user.isLogged ? store.state.user.token : ''
      const { data } = await axios.get(
        `/api/topic/read/${id}`,
        {
          headers: { 'x-access-token': token }
        }
      )
      if (data.status === 'fail') return alert(data.message)
      if (store.state.user.isLogged) store.commit('setNoticeCount', data.count)
      return { domain, id, topic: data.topic }
    },
    methods: {
      votes: async function(flag) {
        if (this.id < 1) return
        if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
        const token = this.$store.state.user.token
        this.$store.commit('setLoading', true)
        const { data } = await axios.post(
          '/api/topic/vote',
          { id: this.id, likes: flag },
          { headers: { 'x-access-token': token } }
        )
        if (data.status === 'fail') {
          this.$store.commit('setLoading')
          return this.$message.error(data.message)
        }
        if (data.move === 'BEST') this.$message.success('베스트로 보냈습니다.')
        this.$message('투표했습니다.')
        this.$store.commit('setLoading')
      },
      remove: async function() {
        if (this.id < 1) return
        if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
        const token = this.$store.state.user.token
        this.$confirm('정말로 삭제하시겠습니까?', '알림', {
          confirmButtonText: '삭제',
          cancelButtonText: '취소'
        }).then(async function() {
          this.$store.commit('setLoading', true)
          const { data } = await axios.delete(
            '/api/topic/delete',
            {
              data: { id: this.id },
              headers: { 'x-access-token': token }
            }
          )
          if (data.status === 'fail') {
            this.$store.commit('setLoading')
            return this.$message.error(data.message)
          }
          this.$router.go(-1)
        })
      },
      numberWithCommas: x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      scrollToBottom() {
        this.$nextTick(() => {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
        })
      }
    },
    beforeMount() {
      this.$socket.emit('join', this.id)
      this.$socket.on('vote', data => {
        this.topic.likes = data.likes
        this.topic.hates = data.hates
      })
    },
    beforeDestroy() {
      this.$socket.emit('leave', this.id)
      this.$socket.removeAllListeners()
    },
    components: {
      TopicList,
      PostList,
      Recent
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
  }
  .article-header .item .image {
    display: inline-block;
    width: 4.5rem;
    margin-top: .5rem;
    margin-left: 4.5rem;
    padding: 2px;
    box-shadow: 1px 1px 5px rgba(247, 137, 137, 0.6);
    border-radius: 500rem;
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
    vertical-align: top;
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
    height: 40vh;
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
</style>