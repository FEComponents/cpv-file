<!--
 * @Author: ywuangi
 * @LastEditTime: 2020-12-02 12:00:06
 * @LastEditors: your name
 * @Description:
-->

```vue
<template>
  <div>
    <Form ref="formData" :model="formData" :label-width="160">
      <cpv-file v-bind="childProp" />
    </Form>
    <Button @click="submit" type="success">提交</Button>
    {{ formData }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      /*
       * @childProp
       */
      childProp: {
        name: '附件上传',
        prop: 'file',
        required: true,
        maxSize: 1024 * 10, //10M
        multiple: false,
        fileNum: 1,
        token: '126dcc1f-5bb6-45b4-9c2a-1e74b28ecbe6', //请求携带的 token
        baseUrl: 'oscs-api' //转发地址
      },
      formData: {},
      modalType: 'readonly'
    }
  },
  provide() {
    return {formData: this.formData, modalType: this.modalType}
  },
  methods: {
    submit() {
      this.$refs.formData.validate(valid => {
        if (valid) {
        }
      })
    }
  }
}
</script>
```
