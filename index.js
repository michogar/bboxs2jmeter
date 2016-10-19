function onload(){

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return undefined;
}

  var url = getCookie('url');
  var layer = getCookie('layer');
  var center_latitude = getCookie('center_latitude');
  var center_longitude = getCookie('center_longitude');
  var initial_zoom = getCookie('initial_zoom');

  if (url) {
    document.getElementById('url').value = url;
  }
  if (layer) {
    document.getElementById('layer').value = layer;
  }
  if (center_latitude) {
    document.getElementById('center_latitude').value = center_latitude;
  }
  if (center_longitude) {
    document.getElementById('center_longitude').value = center_longitude;
  }
  if (initial_zoom) {
    document.getElementById('initial_zoom').value = initial_zoom;
  }

  var btnSetMap = document.getElementById('setmap');
  var btnGetBBBOXs = document.getElementById('getbboxs');
  btnGetBBBOXs.disabled = true;

  var mymap = null;
  btnSetMap.addEventListener('click', function(evt) {

    url = document.getElementById('url').value;
    layer = document.getElementById('layer').value;
    center_latitude = parseFloat(document.getElementById('center_latitude').value);
    center_longitude = parseFloat(document.getElementById('center_longitude').value);
    initial_zoom = parseInt(document.getElementById('initial_zoom').value);

    document.cookie = "url=" + url;
    document.cookie = "layer=" + layer;
    document.cookie = "center_latitude=" + center_latitude;
    document.cookie = "center_longitude=" + center_longitude;
    document.cookie = "initial_zoom=" + initial_zoom;

    if (mymap) {
      mymap.remove();
    }
  mymap = L.map('mapid').setView([center_latitude, center_longitude], initial_zoom);

    L.tileLayer.wms(url, {
        layers: layer,
        format: 'image/png',
        transparent: true
    }).addTo(mymap);

    console.log("Current BBOX: " + mymap.getBounds().toBBoxString());
    mymap.on('moveend', function(evt) {
        console.log("Current BBOX: " + mymap.getBounds().toBBoxString());
    })
    btnGetBBBOXs.disabled = false;
  })

   var randomPointInBounds = function (bounds) {

    var x_min  = bounds.getEast();
    var x_max  = bounds.getWest();
    var y_min  = bounds.getSouth();
    var y_max  = bounds.getNorth();

    var lat = y_min + (Math.random() * (y_max - y_min));
    var lng = x_min + (Math.random() * (x_max - x_min));

    var point  = L.latLng(lat, lng);
    var inside = bounds.contains(point);

    if (inside) {
        return point
    } else {
        return randomPointInPoly(bounds)
    }
}

  btnGetBBBOXs.addEventListener('click', function(evt) {

    var ZERO = 0;
    var number_bboxs = parseInt(document.getElementById('number_bboxs').value);
    var current_bbox = mymap.getBounds();
    var intial_distance = current_bbox.getNorthWest().distanceTo(current_bbox.getSouthEast());
    var textareabboxs = document.getElementById('textareabboxs');
    textareabboxs.value = "";

    if (!isNaN(number_bboxs)) {
      var i = 0;
      for ( i; i<number_bboxs; i++) {
            var latlng = randomPointInBounds(current_bbox);
            var distance = Math.floor(Math.random() * (intial_distance - ZERO + 1)) + ZERO;
            var newbounds = latlng.toBounds(distance);
            if (current_bbox.contains(newbounds)) {
              textareabboxs.value = textareabboxs.value + '\n ' + newbounds.toBBoxString();
            } else {
              i--;
            }
      }
    }
  })
}
