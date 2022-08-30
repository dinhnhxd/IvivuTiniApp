import parse from '@tiki.vn/mini-html-parser2';
import moment from 'moment';
import { topDealService} from '../../../providers/topDealService';
const init = () => ({
  latitude: 10.779693436530149,
  longitude: 106.67971686137946,
  markers: [],
  polygon: [],
  polyline: [],
  zoom: 10,
  circles: []
});
Page({
  data: {
    apiKey: 'AIzaSyDY6f-OwKoI7g7VtWUcBhKKieXfyHKBHw8',
    ...init(),
  el:'',
  show:false, 
  showInfo:false,
  showOption:false,
  fixedHeader: false,
  cin:moment().format('DD-MM-YYYY'),
  diffdate:1,
  room:1,
  adults:2,
  child:0,
  roomtemp:1,
  adultstemp:2,
  childtemp:0,
  arrchildtemp:[],
  pax:2,
  array: Array.from(Array(10).keys()),
  arrayIndex: 2,
  tabs1: [
    { title: 'Tổng quan' },
    { title: 'Đánh giá' },
    { title: 'Chi tiết combo' },
    { title: 'Mô tả khách sạn' }
  ],
  showInfoAge:false,

  },
  onLoad(query) {
    try {

    this.room=1;
    this.adults=2;
    this.child=0;
    this.roomtemp=1;
    this.adultstemp=2;
    this.childtemp=0;
    this.pax= this.adults+this.child;
    this.arrchild=[];
    this.arrchildtemp=[];
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
          topDealService.reponseHotel=response;
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
          let HotelReviews=[];
          let coReivew=0;
          for (let index = 0; index < response.HotelReviews.length; index++) {
            if (response.HotelReviews[index].BestFeature) {
              HotelReviews.push(response.HotelReviews[index]);
              coReivew++;
            }
            if (coReivew>2) {
              break;
            }
         
          }
          this.ChildAgeTo=response.ChildAgeTo;
          // let test =unescape(response.Combos.Note); 
          let notecombo = response.ComboPromtion && response.ComboPromtion.Note ? (response.ComboPromtion.Note || '') : (response.Combos ? response.Combos.Note : '');
          let el = this.parseHTML(notecombo);
          let Description = response.ComboPromtion && response.ComboPromtion.Description ? response.ComboPromtion.Description.replace(/\r\n/g, "<br/>") : (response.Combos ? response.Combos.Description.replace(/\r\n/g, "<br/>") : '');
          Description = Description.replace(/#r/g, "");
          Description = Description.replace(/r#/g, "");
          Description = Description.replace(/#m/g, "");
          Description = Description.replace(/m#/g, "");
          Description = Description.replace(/#n/g, "");
          Description = Description.replace(/n#/g, "");
          // let Description = this.parseHTML(response.Combos.Description);
          let FullDescription = this.parseHTML(response.FullDescription);
           Description = this.parseHTML(Description);
           this.ComboDayNum = response.Combos ? response.Combos.ComboDayNum : 1;
           this.cin=new Date();
           var rescin = this.cin.setTime(
            this.cin.getTime() + (1 * 24 * 60 * 60 * 1000)
          );
          var date = new Date(rescin);
          let arrDate=[];
            arrDate.push(date);
          this.cin = moment(date).format("DD-MM-YYYY");
           this.cout=new Date();
           var res = this.cout.setTime(
            this.cout.getTime() + (this.ComboDayNum  * 24 * 60 * 60 * 1000)
          );
          var date = new Date(res);
          this.cout = moment(date).format("DD-MM-YYYY");
          arrDate.push(date);
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
              el,
              minPrice,
              HotelFacilities,
              Description,
              FullDescription,
              cin:this.cin,
              arrDate,
              HotelReviews,
              apiKey: 'AIzaSyDY6f-OwKoI7g7VtWUcBhKKieXfyHKBHw8',
                zoom: 10,
                latitude: response.Latitude,
                longitude: response.Longitude,
                markers: [
                  {
                    latitude: response.Latitude,
                    longitude: response.Longitude,
                  }
                ]
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

  tap() {
    try {
      this.setData({
        scrollTop: this.data.scrollTop + 1000
      });
    } catch (error) {
      console.log(error)
    }

    // console.log('scrollTop '+scrollTop)
  },
  
  handleHideModal() {
    this.setData({ show: false });
  },
  tapMove() {
    for (let i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        const next = (i + 1) % order.length;
        this.setData({
          toView: order[next],
          scrollTop: next * 200
        });
        break;
      }
    }
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
      showInfo: false,
      show: true,
      showOption:false
    });
  },
  onClick(){
    this.setData({
      show: false,
      cin:this.cin,
      cout:this.cout,
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
    this.cout=moment(e.dates[1]).format('DD-MM-YYYY');
    this.diffdate = moment(e.dates[1]).diff(moment(moment(e.dates[0]).format('YYYY-MM-DD')), 'days');
  },

    onTabClick({ index, tabsName }) {
    this.setData({
      [tabsName]: index
    });
    if(index==0){
      this.scrollTo(0);
    }
    else if (index==1) {
      this.scrollTo(2600);
    } else if (index==2) {
      this.scrollTo(320);
    }
    else if (index==3) {
      this.scrollTo(1650);
    }
  
  },
  onChange({ index, tabsName }) {
    this.setData({
      [tabsName]: index
    });
  },
  scrollTo(value) {
    my.pageScrollTo({
      scrollTop: parseInt(value),
      duration: 500,
      success: (res) => {
      },
    });
  },
  onShowInfo(){
    let cinshow=this.getDayOfWeek(this.cin) + ', ' + this.cin;
    let coutshow=this.getDayOfWeek(this.cout) + ', ' + this.cout;
    var datecin = new Date(this.cin);
    var datecout = new Date(this.cout);
    this.setData({
      showInfo: true,
      show: false,
      showOption:false,
      cinshow,
      coutshow,
      datecin,
      datecout
    });
  },
  onClickInfo(){
    this.setData({
      showInfo: false
    });
  },
  onCloseInfo(){
    this.setData({
      showInfo: false
    });
  },
  onShowOption(){
    this.roomtemp=this.room;
    this.adultstemp=this.adults;
    this.childtemp=this.child;
    this.setData({
      showInfo: false,
      show: false,
      showOption: true,
      roomtemp: this.roomtemp,
      adultstemp: this.adultstemp,
      childtemp: this.childtemp
    });
  },
  onClickOption(){
    this.room=this.roomtemp;
    this.adults=this.adultstemp;
    this.child=this.childtemp;
    this.arrchild=this.arrchildtemp;
    this.setData({
      showOption: false,
      pax:this.adultstemp+this.childtemp,
      room: this.roomtemp,
      adults: this.adultstemp,
      child: this.childtemp,
      arrchildtemp:this.arrchildtemp
    });
   
  },
  onCloseOption(){
    this.setData({
      showOption: false
    });
  },
  plusadults() {
    if(this.adultstemp < 50){
      this.adultstemp++;
      this.setData({
        adultstemp: this.adultstemp,
      });
    }
  },
  minusadults() {
    if (this.adultstemp > 1) {
      this.adultstemp--;
      this.setData({
        adultstemp: this.adultstemp,
      });
    }
  },
  pluschild() {
    if(this.childtemp < 12){
      this.childtemp++;
      var arr = { text: 'Trẻ em' + ' ' + this.childtemp, numage: "" }
      this.arrchildtemp.push(arr);
      this.setData({
        childtemp: this.childtemp,
        arrchildtemp:this.arrchildtemp
      });

      console.log(this.arrchild);
    }
  },
  minuschild() {

    if (this.childtemp > 0) {
      this.childtemp--;
      this.arrchildtemp.splice(this.arrchildtemp.length - 1, 1);
      this.setData({
        childtemp: this.childtemp,
        arrchildtemp:this.arrchildtemp
      });
   
      console.log(this.arrchild);
    }
  },
  plusroom() {
    if(this.roomtemp <9){
      this.roomtemp++;
      if(this.adultstemp < this.roomtemp){
        this.adultstemp = this.roomtemp;
     
      }
      this.setData({
        roomtemp: this.roomtemp,
        adultstemp:this.adultstemp
      });
    }
  },
  minusroom() {

    if (this.roomtemp > 1) {
      this.roomtemp--;
      this.setData({
        roomtemp: this.roomtemp
      });
    }
  },
  onshowInfoAge(e){
    console.log(e);
    this.nameChild=e.currentTarget.dataset.id;
    if (!this.ChildAgeTo) {
      this.ChildAgeTo=16
    }
    this.itemAge=[];
    for (let i = 1; i <= this.ChildAgeTo; i++) {
      var item = {name:i}
      this.itemAge.push(item);
    }
    this.setData({
      showInfoAge: true,
      itemAge: this.itemAge
    });
  
  },
  selectage(e){
    this.arrchildtemp.forEach(item => {
      if( this.nameChild==item.text){
        item.age=e.currentTarget.dataset.id;
      }
    })
    this.setData({
      showInfoAge: false,
      arrchildtemp:this.arrchildtemp
    });
  },
  onCloseInfoAge(){
    this.setData({
      showInfoAge: false
    });
  },
  parseHTML(input){
    let htmlNode
    parse(input, (err, htmlNodes) => {
      htmlNode= htmlNodes;
    });
    return htmlNode;
  },
  seemore(){
    this.setData({
      seemore: true
    });
  },
  getDayOfWeek(day) {
    let cinthu ='';
    if(day){
      let arrdate = day.split('-');
      let newdate = new Date(arrdate[2], arrdate[1]-1, arrdate[0]);
      cinthu = moment(newdate).format("dddd");
      switch (cinthu) {
        case "Monday":
          cinthu = "Thứ Hai";
          break;
        case "Tuesday":
          cinthu = "Thứ Ba";
          break;
        case "Wednesday":
          cinthu = "Thứ Tư";
          break;
        case "Thursday":
          cinthu = "Thứ Năm";
          break;
        case "Friday":
          cinthu = "Thứ Sáu";
          break;
        case "Saturday":
          cinthu = "Thứ Bảy";
          break;
        default:
          cinthu = "Chủ nhật";
          break;
      }
    }
    
    return cinthu;
  },
  onReview(){
    my.navigateTo({ url: "pages/tabBar/reviewcus/index"});
  }
});


