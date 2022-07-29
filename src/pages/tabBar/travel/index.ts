Page({
  data: {
    fixedHeader: false,
    items: Array.from(Array(100).keys()),
    iconSize: [20, 30, 40, 50, 60],
    iconColor: ['red', 'yellow', 'blue', 'green'],
    iconType: ['adjustment']
  },
  onPageScroll(event: { scrollTop: number; }) {
    this.setData({ fixedHeader: event.scrollTop > 20 });
  },
  onTapCart() {
    console.log('onTapCart');
  },
  onInput(e: { detail: { value: any; }; }) {
    console.log('onInput', e.detail.value);
  },
});