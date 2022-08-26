
Page({
  data: {
    listitems: [],
    show: false
  },
  onLoad(query){
    console.log(query);
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
        this.listitems=response;
        

       
        this.setData({response, loading: false });
      }
    });
    
},
  // filter(){
  //   let unique;
  //   const key = 'regionName';
  //   let items = this.listitems.map(item => [item[key], item]);
  //   unique = [...new Map(items).values()];
  //   if (!topDealService.listRegion) {
  //     topDealService.listRegion=unique;
  //   }
  //   // my.navigateTo({ url: "pages/tabBar/filter/index"});
  //   if (my.canIUse("showActionSheet")) {
  //     my.showActionSheet({
  //       title: "Bộ lọc",
  //       items: ["Button 1", "Button 2", "Button 3"],
  //       destructiveBtnIndex: 2,
  //       success: (res) => {
  //         const btn = res.index === -1 ? "Cancel" : "at index " + res.index;
       
  //       },
  //     });
  //   }
  // },
  onShowBottomSheet(e) {
    this.setData({
      show: true,
      template: e.target.dataset.template,
    });
  },
  onHoteletail(index){
    console.log('index ',index.currentTarget.dataset.id)
    let hotelid = index.currentTarget.dataset.id
    my.navigateTo({ url: "pages/tabBar/hoteldetail/index?"+hotelid});
  },
  checkRegion(l) {
    return l.ischeck
  },
});

