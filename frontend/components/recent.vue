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
        <span class='regdate'>{{ item.created }}</span>
      </div>
    </div>
    <adsbygoogle v-if='domain !== "anime"' />
  </div>
</template>

<script>
  import axios from 'axios'

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
        const { data } = await axios.get('/api/topic/list/widget')
        if (!this.topics) return
        this.topics = data.map(i => {
          i.title = i.title.length > 40 ? i.title.substr(0, 40) + '...' : i.title
          i.created = this.$moment(i.created).format('YYYY/MM/DD HH:mm:ss')
          return i
        })
        return data
      },
      move(id) {
        this.$router.push({ path: `/b/all/${id}` })
      }
    }
  }
</script>

<style>
  .recentList {
    line-height: 1.2;
    margin-bottom: 1rem;
    padding: .5em;
    border-radius: .25rem;
    background-color: #F5F5F5;
  }
  .recentList .item {
    margin-bottom: .5rem;
    padding: .5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
    background-color: #FFF;
    font-size: .8rem;
  }
  .recentList .item:last-child {
    margin-bottom: 0;
  }
  .recentList .item:hover {
    background: #FAFAFA;
    cursor: pointer;
  }
  .recentList .item a {
    color: #333;
  }
  .recentList .item span.star img {
    width: 14px;
    height: 14px;
    margin-bottom: 4px;
    vertical-align: middle;
  }
  .recentList .item span.regdate {
    color: #29313D;
  }
</style>