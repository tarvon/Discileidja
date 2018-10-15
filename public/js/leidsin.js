function muudaMuu(){
    var uusAsukoht = document.getElementById('muuRada').value;
    var muu = document.getElementById('muu').value = uusAsukoht;

    document.getElementById("muu").innerHTML = "Muu - "+uusAsukoht;
}

function myMap() {
    var vooremäe = {lat: 58.284462, lng: 26.891569};
    var infoVooremäe = "Vooremäe";

    var dendropark = {lat: 58.393514, lng: 26.698580};
    var infoDendro = "Tartu Dendropark";

    var infowindow = new google.maps.InfoWindow({
        content: infoVooremäe, infoDendro
    });

    var mapProp= {
        center:new google.maps.LatLng({lat: 58.377099, lng: 26.722102}),
        zoom:9,
    };

    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

    var markerDendro = new google.maps.Marker({
        position: dendropark,
        map: map,
        title: 'Tartu Dendropark'
    });

    var markerVooremäe = new google.maps.Marker({
        position: vooremäe,
        map: map,
        title: 'Vooremäe'
    });
}