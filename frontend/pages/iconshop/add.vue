<template>
  <div>
    <Loading v-if='loading' />
    <el-row>
      <el-col :xl='4' hidden-lg-and-down><div class='blank'></div></el-col>
      <el-col :xl='16'>
        <div class='AD'>
          <adsbygoogle ad-slot='1882412178' />
        </div>
        <div class='containerSubject'>
          <font-awesome-icon icon='pencil-alt' />
          아이콘 등록
        </div>
        <div class='iconAdd'>
          <div class='marginBottom'>
            <el-input size='medium' placeholder='아이콘 이름을 입력하세요.' v-model='form.name' autofocus>
              <template slot='prepend'>아이콘 이름</template>
            </el-input>
          </div>
          <div class='marginBottom'>
            <el-input size='medium' placeholder='아이콘 설명을 입력하세요.' v-model='form.description'>
              <template slot='prepend'>아이콘 설명</template>
            </el-input>
          </div>
          <div class='marginBottom'>
            <el-input type='number' size='medium' placeholder='아이콘 가격은 0 이상 1억 이하로 설정해주세요.' v-model='form.price'>
              <template slot='prepend'>아이콘 가격</template>
            </el-input>
          </div>
          <div class='preview'>
            <img :src='imageData' v-if='imageData'>
          </div>
          <div class='marginTop'>
            <input
              type='file'
              @change='imageUpload' />
            1MB
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
          description: '',
          price: 20
        },
        temps: [],
        imageData: null,
        loading: false
      }
    },
    methods: {
      add: async function(filename) {
        const token = this.$store.state.user.token
        const data = await this.$axios.$post('/api/icon/add', {
          name: this.form.name,
          description: this.form.description,
          price: this.form.price,
          filename
        }, {
          headers: { 'x-access-token': token }
        })
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message || '오류가 발생했습니다.')
        }
        this.$router.push({ path: `/iconshop` })
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
        if (this.form.name === '') return this.$message.error('아이콘 이름을 입력하세요.')
        if (this.form.description === '') return this.$message.error('아이콘 설명을 입력하세요.')
        if (this.form.price < 0 || this.form.price > 100000000) return this.$message.error('아이콘 가격은 0 이상 1억 이하여야 합니다.')
        if (this.temps.length < 1) return this.$message.error('아이콘을 업로드하세요.')
        if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
        this.loading = true
        const LIMITS = 1048576
        const formData = new FormData()
        formData.append('type', 'file')
        formData.append('image', this.temps[0], this.temps[0].name)
        if (!/(.gif|.png|.jpg|.jpeg)/i.test(this.temps[0].name)) this.$message.error('이미지 업로드 실패... (gif, png, jpg, jpeg만 가능)')
        else if (this.temps[0].size > LIMITS) this.$message.error('이미지 업로드 실패... (1MB 이하만 업로드 가능)')
        else {
          const data = await this.$axios.$post(
            '/api/cloud/icon',
            formData,
            { headers: { 'content-type': 'multipart/form-data' } }
          )
          if (data.status === 'ok') {
            const name = this.temps[0].name
            this.$message.success(`이미지 (${name}) 업로드 성공!`)
            await this.add(data.filename)
          } else {
            this.$message.error('이미지 업로드 실패...')
          }
        }
      }
    }
  }
</script>

<style>
  .iconAdd {
    padding: .5rem;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    background: #FFF;
    font-size: .9rem;
  }
  .iconAdd .preview {
    width: 16px;
    height: 16px;
  }
</style>