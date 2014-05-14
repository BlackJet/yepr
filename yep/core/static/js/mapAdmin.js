/*
 function onInputChange(searchString, map) {
 ymaps.geocode(searchString).then(
 function (result) {
 if (result.metaData.geocoder.found == 0) {
 //                createMarker(getDefaultMark());
 } else {
 createMarker(result.geoObjects.get(0));
 map.setZoom(14);
 }

 },
 function (error) {
 console.error("Error on call geocode", error);
 }
 );
 }

 $(function () {
 //    $("#companyAddress").keyup(function (event) {
 //        if (event.which != 13)
 //            return;
 //
 //        onInputChange($(this).val(), window.mapForCompanyEdit);
 //    });

 */

function createAddressEditMap(renderTo, latitude, longitude, changeCallback) {
    var collection = new ymaps.GeoObjectCollection();

    var createMarker = function (marker) {
        collection.removeAll();

        marker.options.set("draggable", true);

        marker.events.add("dragend", function (event) {
            var c = marker.geometry.getCoordinates();
            changeCallback(c[0], c[1]);
        });

        var c = marker.geometry.getCoordinates();
        changeCallback(c[0], c[1]);

        collection.add(marker);
        collection.options.set("hasBalloon", false);

        map.setCenter(marker.geometry.getCoordinates());
    };


    var map = new ymaps.Map(renderTo, {
        center: [ymaps.geolocation.latitude, ymaps.geolocation.longitude],
        zoom: 11,
        behaviors:['default', 'scrollZoom']
    });

    map.geoObjects.add(collection);

    var marker;

    if(latitude && longitude) {
        marker = new ymaps.Placemark([latitude, longitude]);
    } else {
        marker = new ymaps.Placemark([ymaps.geolocation.latitude, ymaps.geolocation.longitude]);
    }

    createMarker(marker);
}