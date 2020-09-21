import axios from 'axios';
import router from '../router/index';
import store from '../store';
// import Cookies from 'js-cookie';
import { getToken } from '@/utils/auth';
import { baseUrl } from '../common/config';
import { Message, MessageBox } from 'element-ui';
import qs from 'qs';
// let toastLoading;

// 创建axios实例
const $http = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'alpha'
      ? baseUrl
      : '',
  // baseURL: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'alpha') ? baseUrl : '/taozugong',
  timeout: 10000, // 请求超时时间
  responseType: 'json',
  withCredentials: true, // 是否允许带cookie
  headers: {
    'Content-Type': 'application/json'
  }
});

// request 拦截器
$http.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      // Toast("你调用了post请求");
    }

    // 若是有做鉴权token , 就给头部带上token
    // 若是需要跨站点,存放到 cookie 会好一点,限制也没那么多,有些浏览环境限制了 localstorage 的使用
    // console.log('Cookies', getToken());
    if (getToken()) {
      config.headers.Authorization = getToken();
    }

    // 显示loading
    // toastLoading = Toast.loading({
    //   mask: true,
    //   duration:8000,
    //   message: '数据加载中...'
    // });
    // console.log('请求头配置 :', config);
    return config;
  },
  error => {
    // 输出错误信息
    Message({
      type: 'error',
      message: error
    }).then(() => {});

    return Promise.reject(error);
  }
);

// response 拦截器
$http.interceptors.response.use(
  response => {
    // toastLoading.clear();
    return checkStatus(response);
  },

  error => {
    // toastLoading.clear();
    // 用户登录的时候会拿到一个基础信息，比如用户名，token,过期时间戳
    if (error) {
      // 若访问接口的时候没有发现鉴权的基础信息，直接返回登录页
    } else {
      // 如果有基础信息，判断当前时间戳和当前时间，若当前时间大于服务器时间请重新登录
    }

    // 错误页判断
    if (error.response.status === 403) {
      console.log('403');
      Message({
        type: 'error',
        message: '网络错误! 请稍后再试'
      });
    }
    if (error.response.status === 500) {
      console.log('500');
      Message({
        type: 'error',
        message: '服务器报错! 请稍后再试'
      });
    }
    if (error.response.status === 502) {
      console.log('502');
      Message({
        type: 'error',
        message: '服务器报错! 请稍后再试'
      });
    }
    if (error.response.status === 404) {
      console.log('404');
      Message({
        type: 'error',
        message: '网络错误! 请稍后再试'
      });
    }

    return Promise.resolve(error);
  }
);

function checkStatus(response) {
  // loading
  // 如果状态码正常，则直接返回数据
  // console.log("checkStatus", response);

  if (
    (response && response.status === 200) ||
    response.status === 304 ||
    response.status === 400
  ) {
    // 处理token失效情况 code==-110 等于失效
    if (!response.data.status && response.data.code == '-110') {
      // vuex 当登录失效 派遣登出指令 指令已包含token删除
      store.dispatch('LogOut').then(() => {
        console.log('router', router);
        router.replace({
          path: '/login'
        });
      });
    }

    // console.log("config",response.data);
    // 如果不需要除了data 之外的数据 可直接返回过滤后的数据
    if (response.data.status) {
      return response.data;
    } else {
      // Toast(response.data.message);
      return response.data;
    }
    // 如果不需要除了data 之外的数据 可直接返回过滤后的数据
    // return response.data ;
  }

  return {
    code: -404,
    status: false,
    msg: '请求失败，请求所希望得到的资源未被在服务器上发现。'
  };
}

// function checkCode(res) {
//   // 如果 code 异常（这里包括网络错误，服务器错误，后端抛出的错误),可以弹出一个错误提示告诉用户
//   if (res.status === -404) {
//     alert(res.msg);
//   }

//   if (res.data && !res.data.success) {
//     alert(res.data.error_msg);
//   }

//   return res;
// }

export default {
  post(url, data, dataType, contetnType) {
    return $http({
      method: 'post',
      url,
      data: data,
      dataType: dataType || 'json',
      headers: {
        'Content-Type': contetnType || 'application/json;charset=UTF-8'
      }
    });
  },
  get(url, params) {
    console.log(url);
    return $http({
      method: 'get',
      url,
      params
    });
  },
  put(url, data) {
    return $http({
      method: 'put',
      url,
      params: data,
      paramsSerializer: function(params) {
        // arrayFormat可以格式化你的数组参数
        return qs.stringify(params, { arrayFormat: 'brackets' });
      }
    });
  },
  put2(url, data) {
    return $http({
      method: 'put',
      url,
      data: data
    });
  },

  /* *
   * * 封装patch请求
   * * @param url
   * * @param data
   * * @returns {Promise}
   * */

  patch(url, data) {
    return $http({
      method: 'patch',
      url,
      data: data
    });
  },
  delete(url, data) {
    return $http({
      method: 'delete',
      url,
      data: data
    });
  }
};
