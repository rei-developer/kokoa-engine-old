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
              <div><img src='~/assets/Logo.png'></div>
              <div>IDOLBOARD IDOL CHART COMING SOON</div>
              <div>
                <p>곧 아이돌보드 아이돌 차트 시스템이 개발됩니다. (8월 중하순 예정)</p>
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
  import Recent from '~/components/recent.vue'
  
  export default {
    components: { Recent }
  }
</script>