<template>
  <div>
    <div class='widget-title'>
      <font-awesome-icon icon='star' />
      최근 인기글
    </div>
    <div class='widget-list'>
      <div
        class='item'
        v-for='(item, index) in topics' :key='index'>
        <a :href='"/b/all/" + item.id'>
          {{ item.title }}
          <span class='regdate'>{{ item.created }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        topics: []
      }
    },
    methods: {
      getData: async function() {
        const { data } = await axios.get('/api/topic/list/widget')
        this.topics = data.map(i => {
          i.title = i.title.length > 40 ? i.title.substr(0, 40) + '...' : i.title
          i.created = this.$moment(i.created).format('YYYY/MM/DD HH:mm:ss')
          return i
        })
        return data
      },
    },
    created() {
      this.getData()
    }
  }
</script>

<style>
  .widget-list {
    line-height: 1.8;
    text-align: justify;
    background-color: #F5F5F5;
    padding: .5em;
  }
  .widget-list .item {
    background-color: #FFF;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
    margin-bottom: .5rem;
    padding: .5rem;
    font-size: .8rem;
    text-align: left;
  }
  .widget-list .item:last-child {
    margin-bottom: 0;
  }
  .widget-list .item a {
    color: #333;
  }
  .widget-list .item span.regdate {
    color: #f78989;
  }
</style>