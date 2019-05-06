<template>
  <div>
    <Loading v-if='loading' />
    <div class='Container'>
      <el-row>
        <el-col :xl='4' hidden-lg-and-down><div class='grid-content'></div></el-col>
        <el-col :xl='16'>
          <div class='containerSubject'>
            <font-awesome-icon icon='pencil-alt' />
            {{ getBoardName(domain) }} 게시판 글 작성
          </div>
          <div class='topicWrite'>
            <div class='marginBottom' v-if='$store.state.user.isLogged && $store.state.user.isAdmin > 0'>
              <el-switch v-model='form.isNotice' active-color='#29313D'></el-switch>
              공지사항
            </div>
            <div class='marginBottom'>
              <el-input size='medium' placeholder='100자 제한' v-model='form.title' autofocus>
                <template slot='prepend'>제목</template>
              </el-input>
            </div>
            <no-ssr placeholder='에디터를 불러오고 있습니다...'>
              <vue-editor
                id='editor'
                :editorToolbar='[
                  [{ "size": ["small", false, "large", "huge"] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ "align": "" }, { "align": "center" }, { "align": "right" }, { "align": "justify" }],
                  ["blockquote", "code-block"],
                  [{ "header": 1 }, { "header": 2 }],
                  [{ "list": "ordered"}, { "list": "bullet" }, { "list": "check" }],
                  [{ "indent": "-1"}, { "indent": "+1" }],
                  [{ "color": [] }, { "background": [] }],
                  ["link", "clean"]
                ]'
                :editorOptions='{ placeholder: "이곳에 내용을 입력하세요." }'
                v-model='form.content' />
            </no-ssr>
            <div class='marginTop'>
              <input
                type='file'
                multiple='multiple'
                @change='imageUpload'
              />
              10MB
            </div>
          </div>
          <div class='marginTop'>
            <el-button class='widthAll' type='primary' size='medium' @click='write'>작성</el-button>
          </div>
        </el-col>
        <el-col :xl='4' hidden-lg-and-down><div class='grid-content'></div></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Loading from '~/components/loading.vue'
  import axios from 'axios'
  
  export default {
    components: { Loading },
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
    async asyncData ({ params }) {
      const domain = params.domain
      return { domain }
    },
    methods: {
      getBoardName(domain) {
        let boardName = ''
        switch (domain) {
          case 'all':
            boardName = '전체'
            break
          case 'best':
            boardName = '인기'
            break
          case 'girl':
            boardName = '연예'
            break
          case 'anime':
            boardName = '애니'
            break
          case 'talk':
            boardName = '토크'
            break
          case 'social':
            boardName = '정치'
            break
          case 'feedback':
            boardName = '건의'
            break
          case 'notice':
            boardName = '공지'
            break
        }
        return boardName
      },
      write: async function() {
        if (this.loading) return
        if (this.form.title === '') return this.$message.error('제목을 입력하세요.')
        if (this.form.content === '') return this.$message.error('본문을 입력하세요.')
        if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
        const token = this.$store.state.user.token
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
        this.$router.push({ path: `/b/${this.domain}/${data.topicId}` })
      },
      imageUpload: async function(e) {
        if (this.loading || e.target.files.length < 1) return
        if (!this.$store.state.user.isLogged) return this.$message.error('로그인하세요.')
        const token = this.$store.state.user.token
        this.loading = true
        await this.imageUploadToServer(e.target.files)
      },
      imageUploadToServer: async function(files, index = 0) {
        const LIMITS = 10485760
        const formData = new FormData()
        formData.append('type', 'file')
        formData.append('image', files[index], files[index].name)
        if (!/(.gif|.png|.jpg|.jpeg|.webp)/i.test(files[index].name)) this.$message.error(`${index + 1}번째 이미지 업로드 실패... (gif, png, jpg, jpeg, webp만 가능)`)
        else if (files[index].size > LIMITS) this.$message.error(`${index + 1}번째 이미지 업로드 실패... (10MB 이하만 업로드 가능)`)
        else {
          const { data } = await axios.post(
            '/api/cloud/topic',
            formData,
            { headers: { 'content-type': 'multipart/form-data' } }
          )
          if (data.status === 'ok') {
            const name = files[index].name
            const filename = `https://hawawa.co.kr/img/${data.filename}`
            this.$message.success(`${index + 1}번째 이미지 (${name}) 업로드 성공!`)
            this.images.push({
              name,
              filename: data.filename,
              link: filename
            })
            this.selectedImage = filename
            this.form.content += `<p><img src='${filename}'></p><p></p>`
          } else {
            this.$message.error(`${index + 1}번째 이미지 업로드 실패...`)
          }
        }
        if (index === files.length - 1) return this.loading = false
        await this.imageUploadToServer(files, index + 1)
      }
    }
  }
</script>

<style>
  .topicWrite {
    padding: .5rem;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
    background: #FFF;
    font-size: .9rem;
  }
</style>