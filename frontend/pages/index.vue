<template>
  <div>
    <el-row :gutter='0'>
      <el-col :xl='4' hidden-lg-and-down><div class='grid-content'></div></el-col>
      <el-col :xl='16'>
        <el-row>
          <el-col :xl='19'>
            <div class='AD'>
              <adsbygoogle ad-slot='1882412178' />
            </div>
            <div class='header-menu'>
              <el-button-group>
                <el-button type='info' size='small' @click='getData("all", true)' round>
                  전체순
                </el-button>
                <el-button type='danger' size='small' @click='getData("best", true)' round>
                  인기순
                </el-button>
                <el-button type='success' size='small' @click='getData("girl", true)' round>연예순</el-button>
                <el-button type='success' size='small' @click='getData("anime", true)' round>애니순</el-button>
              </el-button-group>
            </div>
            <div class='widget-title'>
              <font-awesome-icon icon='folder-open' />
              {{ boardName }} 게시물 목록순
            </div>
            <div class='board-list'>
              <div
                class='item'
                v-for='(item, index) in topics' :key='index'>
                <div class='grade'>
                  <font-awesome-icon icon='arrow-up' />
                  {{ item.likes }}
                  <el-button type='danger' size='mini' round @click='votes(item.id)'><font-awesome-icon icon='seedling' /></el-button>
                </div>
                <nuxt-link :to='"/b/" + domain + "/" + item.id'>
                  <div class='image'>
                    <img :src='item.imageUrl ? "https://hawawa.co.kr/img/thumb/" + item.imageUrl : "/default.png"'>
                  </div>
                  <div class='info'>
                    <div class='subject'>
                      <span class='board'>{{ getBoardName(item.boardDomain) }}</span>
                      <span class='star' v-if='item.isBest > 0'>
                        <img :src='item.isBest > 1 ? "/star.svg" : "/burn.svg"'>
                      </span>
                      {{ item.title }}
                      <span v-if='item.postsCount > 0'>[{{ item.postsCount }}]</span>
                    </div>
                    <div class='regdate'>{{ item.created }}</div>
                  </div>
                </nuxt-link>
              </div>
            </div>
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
</template>

<script>
  import Recent from '~/components/recent.vue'
  import axios from 'axios'
  
  export default {
    data() {
      return {
        domain: 'all',
        boardName: '전체',
        topics: [],
        page: 0,
        bottom: false,
        lading: false
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
      getData: async function(domain = this.domain, forceUpdate = false) {
        this.$store.commit('setLoading', true)
        if (this.domain != domain) {
          this.domain = domain
          this.boardName = this.getBoardName(domain)
        }
        if (forceUpdate) {
          this.topics = []
          this.page = 0
        }
        const { data } = await axios.post('/api/topic/list', { domain, page: this.page++ })
        if (!data.topics) return this.$store.commit('setLoading')
        data.topics.map(i => {
          i.title = i.title.length > 40 ? i.title.substr(0, 40) + '...' : i.title
          i.created = this.$moment(i.created).format('YYYY/MM/DD HH:mm:ss')
          this.topics.push(i)
        })
        this.$store.commit('setLoading')
        return data
      },
      bottomVisible() {
        if (process.browser) {
          const scrollY = window.pageYOffset
          const visible = document.documentElement.clientHeight
          const pageHeight = document.documentElement.scrollHeight
          const bottomOfPage = visible + scrollY >= pageHeight
          return bottomOfPage || pageHeight < visible
        }
      },
      votes: async function(id) {
        if (process.browser) {
          if (id < 1) return
          if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
          const token = this.$store.state.user.token
          this.$store.commit('setLoading', true)
          const { data } = await axios.post(
            '/api/topic/vote',
            { id, likes: true },
            { headers: { 'x-access-token': token } }
          )
          if (data.status === 'fail') {
            this.$store.commit('setLoading')
            return this.$message.error(data.message)
          }
          if (data.move === 'BEST') this.$message.success('베스트로 보냈습니다.')
          this.$message('투표했습니다.')
          this.$store.commit('setLoading')
        }
      }
    },
    watch: {
      bottom: function(bottom) {
        if (bottom) this.getData()
      },
      '$store.state.forceUpdate': function() {
        this.getData('all', true)
      }
    },
    created() {
      if (process.browser) {
        window.addEventListener('scroll', () => {
          this.bottom = this.bottomVisible()
        })
      }
      this.getData()
    },
    components: {
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

  .board-list {
    line-height: 1.8;
    text-align: justify;
  }
  .board-list .item {
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 1rem;
    min-height: 4.2rem;
  }
  .board-list .item:hover {
    background: #FAFAFA;
    cursor: pointer;
  }
  .board-list .item .grade {
    display: inline-block;
    position: absolute;
    width: 4rem;
    height: 4.2rem;
    background: #F5F5F5;
    padding: .5rem;
    font-size: .8rem;
    font-weight: bold;
    text-align: center;
  }
  .board-list .item .image {
    display: inline-block;
    width: 3.2rem;
    margin-top: .5rem;
    margin-left: 4.5rem;
  }
  .board-list .item .image img {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: .3rem;
  }
  .board-list .item .info {
    display: inline-block;
    padding: .5rem;
    padding-left: .25rem;
    font-size: .8rem;
    vertical-align: top;
  }
  .board-list .item .info .subject {
    color: #f78989;
    font-size: 1rem;
    font-weight: bold;
  }
  .board-list .item .info .subject span.star img {
    width: 16px;
    height: 16px;
    margin-bottom: 4px;
    vertical-align: middle;
  }
  .board-list .item .info .subject span.board {
    padding: 0 .5rem;
    background: #f78989;
    border-radius: 500rem;
    color: #FFF;
    font-size: .9rem;
  }
  .board-list .item .info .regdate {
    padding: 0 .5rem;
    background: hsla(0,0%,78.4%,.2);
    border-radius: 500rem;
    color: #35495e;
    font-size: .7rem;
    float: left;
  }
</style>