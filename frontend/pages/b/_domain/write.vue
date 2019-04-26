<template>
  <div>
    <Loading v-if='loading' />
    <Header />
    <div class='Container'>
      <el-row :gutter='0'>
        <el-col :xl='4' hidden-lg-and-down><div class='grid-content' /></el-col>
        <el-col :xl='16'>
          <div class='article'>
            <el-form ref='form' :model='form' label-width='50px'>
              <el-form-item label='공지'>
                <el-switch v-model='form.isNotice' active-color='#f78989'></el-switch>
              </el-form-item>
              <el-form-item label='제목'>
                <el-input v-model='form.title'></el-input>
              </el-form-item>
              <el-form-item label='본문'>
                <no-ssr placeholder='에디터를 불러오고 있습니다...'>
                  <vue-editor
                    id='editor'
                    v-model='form.content'
                    @imageAdded='handleImageAdded'
                    useCustomImageHandler />
                </no-ssr>
              </el-form-item>
              <el-form-item>
                <el-button type='danger' size='medium' @click='write'>작성</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :xl='4' hidden-lg-and-down><div class='grid-content' /></el-col>
      </el-row>
    </div>
    <Footer class='Footer' />
  </div>
</template>

<script>
  import Header from '~/components/header.vue'
  import Footer from '~/components/footer.vue'
  import Loading from '~/components/loading.vue'
  import axios from 'axios'
  
  export default {
    name: 'TopicWrite',
    extends: {},
    data() {
      return {
        domain: '',
        form: {
          category: '',
          title: '',
          content: '',
          isNotice: false
        },
        images: [],
        selectedImage: null,
        editor: null,
        loading: false
      }
    },
    methods: {
      handleImageAdded: async function(file, Editor, cursorLocation, resetUploader) {
        const formData = new FormData()
        formData.append('type', 'file')
        formData.append('image', file, file.name)
        if (!/(.gif|.png|.jpg|.jpeg|.webp)/i.test(file.name)) return this.$message.error('이미지 업로드 실패... (gif, png, jpg, jpeg, webp만 가능)')
        const { data } = await axios.post(
          '/api/cloud/topic',
          formData,
          {
            headers: { 'content-type': 'multipart/form-data' }
          }
        )
        if (data.status !== 'ok') {
          this.loading = false
          return this.$message.error(data.message)
        }
        const name = file.name
        const filename = `https://hawawa.co.kr/img/${data.filename}`
        this.$message.success(`이미지 ${name} 업로드 성공`)
        this.images.push({
          name,
          filename: data.filename,
          link: filename
        })
        this.selectedImage = filename
        await Editor.insertText(cursorLocation, '\n\n')
        await Editor.insertEmbed(cursorLocation, 'image', filename)
        resetUploader()
        this.loading = false
      },
      write: async function() {
        if (this.loading) return
        if (this.form.title === '') return this.$message.error('제목을 입력하세요.')
        if (this.form.content === '') return this.$message.error('본문을 입력하세요.')
        const token = localStorage.token
        if (!token) return this.$message.error('로그인하세요.')
        this.loading = true
        const { data } = await axios.post('/api/topic/write', {
          domain: this.domain,
          category: this.form.category,
          title: this.form.title,
          content: this.form.content, //this.state.editor.getContent(),
          isNotice: this.form.isNotice,
          images: this.images
        }, {
          headers: { 'x-access-token': token }
        })
        if (data.status === 'fail') {
          this.loading = false
          return this.$message.error(data.message)
        }
        localStorage.token = data.token
        this.$message.success('글 작성 성공')
        this.loading = false
        location.href = `/b/${this.domain}/${data.topicId}`
      },
    },
    created() {
      this.domain = this.$nuxt._route.params.domain
    },
    components: {
      Header,
      Footer,
      Loading
    }
  }
</script>

<style>
  .grid-content {
    min-height: 0.02px;
  }

  .Container {

  }

  .article {
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    padding: .5rem;
    background: #FFF;
  }

  .Bottom {
    margin-bottom: .5rem;
  }

  .Footer {
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: -1;
  }
</style>