const HOSPITAL_API = 'https://www.overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0Anwr(around%3A$(RADIUS)%2C$(LAT)%2C$(LNG))%5B%22amenity%22%3D%22hospital%22%5D%3B%0Aout+center%3B';
function getHospitalData(lat, lng) {
    let url = HOSPITAL_API;
    url = url.replace("$(RADIUS)", HOSPITAL_SEARCH_RADIUS_KM);
    url = url.replace("$(LAT)", lat);
    url = url.replace("$(LNG)", lng);
    map.setView(
        new ol.View({
            center: ol.proj.fromLonLat([lng, lat]),
            // extent: map.getView().calculateExtent(map.getSize()),   
            zoom: 15
        })
    );
    $.get(url, function (data, status) {
        console.log(data);
        if (data) {
            $('#hosptab').show();
            $('#defaultPlacesHosp').hide();
            data.elements.forEach(e => {
                setHospitalMarker(e.tags.name, e.lat, e.lon);
            });
        }
    });

}

function setHospitalMarker(name, lat, lng) {
    const content = document.createElement('i');
    content.classList.add('marker');
    content.classList.add('hosp-marker');
    content.classList.add('fas');
    content.classList.add('fa-medkit');
    content.id = 'hospSymbol';
    //   content.textContent = params.label;
    content.style.color = 'white';
    // content.style.display = 'none';
    content.style.position = 'absolute';
    content.style.transform = 'translate(-50%, -100%)';
    content.style.backgroundColor = '#ff284a';

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.cursor = 'pointer';
    container.setAttribute('data-toggle', 'tooltip');
    container.setAttribute('title', name);
    container.appendChild(content);
    var marker = new ol.Overlay({
        position: ol.proj.fromLonLat([lng, lat]),
        positioning: 'center-center',
        element: container,
        stopEvent: false
    });
    map.addOverlay(marker);
}

$(document).ready(function () {
    if ($('#hosptab'))
        $('#hosptab').hide();
});


function initDefaultHospitals() {
    let defPlaces = Object.keys(LOCATIONS);
    defPlaces.forEach(e => {
        //   getAQIV2(LOCATIONS[e].lat, LOCATIONS[e].lng, false);
        let item = '<a href="#" id="defHospItem" lat="' + LOCATIONS[e].lat + '" lng="' + LOCATIONS[e].lng + '" class="def-loc-list list-group-item list-group-item-action mt-2"><i class="def-loc-icon fas fa-map-marked-alt"></i> ' + LOCATIONS[e].name + '</a>'
        $("#defaultPlacesHosp div").append(item);
    });
    $('body').on('click', '#defHospItem', function () {
        if ($(this) && $(this).length > 0) {
            $('.location').text($(this)[0].innerText);
            let lat = $(this)[0].getAttribute('lat');
            let lng = $(this)[0].getAttribute('lng');
            getAQIV2(lat, lng);
            getHospitalData(lat, lng);
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