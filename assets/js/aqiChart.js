var chartConfig = {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'AQI Value',
      data: [],
      backgroundColor: [

      ],
      borderColor: [
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          fontSize: 15,
          labelString: 'AQI'
        }
      }]
    }
  }
}

$(document).ready(function () {
  // $.get(AUTHTOKENURI, function (data, status) {
  //   AUTHTOKEN = data.token;
  drawChart();
  // });
});

function drawChart() {
  let location = LOCATIONS;
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, chartConfig);
  fetchAQIV2(location, myChart);
}

function fetchAQIV1(location, myChart) {
  Object.keys(location).forEach(e => {

    let url = 'https://api.weatherbit.io/v2.0/current/airquality?lat=' + location[e].lat + '&lon=' + location[e].lng + '&key=a186c979fca24092b56f91103f3d35f2';
    let req = $.get(url, function (data, status) {
      let aqiVal = data.data[0].aqi;
      chartConfig.data.datasets[0].data.push(aqiVal);
      chartConfig.data.labels.push(location[e].name);
      chartConfig.data.datasets[0].backgroundColor.push(getBgColorVal(aqiVal));
      chartConfig.data.datasets[0].borderColor.push(getBorderColorVal(aqiVal));
      myChart.update();
    });
  });
}

function fetchAQIV2(location, myChart) {
  let reqData = aqiReqData;

  Object.keys(location).forEach(e => {
    reqData.headers.lat = location[e].lat;
    reqData.headers.lon = location[e].lng;
    let req = $.get(reqData, function (data, status) {
      if(data.Locations.length > 0) {
        data.Locations[0].airComponents.forEach(c => {
          if(c.sensorName == 'AQI-IN' || c.senDevId =='AQI-IN' ) {
            let aqiVal = c.sensorData;
            chartConfig.data.datasets[0].data.push(aqiVal);
            chartConfig.data.labels.push(location[e].name);
            chartConfig.data.datasets[0].backgroundColor.push(getBgColorVal(aqiVal));
            chartConfig.data.datasets[0].borderColor.push(getBorderColorVal(aqiVal));
            myChart.update();
          }
        });
      }
    });
  });
}
