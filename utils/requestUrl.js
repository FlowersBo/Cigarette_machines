const app = getApp();
import * as api from '../config/api';

function request(url, data = {}, method = "GET") {
  let param = objectToJsonParams(data);
  console.log(param);
  return new Promise(function (resolve, reject) {
    console.log(url + param)
    wx.request({
      url: url + param,
      method: method,
      header: {
        'charset': 'utf-8',
        'Content-Type': 'application/json',
        'app-refresh-token': wx.getStorageSync('refreshToken'),
        'app-access-token': wx.getStorageSync('accessToken'),
        'grant-type': 'refresh-token',
        'username': wx.getStorageSync('username'),
      },
      success: function (resp) {
        console.log("success");
        console.log(resp);
        if (resp.data.code === 200) {
          resolve(resp);
        } else {
          console.log("reject")
          reject(resp.errMsg);
        }

        //Unauthorized
        if (resp.data.code === 401) {
          refreshToken().then((resp) => {
            if (resp.data.code === 200) {
              request(url, data, method).then((resp) => {
                resolve(resp);
              });
            } else {
              reject(resp);
            }
          });
        } else {
          resolve(resp.data);
        }
        if (!resp.data.message) {
          wx.showToast({
            title: '服务器错误，请稍后重试',
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
};
// const siteRoots = app.data.siteroot;
let ajaxTimes = 0;
const wxRequest = (url, data = {}, method = 'POST') => {
  ajaxTimes++;
  wx.showLoading({
    // mask: true,
    title: '加载中...',
  })
  // let param = objectToJsonParams(data);
  console.log(data);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'charset': 'utf-8',
        'Content-Type': 'application/json',
        'grant-type': 'refresh-token',
        'app-refresh-token': wx.getStorageSync('refreshToken'),
        'app-access-token': wx.getStorageSync('accessToken'),
        'username': wx.getStorageSync('username'),
      },
      success: function (res) {
        // console.log('请求数据',res);
        // wx.hideLoading();
        if (res.statusCode != 200) {
          reject({
            error: '服务器忙，请稍后重试',
            code: 500
          });
          return;
        }
        resolve(res.data);
      },
      fail: function (res) {
        // fail调用接口失败
        reject({
          error: '网络错误',
          code: 0
        });
      },
      complete: function (res) {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading()
        }
      }
    })
  })
}

const wxGetRequest = (url, data = {}, method = 'GET') => {
  ajaxTimes++;
  wx.showLoading({
    // mask: true,
    title: '加载中',
  })
  let param = objectToJsonParams(data);
  console.log(url + param);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url + param,
      method: method,
      header: {
        'charset': 'utf-8',
        'Content-Type': 'application/json',
        'grant-type': 'refresh-token',
        'app-refresh-token': wx.getStorageSync('refreshToken'),
        'app-access-token': wx.getStorageSync('accessToken'),
        'username': wx.getStorageSync('username'),
      },
      success: function (resp) {
        console.log(resp);
        if (resp.statusCode === 200) {
          resolve(resp);
        } else {
          reject(resp.errMsg, resp.statusCode);
        }

        //Unauthorized
        if (resp.statusCode === 401) {
          refreshToken().then((resp) => {
            if (resp.data.code === 200) {
              request(url, data, method).then((resp) => {
                resolve(resp);
              });
            } else {
              reject(resp);
            }
          });
        } else {
          resolve(resp.data);
        }
        if (!resp.data) {
          wx.showToast({
            title: '服务器错误，请稍后重试',
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail: function (err) {
        reject('整体错误', err)
        wx.showToast({
          title: '请求超时',
          icon: 'none',
          duration: 2000
        });
      },
      complete: (res) => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading()
        }
      }
    })
  });
}

//Get Method
function get(url, data = {}) {
  return request(url, data, 'GET')
}

//Post Method
function post(url, data = {}) {
  return request(url, data, 'POST')
}
//wx login
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
        wx.showToast({
          title: '请求超时',
          icon: 'none',
          duration: 2000
        });
      }
    });
  });
};

//refresh Token
function refreshToken() {
  let role = wx.getStorageSync('role');
  let data = {
    role: role
  }
  let param = objectToJsonParams(data);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: api.RefreshAuth + param,
      method: 'Post',
      header: {
        'charset': 'utf-8',
        'Content-Type': 'application/json',
        'grant-type': 'refresh-token',
        'app-refresh-token': wx.getStorageSync('refreshToken'),
        'app-access-token': wx.getStorageSync('accessToken'),
        'username': wx.getStorageSync('username')
      },
      success: function (resp) {
        if (resp.data.code == 200) {
          wx.setStorageSync('accessToken', resp.data.data.access_token);
          wx.setStorageSync('refreshToken', resp.data.data.refresh_token);
          wx.setStorageSync('username', resp.data.data.username);
        }
        if (!resp.data.message) {
          wx.showToast({
            title: '服务器错误，请稍后重试',
            icon: 'none',
            duration: 1000
          });
        }
        resolve(resp);
      },
      fail: function (err) {
        reject(err);
        // wx.showToast({
        //   title: '请求超时',
        //   icon: 'none',
        //   duration: 1000
        // });
      }
    })
  });
}

//get verification code 获取验证码
function getVerificationCode(data = {}) {
  let param = objectToJsonParams(data);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: api.VerificationCode + param,
      method: 'Post',
      header: {
        'Content-Type': 'application/json',
      },
      success: function (resp) {
        resolve(resp);
        if (!resp.data.message) {
          wx.showToast({
            title: '服务器错误，请稍后重试',
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail: function (err) {
        reject(err);
        wx.showToast({
          title: '请求超时',
          icon: 'none',
          duration: 1000
        });
      }
    })
  });
};

//phone login
function loginPhone(loginInfo = {}, loginUrl) {
  wx.showLoading({
    title: '登录中',
  })
  let param = objectToJsonParams(loginInfo);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: loginUrl + param,
      method: 'Post',
      header: {
        'Content-Type': 'application/json',
      },
      success: function (resp) {
        console.log(resp)
        if (resp.data.code == 200 && resp.data.data) {
          wx.setStorageSync('accessToken', resp.data.data.access_token);
          wx.setStorageSync('refreshToken', resp.data.data.refresh_token);
          wx.setStorageSync('username', resp.data.data.username);
          wx.setStorageSync('info', resp.data.data.info);
          wx.setStorageSync('merchantId', resp.data.data.info.merchantId);
        }
        if (!resp.data.message) {
          wx.showToast({
            title: '服务器错误，请稍后重试',
            icon: 'none',
            duration: 1000
          });
        }
        resolve(resp);
        wx.hideLoading();
      },
      fail: function (err) {
        reject(err);
        wx.showToast({
          title: '请求超时',
          icon: 'none',
          duration: 1000
        });
        wx.hideLoading();
      }
    })
  });
};

function objectToJsonParams(data = {}) {
  var arr = Object.keys(data);
  // console.log(arr)
  // if (arr === 0) {
  if (arr.length === 0) {
    return '';
  } else {
    let params = '?' + JSON.stringify(data).replace(/{/g, '').replace(/}/g, '').replace(/:/g, '=').replace(/\"/g, '').replace(/\,/g, '&');
    return params;
  }
};

// 验证PromiseAll
function myPromiseall(...myArguments) {
  return new Promise((reslove, reject) => {
    let arr = [], // resolove返回值
      err = true, // Promise 状态
      errContent = ""; // 失败提醒
    console.log(myArguments)
    for (var i = 0; i < myArguments.length; i++) {
      //    Promise.resolve(
      console.log(myArguments[i])
      myArguments[i].then(v => {
        arr.push(v)
        if (arr.length === myArguments.length) {
          console.log('成功')
          return reslove(arr);
        }
      }, e => {
        console.log('失败')
        return reject(e)
      })
      //)
    }
  })
};
module.exports = {
  wxRequest,
  wxGetRequest,
  get,
  post,
  login,
  refreshToken,
  getVerificationCode,
  loginPhone,
  myPromiseall
}