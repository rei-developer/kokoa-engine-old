<template>
  <div>
    <div>
      <el-row>
        <el-col :xl='4' hidden-lg-and-down>
          <div class='grid-content' />
        </el-col>
        <el-col :xl='16'>
          <el-row>
            <el-col :xl='19'>
              <div class='AD' v-if='domain !== "anime"'>
                <adsbygoogle ad-slot='1882412178' />
              </div>
              <nuxt-link :to='`/b/${domain}`'>
                <el-button type='info' size='small'>목록</el-button>
              </nuxt-link>
              <nuxt-link :to='`/b/${domain}/write`' v-if='$store.state.user.isLogged && domain !== "all" && domain !== "best"'>
                <el-button class='floatRight' type='primary' size='small'>
                  <font-awesome-icon icon='pencil-alt' />
                  글 작성
                </el-button>
              </nuxt-link>
              <div class='Blank' />
              <div class='topicArticle'>
                <div class='header'>
                  <div class='image'>
                    <img :src='topic.profile ? "https://hawawa.co.kr/profile/" + topic.profile : "/profile.png"'>
                  </div>
                  <div class='info'>
                    <div class='subject'>
                      <span class='star' v-if='topic.isBest > 0'>
                        <img :src='topic.isBest > 1 ? "/star.svg" : "/burn.svg"'>
                      </span>
                      <span class='notice' v-if='topic.isNotice > 0'>NOTICE</span>
                      {{ topic.title }}
                    </div>
                    <div class='author'>
                      <img :src='topic.admin > 0 ? "/admin.png" : "/user.png"'>
                      {{ topic.author }}
                    </div>
                    <div class='detail'>
                      <span>
                        <font-awesome-icon icon='clock' />
                        {{ $moment(topic.created).fromNow() }}
                      </span>
                      <span v-if='topic.hits > 0'>
                        <font-awesome-icon icon='eye' />
                        {{ numberWithCommas(topic.hits) }}
                      </span>
                      <span v-if='topic.likes > 0'>
                        <font-awesome-icon icon='star' />
                        +{{ numberWithCommas(topic.likes) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class='content'>
                  <span v-html='topic.content' />
                  <div class='event'>
                    <el-button-group>
                      <el-button type='primary' size='small' round @click='votes(true)'>
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
                <el-button class='floatRight' type='primary' size='small'>
                  <font-awesome-icon icon='pencil-alt' />
                  글 작성
                </el-button>
              </nuxt-link>
              <TopicList class='marginTop' :id='id' />
            </el-col>
            <el-col class='subMenu hidden-mobile' :xl='5' hidden-xl-only>
              <Recent :domain='domain' />
            </el-col>
          </el-row>
        </el-col>
        <el-col :xl='4' hidden-lg-and-down>
          <div class='grid-content' />
        </el-col>
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
    components: {
      TopicList,
      PostList,
      Recent
    },
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
        { headers: { 'x-access-token': token } }
      )
      if (data.status === 'fail') return alert(data.message)
      if (store.state.user.isLogged) store.commit('user/setNoticeCount', data.count)
      return { domain, id, topic: data.topic }
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
        data.move === 'BEST' ? this.$message.success('인기글로 보냈습니다.') : this.$message('투표했습니다.')
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
      scrollToBottom() {
        this.$nextTick(() => {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
        })
      },
      numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    },
    head() {
      return {
        title: `${this.topic.title} - 하와와`
      }
    }
  }
</script>

<style>
  .topicArticle {
    display: flex;
    margin-top: 1rem;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    flex-direction: column;
  }
  .topicArticle .header {
    display: flex;
    padding: .5rem;
    border-bottom: 1px solid #F5F5F5;
  }
  .topicArticle .header .image {
    display: flex;
    margin-right: 1rem;
    flex-direction: column;
  }
  .topicArticle .header .image img {
    width: 4.5rem;
    height: 4.5rem;
    padding: 2px;
    border-radius: 500rem;
    box-shadow: 1px 1px 5px rgba(247, 137, 137, 0.6);
  }
  .topicArticle .header .info {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: .25rem;
    padding-left: 0;
  }
  .topicArticle .header .info .subject {
    color: #29313D;
    font-size: 1rem;
    font-weight: bold;
  }
  .topicArticle .header .info .subject span.star img {
    width: 16px;
    height: 16px;
  }
  .topicArticle .header .info .subject span.notice {
    margin-right: .1rem;
    padding: 0 .25rem;
    background: #ED1C24;
    border-radius: .1rem;
    color: #FFF;
    font-size: .8rem;
  }
  .topicArticle .header .info .author {
    color: #333;
    font-size: .8rem;
    font-weight: bold;
  }
  .topicArticle .header .info .detail span {
    margin-right: .25rem;
    color: #999;
    font-size: .7rem;
    font-weight: normal;
  }
  .topicArticle .content {
    padding: 1rem;
  }
  .topicArticle .content img {
    max-width: 100%;
    height: auto;
  }
  .topicArticle .content ifram {
    max-width: calc(100vw - 1rem);
    height: 40vh;
    border: 0;
  }
  .topicArticle .content .event {
    width: 300px;
    margin: 2rem auto .5rem;
    text-align: center;
  }
</style>