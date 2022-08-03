
Page({
  data: {
  },
  onLoad(){
      this.setData({ loading: true });
      my.request({
        url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/TopDeals?pageIndex=1&pageSize=200',
        method: 'POST',
        headers:
        {
          apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
          apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
        },
        success: (response) => {
          this.setData({response, loading: false });
          
        }
      });
      
  },
  numberToCurrency(number: number, thousands: string) {
    var includefee = false
    if (number == undefined)
        return 'undefined';
    let fee = 0;
    if (includefee) {
        fee = 20000;
    }
    var parts = this.round(number + fee, 0).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    return parts.join(thousands);
},
});

