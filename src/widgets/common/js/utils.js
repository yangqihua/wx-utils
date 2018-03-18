/**
 * Created by yangqihua on 2018/2/23.
 */
import tip from './tip'
// 判断是否为手机号
export function isMobilePhone(mPhone) {
    let re = /^[1][3,4,5,7,8][0-9]{9}$/
    return re.test(mPhone)
}

// 判断是否为电话号码
export function isTelephone(tel) {
    let re = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    return re.test(tel)
}

export function isPhone(phone) {
    return isMobilePhone(phone) || isTelephone(phone)
}

export function isEmail(email) {
    let re = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/;
    return re.test(email)
}

export function createAnimation(timingFunction) {
    return wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 200,
        timingFunction: timingFunction,
        delay: 0
    })
}

export function deepCopy(obj) {
    if (typeof obj !== 'object' || !obj) {
        return obj;
    }
    let newObj = obj.constructor === Array ? [] : {};
    for (let i in obj) {
        newObj[i] = typeof obj[i] === 'object' ?
            deepCopy(obj[i]) : obj[i];
    }
    return newObj;
}

export function getDomInfo(id) {
    return new Promise((resolve, reject) => {
        wx.createSelectorQuery().select(id).boundingClientRect(function(rect){
            // rect.id      // 节点的ID
            // rect.dataset // 节点的dataset
            // rect.left    // 节点的左边界坐标
            // rect.right   // 节点的右边界坐标
            // rect.top     // 节点的上边界坐标
            // rect.bottom  // 节点的下边界坐标
            // rect.width   // 节点的宽度
            // rect.height  // 节点的高度
            if (!rect) {
                console.warn('不存在id为' + id + '的节点')
            }
            resolve(rect)
        }).exec()
    })
}

export function pxTorpx(px) {
    let systemInfo = wx.getSystemInfoSync()
    let rate = 750 / systemInfo.windowWidth;
    return px * rate;
}

export function getSystemInfoSync() {
    let systemInfo = wx.getStorageSync('systemInfo')
    if (systemInfo) {
        return systemInfo
    }
    systemInfo = wx.getSystemInfoSync()
    wx.setStorageSync('systemInfo', systemInfo)
    return systemInfo
}

export async function getUserInfo() {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
        return await userInfo
    } else {
        return await getUserInfoFromWx()
    }
}



function resolveDeny() {
    return new Promise(async(resolve, reject) => {
        tip.alert({text: '拒绝授权将不能使用本程序，重新授权？'}).then((result) => {
            wx.openSetting({
                success: async(res) => {
                    if (res.authSetting["scope.userInfo"]) {
                        wx.getUserInfo({
                            success:(userResult)=>{
                                resolve(userResult.userInfo)
                                console.log('重新授权成功,userInfo:', userResult.userInfo)
                            },
                        })
                    } else {
                        resolveDeny().then((userInfo) => {
                            resolve(userInfo)
                        }).catch((error) => reject(error))
                    }
                }, fail: function (error) {
                    reject(error)
                }
            })
        })
    })
}


function getUserInfoFromWx() {
    return new Promise(async(resolve, reject) => {
        wx.getUserInfo({
            success:(userResult)=>{
                wx.setStorageSync('userInfo', userResult.userInfo)
                resolve(userResult.userInfo)
            },
            fail:(error)=>{
                resolveDeny().then((userInfo) => {
                    wx.setStorageSync('userInfo', userInfo)
                    resolve(userInfo)
                }).catch((error) => {
                    reject(error)
                })
            }
        })
    })
}