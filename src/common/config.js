/*
 * @Description:
 * @Version: 1.0
 * @Author: diaoqi
 * @Date: 2020-05-12 10:13:20
 * @LastEditors: diaoqi
 * @LastEditTime: 2020-05-12 10:14:16
 */
let imgBasePath = '';
let baseUrl = '';
let baseApiUrl = '';
let ImageOut = '';

console.log('当前行项目的打包环境', process.env.NODE_ENV);
// let url = '/taozugong'
const url = '';
switch (process.env.NODE_ENV) {
  case 'development':
    // 这里是本地的请求url
    imgBasePath = url;
    ImageOut = 'https://usa-east-static.oss-us-east-1.aliyuncs.com/';
    baseUrl = '';
    break;
  case 'alpha':
    // 注意这里的名字要和.env.alpha中设置的环境名字对应起来
    // 这里是测试环境中的url
    imgBasePath = 'https://usa.api.taozugong.cn';
    baseApiUrl = 'https://usa.api.taozugong.cn';
    baseUrl = 'https://usa.api.taozugong.cn';
    ImageOut = 'https://usa-east-static.oss-us-east-1.aliyuncs.com/';
    break;
  case 'production':
    // 生产环境url
    imgBasePath = 'https://usa.service.taozugong.com';
    baseApiUrl = 'https://usa.service.taozugong.com';
    baseUrl = 'https://usa.service.taozugong.com';
    ImageOut = 'https://usa-east-static.oss-us-east-1.aliyuncs.com/';
    break;
}

export { imgBasePath, baseUrl, baseApiUrl, ImageOut };
