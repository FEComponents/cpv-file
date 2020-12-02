<!--
 * @Author: ywuangi
 * @LastEditTime: 2020-12-02 12:17:08
 * @LastEditors: your name
 * @Description:
-->
<!--
 * @Author: yuwangi
 * @Date: 2020-11-26 20:18:40
 * @LastEditTime: 2020-11-28 12:14:25
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \npm\cpv-file\README.md
-->

# cpv-file

[![Build Status](https://travis-ci.org/FEComponents/cpv-file.svg?branch=main)](https://travis-ci.org/FEComponents/cpv-file.svg?branch=main)
[![NPM Download](https://badgen.net/npm/dm/@fe-components/cpv-file)](https://www.npmjs.com/package/@fe-components/cpv-file)
[![NPM Version](https://badge.fury.io/js/%40fe-components%2Fcpv-file.svg)](https://www.npmjs.com/package/@fe-components/cpv-file)
[![NPM License](https://badgen.net/github/license/FEComponents/cpv-file)](https://github.com/fe-components/cpv-file/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/fe-components/cpv-file/pulls)
[![Automated Release Notes by gren](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg)](https://github-tools.github.io/github-release-notes/)

文件上传通用组件,依赖于 `iview` 插件 👏

## Table of Contents

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Links](#links)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)

## Features

- 支持表单校验
- 支持单/多个文件上传
- 支持限制文件格式
- 支持限制文件大小
- 支持限制文件个数
- 支持多种文件格式上传

  - [x] txt
  - [x] zip
  - [x] rar
  - [x] ...

[⬆ Back to Top](#table-of-contents)

## Install

```bash
yarn add @fe-components/cpv-file
```

[⬆ Back to Top](#table-of-contents)

## Usage

```vue
<cpv-file v-bind="childProp" />

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
//具体用法参考 docs/
```

[⬆ Back to Top](#table-of-contents)

## Links

- [docs](https://fe-components.github.io/cpv-file/)

[⬆ Back to Top](#table-of-contents)

## Contributing

For those who are interested in contributing to this project, such as:

- report a bug
- request new feature
- fix a bug
- implement a new feature

Please refer to our [contributing guide](https://github.com/FEComponents/.github/blob/main/CONTRIBUTING.md).

[⬆ Back to Top](#table-of-contents)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<table>
  <tr><td align="center"><a href="https://yuwangi.github.io"><img src="https://static.opechk.com/dist/other/343046650.jpg" width="100px;" alt="" /><br /><sub><b>yuwangi</b></sub></a><br /><a href="https://github.com/FEComponents/cpv-file/commits?author=yuwangi" title="Code">💻</a> <a href="https://github.com/FEComponents/cpv-file/commits?author=yuwangi" title="Documentation">📖</a> <a href="https://github.com/FEComponents/cpv-file/commits?author=yuwangi" title="Tests">⚠️</a> <a href="#translation-yuwangi" title="Translation">🌍</a><a href="https://github.com/FEComponents/cpv-file/issues?q=author%3Ayuwangi" title="Bug reports">🐛</a></td>
  <td align="center"><a href="https://github.com/ynwshy"><img src="https://static.opechk.com/dist/other/28115432.jpg" width="100px;" alt="" /><br /><sub><b>ynwshy</b></sub></a><br /><a href="https://github.com/FEComponents/cpv-file/commits?author=ynwshy" title="Code">💻</a> <a href="https://github.com/FEComponents/cpv-file/issues?q=author%3Aynwshy" title="Bug reports">🐛</a></td>
  </tr>
  
</table>

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

[⬆ Back to Top](#table-of-contents)

## License

[MIT](./LICENSE)

[⬆ Back to Top](#table-of-contents)
