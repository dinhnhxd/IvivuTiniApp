import { environment } from "./environment";

export class C {
    //public static googleAnalytics: GoogleAnalytics;
    public static ENV = environment.ENV || 'dev';
    public static urls: any = {
      get baseUrl() {
        // if (!C.HOSTS[C.ENV]) { throw new error('Unknown environment'); }
  
        return C.HOSTS[C.ENV];
      },
      apiVersion: 'api',
      get url() {
        return this.baseUrl + '/' + this.apiVersion;
      },
      get users() {
        return this.url + '/users';
      },
    };
  
    private static HOSTS: any = {
      dev: {urlPost: 'https://svc1-beta.ivivu.com',urlGet: 'https://beta.ivivu.com', urlContracting: 'https://betapay.ivivu.com', urlMobile: 'https://beta-olivia.ivivu.com',urlBlog: 'https://svc3.ivivu.com',urlGate: 'https://beta-olivia.ivivu.com',urlPayment: 'https://beta-olivia.ivivu.com/payment',urlbookcombo:'https://betapay.ivivu.com/', urlSVC3: 'https://beta-svc3.ivivu.com/api/', urlFood: "https://beta-food.ivivu.com", urlERPFood: "https://beta-erpfood.ivivu.com/", urlFlight: "https://beta-air.ivivu.com/",emailDC:"sandbox.test@ivivu.info"},
      // dev: {urlPost: 'https://svc1.ivivu.com',urlGet: 'https://www.ivivu.com', urlContracting: 'https://pay.ivivu.com', urlMobile: 'https://gate.ivivu.com',urlBlog: 'https://svc3.ivivu.com',urlGate: 'https://gate.ivivu.com',urlPayment: 'https://gate.ivivu.com/payment', urlSVC3: 'https://svc3.ivivu.com/api/', urlFood: "https://food.ivivu.com", urlERPFood: "https://erpfood.ivivu.com/", urlFlight: "https://api-flight.ivivu.com/"},
      prod: {urlPost: 'https://svc1.ivivu.com',urlGet: 'https://www.ivivu.com', urlContracting: 'https://pay.ivivu.com', urlMobile: 'https://gate.ivivu.com',urlBlog: 'https://svc3.ivivu.com',urlGate: 'https://gate.ivivu.com',urlPayment: 'https://gate.ivivu.com/payment', urlSVC3: 'https://svc3.ivivu.com/api/', urlFood: "https://food.ivivu.com", urlERPFood: "https://erpfood.ivivu.com/", urlFlight: "https://api-flight.ivivu.com/",emailDC:"service@ivivu.com"},
      release: {urlPost: 'https://svc1.ivivu.com',urlGet: 'https://www.ivivu.com', urlContracting: 'https://pay.ivivu.com', urlMobile: 'https://gate.ivivu.com',urlBlog: 'https://svc3.ivivu.com',urlGate: 'https://gate.ivivu.com',urlPayment: 'https://gate.ivivu.com/payment', urlSVC3: 'https://svc3.ivivu.com/api/', urlFood: "https://food.ivivu.com", urlERPFood: "https://erpfood.ivivu.com/", urlFlight: "https://api-flight.ivivu.com/",emailDC:"service@ivivu.com"},
    };

  };
  
