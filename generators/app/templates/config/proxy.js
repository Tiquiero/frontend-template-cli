/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

const file_url = 'https://182.138.104.162:16480/';
const server_url = 'https://182.138.104.162:16480/'; //162环境

export default {
  dev: {
    '/iqi/api/v1': {
      target: server_url,
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
      secure: false,
    },
    '/iam/api/v1': {
      target: server_url, 
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
      secure: false,
    },
    '/file_server': {
      target: file_url,
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
      secure: false,
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
