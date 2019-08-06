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
                <nuxt-link :to='`/pick`'>
                  <el-button type='info' size='small'>목록</el-button>
                </nuxt-link>
                <nuxt-link :to='`/pick/write`' v-if='$store.state.user.isLogged'>
                  <el-button class='floatRight' type='primary' size='small'>아이돌 등록</el-button>
                </nuxt-link>
              </div>
              <div class='pickRead' :style='pick.profile ? `background-image: url(${"https://idolboard.com/pick/" + pick.profile})` : ""'>
                <div class='background' />
                <div class='name'>{{ pick.name }}</div>
                <div class='group'>{{ pick.groupname }} ({{ pick.pureGroupname }})</div>
                <div class='grade'></div>
                <div class='vote' @click='votes()'>투표 {{ pick.likes }}</div>
              </div>
              <PickPostList :id='id' :pick='pick' />
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
  import PickPostList from '~/components/pick/list.vue'
  import Recent from '~/components/recent.vue'

  export default {
    components: {
      PickPostList,
      Recent
    },
    data() {
      return {
        id: 0,
        pick: {
          userId: 0,
          name: '',
          groupname: '',
          pureGroupname: '',
          ip: '',
          created: '',
          updated: '',
          likes: 0,
          profile: ''
        },
        loading: true
      }
    },
    async asyncData ({ app, params, store, $axios }) {
      const id = params.id
      const token = store.state.user.isLogged ? store.state.user.token : ''
      const data = await $axios.$get(
        `/api/pick/read/${id}`,
        { headers: { 'x-access-token': token } }
      )
      if (data.status === 'fail') return console.log(data.message)
      return {
        id,
        pick: data.pick
      }
    },
    methods: {
      votes: async function() {
        if (this.id < 1) return
        if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
        const token = this.$store.state.user.token
        this.$store.commit('setLoading', true)
        const data = await this.$axios.$post(
          '/api/pick/vote',
          { id: this.id },
          { headers: { 'x-access-token': token } }
        )
        if (data.status === 'fail') {
          this.$store.commit('setLoading')
          return this.$message.error(data.message || '오류가 발생했습니다.')
        }
        this.$message('투표했습니다.')
        this.$store.commit('setLoading')
      },
      copyLink: async function(link) {
        this.$message.success('링크를 복사했습니다.')
        this.$copyText(link)
      },
      numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    },
    head() {
      return {
        title: `${this.pick.name} - 아이돌보드`
      }
    }
  }
</script>

<style>
  .pickRead {
    position: relative;
    height: 30rem;
    margin-top: .5rem;
  }
  .pickRead .background {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 8rem;
    background: linear-gradient(to top, rgba(0, 0, 0, .8), transparent);
  }
  .pickRead .vote {
    position: absolute;
    right: 2rem;
    bottom: 2rem;
    height: 2.2rem;
    line-height: 2rem;
    padding: 0 1rem;
    border-radius: 500rem;
    background: #FF509F;
    color: #FFF;
    font-size: 1.2rem;
    text-align: center;
  }
  .pickRead .vote:hover {
    cursor: pointer;
    opacity: .75;
  }
  .pickRead .grade {
    position: absolute;
    right: 2rem;
    top: -2rem;
    color: #FFF;
    font-size: 20rem;
    font-weight: bold;
    opacity: .6;
  }
  .pickRead .name,
  .pickRead .group {
    position: absolute;
    left: 2rem;
    bottom: 3.4rem;
    color: #FFF;
    font-size: 2rem;
    font-weight: bold;
  }
  .pickRead .group {
    bottom: 1.8rem;
    font-size: 1.2rem;
    font-weight: normal;
  }
</style>