<template>
  <div>
    <div class='AD'>
      <adsbygoogle ad-slot='1882412178' />
    </div>
    <nuxt-link :to='`/b/${domain}`'>
      <el-button type='info' size='small' @click='forceUpdate'>목록</el-button>
    </nuxt-link>
    <nuxt-link :to='`/b/${domain}/write`' v-if='$store.state.user.isLogged && domain !== "all" && domain !== "best"'>
      <el-button class='Right' type='danger' size='small'>
        <font-awesome-icon icon='pencil-alt' />
        글 작성
      </el-button>
    </nuxt-link>
    <div class='Blank' />
    <div class='widget-title'>
      <font-awesome-icon icon='pencil-alt' />
      {{ boardName }} ({{ numberWithCommas(topicsCount) }})
    </div>
    <div class='article-list'>
      <div
        :class='id == item.id ? "item view" : "item"'
        v-for='(item, index) in topics' :key='index'>
        <nuxt-link :to='"/b/" + domain + "/" + item.id + "?page=" + page'>
          <div class='image'>
            <img :src='item.imageUrl ? "https://hawawa.co.kr/img/thumb/" + item.imageUrl : "/default.png"'>
          </div>
          <div class='info'>
            <div class='subject'>
              <span class='board' v-if='domain === "all" || domain === "best"'>{{ getBoardName(item.boardDomain) }}</span>
              <span class='star' v-if='item.isBest > 0'>
                <img :src='item.isBest > 1 ? "/star.svg" : "/burn.svg"'>
              </span>
              <span :class='id == item.id ? "view" : ""'>
                {{ item.title }}
                <span v-if='item.postsCount > 0'>[{{ item.postsCount }}]</span>
              </span>
            </div>
            <div class='author'>
              <img :src='item.admin > 0 ? "/admin.png" : "/user.png"'>
              {{ item.author }}
              <span class='regdate'>| {{ item.created }} | 조회 {{ numberWithCommas(item.hits) }}</span>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
    <el-pagination
      layout='prev, pager, next'
      :page-size='20'
      :total='topicsCount'
      :current-page='page'
      @current-change='currentChange' />
    <nuxt-link :to='`/b/${domain}`'>
      <el-button type='info' size='small' @click='forceUpdate'>목록</el-button>
    </nuxt-link>
    <nuxt-link :to='`/b/${domain}/write`' v-if='$store.state.user.isLogged && domain !== "all" && domain !== "best"'>
      <el-button class='Right' type='danger' size='small'>
        <font-awesome-icon icon='pencil-alt' />
        글 작성
      </el-button>
    </nuxt-link>
    <div class='Blank' />
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
        topics: [],
        topicsCount: 0,
        page: 0
      }
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
        this.topics = data.topics.map(i => {
          i.title = i.title.length > 40 ? i.title.substr(0, 40) + '...' : i.title
          i.created = this.$moment(i.created).format('YYYY/MM/DD HH:mm:ss')
          return i
        })
        this.topicsCount = data.count
        this.$store.commit('setLoading')
        return data
      },
      forceUpdate() {
        this.$store.commit('forceUpdate')
      },
      numberWithCommas: x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      currentChange: function(page) {
        this.page = page - 1
        this.getData()
      }
    },
    watch: {
      '$store.state.forceUpdate': function() {
        this.getData(true)
      }
    },
    created() {
      this.domain = this.$nuxt._route.params.domain
      this.boardName = this.getBoardName(this.domain)
      this.page = this.$route.query.page ? this.$route.query.page - 1 : 0
      this.getData()
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

  .article-list {
    line-height: 1.8;
    text-align: justify;
  }
  .article-list .item {
    background: #FFF;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    width: 100%;
    min-height: 4.2rem;
  }
  .article-list .item:hover {
    background: #FAFAFA;
    cursor: pointer;
  }
  .article-list .item.view {
    background: #FAFAFA;
  }
  .article-list .item .image {
    display: inline-block;
    width: 3.2rem;
    margin-top: .5rem;
    margin-left: .5rem;
  }
  .article-list .item .image img {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: .3rem;
  }
  .article-list .item .info {
    display: inline-block;
    padding: .5rem;
    padding-left: .25rem;
    font-size: .8rem;
    vertical-align: top;
  }
  .article-list .item .info .subject {
    color: #333;
    font-size: .9rem;
    font-weight: bold;
  }
  .article-list .item .info .subject span.star img {
    width: 16px;
    height: 16px;
    margin-bottom: 4px;
    vertical-align: middle;
  }
  .article-list .item .info .subject span.board {
    padding: 0 .5rem;
    background: #f78989;
    border-radius: 500rem;
    color: #FFF;
    font-size: .8rem;
  }
  .article-list .item .info .subject span.view {
    color: #f78989;
  }
  .article-list .item .info .author {
    color: #333;
    font-size: .8rem;
    font-weight: bold;
  }
  .article-list .item .info span.regdate {
    color: #999;
    font-size: .7rem;
    font-weight: normal;
  }

  .el-pagination {
    margin: 1rem 0;
  }
</style>