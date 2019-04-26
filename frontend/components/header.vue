<template>
  <div class='Header'>
    <el-row :gutter='0'>
      <el-col :xl='4' hidden-lg-and-down><div class='grid-content' /></el-col>
      <el-col :xl='16'>
        <el-menu
          :default-active='activeIndex'
          class='el-menu'
          mode='horizontal'
          @select='handleSelect'
          active-text-color='#f78989'>
          <el-menu-item index='1' class='Logo'><a href='/?a=1'><img src='~/assets/HeaderLogo.png'></a></el-menu-item>
          <el-menu-item index='2'>
            <font-awesome-icon icon='comment-dots' />
            <a href='/b/all'>전체글</a>
          </el-menu-item>
          <el-menu-item index='3'>
            <font-awesome-icon icon='star' />
            <a href='/b/best'>인기글</a>
          </el-menu-item>
          <el-submenu index='4'>
            <template slot='title'><a href='#' style='color: #909399'>커뮤니티</a></template>
            <a href='/b/talk'><el-menu-item index='4-1'>토크</el-menu-item></a>
            <a href='/b/social'><el-menu-item index='4-2'>정치</el-menu-item></a>
            <a href='/b/feedback'><el-menu-item index='4-3'>건의</el-menu-item></a>
          </el-submenu>
          <el-menu-item index='5'><a href='/b/girl'>연예인</a></el-menu-item>
          <el-menu-item index='6'><a href='/b/anime'>애니메이션</a></el-menu-item>
          <el-menu-item index='7'><a href='/b/notice'>공지</a></el-menu-item>
          <el-menu-item index='8'><a href='/signin'>로그인</a></el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xl='4' hidden-lg-and-down><div class='grid-content' /></el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>

<style>
  .Header {
    position: relative;
    margin-bottom: 1rem;
    background-color: #FFF;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    overflow: visible;
    z-index: 1;
  }

  .el-menu {
    border: 0 !important;
  }

  .grid-content {
    margin: 0;
  }

  .Logo {
    padding-left: 0;
    border-bottom-color: transparent !important;
  }
  .Logo:hover {
    opacity: 0.8;
  }
  .Logo img {
    padding-bottom: 5px;
  }

  .Down {
    padding-bottom: 5px;
  }

  .Right {
    float: right;
  }
</style>