<template>
  <div>
    <el-menu :default-openeds='["5", "6"]'>
      <el-menu-item index='1' @click='move("/b/best")'>
        <font-awesome-icon icon='star' />
        <span>인기</span>
      </el-menu-item>
      <el-menu-item index='2' @click='move("/b/all")'>
        <span>전체</span>
      </el-menu-item>
      <el-menu-item index='3' @click='move("/b/girl")'>
        <span>연예</span>
      </el-menu-item>
      <el-menu-item index='4' @click='move("/b/talk")'>
        <span>토크</span>
      </el-menu-item>
      <el-submenu index='5'>
        <template slot='title'>게시판</template>
        <el-menu-item index='5-1' @click='move("/b/feedback")'>건의</el-menu-item>
        <el-menu-item index='5-2' @click='move("/b/notice")'>공지</el-menu-item>
      </el-submenu>
      <el-submenu index='6'>
        <template slot='title'>포인트</template>
        <el-menu-item index='6-1' @click='move("/sticker")'>스티커샵</el-menu-item>
        <el-menu-item index='6-2' @click='move("/iconshop")'>아이콘샵</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    methods: {
      move(path) {
        this.$store.commit('forceUpdate')
        this.$store.commit('setAside')
        this.$router.push({ path })
      }
    }
  }
</script>