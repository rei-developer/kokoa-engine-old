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
              <div class='AD hidden-mobile'>
                <iframe src='/header-ad.html' frameborder='0' marginwidth='0' marginheight='0'/>
              </div>
              <div class='AD hidden-desktop'>
                <iframe src='/header-mobile-ad.html' frameborder='0' marginwidth='0' marginheight='0'/>
              </div>
              <TopicList :id='0' :purePage='$route.query.page || 1' />
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
  import TopicList from '~/components/topic/list.vue'
  import Recent from '~/components/recent.vue'

  export default {
    components: {
      TopicList,
      Recent
    },
    data() {
      return {
        domain: ''
      }
    },
    async asyncData ({ params }) {
      const domain = params.domain
      return { domain }
    }
  }
</script>