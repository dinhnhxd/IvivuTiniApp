import { topDealService} from '../../../providers/topDealService';

Page({
  data: {
    listRegion: [],
  },
  onLoad(query) {
    console.log(query);
    this.listRegion=topDealService.listRegion;
    // this.listRegion.forEach(element => {
    //     element.ischeck=false;
    // });
    this.setData({listRegion:this.listRegion, loading: false });
  },
  tapRegion: function tapRegion(e) {
    this.listRegion.forEach(element => {
      if (element.id==e.target.id) {
        element.ischeck=!element.ischeck;
        return;
      }
  });
    this.setData({listRegion:this.listRegion, loading: false });
  },
  reset(){
    this.listRegion.forEach(element => {
      element.ischeck=false;
  });
  this.setData({listRegion:this.listRegion, loading: false });
  },
  apply(){
    topDealService.listRegion=this.listRegion;
    my.navigateTo({ url: "pages/tabBar/myhome/index"});
  }
});