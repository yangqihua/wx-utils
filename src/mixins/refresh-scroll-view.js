import wepy from 'wepy'

export default class testMixin extends wepy.mixin {

    onReachBottom() {
        this.$invoke('refresh-scroll-view', 'loadMore')
        console.log('onReachBottom')
    }
    onPageScroll(e) {
        this.$invoke('refresh-scroll-view', 'onPageScroll',e)
        console.log('onPageScroll')
    }

    onPullDownRefresh() {
        this.$invoke('refresh-scroll-view', 'refresh')
        console.log('onPullDownRefresh')
    }

}
