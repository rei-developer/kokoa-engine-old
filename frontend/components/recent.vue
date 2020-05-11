<template>
  <div>
    <!-- <div class='ADSidebar'>
      <iframe src='/sidebar-ad.html' frameborder='0' marginwidth='0' marginheight='0'/>
    </div> -->
    <div class='recentList'>
      <div
        :class='item.isBest > 1 ? "item best" : "item"'
        @click='move(item.id)'
        v-for='(item, index) in topics' :key='index'>
        <div class='info' @click='move(item)'>
          <div class='subject'>
            <span class='star' v-if='item.isBest > 0'>
              <img :src='item.isBest > 1 ? "/star.svg" : "/burn.svg"'>
            </span>
            {{ item.title }}
          </div>
          <div class='author'>
            <span class='event'>
              <font-awesome-icon icon='clock' />
              {{ $moment(item.created).fromNow() }}
            </span>
            <span class='event' v-if='item.postsCount > 0'>
              <font-awesome-icon icon='comment-dots' />
              {{ numberWithCommas(item.postsCount) }}
            </span>
            <span class='event' v-if='item.likes > 0'>
              <font-awesome-icon icon='heart' />
              +{{ numberWithCommas(item.likes) }}
            </span>
          </div>
        </div>
        <div class='image' @click='move(item)' v-if='item.imageUrl'>
          <img :src='`https://idolboard.com/img/thumb/${item.imageUrl}`'>
        </div>
      </div>
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
    display: flex;
    flex-direction: column;
  }
  .recentList .item {
    display: flex;
    min-height: 73px;
    padding: .25rem;
    border: 1px solid rgba(0, 0, 0, .1);
    border-top: 0;
    border-bottom: 1px dashed rgba(0, 0, 0, .1);
    background: #FFF;
  }
  .recentList .item.best {
    border: 1px solid rgba(0, 0, 0, .05);
    border-top: 0;
    border-bottom: 1px dashed rgba(0, 0, 0, .1);
    background: #EEF6F9;
  }
  .recentList .item:hover .info .subject,
  .recentList .item:hover .info .author span.event { color: #FFF }
  .recentList .item:hover {
    background: #ffd1dc;
    cursor: pointer;
  }
  .recentList .item:first-child {
    border-top: 1px solid rgba(0, 0, 0, .1);
    border-top-left-radius: .25rem;
    border-top-right-radius: .25rem;
  }
  .recentList .item:last-child {
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    border-bottom-left-radius: .25rem;
    border-bottom-right-radius: .25rem;
  }
  .recentList .item .image {
    display: flex;
    flex-direction: column;
  }
  .recentList .item .image img {
    width: 4rem;
    height: 4rem;
    border-radius: .25rem;
    background: #FFF;
  }
  .recentList .item .info {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  .recentList .item .info .subject {
    color: #ffd1dc;
    font-size: .8rem;
    font-weight: bold;
  }
  .recentList .item .info .subject span.star img {
    width: 18px;
    height: 18px;
    vertical-align: top;
  }
  .recentList .item .info .author span.event {
    margin-left: .25rem;
    color: #999;
    font-size: .7rem;
    font-weight: normal;
  }
</style>