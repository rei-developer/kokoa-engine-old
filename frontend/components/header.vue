<template>
  <div class='Header'>
    <el-row :gutter='0'>
      <el-col :xl='4' hidden-lg-and-down><div class='grid-content' /></el-col>
      <el-col :xl='16'>
        <el-menu
          class='el-menu'
          mode='horizontal'
          :router='true'
          active-text-color='#f78989'>
          <el-menu-item index='1' route='/' class='Logo' @click='forceUpdate'>
            <span class='hidden-desktop'>
              <font-awesome-icon icon='home' />
              HAWAWA.CO.KR
            </span>
            <img src='~/assets/HeaderLogo.png' class='hidden-mobile'>
          </el-menu-item>
          <el-menu-item index='2' route='/b/all' class='hidden-mobile' @click='forceUpdate'>
            <font-awesome-icon icon='comment-dots' />
            전체글
          </el-menu-item>
          <el-menu-item index='3' route='/b/best' class='hidden-mobile' @click='forceUpdate'>
            <font-awesome-icon icon='star' />
            인기글
          </el-menu-item>
          <el-submenu index='4' class='hidden-mobile'>
            <template slot='title'>커뮤니티</template>
            <el-menu-item index='4-1' route='/b/talk' @click='forceUpdate'>토크</el-menu-item>
            <el-menu-item index='4-2' route='/b/social' @click='forceUpdate'>정치</el-menu-item>
            <el-menu-item index='4-3' route='/b/feedback' @click='forceUpdate'>건의</el-menu-item>
          </el-submenu>
          <el-menu-item index='5' route='/b/girl' class='hidden-mobile' @click='forceUpdate'>연예</el-menu-item>
          <el-menu-item index='6' route='/b/anime' class='hidden-mobile' @click='forceUpdate'>애니</el-menu-item>
          <el-menu-item index='7' route='/b/notice' class='hidden-mobile' @click='forceUpdate'>공지</el-menu-item>
          <el-submenu index='8' class='rightMenu' v-if='$store.state.user.isLogged'>
            <template slot='title'>
              <div class='Avatar'>
                <img :src='$store.state.user.profileImageUrl'>
              </div>
              {{ $store.state.user.nickname }}
            </template>
            <el-menu-item @click='development'>프로필 편집</el-menu-item>
            <el-menu-item @click='development'>블라인드 목록</el-menu-item>
            <el-menu-item @click='signOut'>로그아웃</el-menu-item>
          </el-submenu>
          <el-menu-item index='8' route='/signin' class='rightMenu' v-if='!$store.state.user.isLogged'>
            <font-awesome-icon icon='sign-in-alt' />
            로그인
          </el-menu-item>
          <el-menu-item index='9' route='/notice' class='rightMenu' @click='forceUpdate' v-if='$store.state.user.isLogged'>
            <font-awesome-icon icon='bell' />
            <el-badge class='Badge' :value='$store.state.user.noticeCount' v-if='$store.state.user.noticeCount > 0' />
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xl='4' hidden-lg-and-down><div class='grid-content' /></el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    methods: {
      forceUpdate() {
        this.$store.commit('forceUpdate')
      },
      development() {
        this.$alert('현재 개발중입니다. 이용에 불편을 드려 대단히 죄송합니다.', '알림', { confirmButtonText: '확인' })
      },
      signOut() {
        if (!this.$store.state.user.isLogged) return
        this.$store.commit('user/signOut')
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

  .Badge {
    position: absolute;
    margin-top: -10px;
    margin-left: -5px;
    font-weight: normal;
  }

  .Avatar {
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-bottom: 6px;
    padding: 2px;
    border: 1px solid #DDD;
    border-radius: 500rem;
    background: #FFF;
  }
  .Avatar img {
    width: 34px;
    height: 34px;
    margin-bottom: 50px;
    border-radius: 500rem;
  }

  .rightMenu {
    float: right !important;
  }
  .rightMenu .el-submenu__title {
    padding-right: 0 !important;
    font-weight: bold;
  }
</style>