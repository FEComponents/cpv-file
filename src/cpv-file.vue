<template>
  <FormItem
    :label="childProp.name"
    :prop="childProp.prop"
    :rules="ruleValidate"
  >
    <Row>
      <template v-if="modalType !== 'readonly'">
        <Col span="6">
          <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :headers="headers"
            :before-upload="handleBeforeUpload"
            :max-size="1024 * childProp.maxSize"
            :on-exceeded-size="handleMaxSize"
            :multiple="childProp.multiple"
            :action="baseUrl + '/file-api/uploadFile'"
          >
            <Button icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
        </Col>
      </template>
      <template v-if="waitUpload.length > 0">
        <Col span="24">
          <ul
            v-for="(item, index) in waitUpload"
            :key="index"
            class="file-list"
          >
            <li>
              文件名: <span style="font-size:14px;">{{ item.name }}</span>
              <Icon
                @click="delWaitFileList(index)"
                type="ios-close"
                size="20"
                style="float:right;"
              ></Icon>
            </li>
          </ul>
          <Button
            :loading="loading"
            @click="handleUpload"
            :disabled="modalType === 'readonly'"
            type="primary"
            >上传</Button
          >
        </Col>
      </template>

      <template v-if="!childProp.multiple">
        <Col span="18" v-if="formData[childProp.prop]">
          <a :href="formData[childProp.prop].url" target="_blank">{{
            formData[childProp.prop].name
          }}</a>
        </Col>
      </template>
      <template v-else>
        <Col
          span="24"
          v-for="(item, index) in formData[childProp.prop]"
          :key="index"
        >
          <a :href="item.url" target="_blank">{{ item.name }}</a>
          <Icon
            @click="delFileList(index)"
            :disabled="modalType === 'readonly'"
            type="ios-close"
            size="20"
            style="float:right;"
          ></Icon>
        </Col>
      </template>
    </Row>
    <Row style="position:relative;" v-if="loading">
      <Spin><Tag color="warning">文件上传中 ! 请耐心等待...</Tag></Spin>
      <div style="margin:50px;position:relative;">
        <Spin fix size="large"></Spin>
      </div>
    </Row>
  </FormItem>
</template>

<script>
import axios from 'axios'
import config from '@/config'
import {getToken} from '@/libs/util'

export default {
  name: 'CpvFile',
  props: {
    childProp: {
      type: Object
    },
    formData: {
      type: Object
    },
    modalType: {
      type: String
    }
  },
  data() {
    return {
      waitUpload: [],
      loading: false
    }
  },
  computed: {
    baseUrl() {
      let url =
        process.env.NODE_ENV === 'development'
          ? config.baseUrl.dev
          : config.baseUrl.pro
      return url
    },
    headers() {
      return this.childProp.multiple
        ? {
            'Content-Type': 'multipart/form-data',
            'GATEWAY-TOKEN': this.getTokens()
          }
        : {
            'GATEWAY-TOKEN': this.getTokens()
          }
    },
    ruleValidate() {
      let childProp = this.childProp
      let multiple = childProp.multiple
      if (childProp.required) {
        return [
          {
            required: true,
            type: multiple ? 'array' : 'object',
            message: '请上传' + childProp.name,
            trigger: 'change'
          }
        ]
      } else {
        return []
      }
    }
  },
  methods: {
    getTokens() {
      return getToken()
    },
    delWaitFileList(index) {
      this.waitUpload.splice(index, 1)
    },
    delFileList(index) {
      this.formData[this.childProp.prop].splice(index, 1)
    },
    handleBeforeUpload(file) {
      let childProp = this.childProp
      let formData = this.formData
      let that = this
      if (childProp.multiple) {
        let waitUploadLength = that.waitUpload.length || 0
        let curLength = formData[childProp.prop]?.length || 0
        // 限制长度

        if (waitUploadLength + curLength >= childProp.fileNum) {
          this.$Message.info(`最多只能上传${childProp.fileNum}个文件`)
        } else {
          that.waitUpload.push(file)
        }
        return false
      } else if (!childProp.multiple) {
        this.loading = true
        return true
      } else {
        return true
      }
    },
    handleUpload() {
      let that = this
      let childProp = this.childProp
      let formData = this.formData
      if (that.waitUpload.length > 0) {
        that.loading = true
        // 创建 formData 对象
        let form = new FormData()

        // 多个文件上传
        for (let i = 0; i < that.waitUpload.length; i++) {
          form.append('files', that.waitUpload[i]) // 文件对象
        }

        axios
          .post(that.baseUrl + '/file-api/batchUploadFileByFile', form, {
            timeout: 10000,
            headers: this.headers
          })
          .then(function(rdata) {
            if (rdata.data.code === '0') {
              that.loading = false
              that.waitUpload = []
              let list = rdata.data.content
              let arrays = []

              list.forEach(elems => {
                arrays.push({
                  url: elems.fileUrl,
                  name: elems.fileName
                })
              })
              let cur = formData[childProp.prop] || []

              let total = cur.concat(arrays)
              if (!formData[childProp.prop]) {
                that.$set(formData, childProp.prop, total)
              } else {
                formData[childProp.prop] = total
              }
            } else {
              that.loading = false
              that.failMsg('服务器错误，请重新上传')
            }
          })
          .catch(function(error) {
            that.loading = false
            that.failMsg('服务器错误' + error)
          })
      } else {
        that.$Message.error('请至少上传一个文件')
      }
    },
    uploadSuccess(res, file) {
      this.loading = false
      if (res.code === '0') {
        file.url = res.content

        let childProp = this.childProp
        let formData = this.formData

        if (!formData[childProp]) {
          this.$set(this.formData, this.childProp.prop, {
            url: res.content,
            name: file.name
          })
        } else {
          formData[childProp] = {url: res.content, name: file.name}
        }
      } else {
        this.failMsg(res.msg)
      }
    },
    uploadError(error, file, fileList) {
      this.failMsg(res.msg)
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '' + this.childProp.maxSize + ' 文件大小超出限制, 请不要超过10M.'
      })
    },
    upFormatError(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '' + file.name + '格式不正确，仅支持压缩(zip/rar)格式的文件'
      })
    },
    linkDownload(url) {
      window.open(url, '_blank') // 新窗口打开外链接
    }
  }
}
</script>
