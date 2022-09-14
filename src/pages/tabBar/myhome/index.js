
import {C} from '../../../providers/constants';
Page({
  data: {
    listitems: [],
    show: false,
    listfilter:[],
    countFilter:0
  },
  onLoad(query){
    console.log(query);
    this.setData({ loading: true });
    my.request({
      url: C.urls.baseUrl.urlMobile+'/mobile/OliviaApis/TopDeals?pageIndex=1&pageSize=200',
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
    if (!this.listfilter ) {
      const key = 'regionName';
      let items = this.listitems.map(item => [item[key], item]);
      this.listfilter = [...new Map(items).values()];
    }
    this.setData({
      show: true,
      template: e.target.dataset.template,
      listfilter:this.listfilter
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
  onClose() {
    this.setData({
      show: false,
    });
  },
  onOk(){
    let listitemfilter=[];
    let itemfilter;
    if (this.listfilter) {
       itemfilter = this.listfilter.filter(this.checkRegion);
      if (itemfilter.length>0) {
        itemfilter.forEach(element => {
          let itemfilterRegion = this.listitems.filter((l) => { return l.regionId == element.regionId});
          itemfilterRegion.forEach(elementregion => {
            listitemfilter.push(elementregion);
          });
        
        });
      }
    } 
    this.setData({
      show: false,
      listfilter:this.listfilter,
      response:listitemfilter.length>0?listitemfilter:this.listitems,
      countFilter:itemfilter.length>0?itemfilter.length:0
    });

  },
  onReset(){
    this.listfilter.forEach(element => {
      element.ischeck=false;
    });
    this.setData({
      listfilter:this.listfilter,
      response:this.listitems,
      countFilter:0
    });
  },
  onChange(e){
    this.listfilter.forEach(element => {
      if (element.regionId==e.target.id) {
        element.ischeck=!element.ischeck;
        return;
      }
  });
  this.setDataFilter();
  },
  remove(event){
    this.listfilter.forEach(element => {
      if (element.regionId==event.currentTarget.dataset.id) {
        element.ischeck=false;
        return;
      }
      
  });
  this.onOk()
  },
  setDataFilter(){
    let listitemfilter=[];
    let itemfilter;
    if (this.listfilter) {
       itemfilter = this.listfilter.filter(this.checkRegion);
      if (itemfilter.length>0) {
        itemfilter.forEach(element => {
          let itemfilterRegion = this.listitems.filter((l) => { return l.regionId == element.regionId});
          itemfilterRegion.forEach(elementregion => {
            listitemfilter.push(elementregion);
          });
        
        });
      }
    } 
    this.setData({
      listfilter:this.listfilter,
      response:listitemfilter.length>0?listitemfilter:this.listitems,
      countFilter:itemfilter.length>0?itemfilter.length:0
    });

  },

});