var AUTHTOKEN = 'eyJpdiI6ImJqemFsR2w3Q1lIeFptXC9lOE5cL2ZBQT09IiwidmFsdWUiOiJuR2lPOW12RTRHVTJBajhMc2dMTGRnPT0iLCJtYWMiOiJiMDE4NDAxZjE4OGNkZWYwNWE4NGEwNjNjYjhmODY0YmUzMzAwZjc5YzA3MzIzOTg2NTJlOGVkZGJiN2YxZGFhIn0=';

$(function () {
  $("#loc-search").autocomplete({
    source: function (request, response) {
      $.get('https://photon.komoot.io/api/?q=' + request.term + '&lat=' + LOCATIONS.virar.lat + '&lon=' + LOCATIONS.virar.lng, function (data, status) {
        console.log('status' + status);
        let locArr = [];
        let resCount = 0;
        let uniqueFlag = {};
        data.features.forEach(e => {
          if (locArr.length == 10)
            return;
          let record = {};
          if (e.properties.countrycode == 'IN') {
            record.label = e.properties.name;
            record.value = e.properties.name;
            record.lat = e.geometry.coordinates[1];
            record.lng = e.geometry.coordinates[0];
            if (!uniqueFlag[record.label]) {
              locArr.push(record);
            }
            uniqueFlag[record.label] = true;
          }
        });
        response(locArr);
      });
    },
    select: function (event, ui) {
      $('.location').text(ui.item.label);
      $('.nav-tabs a[href="#aqitab"]').tab('show');
      currLat = ui.item.lat;
      currLng = ui.item.lng;
      map.setView(
        new ol.View({
          center: ol.proj.fromLonLat([ui.item.lng, ui.item.lat]),
          // extent: map.getView().calculateExtent(map.getSize()),   
          zoom: 15
        })
      );
      getAQIV2(ui.item.lat, ui.item.lng);
      if (location.pathname.lastIndexOf('HospitalService') != -1)
        getHospitalData(ui.item.lat, ui.item.lng);

    },
    minLength: 3
  });

});


function getAQI(lat, lng) {
  let url = 'https://api.weatherbit.io/v2.0/current/airquality?lat=' + lat + '&lon=' + lng + '&key=a186c979fca24092b56f91103f3d35f2';
  $.get(url, function (data, status) {
    let aqiVal = data.data[0].aqi;
    const marker = new AQIMarker({
      position: new google.maps.LatLng(lat, lng),
      label: "AQI: " + aqiVal,
      value: aqiVal
    });
    let aqiHtml = aqiVal + '<br>' + getSeverity(aqiVal);
    $('.aqival').html(aqiHtml);
    $('.aqival').css({ 'color': getBorderColorVal(aqiVal), });
    setPatientCaution(aqiVal);
    marker.setMap(map);
    findHospitals(currLocation);
    google.maps.event.addListenerOnce(map, 'idle', function () {
      marker.setMap(map);
    });
  });
}


function getAQIV2(lat, lng, showDetail = true) {
  let reqData = aqiReqData;
  reqData.headers.lat = lat;
  reqData.headers.lon = lng;
  $.get(reqData, function (data, status) {
    if (data.Locations.length > 0) {
      data.Locations[0].airComponents.forEach(e => {
        if (e.sensorName == 'AQI-IN' || e.senDevId == 'AQI-IN') {
          let aqiVal = e.sensorData;
          if (location.pathname.lastIndexOf('HospitalService') != -1) {
            setPatientCaution(aqiVal);
          } else {
            setAqiMarker(aqiVal, lat, lng);
          }
          if (showDetail) {
            $('#aqiDetails').show();
            $('#defaultPlaces').hide();
            setAirComposition(data.Locations[0].airComponents);
            let aqiHtml = aqiVal + '<br>' + getSeverity(aqiVal);
            $('.aqival').html(aqiHtml);
            $('.aqival').css({ 'color': getBorderColorVal(aqiVal), });
          }
          return;
        }
      });

    }
  });
}

function setAirComposition(data) {
  $('#airCompGrid').show();
  let rowData = '';
  data.forEach(e => {
    if (e.sensorName != 'aqi' && e.sensorName != 'AQI-IN') {
      let row = '<tr><td>' + String(e.sensorName).toUpperCase() + '</td><td>' + e.sensorData + ' ' + e.sensorUnit + '</td></tr>'
      rowData += row;
    }
  });
  $('#airCompGrid tr:last').after(rowData);
}

function setPatientCaution(value) {
  let desc = '';
  if (value > 400) {
    desc = CAUTIION_PATIENTS.HAZARDOUS;
  } else if (value > 300) {
    desc = CAUTIION_PATIENTS.SEVERE;
  } else if (value > 200) {
    desc = CAUTIION_PATIENTS.UNHEALTHY;
  } else if (value > 100) {
    desc = CAUTIION_PATIENTS.POOR;
  } else if (value > 50) {
    desc = CAUTIION_PATIENTS.MODERATE;
  } else if (value <= 50 && value >= 0) {
    desc = CAUTIION_PATIENTS.GOOD;
  }
  $('#hosp-desc').html(desc);
}


$(document).ready(function () {
  $.get('token', function (data, status) {
    AUTHTOKEN = data.token;

    initMap();
  }).fail(function(err) {
    alert('Error while fetching API TOKEN from server');
    console.log(err);    
  });

  $('#aqiDetails').hide();
  $('#airCompGrid').hide();
  $('#btn-hos').click(function () {
    $('.hosp-marker').show();
    $('.aqi-marker').hide();
  });

  $('#btn-aqi').click(function () {
    $('.aqi-marker').show();
    $('.hosp-marker').hide();
  });
  $('[data-toggle="tooltip"]').tooltip();
});


var map = null;
var AQIMarker = null;
var currLng = null;
var currLat = null;

function initMap() {
  map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([77.8667512008853, 19.287833629855626]),
      zoom: 6
    })
  });

  if (location.pathname.lastIndexOf('HospitalService') != -1) {
    initDefaultHospitals();
  } else {
    initDefaultPlaces();
  }
}

function initDefaultPlaces() {
  let defPlaces = Object.keys(LOCATIONS);
  defPlaces.forEach(e => {
    getAQIV2(LOCATIONS[e].lat, LOCATIONS[e].lng, false);
    let item = '<a href="#" id="defLocItem" lat="' + LOCATIONS[e].lat + '" lng="' + LOCATIONS[e].lng + '" class="def-loc-list list-group-item list-group-item-action mt-2"><i class="def-loc-icon fas fa-map-marked-alt"></i> ' + LOCATIONS[e].name + '</a>'
    $("#defaultPlaces div").append(item);
  });
  $('body').on('click', '#defLocItem', function () {
    if ($(this) && $(this).length > 0) {
      $('.location').text($(this)[0].innerText);
      let lat = $(this)[0].getAttribute('lat');
      let lng = $(this)[0].getAttribute('lng');
      getAQIV2(lat, lng);
      map.setView(
        new ol.View({
          center: ol.proj.fromLonLat([lng, lat]),
          // extent: map.getView().calculateExtent(map.getSize()),   
          zoom: 15
        })
      );
    }
  });
}

function setAqiMarker(aqiVal, lat, lng) {
  const content = document.createElement('div');
  content.classList.add('marker');
  content.classList.add('aqi-marker');
  content.id = 'aqiSymbol';
  content.textContent = aqiVal;
  content.style.position = 'absolute';
  content.style.transform = 'translate(-50%, -100%)';

  if (aqiVal > 400) {
    content.style.backgroundColor = '#f00';
  } else if (aqiVal > 300) {
    content.style.backgroundColor = '#ff4d00';
  } else if (aqiVal > 200) {
    content.style.backgroundColor = '#ff7100';
  } else if (aqiVal > 100) {
    content.style.backgroundColor = '#ffb700';
  } else if (aqiVal > 50) {
    content.style.backgroundColor = '#e9ff00';
  } else if (aqiVal <= 50 && aqiVal >= 0) {
    content.style.backgroundColor = '#00ff32';
  }

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.cursor = 'pointer';
  container.appendChild(content);

  var marker = new ol.Overlay({
    position: ol.proj.fromLonLat([lng, lat]),
    positioning: 'center-center',
    element: container,
    stopEvent: false
  });
  map.addOverlay(marker);

  map.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
}