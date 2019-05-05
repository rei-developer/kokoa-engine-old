<template>
  <div>
    <el-row>
      <el-col :xl='4' hidden-lg-and-down>
        <div class='grid-content' />
      </el-col>
      <el-col :xl='16'>
        <el-row>
          <el-col :xl='19'>
            <TopicList :id='0' />
          </el-col>
          <el-col class='subMenu hidden-mobile' :xl='5' hidden-xl-only>
            <Recent />
            <adsbygoogle />
          </el-col>
        </el-row>
      </el-col>
      <el-col :xl='4' hidden-lg-and-down>
        <div class='grid-content' />
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
    }
  }
</script>