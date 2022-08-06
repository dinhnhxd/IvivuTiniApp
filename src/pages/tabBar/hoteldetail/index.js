Page({
  data: {
    items: [],
    iconType:[
      'location',
    ]
  },
  onLoad(query) {
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
        this.items = response;
        let ricecombo = response.Combos.Price;
        console.log('ricecombo '+ricecombo);
        ricecombo = this.arprice(ricecombo);
        console.log(this.items);
        this.setData({ response,ricecombo, loading: false });
      },
    });
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
    let rice = (minPrice )
      .toLocaleString()
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
      .replace(',', '.');
    console.log('rice ' + rice);
    return rice;
  },
});
