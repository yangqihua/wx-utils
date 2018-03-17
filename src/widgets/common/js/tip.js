/**
 * 提示与加载工具类
 */
export default class Tips {
    constructor() {
        this.isLoading = false;
    }

    /**
     * 弹出提示框
     */

    static success(title, duration = 1500) {
        wx.showToast({
            title: title,
            image: "/widgets/common/assets/images/yes.png",
            mask: true,
            duration: duration
        });
    }

    /**
     * 弹出确认窗口
     */
    static confirm({text, payload = {}, title = "温馨提示", cancelText = '取消', confirmText = '确定'}) {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: title,
                content: text,
                cancelText: cancelText,
                cancelColor: '#333',
                confirmText: confirmText,
                confirmColor: '#ff0077',
                showCancel: true,
                success: res => {
                    if (res.confirm) {
                        resolve(payload);
                    } else if (res.cancel) {
                        reject(payload);
                    }
                },
                fail: res => {
                    reject(payload);
                }
            });
        });
    }


    /**
     * 弹出窗口
     */
    static alert({text, payload = {}, title = "提示"}) {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: title,
                content: text,
                showCancel: false,
                success: res => {
                    resolve(payload);
                },
                fail: res => {
                    reject(payload);
                }
            });
        });
    }

    static toast(title) {
        wx.showToast({
            title: title,
            image: "/widgets/common/assets/images/info.png",
            mask: false,
            duration: 1500
        });
    }


    /**
     * 错误框
     */
    static error(title, onHide) {
        wx.showToast({
            title: title,
            image: "/widgets/common/assets/images/error.png",
            mask: true,
            duration: 1500
        });
    }

    /**
     * 弹出加载提示
     */
    static loading(title = "加载中") {
        if (Tips.isLoading) {
            return;
        }
        Tips.isLoading = true;
        wx.showLoading({
            title: title,
            mask: true
        });
    }

    /**
     * 加载完毕
     */
    static loaded() {
        if (Tips.isLoading) {
            Tips.isLoading = false;
            wx.hideLoading();
        }
    }

    static share(title, desc, imageUrl, path) {
        return {
            title: title,
            path: path,
            desc: desc,
            imageUrl: imageUrl,
            success: (res) => {
                Tips.success("分享成功");
            },
            fail: (err) => {
                // Tips.error("取消分享");
            }
        };
    }
}

/**
 * 静态变量，是否加载中
 */
Tips.isLoading = false;
