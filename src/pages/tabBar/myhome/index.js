import { topDealService} from '../../../providers/topDealService';

Page({
  data: {
    listitems: [],
    isfilter:false
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
  filter(){
    let unique;
    const key = 'regionName';
    let items = this.listitems.map(item => [item[key], item]);
    unique = [...new Map(items).values()];
    if (!topDealService.listRegion) {
      topDealService.listRegion=unique;
    }
   
    my.navigateTo({ url: "pages/tabBar/filter/index"});
  },
  onShow(){
    let isfilter ;
    topDealService.listRegion.forEach(element => {
      if (element.ischeck) {
        isfilter=true;
        return;
      }

  });
    
      this.setData({
        isfilter: isfilter
      });
  
  },
});
