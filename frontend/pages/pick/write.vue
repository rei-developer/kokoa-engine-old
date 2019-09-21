<template>
  <div>
    <Loading v-if='loading' />
    <el-row>
      <el-col :xl='4' hidden-lg-and-down><div class='blank'></div></el-col>
      <el-col :xl='16'>
        <div class='containerSubject'>
          <font-awesome-icon icon='pencil-alt' />
          아이돌 등록
        </div>
        <div class='pickWrite'>
          <div class='marginBottom'>
            <el-input size='medium' placeholder='본명이 아닌 예명을 입력하세요.' v-model='form.name' autofocus>
              <template slot='prepend'>아이돌 예명</template>
            </el-input>
          </div>
          <div class='marginBottom'>
            <el-input size='medium' placeholder='공식 아이돌 그룹 이름을 입력하세요.' v-model='form.groupname'>
              <template slot='prepend'>그룹 공식 이름</template>
            </el-input>
          </div>
          <div class='marginBottom'>
            <el-input size='medium' placeholder='검색에 용이한 순한글 아이돌 그룹 이름을 입력하세요.' v-model='form.pureGroupname'>
              <template slot='prepend'>그룹 한글 이름</template>
            </el-input>
          </div>
          <div class='preview'>
            <img :src='imageData' v-if='imageData'>
          </div>
          <div class='marginTop'>
            <input
              type='file'
              @change='imageUpload' />
            5MB
          </div>
        </div>
        <div class='marginVertical'>
          <el-button class='widthAll' type='primary' size='medium' @click='submit'>등록</el-button>
        </div>
      </el-col>
      <el-col :xl='4' hidden-lg-and-down><div class='blank'></div></el-col>
    </el-row>
  </div>
</template>

<script>
  import Library from '~/assets/lib.js'
  import Loading from '~/components/loading.vue'
  
  export default {
    components: { Loading },
    data() {
      return {
        form: {
          name: '',
          groupname: '',
          pureGroupname: ''
        },
        temps: [],
        imageData: null,
        loading: false
      }
    },
    methods: {
      write: async function(filename) {
        const token = this.$store.state.user.token
        const data = await this.$axios.$post('/api/pick/write', {
          name: this.form.name,
          groupname: this.form.groupname,
          pureGroupname: this.form.pureGroupname,
          filename
        }, {
          headers: { 'x-access-token': token }
        })
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message || '오류가 발생했습니다.')
        }
        this.$router.push({ path: `/pick/${data.pickId}` })
      },
      imageUpload: async function(e) {
        this.temps = e.target.files
        const input = e.target
        if (input.files && input.files[0]) {
          const reader = new FileReader()
          reader.onload = event => {
            this.imageData = event.target.result
          }
          reader.readAsDataURL(input.files[0])
        }
      },
      submit: async function() {
        if (this.loading) return
        if (this.form.name === '') return this.$message.error('아이돌 예명을 입력하세요.')
        if (this.form.groupname === '') return this.$message.error('그룹 공식이름을 입력하세요.')
        if (this.form.pureGroupname === '') return this.$message.error('그룹 한글이름을 입력하세요.')
        if (this.temps.length < 1) return this.$message.error('아이돌 사진을 업로드하세요.')
        if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
        this.loading = true
        const LIMITS = 10485760
        const formData = new FormData()
        formData.append('type', 'file')
        formData.append('image', this.temps[0], this.temps[0].name)
        if (!/(.gif|.png|.jpg|.jpeg|.webp)/i.test(this.temps[0].name)) this.$message.error('이미지 업로드 실패... (gif, png, jpg, jpeg, webp만 가능)')
        else if (this.temps[0].size > LIMITS) this.$message.error('이미지 업로드 실패... (10MB 이하만 업로드 가능)')
        else {
          const data = await this.$axios.$post(
            '/api/cloud/pick',
            formData,
            { headers: { 'content-type': 'multipart/form-data' } }
          )
          if (data.status === 'ok') {
            const name = this.temps[0].name
            this.$message.success(`이미지 (${name}) 업로드 성공!`)
            await this.write(data.filename)
          } else {
            this.$message.error('이미지 업로드 실패...')
          }
        }
      }
    }
  }
</script>

<style>
  .pickWrite {
    padding: .5rem;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    background: #FFF;
    font-size: .9rem;
  }
  .pickWrite .preview {
    width: 100px;
    height: auto;
    border-radius: .25rem;
  }
</style>