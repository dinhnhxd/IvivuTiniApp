

Page({
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

        response.forEach(element => {
          element.minPrice=(element.minPrice/1000).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(',','.')
        });
        this.setData({response, loading: false });
      }
    });
    
},
  filter(){
    my.navigateTo({ url: "pages/tabBar/filter/index" });
  }
});