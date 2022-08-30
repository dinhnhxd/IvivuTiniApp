import { topDealService} from '../../../providers/topDealService';
import moment from 'moment';
Page({
  data: {
  
  },
  onLoad(query) {
   let reponseHotel=topDealService.reponseHotel;
   reponseHotel.HotelReviews.forEach(element => {
    element.DateStayed = moment(element.DateStayed).format('DD-MM-YYYY');
   });
   this.setData({
    reponseHotel
  });
  },
 
});
