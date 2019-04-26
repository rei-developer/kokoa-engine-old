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
              <div class='AD'><img src='~/assets/test.gif'></div>
              <div class='header-menu'>
                <el-button-group>
                  <el-button type='info' size='small' @click='getData("all")' round>
                    전체
                  </el-button>
                  <el-button type='danger' size='small' @click='getData("best")' round>
                    인기
                  </el-button>
                  <el-button type='success' size='small' @click='getData("girl")' round>연예</el-button>
                  <el-button type='success' size='small' @click='getData("anime")' round>애니</el-button>
                  <el-button size='small' @click='getData("talk")' round>토크</el-button>
                </el-button-group>
              </div>
              <div class='widget-title'>
                <font-awesome-icon icon='pencil-alt' />
                {{ domainName }}
              </div>
              <div class='article-list'>
                <div
                  class='item'
                  v-for='(item, index) in topics' :key='index'>
                  <div class='grade'>
                    <font-awesome-icon icon='arrow-up' />
                    {{ item.likes }}
                    <el-button type='danger' size='mini' round @click='votes(item.id)'><font-awesome-icon icon='seedling' /></el-button>
                  </div>
                  <a :href='"/b/" + domain + "/" + item.id'>
                    <div class='image'>
                      <img :src='item.imageUrl ? "https://hawawa.co.kr/img/thumb/" + item.imageUrl : "/default.png"'>
                    </div>
                    <div class='info'>
                      <div class='subject'>
                        <span class='star' v-if='item.isBest > 0'>
                          <img :src='item.isBest > 1 ? "/star.svg" : "/burn.svg"'>
                        </span>
                        {{ item.title }}
                        <span v-if='item.postsCount > 0'>[{{ item.postsCount }}]</span>
                      </div>
                      <div class='regdate'>{{ item.created }}</div>
                    </div>
                  </a>
                </div>
              </div>
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
        domain: 'all',
        domainName: '전체글',
        topics: [],
        page: 0,
        bottom: false,
        loading: false
      }
    },
    methods: {
      open() {
        this.$notify({
          title: '나코나코땅땅!',
          message: '새로운 글이 베스트로 등극되었습니다!',
          position: 'bottom-right'
        });
      },
      getData: async function(domain = this.domain) {
        if (this.loading) return
        this.loading = true
        if (this.domain != domain) {
          this.domain = domain
          switch (domain) {
            case 'all':
              this.domainName = '전체글'
              break
            case 'best':
              this.domainName = '인기글'
              break
            case 'girl':
              this.domainName = '연예인'
              break
            case 'anime':
              this.domainName = '애니메이션'
              break
            case 'talk':
              this.domainName = '토크'
              break
            case 'social':
              this.domainName = '정치'
              break
          }
          this.topics = []
          this.page = 0
        }
        const { data } = await axios.post('/api/topic/list', { domain, page: this.page++ })
        data.topics.map(i => {
          i.title = i.title.length > 40 ? i.title.substr(0, 40) + '...' : i.title
          i.created = this.$moment(i.created).format('YYYY/MM/DD HH:mm:ss')
          this.topics.push(i)
        })
        if (this.bottomVisible()) this.getData()
        this.loading = false
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
        if (this.loading || id < 1) return
        const token = localStorage.token
        if (!token) return this.$message.error('로그인하세요.')
        this.loading = true
        const { data } = await axios.post(
          '/api/topic/vote',
          { id, likes: true },
          { headers: { 'x-access-token': token } }
        )
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message)
        }
        if (data.move === 'BEST') this.$message.success('베스트로 보냈습니다.')
        this.$message('투표했습니다.')
        this.loading = false
      }
    },
    watch: {
      bottom: function(bottom) {
        if (bottom) this.getData()
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

  .article-list {
    line-height: 1.8;
    text-align: justify;
  }
  .article-list .item {
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 1rem;
    float: left;
    width: 100%;
    min-height: 4.2rem;
  }
  .article-list .item:hover {
    background: #FAFAFA;
    cursor: pointer;
  }
  .article-list .item .grade {
    display: inline-block;
    position: absolute;
    width: 4rem;
    height: 4.2rem;
    background: #F5F5F5;
    padding: .5rem;
    font-size: .8rem;
    font-weight: bold;
    text-align: center;
    float: left;
  }
  .article-list .item .image {
    display: inline-block;
    width: 3.2rem;
    margin-top: .5rem;
    margin-left: 4.5rem;
    float: left;
  }
  .article-list .item .image img {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: .3rem;
  }
  .article-list .item .info {
    display: inline-block;
    padding: .5rem;
    font-size: .8rem;
    float: left;
  }
  .article-list .item .info .subject {
    color: #f78989;
    font-size: 1rem;
    font-weight: bold;
  }
  .article-list .item .info .subject span.star img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
  .article-list .item .info .regdate {
    display: block;
    padding: 0 .5rem;
    background: hsla(0,0%,78.4%,.2);
    border-radius: 500rem;
    color: #35495e;
    font-size: .7rem;
    float: left;
  }
</style>