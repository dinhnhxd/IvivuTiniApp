import { topDealService} from '../../../providers/topDealService';
Page({
  data: {
  
  },
  onLoad(query) {
    let reponseHotel = topDealService.reponseHotel
    this.setData({
      reponseHotel
    });
    this.getHotelContractPrice();
  },
  getHotelContractPrice(){
    var data = {
      CheckInDate: "2022-08-30",
      CheckOutDate: "2022-09-01",
      CityID: '',
      CountryID: '',
      HotelID: topDealService.reponseHotel.Id,
      IsLeadingPrice: '1',
      IsPackageRate: true,
      NationalityID: '82',
      ReferenceClient: '',
      RoomNumber: 1,
      'RoomsRequest[0].RoomIndex': '1',
      Supplier: 'IVIVU',
      dataKey: '',
      'RoomsRequest[0][Adults][value]': "2",
      'RoomsRequest[0][Child][value]':  "0",
      IsFenced: true,
      GetVinHms: 1,
      GetSMD: 1,
      IsB2B: true,
      IsSeri: true,
      IsPackageRateInternal:true
    };
    // let data= JSON.stringify(form);
    my.request({
      url: 'https://betapay.ivivu.com/api/contracting/HotelSearchReqContractAppV2',
      method: 'POST',
      headers: {
        "content-type": "application/json",
      },
      data,
      success: (response) => {
        try {
         console.log(response);
     
        } catch (error) {
          console.log(error)
        }
       
      },
      
    });
  }
});
