<template>
  <div>
    <el-row>
      <el-col :xl='4' hidden-lg-and-down>
        <div class='blank' />
      </el-col>
      <el-col :xl='16'>
        <div class='Container'>
          <div class='item'>
            <div class='content'>
              <div class='AD'>
                <adsbygoogle ad-slot='1882412178' />
              </div>
              <div>
                <nuxt-link :to='`/pick/write`' v-if='$store.state.user.isLogged'>
                  <el-button class='floatRight' type='primary' size='small'>아이돌 등록</el-button>
                </nuxt-link>
              </div>
              <div class='chartAce' :style='aceprofileImageUrl ? `background-image: url(${"https://idolboard.com/pick/" + aceprofileImageUrl})` : ""'>
                <div class='background' />
                <div class='number-one'>
                  <img src='/number-one.svg'>
                </div>
                <div class='name'>{{ acename }}</div>
                <div class='group'>{{ acegroupname }} ({{ acepureGroupname }})</div>
              </div>
              <div class='marginVertical'>
                <el-input class='input-with-select' size='medium' placeholder='검색어 (2글자 이상)' v-model='searches.text'>
                  <el-select v-model='searches.select' slot='prepend'>
                    <el-option label='예명' :value='0' />
                    <el-option label='그룹' :value='1' />
                  </el-select>
                  <el-button slot='append' @click='search'>
                    <font-awesome-icon icon='search' />
                    검색
                  </el-button>
                </el-input>
              </div>
              <div class='chartList'>
                <div
                  class='item'
                  v-for='(item, index) in picks' :key='index'>
                  <div class='grade'>{{ numberWithCommas(index + 1) }}</div>
                  <div class='image' @click='move(item)'>
                    <img :src='item.profile ? "https://idolboard.com/pick/thumb/" + item.profile : "/default.png"'>
                  </div>
                  <div class='info' @click='move(item)'>
                    <div class='name'>{{ item.name }}</div>
                    <div class='group'>{{ item.groupname }} ({{ item.pureGroupname }})</div>
                  </div>
                  <div class='likes'>{{ numberWithCommas(item.likes) }}</div>
                  <div class='vote' @click='votes(item.id)'>
                    <font-awesome-icon icon='vote-yea' />
                    투표
                  </div>
                </div>
              </div>
            </div>
            <div class='sidebar'>
              <Recent />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xl='4' hidden-lg-and-down>
        <div class='blank' />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Library from '~/assets/lib.js'
  import Recent from '~/components/recent.vue'
  
  export default {
    components: { Recent },
    data() {
      return {
        acename: '',
        acegroupname: '',
        acepureGroupname: '',
        aceprofileImageUrl: '',
        picks: [],
        picksCount: 0,
        searches: {
          text: '',
          select: 0
        },
        page: 0,
        bottom: false
      }
    },
    watch: {
      '$store.state.forceUpdate': function() {
        this.getData('all', true)
      },
      bottom: function(bottom) {
        if (bottom) this.getData()
      }
    },
    mounted() {
      if (process.browser) {
        window.addEventListener('scroll', () => {
          this.bottom = this.bottomVisible()
        })
      }
      this.getData()
    },
    methods: {
      getData: async function(forceUpdate = false) {
        this.$store.commit('setLoading', true)
        if (forceUpdate) {
          this.picks = []
          this.picksCount = 0
          this.page = 0
        }
        const data = await this.$axios.$post(
          '/api/pick/list',
          {
            searches: this.searches,
            page: this.page++
          }
        )
        if (!data.picks) return this.$store.commit('setLoading')
        data.picks.map(topic => this.picks.push(topic))
        this.picksCount = data.count
        if (this.page === 1) {
          this.acename = data.picks[0].name
          this.acegroupname = data.picks[0].groupname
          this.acepureGroupname = data.picks[0].pureGroupname
          this.aceprofileImageUrl = data.picks[0].profile
        }
        this.$store.commit('setLoading')
        return data
      },
      votes: async function(id) {
        if (process.browser) {
          if (id < 1) return
          this.$store.commit('setLoading', true)
          const data = await this.$axios.$post(
            '/api/pick/vote',
            { id, likes: true }
          )
          if (data.status === 'fail') {
            this.$store.commit('setLoading')
            return this.$message.error(data.message || '오류가 발생했습니다.')
          }
          this.$message('추천했습니다.')
          this.$store.commit('setLoading')
        }
      },
      search: async function() {
        if (this.searches.text === '') return this.$message.error('검색어를 입력하세요.')
        if (this.searches.text.length < 2) return this.$message.error('검색어는 두 글자 이상 입력하세요.')
        this.page = 1
        this.getData(true)
      },
      move(item) {
        this.$router.push({ path: `/pick/${item.id}` })
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
      numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    }
  }
</script>

<style>
  .chartAce {
    position: relative;
    height: 40rem;
    margin-top: .5rem;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    background-size: cover;
    background-position: top center;
  }
  @media (max-width: 1023px) {
    .chartAce { height: 20rem }
  }
  .chartAce .background {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 8rem;
    background: linear-gradient(to top, rgba(0, 0, 0, .8), transparent);
  }
  .chartAce .number-one {
    position: absolute;
    left: 1rem;
    bottom: 1rem;
  }
  .chartAce .name,
  .chartAce .group {
    position: absolute;
    left: 5rem;
    bottom: 4rem;
    color: #FFF;
    font-size: 2rem;
    font-weight: bold;
  }
  .chartAce .group {
    bottom: 2.5rem;
    font-size: 1.2rem;
    font-weight: normal;
  }

  .chartList {
    display: flex;
    flex-direction: column;
  }
  .chartList .item {
    display: flex;
    margin-bottom: .5rem;
    border: 1px solid #EEE;
    background: #FFF;
  }
  .chartList .item:hover {
    background: #F0F0F0;
    cursor: pointer;
  }
  .chartList .item .grade {
    display: flex;
    flex-direction: column;
    width: 4rem;
    line-height: 6rem;
    margin-left: .5rem;
    font-size: 2.5rem;
    font-weight: bold;
    text-align: center;
    letter-spacing: normal;
  }
  .chartList .item .image {
    display: flex;
    flex-direction: column;
  }
  .chartList .item .image img {
    width: 5rem;
    height: 5rem;
    margin: .5rem;
  }
  .chartList .item .info {
    display: flex;
    margin-left: .75rem;
    flex: 1;
    flex-direction: column;
  }
  .chartList .item .info .name {
    padding-top: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
  }
  .chartList .item .info .group {
    font-size: 1rem;
  }
  .chartList .item .likes {
    display: flex;
    flex-direction: column;
    width: 5rem;
    color: #999;
    font-size: .9rem;
    justify-content: center;
    align-items: center;
  }
  .chartList .item .vote {
    display: flex;
    flex-direction: column;
    width: 3rem;
    background: #FF509F;
    color: #FFF;
    font-size: 1rem;
    justify-content: center;
    align-items: center;
  }
  .chartList .item .vote:hover {
    opacity: .8;
    cursor: pointer;
  }
</style>