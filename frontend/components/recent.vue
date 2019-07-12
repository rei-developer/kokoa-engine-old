<template>
  <div>
    <div class='containerSubject'>
      <font-awesome-icon icon='star' />
      최근 인기 게시물
    </div>
    <div class='recentList'>
      <div
        class='item'
        @click='move(item.id)'
        v-for='(item, index) in topics' :key='index'>
        <span class='star' v-if='item.isBest > 0'>
          <img :src='item.isBest > 1 ? "/star.svg" : "/burn.svg"'>
        </span>
        {{ item.title }}
        <span class='posts' v-if='item.postsCount > 0'>{{ numberWithCommas(item.postsCount) }}</span>
        <div class='event'>
          <span>
            <font-awesome-icon icon='clock' />
            {{ $moment(item.created).fromNow() }}
          </span>
          <span v-if='item.likes > 0'>
            <font-awesome-icon icon='heart' />
            +{{ numberWithCommas(item.likes) }}
          </span>
        </div>
      </div>
    </div>
    <div class='ADSidebar'>
      <adsbygoogle />
    </div>
  </div>
</template>

<script>
  export default {
    props: ['domain'],
    data() {
      return {
        topics: []
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData: async function() {
        const data = await this.$axios.$get('/api/topic/list/widget')
        if (!this.topics) return
        this.topics = data.map(i => {
          i.title = i.title.length > 50 ? i.title.substr(0, 50) + '...' : i.title
          i.created = this.$moment(i.created).format('YYYY/MM/DD HH:mm:ss')
          return i
        })
        return data
      },
      move(id) {
        this.$router.push({ path: `/b/all/${id}` })
      },
      numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    }
  }
</script>

<style>
  .recentList {
    margin-bottom: 1rem;
    border-top: 2px solid #21374F;
  }
  .recentList .item {
    padding: .25rem .5rem;
    border-bottom: 1px solid #405368;
    color: #FFF;
    font-size: .8rem;
    font-weight: bold;
  }
  .recentList .item:last-child {
    margin-bottom: 0;
  }
  .recentList .item:hover {
    background: #122943;
    cursor: pointer;
  }
  .recentList .item span.star img {
    width: 14px;
    height: 14px;
    margin-bottom: 4px;
    vertical-align: middle;
  }
  .recentList .item span.posts {
    margin-left: .1rem;
    padding: 0 .25rem;
    background: #999;
    border-radius: .1rem;
    color: #FFF;
    font-size: .7rem;
    font-weight: normal;
  }
  .recentList .item .event span {
    margin-right: .25rem;
    color: #939EA9;
    font-size: .7rem;
    font-weight: normal;
  }
</style>