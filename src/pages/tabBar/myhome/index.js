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

        if (topDealService.listRegion) {
          let itemfilter = topDealService.listRegion.filter(this.checkRegion);
       
          if (itemfilter.length>0) {
            let listitemfilter=[];
            itemfilter.forEach(element => {
              let itemfilterRegion = response.filter((l) => { return l.regionId == element.regionId});
              itemfilterRegion.forEach(elementregion => {
                listitemfilter.push(elementregion);
              });
            
            });
            response=[];
            response=listitemfilter;
          }
        
          // if (listitemfilter.length>0) {
          //   this.setData({response,
          //     isfilter:itemfilter.length>0?true:false
          //   });
          // }
        } 
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
});
