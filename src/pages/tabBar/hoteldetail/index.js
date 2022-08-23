import parse from '@tiki.vn/mini-html-parser2';
import moment from 'moment';
Page({
  data: {
    apikey:'AIzaSyA759T_2b8Vd9KPputmQ8AslLcuGwARXMU',
    items: [],
    iconType: ['location',
  'direction_right'],
  el:'',
  show:false,
  showInfo:false,
  fixedHeader: false,
  cin:moment().format('DD-MM-YYYY'),
  diffdate:1,
  room:1,
  array: Array.from(Array(10).keys()),
  arrayIndex: 0,
  },
  onLoad(query) {
    try {
    this.cin=new Date();
    this.cout=new Date();
    this.setData({ loading: true });
    my.request({
      url: 'https://svc1-beta.ivivu.com/mhoteldetail/' + query + '/',
      method: 'GET',
      headers: {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U',
      },
      success: (response) => {
        try {
          this.items = response;
          let ricecombo = response.Combos.Price;
          let minPrice = response.MinPrice;   
          minPrice = this.arprice(minPrice)
          let timef1 = response.Combos.ComboDetail[0].StayFrom;
          let timef2 = response.Combos.ComboDetail[1]?.StayFrom;
          let timef3 = response.Combos.ComboDetail[2]?.StayFrom;
          let timef4 = response.Combos.ComboDetail[3]?.StayFrom;
          let timet1 = response.Combos.ComboDetail[0].StayTo;
          let timet2 = response.Combos.ComboDetail[1]?.StayTo;
          let timet3 = response.Combos.ComboDetail[2]?.StayTo;
          let timet4 = response.Combos.ComboDetail[3]?.StayTo;
          let timecover1 = this.artime(timef1);
          timecover1 = this.timeConverter(timecover1);
          let timecover2 = this.artime(timef2);
          timecover2 = this.timeConverter(timecover2);
          let timecover3 = this.artime(timef3);
          timecover3 = this.timeConverter(timecover3);
          let timecover4 = this.artime(timef4);
          timecover4 = this.timeConverter(timecover4);
          let timecoverto1 = this.artime(timet1);
          timecoverto1 = this.timeConverter(timecoverto1);
          let timecoverto2 = this.artime(timet2);
          timecoverto2 = this.timeConverter(timecoverto2);
          let timecoverto3 = this.artime(timet3);
          timecoverto3 = this.timeConverter(timecoverto3);
          let timecoverto4 = this.artime(timet4);
          timecoverto4 = this.timeConverter(timecoverto4);
  
          ricecombo = this.arprice(ricecombo);
          let ricefrom1 = this.arprice(response.Combos.ComboDetail[0]?.PriceFrom);
          let ricefrom2  = this.arprice(response.Combos.ComboDetail[1]?.PriceFrom);
          let ricefrom3  = this.arprice(response.Combos.ComboDetail[2]?.PriceFrom);
          let ricefrom4  = this.arprice(response.Combos.ComboDetail[3]?.PriceFrom);
          let HotelFacilities=[];
          for (let index = 0; index < 4; index++) {
            HotelFacilities.push(response.HotelFacilities[index]);
            
          }
          parse(response.Combos.Note, (err, htmlNodes) => {
            if (!err) {
              this.setData({
                response,
                ricecombo,
                timecover1,
                timecover2,
                timecover3,
                timecover4,
                timecoverto1,
                timecoverto2,
                timecoverto3,
                timecoverto4,
                ricefrom1,
                ricefrom2,
                ricefrom3,
                ricefrom4,
                loading: false,
                el:htmlNodes,
                minPrice,
                HotelFacilities
          });
            }
          });
          
          if (response.ComboPromtion && response.ComboPromtion.Id) {
            this.comboid = response.ComboPromtion.Id;
          }
          if (response.Combos && response.Combos.ComboDetail) {
            this.comboid = response.Combos.Id;
            this.getDetailCombo(response.Combos.Id);
          }

        } catch (error) {
          console.log(error)
        }
       
      },
      
    });
  } catch (error) {
    console.log(error)
  }
  },
  getDetailCombo(comboid){
    my.request({
   
      url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/ComboDetailList?comboId=' + (comboid ? comboid : this.comboid) + '&checkin=' + moment(this.cin).format('DD-MM-YYYY') + '&checkout=' + moment(this.cout).format('DD-MM-YYYY'),
      method: 'GET',
      headers: {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U',
      },
      success: (response) => {
        try {
          var item=response.comboDetail;
          if (item) {
            this.fc = (item.comboType == "1");
            this.fs = (item.comboType == "2");
            this.fcbcar = item.comboType == "3";
            this.nm = (item.comboType == null);
          
            if (this.fs && item.availableTo) {
              let dateEnd = new Date(item.availableTo.toLocaleString());
              let y = moment(this.cin).format('YYYY'),
                  m = moment(this.cin).format('MM'),
                  d = moment(this.cin).format('DD');
              let dateNow = new Date(y*1, m*1 -1, d*1);
              if (moment(dateNow).diff(moment(dateEnd),'days') > 0 ) {
                this.flashSaleEndDate = moment(dateEnd).format('DD.MM.YYYY');
              }
            }
            if(this.fc && (item.availableTo || response.endDate)){
              if( response.endDate){
                var arr =response.endDate.split('-');
                var newdate = new Date(arr[2],arr[1] -1,arr[0]);
                var d = moment(newdate).format('YYYY-MM-DD');
                this.comboDetailEndDate = d;
                this.allowbookcombofc = moment(this.cin).diff(moment(d),'days') > 1 ? false : true;
                this.allowbookcombofx = moment(this.cin).diff(moment(d),'days') > 1 ? false : true;
              }
            }
            // if(this.fcbcar && this.comboDetail){
            //   this.bookCombo.ComboRoomPrice = this.comboDetail.comboDetail.totalPriceSale;
            // }
            var itemList = response.list;
            if (itemList) {
              let comboDetailList=[];
              itemList.forEach(item => {
                if(item.details && item.details.length >0){
                  item.details.forEach((itemdetail) => {
                    itemdetail.priceDisplay = itemdetail.totalPriceSale.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g, ".");
                  })
                }
  
                comboDetailList.push(item);
                this.setData({
                  comboDetailList
            });
              });
            }
          }
     
        } catch (error) {
          console.log(error)
        }
       
      },
      
    });
  },
  handleShowModal() {
    this.setData({ show: true });
  },
  onPageScroll(event) {
    if(event.scrollTop > 200){
      this.setData({ fixedHeader: true });
    }
    else{
      this.setData({ fixedHeader: false });
    
    }
    // this.setData({ fixedHeader: event.scrollTop > 20 });
  },
  handleHideModal() {
    this.setData({ show: false });
  },

  handleTapButton(event) {
    const { item } = event.target.dataset;
    // my.alert({ content: JSON.stringify(item) });
    this.handleHideModal();
  },

  arprice(minPrice) {
    if(minPrice){
      let rice = minPrice
      .toLocaleString()
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
      .replace(',', '.');
    return rice;
    }
    
    return null;
  },

  timeConverter(UNIX_timestamp) {
    if(UNIX_timestamp){
      var a = new Date(UNIX_timestamp * 1000);
      var year = a.getFullYear();
      var month = a.getMonth();
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time = month + '/' + date;
      return time;
    }
    return null
    
  },
  artime(str) {
    if(str){
      return str.replace(/[&\/\\#,+()$~%.'":*?<>{}|Date]/g, '');
    }
    else{
      return null
    }
  },
  bookCombo(){
    
    my.navigateTo({ url: "pages/tabBar/combooverview/index"});
  },

  showDatePicker(format, ...options) {
    my.datePicker({
      format,
      ...options,
      success: (success) => {
        this.setData({now:  success.date});
        console.log('date ', success.date)
        // my.alert({
        //   content: JSON.stringify(success)
         
        // });
      },
      fail: (error) => {
        my.alert({
          content: JSON.stringify(error)
        });
      }
    });
  },

  onShowDateTime() {
    this.showDatePicker('dd-MM-yyyy');
  },
  // onArrayChange(e) {
  //   console.log('array', e.detail.value);
  //   this.setData({
  //     arrayIndex: e.detail.value
  //   });
  // },
  onShowcalendar(){
    this.setData({
          show: true
    });
  },
  onClick(){
    this.setData({
      show: false,
      cin:this.cin,
      diffdate:this.diffdate
    });
  },
  onClose(){
    this.setData({
      show: false
    });
  },
  selectedDate(e){
    this.cin=moment(e.dates[0]).format('DD-MM-YYYY');
    this.diffdate = moment(e.dates[1]).diff(moment(moment(e.dates[0]).format('YYYY-MM-DD')), 'days');
  }
});

