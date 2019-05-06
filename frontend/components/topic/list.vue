<template>
  <div>
    <div class='AD' v-if='domain !== "anime"'>
      <adsbygoogle ad-slot='1882412178' />
    </div>
    <nuxt-link :to='`/b/${domain}`'>
      <el-button type='info' size='small' @click='forceUpdate'>목록</el-button>
    </nuxt-link>
    <nuxt-link :to='`/b/${domain}/write`' v-if='$store.state.user.isLogged && domain !== "all" && domain !== "best"'>
      <el-button class='floatRight' type='danger' size='small'>
        <font-awesome-icon icon='pencil-alt' />
        글 작성
      </el-button>
    </nuxt-link>
    <div class='containerSubject marginTop'>
      <font-awesome-icon icon='pencil-alt' />
      {{ boardName }} ({{ numberWithCommas(topicsCount) }})
    </div>
    <div class='topicList'>
      <div
        :class='id == item.id ? "item view" : "item notice"'
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
              {{ item.title }}
              <span class='newest' v-if='$moment().diff($moment(item.created), "days") <= 1'>NEW</span>
              <span class='posts' v-if='item.postsCount > 0'>{{ item.postsCount }}</span>
            </span>
          </div>
          <div class='author'>
            <img :src='item.admin > 0 ? "/admin.png" : "/user.png"'>
            {{ item.author }}
            <span>
              <font-awesome-icon icon='clock' />
              {{ item.created }}
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
      <div
        :class='id == item.id ? "item view" : "item"'
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
              {{ item.title }}
              <span class='newest' v-if='$moment().diff($moment(item.created), "days") <= 1'>NEW</span>
              <span class='posts' v-if='item.postsCount > 0'>{{ item.postsCount }}</span>
            </span>
          </div>
          <div class='author'>
            <img :src='item.admin > 0 ? "/admin.png" : "/user.png"'>
            {{ item.author }}
            <span>
              <font-awesome-icon icon='clock' />
              {{ item.created }}
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
        <el-button class='floatRight' type='danger' size='small'>
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
      this.domain = this.$nuxt._route.params.domain
      this.boardName = this.getBoardName(this.domain)
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
        if (data.notices) {
          this.notices = data.notices.map(i => {
            i.title = i.title.length > 40 ? i.title.substr(0, 40) + '...' : i.title
            i.created = this.$moment(i.created).format('YYYY/MM/DD HH:mm:ss')
            return i
          })
        }
        this.topics = data.topics.map(i => {
          i.title = i.title.length > 40 ? i.title.substr(0, 40) + '...' : i.title
          i.created = this.$moment(i.created).format('YYYY/MM/DD HH:mm:ss')
          return i
        })
        this.topicsCount = data.count
        this.$store.commit('setLoading')
        return data
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
  }
  .topicList .item:hover {
    background: #FAFAFA;
    cursor: pointer;
  }
  .topicList .item.notice {
    background: #FAFAFA;
  }
  .topicList .item.view {
    border-left: .25rem solid #F78989;
    background: #FAFAFA;
  }
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
    background: #F78989;
    border-radius: 500rem;
    color: #FFF;
    font-weight: bold;
  }
  .topicList .item .info .subject span.star img {
    width: 16px;
    height: 16px;
  }
  .topicList .item .info .subject span.notice {
    margin-right: .1rem;
    padding: 0 .25rem;
    background: #ED1C24;
    border-radius: .1rem;
    color: #FFF;
    font-size: .7rem;
  }
  .topicList .item .info .subject span.newest {
    margin-left: .1rem;
    padding: 0 .25rem;
    background: #FF7F27;
    border-radius: .1rem;
    color: #FFF;
    font-size: .7rem;
  }
  .topicList .item .info .subject span.posts {
    margin-left: .1rem;
    padding: 0 .25rem;
    background: #999;
    border-radius: .1rem;
    color: #FFF;
    font-size: .7rem;
  }
  .topicList .item .info .subject span.view {
    color: #F78989;
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
</style>