<template>
  <div>
    <div class='AD hidden-mobile'>
      <iframe src='/ad.html' />
    </div>
    <div class='AD hidden-desktop'>
      <iframe src='/ad-mobile.html' />
    </div>
    <div>
      <nuxt-link :to='`/b/${domain}`'>
        <el-button type='info' size='small' @click='forceUpdate'>목록</el-button>
      </nuxt-link>
      <nuxt-link :to='`/b/${domain}/write`' v-if='$store.state.user.isLogged && domain !== "all" && domain !== "best"'>
        <el-button class='floatRight' type='primary' size='small'>
          <font-awesome-icon icon='pencil-alt' />
          글 작성
        </el-button>
      </nuxt-link>
    </div>
    <div class='containerSubject marginTop'>
      <font-awesome-icon icon='pencil-alt' />
      {{ getBoardName(domain) }} ({{ numberWithCommas(topicsCount) }})
    </div>
    <div class='topicList'>
      <div
        :class='id == item.id ? "item view" : "item odd"'
        v-for='item in notices' :key='item.id'>
        <div class='image' @click='move(item)'>
          <img :src='item.imageUrl ? "https://hawawa.co.kr/img/thumb/" + item.imageUrl : "/default.png"'>
        </div>
        <div class='info' @click='move(item)'>
          <div class='subject'>
            <span class='board' v-if='domain === "all" || domain === "best"'>{{ getBoardName(item.boardDomain) }}</span>
            <span class='star' v-if='item.isBest > 0'>
              <img :src='item.isBest > 1 ? "/star.svg" : "/burn.svg"'>
            </span>
            <span class='view'>
              <span class='notice'>NOTICE</span>
              <span class='category' v-if='item.category !== ""'>{{ item.category }}</span>
              {{ item.title }}
              <span class='newest' v-if='$moment().diff($moment(item.created), "days") <= 1'>NEW</span>
              <span class='posts' v-if='item.postsCount > 0'>{{ item.postsCount }}</span>
              <span class='image' v-if='item.isImage > 0'>
                <font-awesome-icon icon='image' />
              </span>
            </span>
          </div>
          <div class='author'>
            <img :src='item.admin > 0 ? "/admin.png" : "/user.png"'>
            {{ item.author }}
            <span>
              <font-awesome-icon icon='clock' />
              {{ $moment(item.created).format('YYYY/MM/DD HH:mm:ss') }}
            </span>
            <span v-if='item.hits > 0'>
              <font-awesome-icon icon='eye' />
              {{ numberWithCommas(item.hits) }}
            </span>
            <span v-if='item.likes > 0'>
              <font-awesome-icon icon='star' />
              +{{ numberWithCommas(item.likes) }}
            </span>
          </div>
        </div>
        <div class='unlock' @click='unlock(item.id)' v-if='$store.state.user.isAdmin > 0'>
          <font-awesome-icon icon='unlock-alt' />
        </div>
      </div>
      <div
        :class='id == item.id ? "item view" : (index % 2 === 0 ? "item" : "item odd")'
        v-for='(item, index) in topics' :key='index'>
        <div class='image' @click='move(item)'>
          <img :src='item.imageUrl ? "https://hawawa.co.kr/img/thumb/" + item.imageUrl : "/default.png"'>
        </div>
        <div class='info' @click='move(item)'>
          <div class='subject'>
            <span class='board' v-if='domain === "all" || domain === "best"'>{{ getBoardName(item.boardDomain) }}</span>
            <span class='star' v-if='item.isBest > 0'>
              <img :src='item.isBest > 1 ? "/star.svg" : "/burn.svg"'>
            </span>
            <span :class='id == item.id ? "view" : ""'>
              <span class='category' v-if='item.category !== ""'>{{ item.category }}</span>
              {{ item.title }}
              <span class='newest' v-if='$moment().diff($moment(item.created), "days") <= 1'>NEW</span>
              <span class='posts' v-if='item.postsCount > 0'>{{ item.postsCount }}</span>
              <span v-if='item.isImage > 0'>
                <font-awesome-icon icon='image' />
              </span>
            </span>
          </div>
          <div class='author'>
            <img :src='item.admin > 0 ? "/admin.png" : "/user.png"'>
            {{ item.author }}
            <span>
              <font-awesome-icon icon='clock' />
              {{ $moment(item.created).format('YYYY/MM/DD HH:mm:ss') }}
            </span>
            <span v-if='item.hits > 0'>
              <font-awesome-icon icon='eye' />
              {{ numberWithCommas(item.hits) }}
            </span>
            <span v-if='item.likes > 0'>
              <font-awesome-icon icon='star' />
              +{{ numberWithCommas(item.likes) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      class='marginVertical'
      layout='prev, pager, next'
      :page-size='20'
      :total='topicsCount'
      :current-page='page'
      @current-change='currentChange' />
    <div class='marginBottom'>
      <nuxt-link :to='`/b/${domain}`'>
        <el-button type='info' size='small' @click='forceUpdate'>목록</el-button>
      </nuxt-link>
      <nuxt-link :to='`/b/${domain}/write`' v-if='$store.state.user.isLogged && domain !== "all" && domain !== "best"'>
        <el-button class='floatRight' type='primary' size='small'>
          <font-awesome-icon icon='pencil-alt' />
          글 작성
        </el-button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  
  export default {
    props: ['id'],
    data() {
      return {
        domain: '',
        boardName: '',
        notices: [],
        topics: [],
        topicsCount: 0,
        page: 0
      }
    },
    watch: {
      '$store.state.forceUpdate': function() {
        this.getData(true)
      }
    },
    mounted() {
      this.domain = this.$route.params.domain
      this.page = this.$route.query.page ? this.$route.query.page - 1 : 0
      this.getData()
    },
    methods: {
      getBoardName(domain) {
        let boardName = ''
        switch (domain) {
          case 'all':
            boardName = '전체'
            break
          case 'best':
            boardName = '인기'
            break
          case 'girl':
            boardName = '연예'
            break
          case 'anime':
            boardName = '애니'
            break
          case 'talk':
            boardName = '토크'
            break
          case 'social':
            boardName = '정치'
            break
          case 'feedback':
            boardName = '건의'
            break
          case 'notice':
            boardName = '공지'
            break
        }
        return boardName
      },
      getData: async function(forceUpdate = false) {
        this.$store.commit('setLoading', true)
        if (forceUpdate) this.page = 0
        const { data } = await axios.post('/api/topic/list', { domain: this.domain, page: this.page++ })
        this.notices = []
        if (data.notices) this.notices = data.notices
        this.topics = data.topics
        this.topicsCount = data.count
        this.$store.commit('setLoading')
        return data
      },
      unlock: async function(id) {
        if (this.$store.state.user.admin < 1) return
        const token = this.$store.state.user.token
        this.$store.commit('setLoading', true)
        const { data } = await axios.patch(
          '/api/topic/edit/notice',
          { id },
          { headers: { 'x-access-token': token } }
        )
        if (data.status === 'fail') {
          this.$store.commit('setLoading')
          return this.$message.error(data.message)
        }
        this.$message.success('공지사항을 해제했습니다.')
        this.forceUpdate()
        this.$store.commit('setLoading')
      },
      move(item) {
        this.$router.push({ path: `/b/${this.domain}/${item.id}?page=${this.page}` })
      },
      currentChange(page) {
        this.page = page - 1
        this.getData()
      },
      forceUpdate() {
        this.$store.commit('forceUpdate')
      },
      numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    }
  }
</script>

<style>
  .topicList {
    display: flex;
    flex-direction: column;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
  }
  .topicList .item {
    display: flex;
    border-bottom: 1px solid #F5F5F5;
    background: rgba(255, 255, 255, .5);
  }
  .topicList .item:hover {
    background: rgba(245, 245, 245, .5);
    cursor: pointer;
  }
  .topicList .item.odd,
  .topicList .item.view { background: rgba(245, 245, 245, .5) }
  .topicList .item.view { border-left: .25rem solid #29313D }
  .topicList .item .image {
    display: flex;
    flex-direction: column;
  }
  .topicList .item .image img {
    width: 3.5rem;
    height: 3.5rem;
    margin: .25rem;
    padding: 2px;
    border: 1px solid #CCC;
    border-radius: .25rem;
    background: #FFF;
  }
  .topicList .item .info {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: .25rem;
    padding-left: 0;
  }
  .topicList .item .info .subject {
    color: #333;
    font-size: .8rem;
  }
  .topicList .item .info .subject span.board {
    padding: 0 .5rem;
    border-radius: 500rem;
    background: #29313D;
    color: #FFF;
    font-weight: bold;
  }
  .topicList .item .info .subject span.star img {
    width: 16px;
    height: 16px;
  }
  .topicList .item .info .subject span.notice,
  .topicList .item .info .subject span.category,
  .topicList .item .info .subject span.newest,
  .topicList .item .info .subject span.posts {
    margin-right: .1rem;
    padding: 0 .25rem;
    border-radius: .1rem;
    background: #ED1C24;
    color: #FFF;
    font-size: .7rem;
  }
  .topicList .item .info .subject span.category { background: #29313D }
  .topicList .item .info .subject span.newest { background: #409EFF }
  .topicList .item .info .subject span.posts { background: #999 }
  .topicList .item .info .subject span.image { color: #409EFF }
  .topicList .item .info .subject span.view {
    color: #409EFF;
    font-weight: bold;
  }
  .topicList .item .info .author {
    color: #333;
    font-size: .8rem;
    font-weight: bold;
  }
  .topicList .item .info .author span {
    margin-left: .25rem;
    color: #999;
    font-size: .7rem;
    font-weight: normal;
  }
  .topicList .item .unlock {
    display: flex;
    flex-direction: column;
    width: 3rem;
    background: #29313D;
    color: #FFF;
    font-size: 1rem;
    justify-content: center;
    align-items: center;
  }
  .topicList .item .unlock:hover {
    opacity: .8;
    cursor: pointer;
  }
</style>