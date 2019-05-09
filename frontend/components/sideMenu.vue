<template>
  <div>
    <el-menu :default-openeds='["3"]'>
      <el-menu-item index='1' @click='move("/b/all")'>
        <font-awesome-icon icon='comment-dots' />
        <span>전체</span>
      </el-menu-item>
      <el-menu-item index='2' @click='move("/b/best")'>
        <font-awesome-icon icon='star' />
        <span>인기</span>
      </el-menu-item>
      <el-menu-item index='3' @click='move("/b/ilbe")'>
        <font-awesome-icon icon='archive' />
        <span>일베</span>
      </el-menu-item>
      <el-menu-item index='4' @click='move("/b/girl")'>
        <span>연예</span>
      </el-menu-item>
      <el-menu-item index='5' @click='move("/b/anime")'>
        <span>애니</span>
      </el-menu-item>
      <el-submenu index='6'>
        <template slot='title'>게시판</template>
        <el-menu-item index='6-1' @click='move("/b/talk")'>토크</el-menu-item>
        <el-menu-item index='6-2' @click='move("/b/social")'>사회</el-menu-item>
        <el-menu-item index='6-3' @click='move("/b/feedback")'>건의</el-menu-item>
        <el-menu-item index='6-4' @click='move("/b/notice")'>공지</el-menu-item>
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