<template>
  <div>
    <el-menu :default-openeds='["3"]'>
      <el-menu-item index='1' @click='move("/b/all")'>
        <font-awesome-icon icon='comment-dots' />
        <span>전체글</span>
      </el-menu-item>
      <el-menu-item index='2' @click='move("/b/best")'>
        <font-awesome-icon icon='star' />
        <span>인기글</span>
      </el-menu-item>
      <el-submenu index='3'>
        <template slot='title'>커뮤니티</template>
        <el-menu-item index='3-1' @click='move("/b/talk")'>토크</el-menu-item>
        <el-menu-item index='3-2' @click='move("/b/social")'>정치</el-menu-item>
        <el-menu-item index='3-3' @click='move("/b/feedback")'>건의</el-menu-item>
      </el-submenu>
      <el-menu-item index='4' @click='move("/b/girl")'>
        <span>연예</span>
      </el-menu-item>
      <el-menu-item index='5' @click='move("/b/anime")'>
        <span>애니</span>
      </el-menu-item>
      <el-menu-item index='6' @click='move("/b/notice")'>
        <span>공지</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    methods: {
      move(path) {
        this.$store.commit('setAside')
        this.$router.push({ path })
      }
    }
  }
</script>