import { topDealService} from '../../../providers/topDealService';
import moment from 'moment';
import {C} from '../../../providers/constants';
Page({
  data: {
    show:false, 
    showInfo:false,
    showOption:false,
    showInfoDep:false,
    showInfoAge:false
  },
  onLoad(query) {
    this.arrchild=[];
    this.arrchildtemp=[];
    this.JsonSurchargeFee =
    {
      RoomDifferenceFee: 0,
      AdultUnit: 0,
      DepartTicketDifferenceFee: 0,
      TransportPriceSale: 0,
      ReturnTicketDifferenceFee: 0,
      BaggageDepart: 0,
      BaggageReturn: 0,
      SurchargeWeekendFee: 0,
      SurchargeFee: [],
      TotalAll: 0,
      ComboData: {}
    };
    this.totalTransportPriceSale=0;
    this.adultUnit = 0;
    this.commissionAdult = 0;
    this.adultUnitExb = 0;
    this.childUnit = 0;
    this.infantUnit = 0;
    this.departTicketSale = 0;
    this.returnTicketSale = 0;
    this.transportPriceSale = 0;
    this.transportPriceNet = 0;
    this.transportPriceSaleForChild = 0;
    this.transportPriceNetForChild = 0;
    this.totalPriceSale = 0;
    this.totalSurchargeWeekendFee = 0;
    this.totalTransportPriceSale = 0;
    this.TotalPriceCombo = 0;
    this.totalAirLineLuggage = 0;
    this.totalPriceForEXBA = 0;
    this.totalPriceForChildCWE = 0;
    this.totalPriceForChildEXBC = 0;
    this.totalPriceInfant = 0;
    this.totalPriceForOtherFee = 0;
    this.totalGetSubPriceForAdultExtrabed = 0;
    this.totalGetSubPriceForChild = 0;
    this.totalQuantityChildCWEAndEXBC = 0;
    this.totalQuantityFlightForChildAndInfant = 0;
    this.totalQuantityFlightForChild = 0;
    this.totalPriceChild = 0;
    this.ChildOtherFeeTotal = 0;
    this.ChildOtherFee = 0;
    this.ComboPriceDiff = {
      RoomDiff: { AdultUnit: 0, ChildUnit: 0, Total: 0 },
      DepartFlightDiff: { AdultUnit: 0, AdultUnitExb: 0, ChildUnit: 0, InfantUnit: 0, Total: 0, CommissionAdult: 0 },
      ReturnFlightDiff: { AdultUnit: 0, AdultUnitExb: 0, ChildUnit: 0, InfantUnit: 0, Total: 0, CommissionAdult: 0 },
    };
    this.reponseHotel = topDealService.reponseHotel;
    this.cin=topDealService.checkin;
    
    this.cout=topDealService.checkout;
    var chuoicin = this.cin.split('-');
    var chuoicout = this.cout.split('-');
    var arrDate=[];
    var datecin =new Date(chuoicin[2],chuoicin[1]-1,chuoicin[0]);
    arrDate.push(datecin);
    var datecout =new Date(chuoicout[2],chuoicout[1]-1,chuoicout[0]);
    arrDate.push(datecout);
    this.adults=topDealService.adults;
    this.child=topDealService.child
    this.diffdate=topDealService.dur;
    this.TotalNight=topDealService.dur;
    this.roomnumber=topDealService.roomnumber;
    //
    var cb;
      if (topDealService.ComboDetail.details.length == 1) {
        cb = topDealService.ComboDetail.details[0];
        this.bookcombodetail = cb;
      } else {
        topDealService.ComboDetail.details.forEach(element => {
          let df = moment(element.stayFrom).format('YYYY-MM-DD');
          let dt = moment(element.stayTo).format('YYYY-MM-DD');
          if (moment(topDealService.checkin).diff(moment(df), 'days') >= 0 && moment(dt).diff(moment(topDealService.checkin), 'days') >= 0
            && moment(topDealService.checkout).diff(moment(df), 'days') >= 0 && moment(dt).diff(moment(topDealService.checkout), 'days') >= 0) {
            cb = element;
            this.bookcombodetail = element;
          }
        });
        if(!cb){
          cb= topDealService.ComboDetail.details[0];
            this.bookcombodetail = cb;
        }
      }
      this.totalPriceSale = cb.totalPriceSale;
      this.departTicketSale = cb.departTicketSale;
      this.returnTicketSale = cb.returnTicketSale;
      this.basepricesale = cb.totalPriceSale - cb.departTicketSale - cb.returnTicketSale;
      this.roomPriceSale = this.basepricesale;

      this.totalChild = 0;
      this.totalAdult = topDealService.adults;
      this.totalInfant = 0;
      this.infant=0;
      this.children=this.child;
      if (topDealService.arrchild) {
        for (let i = 0; i < topDealService.arrchild.length; i++) {
            if (topDealService.arrchild[i].age < 2) {
              this.infant += 1;
            }
          //PDANH 10/06/2019: Check tuổi trẻ em >=12 tuổi tính giá vé = người lớn
          if(topDealService.arrchild[i].age >=12){
            this.children--;
            this.totalChild--;
            this.adults++;
            this.totalAdult++;
          }
        }
      }
      this.totalInfant = this.infant;
      this.totalChild = this.children - this.infant;
    this.setData({
      cin:this.cin,
      pax:this.adults+this.child,
      roomnumber:topDealService.roomnumber,
      diffdate:topDealService.dur,
      reponseHotel:this.reponseHotel,
      arrDate,
      adults:this.adults,
      child:this.child
    });
    this.getHotelContractPrice().then((data) => {
      if (data) {
        this.listDepart=[];
        this.listReturn=[];
        this.loadpricedone = false;
        this.loadflightpricedone = false;
        this.loadFlightDataNew(false);
      }
    })
  },
  getHotelContractPrice(){
    return new Promise((resolve, reject) => {
      var chuoicin = this.cin.split('-');
      var chuoicout = this.cout.split('-');
      this.cinparam = chuoicin[2] + "-" + chuoicin[1] + "-" + chuoicin[0];
      this.coutparam = chuoicout[2] + "-" + chuoicout[1] + "-" + chuoicout[0];
      var form = {
        CheckInDate: this.cinparam,
        CheckOutDate: this.coutparam,
        CityID: '',
        CountryID: '',
        HotelID: this.reponseHotel.Id,
        IsLeadingPrice: '1',
        IsPackageRate: true,
        NationalityID: '82',
        ReferenceClient: '',
        RoomNumber: 1,
        'RoomsRequest[0].RoomIndex': '1',
        Supplier: 'IVIVU',
        dataKey: '',
        'RoomsRequest[0][Adults][value]': this.adults,
        'RoomsRequest[0][Child][value]':  this.child,
        IsFenced: true,
        GetVinHms: 1,
        GetSMD: 1,
        IsB2B: true,
        IsSeri: true,
        IsPackageRateInternal:true
      };
      if (topDealService.arrchild) {
        for (var i = 0; i < topDealService.arrchild.length; i++) {
          form["RoomsRequest[0][AgeChilds][" + i + "][value]"] = + topDealService.arrchild[i].age;
        }
      }
    let body=this.getFormData(form);
      my.request({
        url: C.urls.baseUrl.urlContracting +'/api/contracting/HotelSearchReqContractAppV2',
        method: 'POST',
        headers:   {},
        data:body,
        success: (response) => {
          try {
           console.log(response);
            if (response.Hotels) {
              this.jsonroom = response.Hotels[0].RoomClasses;
             
              //Hàm tính tiền chênh khi nâng cấp phòng
              var element = this.checkElement(this.jsonroom);
              if (element) {
                 //check lấy theo meal
                 var index=0;
                 for (let i = 0; i < element.MealTypeRates.length; i++) {
                   if (element.MealTypeRates[i].Code==topDealService.reponseComboDetail.mealTypeCode) {
                     index=i;
                     break;
                   }
                 }
  
                this.nameroom = element.ClassName;
                this.RoomType = element.RoomType;
                this.roomnumber = element.TotalRoom;
                this.index=index;
                this.calculateDiffPriceUnit();
                this.callSummaryPrice(element,index);
                this.setData({
                  nameroom: this.nameroom,
                  RoomType:this.RoomType,
                  roomnumber:this.roomnumber
                });
                resolve(true);
              } else {
                this.jsonroom = response.Hotels[0].RoomClassesRecomments;
             
                //Hàm tính tiền chênh khi nâng cấp phòng
                var element = this.checkElement(this.jsonroom);
                if (element) {
                   //check lấy theo meal
                   var index=0;
                   for (let i = 0; i < element.MealTypeRates.length; i++) {
                     if (element.MealTypeRates[i].Code==topDealService.reponseComboDetail.mealTypeCode) {
                       index=i;
                       break;
                     }
                   }
    
                  this.nameroom = element.ClassName;
                  this.RoomType = element.RoomType;
                  this.roomnumber = element.TotalRoom;
                  this.index=index;
                  this.calculateDiffPriceUnit();
                  this.callSummaryPrice(element,index);
                  this.setData({
                    nameroom: this.nameroom,
                    RoomType:this.RoomType,
                    roomnumber:this.roomnumber
                  });
                  resolve(true);
              }
            }
            } else {
              resolve(false);
            }
          } catch (error) {
            console.log(error)
          }
         
        },
        
      });
    })
   
  },
  getFormData(object) {
    let body = '';
    Object.keys(object).forEach(key => {
      if (typeof object[key] !== 'object') {
        if(!body){
          body += `${key}=${object[key]}`;
        }else{
          body += `&${key}=${object[key]}`;
        }
      }
      //else formData.append(key, JSON.stringify(object[key]))
    })
    //return formData;
    return body;
},
checkElement(object) {
  var el = null;
  var se = this;
  object.forEach(element => {
    if (element && element.MealTypeRates[0].RoomId == topDealService.reponseComboDetail.comboDetail.roomId && !element.MSGCode) {
      el = element;
    }
  })

  if (!el) {
    var arr = object.filter(function (e) { return !e.MSGCode })
    if (arr && arr.length > 0) {
      el = arr[0];
    }
  }
  return el;
},
calculateDiffPriceUnit() {
  var se = this;

  if(se.jsonroom && se.jsonroom.length >0){

    se.jsonroom.forEach(room => {
      room.MealTypeRates.forEach(element => {
        //AdultOtherFee
        let adultOtherFee = 0;
        element.ExtraBedAndGalaDinerList.forEach(e => {
          if (e.ChargeOn == 'Per Adult' && e.Code != 'EXBA') {
            adultOtherFee += e.PriceOTA;
          }
        });
        //ChildOtherFee
        let childOtherFee = 0;
        element.ExtraBedAndGalaDinerList.forEach(e => {
          if (e.ChargeOn == 'Per Child' && e.Code != 'CWE' && e.Code != 'EXBC') {
            childOtherFee += e.PriceOTA;
          }
        });
        //ChildOtherFeeTotal
        let childOtherFeeTotal = 0;
        element.ExtraBedAndGalaDinerList.forEach(e => {
          if (e.ChargeOn == 'Per Child' && e.Code != 'CWE' && e.Code != 'EXBC') {
            childOtherFeeTotal += e.PriceOTA * e.Quantity.value;
          }
        });
        let adultCombo = room.Rooms[0].IncludeAdults * element.TotalRoom;
        adultCombo = adultCombo > se.totalAdult ? se.totalAdult : adultCombo;

        adultOtherFee = adultOtherFee * (room.Rooms[0].IncludeAdults * se.roomnumber) / adultCombo;
        element.PriceDiffUnit = adultOtherFee + ((element.PriceAvgDefaultTA * se.roomnumber) * se.TotalNight / adultCombo) - se.roomPriceSale;
        element.PriceDiffUnit = Math.round(element.PriceDiffUnit);
      });
    });
    
    //se.ComboPriceDiff.RoomDiff.Total = se.elementMealtype.PriceAvgPlusTotalTA - (se.roomPriceSale * se.AdultCombo) //- totalExtraBedAndGalaDinerListTA;
    //se.ComboPriceDiff.RoomDiff.AdultUnit = se.PriceDiffUnit;

    }
  
},
callSummaryPrice(element,index) {
  var se = this;
  if (element && !element.MSGCode) {
    // Giá nhà cung cấp
    se.TravPaxPrices = element.MealTypeRates[index].PriceAvgPlusNet * se.roomnumber * se.TotalNight;

    se.roomclass = element;
    topDealService.mealTypeRates = element.MealTypeRates[index];
    se.elementMealtype = element.MealTypeRates[index];
    se.breakfast= element.MealTypeRates[index].Name;
    se.statusRoom=element.MealTypeRates[index].Status;
    this.index=index;
    se.AdultCombo = element.Rooms[0].IncludeAdults * se.elementMealtype.TotalRoom;
    se.AdultCombo = se.AdultCombo > se.totalAdult ? se.totalAdult : se.AdultCombo;

    se.transportPriceSale = se.transportPriceSale * (se.totalAdult - se.AdultCombo);
    se.transportPriceNet = se.transportPriceNet * (se.totalAdult - se.AdultCombo);

    se.TotalPriceCombo = se.totalPriceSale * se.AdultCombo;
    se.totalAdultExtrabed = se.totalAdult - se.AdultCombo;
    se.MathGaladinnerAdExtrabed();
    if (se.currentDepartFlight != undefined) {
      se.SaveFlightDepartSelected();
    }
    if (se.currentDepartFlight != undefined) {
      se.SaveFlightReturnSelected();
    }
    se.MathPriceAll();
  }
},
MathGaladinnerAdExtrabed() {
  var se = this;
  if (se.elementMealtype == undefined) return false;


  se.totalExtraBedAndGalaDinerListTA = 0;
  se.JsonSurchargeFee.SurchargeFee = [];
  if (se.elementMealtype.ExtraBedAndGalaDinerList.length > 0) {
    for (var i = 0; i < se.elementMealtype.ExtraBedAndGalaDinerList.length; i++) {
      if (se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeType == "Per Night" || se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeType == "Per Bed" || se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeType == "Per Meal WithoutNo") {
        se.totalExtraBedAndGalaDinerListTA += se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA * se.TotalNight;
        var priceItem2 = { Code: se.elementMealtype.ExtraBedAndGalaDinerList[i].Code, type: 'room', PassengerType: (se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeOn == 'Per Adult' ? 0 : 1), PriceType: 0, Text: se.elementMealtype.ExtraBedAndGalaDinerList[i].NameDisplay, Quantity: se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value, Price: (se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA * se.TotalNight), PriceFormat: (se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA * se.TotalNight).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
        se.JsonSurchargeFee.SurchargeFee.push(priceItem2);

      }
      else {
        se.totalExtraBedAndGalaDinerListTA += se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA;
        var priceItem2 = { Code: se.elementMealtype.ExtraBedAndGalaDinerList[i].Code, type: 'room', PassengerType: (se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeOn == 'Per Adult' ? 0 : 1), PriceType: 0, Text: se.elementMealtype.ExtraBedAndGalaDinerList[i].NameDisplay, Quantity: se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value, Price: (se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA), PriceFormat: (se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
        se.JsonSurchargeFee.SurchargeFee.push(priceItem2);
      }
    }
  }


  //AdultOtherFee
  se.AdultOtherFee = 0;
  se.elementMealtype.ExtraBedAndGalaDinerList.forEach(e => {
    if (e.ChargeOn == 'Per Adult' && e.Code != 'EXBA') {
      se.AdultOtherFee += e.PriceOTA;
    }
  });
  //ChildOtherFee
  se.ChildOtherFee = 0;
  se.elementMealtype.ExtraBedAndGalaDinerList.forEach(e => {
    if (e.ChargeOn == 'Per Child' && e.Code != 'CWE' && e.Code != 'EXBC') {
      se.ChildOtherFee += e.PriceOTA;
    }
  });
  //ChildOtherFeeTotal
  se.ChildOtherFeeTotal = 0;
  se.elementMealtype.ExtraBedAndGalaDinerList.forEach(e => {
    if (e.ChargeOn == 'Per Child' && e.Code != 'CWE' && e.Code != 'EXBC') {
      se.ChildOtherFeeTotal += e.PriceOTA * e.Quantity.value;
    }
  });

  se.AdultOtherFee = se.AdultOtherFee * (se.roomclass.Rooms[0].IncludeAdults * se.roomnumber) / se.AdultCombo;
  se.PriceDiffUnit = se.AdultOtherFee + ((se.elementMealtype.PriceAvgDefaultTA * se.roomnumber) * se.TotalNight / se.AdultCombo) - se.roomPriceSale;

  se.ComboPriceDiff.RoomDiff.Total = se.elementMealtype.PriceAvgPlusTotalTA - (se.roomPriceSale * se.AdultCombo) //- totalExtraBedAndGalaDinerListTA;
  se.ComboPriceDiff.RoomDiff.AdultUnit = se.PriceDiffUnit;

  se.JsonSurchargeFee.RoomDifferenceFee = se.PriceDiffUnit * se.AdultCombo + (se.totalAdult - se.AdultCombo) * se.AdultOtherFee + se.ChildOtherFeeTotal;

},
SaveFlightReturnSelected() {
  var se = this;
  if (!se.currentReturnFlight) return;
  se.JsonSurchargeFee.SurchargeFee = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.type != 'flightReturn'; });
  //var priceFlightAdult = $.grep(se.FlightReturnSelected.priceSummaries, function (e) { return e.passengerType == 0; }).reduce(function (acc, val) { return acc + val.price; }, 0);
  var priceFlightAdult = 0;
  se.currentReturnFlight[0].priceSummaries.forEach(e => {
    if (e.passengerType == 0) {
      priceFlightAdult += e.price;
    }
  });
  se.ComboPriceDiff.ReturnFlightDiff.AdultUnit = priceFlightAdult - se.returnTicketSale;
  var tempDiff = se.ComboPriceDiff.ReturnFlightDiff.AdultUnit;
  se.ComboPriceDiff.ReturnFlightDiff.CommissionAdult = Math.ceil((se.ComboPriceDiff.ReturnFlightDiff.AdultUnit < 0 ? Math.abs(se.ComboPriceDiff.ReturnFlightDiff.AdultUnit * 0.3) : -tempDiff) / 1000) * 1000;
  //Hiển thị giá tăng/giảm chiều về
  se.ar_flightpricetitle = Math.ceil((se.ComboPriceDiff.ReturnFlightDiff.AdultUnit < 0 ? Math.abs(se.ComboPriceDiff.ReturnFlightDiff.AdultUnit * 0.7) : tempDiff) / 1000) * 1000;
  se.ar_flightpricetitle = se.ar_flightpricetitle.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
  se.ar_returnpriceincrease = tempDiff > 0 ? true : false;
  se.ComboPriceDiff.ReturnFlightDiff.AdultUnit = se.ComboPriceDiff.ReturnFlightDiff.AdultUnit + (se.ComboPriceDiff.ReturnFlightDiff.CommissionAdult > 0 ? se.ComboPriceDiff.ReturnFlightDiff.CommissionAdult : 0);
  //se.ComboPriceDiff.ReturnFlightDiff.AdultUnitExb = $.grep(se.FlightReturnSelected.priceSummaries, function (e) { return e.passengerType == 0 }).reduce(function (acc, val) { return acc + val.price; }, 0);
  se.ComboPriceDiff.ReturnFlightDiff.AdultUnitExb = 0;
  se.currentReturnFlight[0].priceSummaries.forEach(e => {
    if (e.passengerType == 0) {
      se.ComboPriceDiff.ReturnFlightDiff.AdultUnitExb += e.price;
    }
  });

  se.ComboPriceDiff.ReturnFlightDiff.ChildUnit = 0;
  if (se.totalChild > 0) {
    se.ComboPriceDiff.ReturnFlightDiff.ChildUnit = 0;
    se.currentReturnFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 1) {
        se.ComboPriceDiff.ReturnFlightDiff.ChildUnit += e.price;
      }
    });

  }

  se.ComboPriceDiff.ReturnFlightDiff.InfantUnit = 0;
  if (se.totalInfant > 0) {
    se.currentReturnFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 2) {
        se.ComboPriceDiff.ReturnFlightDiff.InfantUnit += e.price;
      }
    });
  }

  se.JsonSurchargeFee.ReturnTicketDifferenceFee = se.ComboPriceDiff.ReturnFlightDiff.AdultUnit * se.AdultCombo;
  if (se.totalChild > 0) {
    var priceItem = { type: 'flightReturn', PassengerType: 1, Quantity: (se.totalChild), PriceType: 1, Text: 'Vé máy bay chiều về', Price: (se.ComboPriceDiff.ReturnFlightDiff.ChildUnit * (se.totalChild)), PriceFormat: (se.ComboPriceDiff.ReturnFlightDiff.ChildUnit * (se.totalChild)).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
    se.JsonSurchargeFee.SurchargeFee.push(priceItem);
  }
  if (se.totalInfant > 0) {
    var priceItem = { type: 'flightReturn', PassengerType: 2, Quantity: (se.totalInfant), PriceType: 1, Text: 'Vé máy bay chiều về', Price: (se.ComboPriceDiff.ReturnFlightDiff.InfantUnit * se.totalInfant), PriceFormat: (se.ComboPriceDiff.ReturnFlightDiff.InfantUnit * se.totalInfant).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
    se.JsonSurchargeFee.SurchargeFee.push(priceItem);
  }
  if (se.totalAdultExtrabed > 0 && se.adultFlightNumber == 0) {
    var priceItem = { type: 'flightReturn', PassengerType: 0, Quantity: se.totalAdultExtrabed, PriceType: 1, Text: 'Vé máy bay chiều về', Price: priceFlightAdult * se.totalAdultExtrabed, PriceFormat: (priceFlightAdult * se.totalAdultExtrabed).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
    se.JsonSurchargeFee.SurchargeFee.push(priceItem);
  }
  else
    if (se.adultFlightNumber > 0) {
      if (se.totalAdultExtrabed > 0) {
        var priceItem = { type: 'flightReturn', PassengerType: 0, Quantity: se.totalAdultExtrabed, PriceType: 1, Text: 'Vé máy bay chiều về', Price: priceFlightAdult * se.totalAdultExtrabed, PriceFormat: (priceFlightAdult * se.totalAdultExtrabed).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
        se.JsonSurchargeFee.SurchargeFee.push(priceItem);
      }
      var priceItem1 = { type: 'flightReturn', PassengerType: 1, childAsAdult: true, Quantity: se.adultFlightNumber, PriceType: 1, Text: 'Vé máy bay chiều về', Price: (priceFlightAdult * se.adultFlightNumber), PriceFormat: (priceFlightAdult * se.adultFlightNumber).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem1);
    }

  se.MathPriceAll();
},
MathPriceAll() {
  var se = this;
  var surchargePlus = se.JsonSurchargeFee.SurchargeFee.reduce(function (acc, val) { return acc + val.Price; }, 0);
  let adultFlightNumber = se.adults;
  se.JsonSurchargeFee.TransportPriceSale = se.transportPriceSale + se.transportPriceSaleForChild;
  se.totalTransportPriceSale = se.JsonSurchargeFee.TransportPriceSale;
  se.totalSurchargeWeekendFee = 0;

  se.JsonSurchargeFee.TotalAll = se.TotalPriceCombo +
    se.JsonSurchargeFee.RoomDifferenceFee
    + se.JsonSurchargeFee.DepartTicketDifferenceFee
    + se.JsonSurchargeFee.ReturnTicketDifferenceFee
    + se.totalSurchargeWeekendFee
    + se.totalTransportPriceSale
    + surchargePlus
    + se.totalAirLineLuggage;
  let GetSubPriceForAdultExtrabed = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.PassengerType == 0 && (e.Code == 'EXBA' || e.type == 'flightDepart' || e.type == 'flightReturn') });
  se.totalPriceForEXBA = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code == 'EXBA' }).reduce(function (acc, val) { return acc + val.Price / val.Quantity; }, 0);//= GetSubPriceForAdultExtrabed.reduce(function (acc, val) { return acc + val.Price / val.Quantity; }, 0);

  let GetSubPriceForChild = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return (e.PassengerType == 1 || e.PassengerType == 2) && (e.Code == 'CWE' || e.Code == 'EXBC' || e.type == 'flightDepart' || e.type == 'flightReturn') });
  se.totalPriceForChildCWE = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code == 'CWE' }).reduce(function (acc, val) { return acc + val.Price / val.Quantity; }, 0);
  se.totalPriceForChildEXBC = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code == 'EXBC' }).reduce(function (acc, val) { return acc + val.Price / val.Quantity; }, 0);
  se.totalPriceInfant = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.PassengerType == 2 }).reduce(function (acc, val) { return acc + val.Price; }, 0);

  let GetSubPriceForOtherFee = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code != 'EXBA' && e.Code != 'CWE' && e.Code != 'EXBC' && e.type != 'flightDepart' && e.type != 'flightReturn' });

  se.totalPriceForOtherFee = GetSubPriceForOtherFee.reduce(function (acc, val) { return acc + val.Price; }, 0);
  se.JsonSurchargeFee.TotalAll = se.JsonSurchargeFee.TotalAll - se.totalPriceForOtherFee;
  se.JsonSurchargeFee.AdultUnit = se.ComboPriceDiff.RoomDiff.AdultUnit;


  se.totalGetSubPriceForAdultExtrabed = GetSubPriceForAdultExtrabed.reduce(function (acc, val) { return acc + val.Price; }, 0);
  se.totalGetSubPriceForChild = GetSubPriceForChild.reduce(function (acc, val) { return acc + val.Price; }, 0);

  se.totalQuantityChildCWEAndEXBC = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code == 'CWE' || e.Code == 'EXBC' }).reduce(function (acc, val) { return acc + val.Quantity; }, 0);
  se.totalQuantityFlightForChildAndInfant = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return (e.PassengerType == 1 || e.PassengerType == 2) && (e.type == 'flightDepart' || e.type == 'flightReturn') }).reduce(function (acc, val) { return acc + val.Quantity; }, 0) / 2;
  se.totalQuantityFlightForChild = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return (e.PassengerType == 1) && (e.type == 'flightDepart' || e.type == 'flightReturn') }).reduce(function (acc, val) { return acc + val.Quantity; }, 0) / 2 - adultFlightNumber;

  se.totalPriceChild = 0;
  if (se.totalPriceForChildCWE > 0 && se.totalPriceForChildEXBC > 0) {
    se.totalPriceChild == 0
  }
  else if (se.totalQuantityChildCWEAndEXBC < (se.totalQuantityFlightForChildAndInfant) && se.currentDepartFlight != undefined && se.currentReturnFlight != undefined) {
    se.totalPriceChild = (se.totalQuantityFlightForChild - se.totalQuantityChildCWEAndEXBC) * (se.ComboPriceDiff.DepartFlightDiff.ChildUnit + se.ComboPriceDiff.ReturnFlightDiff.ChildUnit) + (se.ChildOtherFeeTotal - se.ChildOtherFee * se.totalQuantityChildCWEAndEXBC);  //$.grep(se.JsonSurchargeFee.SurchargeFee, function (e) { return e.PassengerType == 1 }).reduce(function (acc, val) { return acc + val.Price; }, 0);
  }

  if (adultFlightNumber > 0) {

    se.totalPriceChild += (se.ComboPriceDiff.DepartFlightDiff.AdultUnitExb + se.ComboPriceDiff.ReturnFlightDiff.AdultUnitExb) * adultFlightNumber;
  }

  if (se.totalChild > 0) {
    se.ComboPriceDiff.RoomDiff.ChildUnit = se.totalGetSubPriceForChild / se.totalChild;

  }
  se.totalFlightDepart = se.currentDepartFlight == undefined ? 0 : se.currentDepartFlight[0].priceSummaries.reduce(function (acc, val) { return acc + val.total; }, 0);
  se.totalFlightReturn = se.currentReturnFlight == undefined ? 0 : se.currentReturnFlight[0].priceSummaries.reduce(function (acc, val) { return acc + val.total; }, 0);
  se.commissionFlight = se.ComboPriceDiff.DepartFlightDiff.CommissionAdult * se.AdultCombo + se.ComboPriceDiff.ReturnFlightDiff.CommissionAdult * se.AdultCombo;
  se.commissionDepart = se.ComboPriceDiff.DepartFlightDiff.CommissionAdult * se.AdultCombo;
  if (se.commissionFlight < 0) {
    se.commissionFlight = 0;
  }
  se.Commission = (se.elementMealtype == undefined ? 0 : se.JsonSurchargeFee.TotalAll - (se.totalFlightDepart + se.totalFlightReturn + (se.transportPriceNet * se.totalAdult + se.transportPriceNetForChild * (se.totalInfant + se.totalChild) + se.elementMealtype.PriceAvgPlusNet * se.elementMealtype.TotalRoom * se.TotalNight) + se.JsonSurchargeFee.BaggageDepart + se.JsonSurchargeFee.BaggageReturn));

  // let pricetotal =Math.ceil(se.JsonSurchargeFee.TotalAll)
  let pricetotal =Math.ceil(se.JsonSurchargeFee.TotalAll);
    se.PriceAvgPlusTAStr = pricetotal.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    se.TotalPrice = pricetotal;
},
loadFlightDataNew(hascache) {
  var se = this;
  setTimeout(() => {
    se.stoprequest = true;
    se.loadpricedone = true;
    if (se.listDepart.length == 0 || se.listReturn.length == 0) {
      se.PriceAvgPlusTAStr = 0;
      se.loadflightpricedone=true;
      se.ischeckwaitlug=true;
      se.msgEmptyFlight = se.listDepart.length == 0 && se.listReturn.length == 0 ? 'Vé máy bay không có.' : (se.listDepart.length == 0 ? 'Vé máy bay chiều đi không có.' : 'Vé máy bay chiều về không có.');
    }
  }, 50 * 1000);

  se.checkLoadCacheData().then(data => {
    if (data) {
      se.stoprequest = false;
      se.loadFlightCacheDataByAirline(data, 'depart');

      se.loadFlightCacheDataByAirline(data, 'return');
    }
  })
},
checkLoadCacheData() {
  var se = this;
  se.stoprequest = true;
  return new Promise((resolve, reject) => {
    let objjson =
    {
      "requestFrom": {
        "fromPlace": topDealService.ComboDetail.departureCode,
        "toPlace": topDealService.reponseComboDetail.arrivalCode,
        "departDate": moment(new Date(moment(this.cinparam).format("YYYY-MM-DD"))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
        "returnDate": moment(new Date(moment(this.cinparam).format("YYYY-MM-DD"))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
        "adult": se.adults,
        "child": se.child,
        "infant": se.infant,
        "version": "2.0",
        "roundTrip": true
      },
      "requestTo": {
        "fromPlace": topDealService.reponseComboDetail.arrivalCode,
        "toPlace": topDealService.ComboDetail.departureCode,
        "departDate": moment(new Date(moment(this.coutparam).format("YYYY-MM-DD"))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
        "returnDate": moment(new Date(moment(this.coutparam).format("YYYY-MM-DD"))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
        "adult": se.adults,
        "child": se.child,
        "infant": 0,
        "version": "2.0",
        "roundTrip": true
      },
      "roundTrip": true,
      "noCache": true,
      'tcincharge': "89311",
    }
    my.request({
      url: C.urls.baseUrl.urlFlight + 'gate/apiv1/GetSessionFlight',
      method: 'POST',
      headers:   { "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
          'Content-Type': 'application/json; charset=utf-8'},
      data:JSON.stringify(objjson),
      success: (response) => {
        resolve(response);
       
      },
      
    });
   
  })
},
loadFlightCacheDataByAirline(source, type) {
  var se = this;
  if (type == "depart") {
    se.allowSearch = false;
  } else {
    se.allowSearchReturn = false;
  }

  let urlfindflightincache = type == "depart" ? C.urls.baseUrl.urlFlight + "gate/apiv1/GetFlightDepart" : C.urls.baseUrl.urlFlight + "gate/apiv1/GetFlightReturn";
  let objbody = {
    "fromPlace": type == 'depart' ? topDealService.ComboDetail.departureCode : topDealService.reponseComboDetail.arrivalCode,
    "toPlace": type == 'depart' ? topDealService.reponseComboDetail.arrivalCode : topDealService.ComboDetail.departureCode,
    "departDate": type == 'depart' ? moment(new Date(moment(this.cinparam).format("YYYY-MM-DD"))).format("YYYY-MM-DDTHH:mm:ss.SSS") : moment(new Date(moment(this.coutparam).format("YYYY-MM-DD"))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
    "returnDate": type == 'depart' ? moment(new Date(moment(this.cinparam).format("YYYY-MM-DD"))).format("YYYY-MM-DDTHH:mm:ss.SSS") : moment(new Date(moment(this.coutparam).format("YYYY-MM-DD"))).format("YYYY-MM-DDTHH:mm:ss.SSS"),
    "adult": se.adults,
    "child": se.child,
    "infant": 0,
    "sources": source,
    "version": "2.0",
    "roundTrip": true
  };

  my.request({
    method: "POST",
    url: urlfindflightincache,
    data: JSON.stringify(objbody),
    headers: {
      "Authorization": "Basic YXBwOmNTQmRuWlV6RFFiY1BySXNZdz09",
      'Content-Type': 'application/json; charset=utf-8'
    },

  success: (response) => {
    if (type == "depart") {
      se.allowSearch = true;
    } else {
      se.allowSearchReturn = true;
    }
    if (response) {
      if (response.data && response.data.length > 0) {
        response.data.forEach(element => {
          var arrfly=[];
          for (let i = 0; i < element.flights.length; i++) {
           if (element.flights[i].stops==0) {
            arrfly.push(element.flights[i]);
           }
          }
          se.loadmultidata(arrfly, type);
        });
        
      }

      if (!response.stop && !se.stoprequest && type == 'depart' && se.allowSearch) {

        setTimeout(() => {
            source = response.sources;
          se.loadFlightCacheDataByAirline(source, 'depart');
        }, 1500)
      }

      else if (!response.stop && !se.stoprequest && type == 'return' && se.allowSearchReturn) {
        source = response.sources;
        setTimeout(() => {

            source = response.sources;
          se.loadFlightCacheDataByAirline(source, 'return');
        }, 1500)
        // obj.countretry++;
      }
    }
  },
})
},
loadmultidata(data, type) {
  var se = this;
  let jsondata = data;
  //se.loadpricedone = true;
  se.ischeckwaitlug=false;
    if (type == 'depart') {
      if (!se.listDepart || (se.listDepart && se.listDepart.length == 0)) {
        se.listDepart = jsondata;
      }
      else {
        if (se.listDepart && se.listDepart.length > 0) {
          se.listDepart = [...se.listDepart, ...jsondata];
        }
      }
    }

    if (type == 'return') {
      if (!se.listReturn || (se.listReturn && se.listReturn.length == 0)) {
        se.listReturn = jsondata;
      }
      else {
        if (se.listReturn && se.listReturn.length > 0) {
          se.listReturn = [...se.listReturn, ...jsondata];
        }
      }
    }
    se.getdata();

},
getdata() {
  var se = this;
  se.loadpricedone = true;
    if (se.listDepart && se.listDepart.length > 0) {
      se.listDepart.forEach(element => {
        var priceFlightAdult = 0;
        element.priceSummaries.forEach(e => {
          if (e.passengerType == 0) {
            priceFlightAdult += e.price;
          }
        });
        //25/12/2020: Sửa lại lấy đúng giá giảm (sau khi trừ giá bán default)
        element.priceorder = priceFlightAdult - se.departTicketSale;
        if (element.airlineCode == "VietnamAirlines") {
          element.priceorder = element.priceorder * 0.75;
        }
        else if (element.airlineCode == "BambooAirways") {
          element.priceorder = element.priceorder * 0.8;
        }
        let ar_time = element.departTime.toString().split('T')[1];
        let Hour = ar_time.toString().split(':')[0];
        let Minute = ar_time.toString().split(':')[1];
        let kq = Hour * 60 + Number(Minute);
        element.rangeTime = kq;
      });
      se.sort('priceorder', se.listDepart);
      se.checkvalue(se.listDepart, 0);
      se.currentDepartFlight = se.departfi;
    }

    if (se.listReturn && se.listReturn.length > 0) {
      se.listReturn.forEach(element => {
        var priceFlightAdult = 0;
        element.priceSummaries.forEach(e => {
          if (e.passengerType == 0) {
            priceFlightAdult += e.price;
          }
        });
        //25/12/2020: Sửa lại lấy đúng giá giảm (sau khi trừ giá bán default)
        element.priceorder = priceFlightAdult - se.returnTicketSale;

        if (element.airlineCode == "VietnamAirlines") {
          element.priceorder = element.priceorder * 0.75;
        }
        else if (element.airlineCode == "BambooAirways") {
          element.priceorder = element.priceorder * 0.8;
        }
      });
      se.sort('priceorder', se.listReturn);
      se.checkvalue(se.listReturn, 1);
      se.currentReturnFlight = se.returnfi;
    }
    se.loadFlightData(se.departfi, se.returnfi);
},

//Hàm check VMB giá thấp nhất trong khung giờ chấp nhận được
checkvalue(list, stt) {
  var Hour; var Minute; var kq;
  var good = [];
  var medium = [];
  var other = [];
  if (stt == 0) {
    for (let i = 0; i < list.length; i++) {
      // var dateTime = new Date(list.flights[i].departTime);
      // Hour = moment(dateTime).format("HH");
      // Minute = moment(dateTime).format("mm");
      let ar_time = list[i].departTime.toString().split('T')[1];
      Hour = ar_time.toString().split(':')[0];
      Minute = ar_time.toString().split(':')[1];
      kq = Hour * 60 + Number(Minute);
      list[i].rangeTime = kq;

      if (kq >= 360 && kq <= 960) {
        if (kq >= 480 && kq <= 660) {
          good.push(list[i]);
        }
        else {
          medium.push(list[i]);
        }
      }
      else {
        other.push(list[i]);
      }
    }
    if (medium && medium.length > 0 && good && good.length > 0) {
      if (good[0].priceorder <= medium[0].priceorder) {
        this.departfi = good;
      } else {
        if (medium.length > 0) {
          this.departfi = medium;
        } else {
          if (good.length > 0) {
            this.departfi = good;
          }

        }
      }
    } else {
      if (medium.length > 0) {
        this.departfi = medium;
      } else {
        if (good.length > 0) {
          this.departfi = good;
        }

      }
    }


    if (this.departfi && this.departfi.length == 0) {
      this.departfi = other;
    }
  }
  else {
    for (let i = 0; i < list.length; i++) {
      // var dateTime = new Date(list.flights[i].departTime);
      // Hour = moment(dateTime).format("HH");
      // Minute = moment(dateTime).format("mm");
      let ar_time = list[i].departTime.toString().split('T')[1];
      Hour = ar_time.toString().split(':')[0];
      Minute = ar_time.toString().split(':')[1];
      kq = Hour * 60 + Number(Minute);

      if (kq >= 600 && kq < 1440) {
        if (kq >= 840 && kq <= 1020) {
          good.push(list[i]);
        }
        else {
          medium.push(list[i]);
        }
      }
      else {
        other.push(list[i]);
      }
    }
    if (medium.length > 0) {
      this.returnfi = medium;
    }
    else {
      if (good.length > 0) {
        this.returnfi = good;
      }

    }
    if (this.returnfi.length == 0) {
      this.returnfi = other;
    }
  }

},

checkReturnList(list){
  var Hour; var Minute; var kq;
  var good = [];
  var medium = [];
  var other = [];
    for (let i = 0; i < list.flights.length; i++) {
      // var dateTime = new Date(list.flights[i].departTime);
      // Hour = moment(dateTime).format("HH");
      // Minute = moment(dateTime).format("mm");
      let ar_time = list.flights[i].departTime.toString().split('T')[1];
      Hour = ar_time.toString().split(':')[0];
      Minute = ar_time.toString().split(':')[1];
      kq = Hour * 60 + Number(Minute);

      if (kq >= 600 && kq < 1440) {
        if (kq >= 840 && kq <= 1020) {
          good.push(list.flights[i]);
        }
        else {
          medium.push(list.flights[i]);
        }
      }
      else {
        other.push(list.flights[i]);
      }
    }
    if(medium && medium.length >0 && good && good.length >0){
      if(good[0].priceorder <= medium[0].priceorder ){
        this.returnfi = good;
      }else{
        if (medium.length > 0) {
          this.returnfi = medium;
        }else{
         if(good.length>0)
          {
            this.returnfi = good;
          }
          
        }
      }
    }else {
      if (medium.length > 0) {
        this.returnfi = medium;
      }else{
       if(good.length>0)
        {
          this.returnfi = good;
        }
        
      }
    }
    
    if(this.returnfi.length ==0){
      this.returnfi = other;
    }
},
sort(property, listsort) {
  var se = this;
  if (listsort && listsort.length > 0) {
    listsort.sort(function (a, b) {
      let direction = -1;
      if (property == "priceorder") {
        if (a[property] * 1 < b[property] * 1) {
          return 1 * direction;
        }
        else if (a[property] * 1 > b[property] * 1) {
          return -1 * direction;
        }
        //chiều đi
        else if (a[property] * 1 == b[property] * 1 && a["rangeTime"] && b["rangeTime"]) {
          if(a["rangeTime"] >= 600 && a["rangeTime"] <=720){
            return 1 * direction;
          }
          else if(b["rangeTime"] >= 600 && b["rangeTime"] <=720){
            return -1 * direction;
          }
          else{
            return 1 * direction;
          }
        }
        //chiều về
        else if (a[property] * 1 == b[property] * 1 && a["rangeTimeReturn"] && b["rangeTimeReturn"]) {
          if(a["rangeTimeReturn"] >= 840 && a["rangeTimeReturn"] <=1020){
            return 1 * direction;
          }
          else if(b["rangeTimeReturn"] >= 840 && b["rangeTimeReturn"] <=1020){
            return -1 * direction;
          }
          else{
            return 1 * direction;
          }
        }
      }
    });
  }
},
loadFlightData(departFlight, returnFlight) {
  var se = this;
  se.listDeparture = [];
  if (departFlight && departFlight.length > 0) {
    se.listDeparture.push(departFlight[0]);
  
    let de_date = new Date(departFlight[0].departTime);
    let de_date_landing = new Date(departFlight[0].landingTime);
    let de_hour = moment(de_date).format("HH");
    let de_minute = moment(de_date).format("mm");
    let de_hour_landing = moment(de_date_landing).format("HH");
    let de_minute_landing = moment(de_date_landing).format("mm");
    if (departFlight[0].departTime.toString().indexOf('T')) {
      de_date = new Date(departFlight[0].departTime.toString().split('T')[0]);
      de_date_landing = new Date(departFlight[0].landingTime.toString().split('T')[0]);
      let de_time = departFlight[0].departTime.toString().split('T')[1];
      de_hour = de_time.toString().split(':')[0];
      de_minute = de_time.toString().split(':')[1];
      let ar_time_landing = departFlight[0].landingTime.toString().split('T')[1];
      de_hour_landing = ar_time_landing.toString().split(':')[0];
      de_minute_landing = ar_time_landing.toString().split(':')[1];
    }

    // se.de_departtime = de_hour + ':' + de_minute + ' → ' + de_hour_landing + ':' + de_minute_landing;
    se.de_departtime = de_hour + ':' + de_minute;
    se.re_departtime = de_hour_landing + ':' + de_minute_landing;
    //se.bookCombo.departTimeStr = de_hour + ':' + de_minute + ' → ' + de_hour_landing + ':' + de_minute_landing;
    se.de_departdatestr = se.getDayOfWeek(de_date)+', '+moment(de_date).format('DD')+ ' '+ 'thg' + ' ' +  moment(de_date).format('MM');
    //se.bookCombo.de_departdatestr = "Đi " + se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
    se.daydeparttitle = se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
    se.operatedBydep=departFlight[0].operatedBy;
    //tính thời gian bay
    let hours = Math.floor(departFlight[0].flightDuration / 60);
    let minutes = departFlight[0].flightDuration * 1 - (hours * 60);
    if (hours < 10) {
      hours = hours != 0 ? "0" + hours : "0";
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    departFlight[0].departTimeDisplay = moment(departFlight[0].departTime).format("HH:mm");
    departFlight[0].landingTimeDisplay = moment(departFlight[0].landingTime).format("HH:mm");
    departFlight[0].flightTimeDisplay = hours + "h" + minutes;
    departFlight[0].flightTimeDetailDisplay = hours + "h" + minutes + "m";
    se.departlocationdisplay = departFlight[0].fromPlaceCode + "   ·   " + departFlight[0].flightTimeDetailDisplay + "   ·   " + departFlight[0].toPlaceCode;
    if (departFlight[0].operatedBy && departFlight[0].urlLogo.indexOf('content/img') == -1) {
      departFlight[0].urlLogo = "https://www.ivivu.com/ve-may-bay/content/img/brands/w100/" + departFlight[0].urlLogo;
    }
    let priceFlightAdult = 0;
    departFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 0) {
        priceFlightAdult += e.price;
      }
    });
    if (se.bookcombodetail.departTicketSale > priceFlightAdult) {

      let pricesdepartstr = se.bookcombodetail.departTicketSale - priceFlightAdult;
      se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') - pricesdepartstr;
      //se.de_flightpricetitle = pricesdepartstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
      se.de_departpriceincrease = false;

    }
    if (se.bookcombodetail.departTicketSale <= priceFlightAdult) {

      let pricesdepartstr = priceFlightAdult - se.bookcombodetail.departTicketSale;
      se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') + pricesdepartstr;
      //se.de_flightpricetitle = pricesdepartstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
      se.de_departpriceincrease = true
    }
    //Gán giá vé máy bay chênh
    se.JsonSurchargeFee.DepartTicketDifferenceFee = priceFlightAdult - se.bookcombodetail.departTicketSale;
    //thông tin hành lý
    if (departFlight[0].ticketCondition) {
      se.departConditionInfo = departFlight[0].ticketCondition;
      if (se.departConditionInfo && se.departConditionInfo.luggageSigned && se.departConditionInfo.luggageSigned.length <= 4) {
        se.totaldepluggage = se.departConditionInfo.luggageSigned;
      }
      else {
        se.totaldepluggage = 0;
      }
    }

  }

  if (returnFlight && returnFlight.length > 0) {
    let itemReturnFlight = returnFlight[0];
    //Check vé seri
    if(departFlight[0] && departFlight[0].id.indexOf('__seri') != -1){
      let itemr = returnFlight.filter((itemreturn) => { return itemreturn.id.indexOf('__seri') != -1 && itemreturn.availId == departFlight[0].availId})
      if(itemr && itemr.length >0){
        itemReturnFlight = itemr[0];
      }
    }
    se.listDeparture.push(itemReturnFlight);

    let ar_date = new Date(returnFlight[0].departTime);
    let ar_date_landing = new Date(returnFlight[0].landingTime);
    let ar_hour = moment(ar_date).format("HH");
    let ar_minute = moment(ar_date).format("mm");
    let ar_hour_landing = moment(ar_date_landing).format("HH");
    let ar_minute_landing = moment(ar_date_landing).format("mm");
    if (returnFlight[0].departTime.toString().indexOf('T')) {
      ar_date = new Date(returnFlight[0].departTime.toString().split('T')[0]);
      ar_date_landing = new Date(returnFlight[0].landingTime.toString().split('T')[0]);
      let ar_time = returnFlight[0].departTime.toString().split('T')[1];
      ar_hour = ar_time.toString().split(':')[0];
      ar_minute = ar_time.toString().split(':')[1];
      let ar_time_landing = returnFlight[0].landingTime.toString().split('T')[1];
      ar_hour_landing = ar_time_landing.toString().split(':')[0];
      ar_minute_landing = ar_time_landing.toString().split(':')[1];
    }

    // se.ar_departtime = ar_hour + ':' + ar_minute + ' → ' + ar_hour_landing + ':' + ar_minute_landing;
    se.ar_departtime = ar_hour + ':' + ar_minute
    se.ar_returntime = ar_hour_landing + ':' + ar_minute_landing;
    //se.bookCombo.returnTimeStr = ar_hour + ':' + ar_minute + ' → ' + ar_hour_landing + ':' + ar_minute_landing;
    se.ar_departdatestr = se.getDayOfWeek(ar_date) +', '+moment(ar_date).format('DD')+ ' '+ 'thg' + ' ' +  moment(ar_date).format('MM'), 
    //se.bookCombo.ar_departdatestr = "Về " + se.getDayOfWeek(ar_date) + ', ' + moment(ar_date).format('DD-MM-YYYY');
    se.dayreturntitle = se.getDayOfWeek(ar_date) + ', ' + moment(ar_date).format('DD-MM-YYYY');
    //tính thời gian bay
    let hours = Math.floor(returnFlight[0].flightDuration / 60);
    let minutes = returnFlight[0].flightDuration * 1 - (hours * 60);
    if (hours < 10) {
      hours = hours != 0 ? "0" + hours : "0";
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    returnFlight[0].departTimeDisplay = moment(returnFlight[0].departTime).format("HH:mm");
    returnFlight[0].landingTimeDisplay = moment(returnFlight[0].landingTime).format("HH:mm");
    returnFlight[0].flightTimeDisplay = hours + "h" + minutes;
    returnFlight[0].flightTimeDetailDisplay = hours + "h" + minutes + "m";
    se.returnlocationdisplay = returnFlight[0].fromPlaceCode + "   ·   " + returnFlight[0].flightTimeDetailDisplay + "   ·   " + returnFlight[0].toPlaceCode;
    se.operatedByret=returnFlight[0].operatedBy;
    if (returnFlight[0].operatedBy && returnFlight[0].urlLogo.indexOf('content/img') == -1) {
      returnFlight[0].urlLogo = "https://www.ivivu.com/ve-may-bay/content/img/brands/w100/" + returnFlight[0].urlLogo;
    }
    let priceFlightAdult = 0;
    returnFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 0) {
        priceFlightAdult += e.price;
      } 
    });
    if (se.bookcombodetail.returnTicketSale > priceFlightAdult) {
      let pricesreturnstr = se.bookcombodetail.returnTicketSale - priceFlightAdult;
      se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') - pricesreturnstr;
      //se.ar_flightpricetitle = pricesreturnstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
      se.ar_departpriceincrease = false
    }
    if (se.bookcombodetail.returnTicketSale <= priceFlightAdult) {
      let pricesreturnstr = priceFlightAdult - se.bookcombodetail.returnTicketSale;
      se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') + pricesreturnstr;
      //se.ar_flightpricetitle = pricesreturnstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
      se.ar_departpriceincrease = true
    }
    //Gán giá vé máy bay chênh
    se.JsonSurchargeFee.ReturnTicketDifferenceFee = priceFlightAdult - se.bookcombodetail.returnTicketSale;
    //thông tin hành lý
    if (returnFlight[0].ticketCondition) {
      se.returnConditionInfo = returnFlight[0].ticketCondition;
      if (se.returnConditionInfo && se.returnConditionInfo.luggageSigned && se.returnConditionInfo.luggageSigned.length <= 4) {
        se.totalretluggage = se.returnConditionInfo.luggageSigned;
      }
      else {
        se.totalretluggage = 0;
      }
    }
  }
  if(se.currentDepartFlight){
    se.flightdeparttitle = 'Từ ' + se.currentDepartFlight[0].fromPlace + ' đi ' + se.currentDepartFlight[0].toPlace;
    se.fromPlace = se.currentDepartFlight[0].fromPlace;
    se.toPlace = se.currentDepartFlight[0].toPlace;
    se.callSummaryPrice(se.roomclass,se.index);
  }
  this.setData({
    listDeparture:this.listDeparture,
    departlocationdisplay:this.departlocationdisplay,
    de_flightpricetitle:this.de_flightpricetitle,
    de_departtime:this.de_departtime,
    re_departtime:this.re_departtime,
    de_departpriceincrease:this.de_departpriceincrease,
    de_departdatestr:this.de_departdatestr,
    operatedBydep:this.operatedBydep,
    ar_departdatestr:this.ar_departdatestr,
    ar_departpriceincrease:this.ar_departpriceincrease,
    ar_departtime:this.ar_departtime,
    ar_returntime:this.ar_returntime,
    returnlocationdisplay:this.returnlocationdisplay,
    ar_flightpricetitle:this.ar_flightpricetitle,
    PriceAvgPlusTAStr:this.PriceAvgPlusTAStr,
    breakfast:this.breakfast,
    totaldepluggage:this.totaldepluggage,
    totalretluggage:this.totalretluggage
  });
  // setTimeout(() => {
  //   se.ischeckwaitlug=true;
  // }, 10 *1000)
  // setTimeout(() => {
  //   se.loadflightpricedone = true;
  //   se.checkVoucherClaimed();
  // },4000)
},
getDayOfWeek(date) {
  let coutthu = moment(date).format('dddd');
  switch (coutthu) {
    case "Monday":
      coutthu = "Thứ 2"
      break;
    case "Tuesday":
      coutthu = "Thứ 3"
      break;
    case "Wednesday":
      coutthu = "Thứ 4"
      break;
    case "Thursday":
      coutthu = "Thứ 5"
      break;
    case "Friday":
      coutthu = "Thứ 6"
      break;
    case "Saturday":
      coutthu = "Thứ 7"
      break;
    default:
      coutthu = "Chủ nhật"
      break;
  }
  return coutthu;
},
SaveFlightDepartSelected() {
  var se = this;
  if (!se.currentDepartFlight) return;
  se.JsonSurchargeFee.SurchargeFee = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.type != 'flightDepart'; });
  var priceFlightAdult = 0;
  se.currentDepartFlight[0].priceSummaries.forEach(e => {
    if (e.passengerType == 0) {
      priceFlightAdult += e.price;
    }
  });

  se.ComboPriceDiff.DepartFlightDiff.AdultUnit = priceFlightAdult - se.departTicketSale;
  var tempDiff = se.ComboPriceDiff.DepartFlightDiff.AdultUnit;
  se.ComboPriceDiff.DepartFlightDiff.CommissionAdult = Math.ceil((se.ComboPriceDiff.DepartFlightDiff.AdultUnit < 0 ? Math.abs(se.ComboPriceDiff.DepartFlightDiff.AdultUnit * 0.3) : -tempDiff) / 1000) * 1000;
  //Hiển thị giá tăng/giảm chiều đi
  se.de_flightpricetitle = Math.ceil((se.ComboPriceDiff.DepartFlightDiff.AdultUnit < 0 ? Math.abs(se.ComboPriceDiff.DepartFlightDiff.AdultUnit * 0.7) : tempDiff) / 1000) * 1000;
  se.de_flightpricetitle = se.de_flightpricetitle.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
  se.de_departpriceincrease = tempDiff > 0 ? true : false;
  se.ComboPriceDiff.DepartFlightDiff.AdultUnit = se.ComboPriceDiff.DepartFlightDiff.AdultUnit + (se.ComboPriceDiff.DepartFlightDiff.CommissionAdult > 0 ? se.ComboPriceDiff.DepartFlightDiff.CommissionAdult : 0);
  se.ComboPriceDiff.DepartFlightDiff.AdultUnitExb = 0;
  se.currentDepartFlight[0].priceSummaries.forEach(e => {
    if (e.passengerType == 0) {
      se.ComboPriceDiff.DepartFlightDiff.AdultUnitExb += e.price;
    }
  });

  se.ComboPriceDiff.DepartFlightDiff.ChildUnit = 0;
  if (se.totalChild > 0) {
    se.ComboPriceDiff.DepartFlightDiff.ChildUnit = 0;
    se.currentDepartFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 1) {
        se.ComboPriceDiff.DepartFlightDiff.ChildUnit += e.price;
      }
    });

  }

  se.ComboPriceDiff.DepartFlightDiff.InfantUnit = 0;
  if (se.totalInfant > 0) {
    se.currentDepartFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 2) {
        se.ComboPriceDiff.DepartFlightDiff.InfantUnit += e.price;
      }
    });
  }

  se.JsonSurchargeFee.DepartTicketDifferenceFee = se.ComboPriceDiff.DepartFlightDiff.AdultUnit * se.AdultCombo;
  if (se.totalChild > 0) {
    var priceItem = { type: 'flightDepart', PassengerType: 1, Quantity: (se.totalChild), PriceType: 1, Text: 'Vé máy bay chiều đi', Price: (se.ComboPriceDiff.DepartFlightDiff.ChildUnit * (se.totalChild)), PriceFormat: (se.ComboPriceDiff.DepartFlightDiff.ChildUnit * (se.totalChild)).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
    se.JsonSurchargeFee.SurchargeFee.push(priceItem);
  }
  if (se.totalInfant > 0) {
    var priceItem = { type: 'flightDepart', PassengerType: 2, Quantity: (se.totalInfant), PriceType: 1, Text: 'Vé máy bay chiều đi', Price: (se.ComboPriceDiff.DepartFlightDiff.InfantUnit * se.totalInfant), PriceFormat: (se.ComboPriceDiff.DepartFlightDiff.InfantUnit * se.totalInfant).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
    se.JsonSurchargeFee.SurchargeFee.push(priceItem);
  }
  if (se.totalAdultExtrabed > 0 && se.adultFlightNumber == 0) {
    var priceItem = { type: 'flightDepart', PassengerType: 0, Quantity: se.totalAdultExtrabed, PriceType: 1, Text: 'Vé máy bay chiều đi', Price: priceFlightAdult * se.totalAdultExtrabed, PriceFormat: (priceFlightAdult * se.totalAdultExtrabed).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
    se.JsonSurchargeFee.SurchargeFee.push(priceItem);
  } else if (se.adultFlightNumber > 0) {
    if (se.totalAdultExtrabed > 0) {
      var priceItem = { type: 'flightDepart', PassengerType: 0, Quantity: se.totalAdultExtrabed, PriceType: 1, Text: 'Vé máy bay chiều đi', Price: priceFlightAdult * se.totalAdultExtrabed, PriceFormat: (priceFlightAdult * se.totalAdultExtrabed).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    }

    var priceItem1 = { type: 'flightDepart', PassengerType: 1, childAsAdult: true, Quantity: se.adultFlightNumber, PriceType: 1, Text: 'Vé máy bay chiều đi', Price: (priceFlightAdult * se.adultFlightNumber), PriceFormat: (priceFlightAdult * se.adultFlightNumber).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
    se.JsonSurchargeFee.SurchargeFee.push(priceItem1);

  }

  se.MathPriceAll();
},
upgraderoom(){
  my.navigateTo({ url: "pages/tabBar/upgraderoom/index"});
},
onShowDateTime() {
  this.showDatePicker('dd-MM-yyyy');
},
onShowcalendar(){
  this.setData({
    showInfo: false,
    show: true,
    showOption:false
  });
},
onClick(){
  this.TotalNight=this.diffdate;
  this.getHotelContractPrice().then((data) => {
    if (data) {
      this.listDepart=[];
      this.listReturn=[];
      this.loadpricedone = false;
      this.loadflightpricedone = false;
      this.loadFlightDataNew(false);
    }
  })
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
  // var datecin = new Date(this.cin);
  // var datecout = new Date(this.cout);
  var chuoicin = this.cin.split('-');
  var chuoicout = this.cout.split('-');
  let cinshow=this.getDayOfWeek(new Date(chuoicin[2],chuoicin[1]-1,chuoicin[0])) + ', ' + this.cin;
  let coutshow=this.getDayOfWeek(new Date(chuoicout[2],chuoicout[1]-1,chuoicout[0])) + ', ' + this.cout;

  this.setData({
    showInfo: true,
    show: false,
    showOption:false,
    cinshow,
    coutshow
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
  this.roomtemp=this.roomnumber;
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
  this.roomnumber=this.roomtemp;
  this.adults=this.adultstemp;
  this.child=this.childtemp;
  this.arrchild=this.arrchildtemp;
  this.setData({
    showOption: false,
    pax:this.adultstemp+this.childtemp,
    roomnumber: this.roomtemp,
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
});
