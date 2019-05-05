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
            <div class='widget-title'>
              <font-awesome-icon icon='bell' />
              알림 목록 ({{ this.$store.state.user.noticeCount }})
            </div>
            <div class='notice-list'>
              <div
                :class='"item" + (item.confirm < 1 ? " view" : "")'
                v-for='(item, index) in notices' :key='index'>
                <nuxt-link :to='"/b/" + item.boardDomain + "/" + item.topicId + "?postId=" + item.postId'>
                  <div class='image'>
                    <img :src='item.profile ? "https://hawawa.co.kr/profile/" + item.profile : "/profile.png"'>
                  </div>
                  <div class='info'>
                    <div class='subject'>
                      <span class='tagUser' v-if='item.tagAuthor'>{{ item.tagAuthor }}</span>
                      <span v-html='item.content' />
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
        notices: [],
        page: 0,
        bottom: false,
        lading: false
      }
    },
    methods: {
      getData: async function(forceUpdate = false) {
        if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
        const token = this.$store.state.user.token
        this.$store.commit('setLoading', true)
        if (forceUpdate) {
          this.notices = []
          this.page = 0
        }
        const { data } = await axios.post(
          '/api/notice/list',
          { page: this.page++ },
          { headers: { 'x-access-token': token } }
        )
        if (!data.notices) {
          this.$alert('알림이 없습니다.', '알림', { confirmButtonText: '확인' })
          return this.$store.commit('setLoading')
        }
        data.notices.map(i => {
          i.created = this.$moment(i.created).format('YYYY/MM/DD HH:mm:ss')
          this.notices.push(i)
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
      }
    },
    watch: {
      bottom: function(bottom) {
        if (bottom) this.getData()
      },
      '$store.state.forceUpdate': function() {
        this.getData(true)
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

  .notice-list {
    line-height: 1.8;
    text-align: justify;
  }
  .notice-list .item {
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 1rem;
    width: 100%;
    min-height: 4.2rem;
  }
  .notice-list .item:hover {
    background: #FAFAFA;
    cursor: pointer;
  }
  .notice-list .item.view {
    border-left: 5px solid #f78989;
  }
  .notice-list .item .image {
    display: inline-block;
    width: 3.2rem;
    margin-top: .5rem;
    margin-left: .5rem;
    padding: 2px;
    border: 1px solid #DDD;
    border-radius: 500rem;
  }
  .notice-list .item .image img {
    width: calc(3.2rem - 6px);
    height: calc(3.2rem - 6px);
    border-radius: 500rem;
  }
  .notice-list .item .info {
    display: inline-block;
    padding: .5rem;
    padding-left: .25rem;
    font-size: .8rem;
    vertical-align: top;
  }
  .notice-list .item .info .subject {
    color: #333;
  }
  .notice-list .item .info .author {
    color: #333;
    font-size: .8rem;
    font-weight: bold;
  }
  .notice-list .item .info span.regdate {
    color: #999;
    font-size: .7rem;
    font-weight: normal;
  }
  .notice-list .item .info .subject span.tagUser {
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