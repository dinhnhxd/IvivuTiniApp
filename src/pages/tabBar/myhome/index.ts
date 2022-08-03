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
  numberToCurrency(number: any, thousands: any): any{
    var includefee = false
    if (number == undefined){
      return 'undefined';
    }
    else{
      let fee = 0;
      if (includefee) {
          fee = 20000;
      }
      var parts = Math.round(number + fee).toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
      return parts.join(thousands);
    }
   
  },
  newFunction(a:any, b:any){
    console.log(a);
    console.log(b);
    return a +b
  }
});