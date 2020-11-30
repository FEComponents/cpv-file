<template>
  <FormItem
    :label="childProp.name"
    :prop="childProp.prop"
    :rules="ruleValidate"
  >
    <Row>
      <!-- form表单状态判断 -->
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
            :action="childProp.baseUrl + '/file-api/uploadFile'"
          >
            <Button icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
        </Col>
      </template>
      <!-- 等待上传的文件列表 -->
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
                type="ios-close"
                size="20"
                style="float:right;"
                @click="delWaitFileList(index)"
              ></Icon>
            </li>
          </ul>
          <Button :loading="loading" type="primary" @click="handleUpload"
            >上传</Button
          >
        </Col>
      </template>
      <!-- 单个文件上传 -->
      <template v-if="!childProp.multiple">
        <Col v-if="formData[childProp.prop]" span="18">
          <a :href="formData[childProp.prop].url" target="_blank">{{
            formData[childProp.prop].name
          }}</a>
        </Col>
      </template>
      <!-- 多个文件上传 -->
      <template v-else>
        <Col
          v-for="(item, index) in formData[childProp.prop]"
          :key="index"
          span="24"
        >
          <!-- 点击打开文件链接 -->
          <a :href="item.url" target="_blank">{{ item.name }}</a>
          <!-- 删除文件 -->
          <Icon
            :disabled="modalType === 'readonly'"
            type="ios-close"
            size="20"
            style="float:right;"
            @click="delFileList(index)"
          ></Icon>
        </Col>
      </template>
    </Row>
    <!-- loading效果 -->
    <Row v-if="loading" style="position:relative;">
      <Spin><Tag color="warning">文件上传中 ! 请耐心等待...</Tag></Spin>
      <div style="margin:50px; position:relative;">
        <Spin fix size="large"></Spin>
      </div>
    </Row>
  </FormItem>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CpvFile',
  props: {
    /**
     * 表单属性相关
     * { name: '附件上传',
        prop: 'file',
        required: true,
        maxSize: 1024 * 10, //10M
        multiple: false,
        fileNum: 1,
        token: '126dcc1f-5bb6-45b4-9c2a-1e74b28ecbe6',//请求携带的 token
        baseUrl: 'oscs-api'//转发地址
      }
     */
    childProp: {
      type: Object,
      required: true,
      default: () => ({})
    },
    /**
     * form对象
     * { }
     */
    formData: {
      type: Object,
      required: true,
      default: () => ({})
    },
    /**
     * 表单状态：create、edit、readonly
     */
    modalType: {
      type: String,
      default: 'readonly'
    }
  },
  data() {
    return {
      waitUpload: [],
      loading: false
    }
  },
  computed: {
    //上传请求的headers
    headers() {
      let childProp = this.childProp
      return childProp.multiple
        ? {
            'Content-Type': 'multipart/form-data',
            'GATEWAY-TOKEN': childProp.token
          }
        : {
            'GATEWAY-TOKEN': childProp.token
          }
    },
    //表单校验
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
    // 删除待上传文件
    delWaitFileList(index) {
      this.waitUpload.splice(index, 1)
    },
    //删除已上传文件
    delFileList(index) {
      this.formData[this.childProp.prop].splice(index, 1)
    },
    //文件上传前钩子
    handleBeforeUpload(file) {
      let childProp = this.childProp
      let formData = this.formData
      let that = this

      if (childProp.multiple) {
        //是否支持多个
        let waitUploadLength = that.waitUpload.length || 0
        let curLength = formData[childProp.prop]?.length || 0
        // 限制长度

        if (waitUploadLength + curLength >= childProp.fileNum) {
          //上传数量限制
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
    //手动上传
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
                //判断当前form有无当前属性 而赋值
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
    //上传成功钩子
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
    //上传失败
    uploadError(error) {
      this.failMsg(error)
    },
    //文件大小超出
    handleMaxSize() {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '' + this.childProp.maxSize + ' 文件大小超出限制, 请不要超过10M.'
      })
    },
    //文件格式校验
    upFormatError(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '' + file.name + '格式不正确，仅支持压缩(zip/rar)格式的文件'
      })
    },
    //下载
    linkDownload(url) {
      window.open(url, '_blank') // 新窗口打开外链接
    }
  }
}
</script>
