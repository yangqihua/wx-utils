/**
 * Created by yangqihua on 2017/01/17.
 */
import wepy from 'wepy'
import tip from './tip'
import md5 from './md5'

const BASE_URL = 'https://www.qu-gou.com'
const PROJECT_ID = '123'
const KEY = '123'
const TIMESTAMP = Math.round(new Date().getTime() / 1000)

class HTTPUtil {
    static async wxRequest(url, params = {}, isLoading = true, method = 'GET', headers = {}) {
        let sign = HTTPUtil.getSign(url)
        let token = HTTPUtil.getToken(url)
        let userId = HTTPUtil.getUserId()

        headers['content-type'] = 'application/json'
        isLoading && tip.loading()
        let result = await wepy.request({
            url: BASE_URL + '/api/' + url + '?sign=' + sign + '&token=' + token + '&loginuserid=' + userId + '&timestamp=' + TIMESTAMP,
            data: params,
            method: method,
            header: headers,
        }).catch((fail) => {
            // 1.客户端类型异常
            isLoading && tip.loaded()
            tip.alert({text:'请求数据异常'})
        })
        result && isLoading && tip.loaded()
        // 2.Http 类型异常
        if (result && result['statusCode'] !== 200) {
            if (result['statusCode'] === 500) {
                tip.alert({text:'服务器异常'})
            } else {
                tip.alert({text:'code:' + result['statusCode']})
            }
            return null
        }
        result = result.data
        // 3.业务类型异常
        if (result.hasOwnProperty('status') && result['status'] !== 1) {
            if(result['status'] ==101){
                wx.navigateTo({
                    url: 'pages/common/bind-phone',
                })
            }else{
                tip.alert({text:result.message || '未知错误'})
            }
            return null
        }
        return result.result

    }

    static async get(params = {}, url, isLoading = true) {
        return await HTTPUtil.wxRequest(url, params, isLoading)
    }

    static async put(params = {}, url, isLoading = true) {
        return await HTTPUtil.wxRequest(url, params, isLoading,'PUT')
    }

    static async post(params = {}, url, isLoading = true) {
        return await HTTPUtil.wxRequest(url, params, isLoading,'POST')
    }

    static async delete(params = {}, url, isLoading = true) {
        return await HTTPUtil.wxRequest(url, params, isLoading,'DELETE')
    }

    static getSign(url) {
        let sign =
            TIMESTAMP +
            url.toLowerCase() +
            KEY +
            PROJECT_ID +
            'localhost'
        return md5(sign)
    }

    static getToken(url) {
        if (url.substring(0, 1) !== '/') {
            url = '/' + url
        }
        let userInfo = wepy.getStorageSync('userInfo')
        // todo: for debug or test
        let userName = 'admin'
        // let userName = userInfo.userName && userInfo.userName.toLowerCase() || ''
        return md5(url.toLowerCase() + TIMESTAMP + userName)
    }

    static getUserId() {
        let userInfo = wepy.getStorageSync('userInfo')
        // todo: for debug or test
        return 1
        // return userInfo.id
    }

}

export default HTTPUtil