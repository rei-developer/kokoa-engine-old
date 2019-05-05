<template>
  <div>
    <el-row :gutter='0'>
      <el-col :xl='4' hidden-lg-and-down><div class='grid-content'></div></el-col>
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
      <el-col :xl='4' hidden-lg-and-down><div class='grid-content'></div></el-col>
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

<style>
  .grid-content {
    min-height: 0.02px;
  }
</style>