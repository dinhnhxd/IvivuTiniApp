Page({
  data: {
    items: [],
    iconType: ['location',
  'direction_right'],
  },
  onLoad(query) {
    try {
    
  

    // https://svc1-beta.ivivu.com/mhoteldetail/377518/
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
          });
        } catch (error) {
          console.log(error)
        }
       
      },
      
    });
  } catch (error) {
    console.log(error)
  }
  },
  handleShowModal() {
    this.setData({ show: true });
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
    console.log('sr' +str)
    if(str){
      return str.replace(/[&\/\\#,+()$~%.'":*?<>{}|Date]/g, '');
    }
    else{
      return null
    }
  },
});
