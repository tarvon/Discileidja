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

function saada(){
    if( document.getElementById('nimi').value =='' &&
        document.getElementById('telefoninumber').value =='' &&
        document.getElementById('värvus').value =='' &&
        document.getElementById('tootja').value =='' &&
        document.getElementById('mudel').value =='' &&
        document.getElementById('lisainfo').value ==''){
        document.getElementById("vastusAlert").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Pead lisama veel infot!</div>";
    } else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var vastusAlert = document.getElementById("vastusAlert");
                if(this.responseText == ""){
                    if(typeof document.getElementById('pilt').files[0] != 'undefined'){
                        saadafile();
                    }else{
                        vastusAlert.innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Ketas lisatud!</div>";
                    }
                }else{
                    vastusAlert.innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Ketta lisamisel tekkis viga!</div>";
                }
            }
        };

        var info = {rada:document.getElementById('rada').value, nimi:document.getElementById('nimi').value,
            telefoninumber: + document.getElementById('telefoninumber').value, värvus:document.getElementById('värvus').value,
            tootja:document.getElementById('tootja').value, mudel:document.getElementById('mudel').value,
            lisainfo:document.getElementById('lisainfo').value};


        if(!isNaN(info.telefoninumber)){
            xhttp.open("POST", "/leidsinPOST");
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(info));
        }else{
            var vastusAlert = document.getElementById("vastusAlert");
            vastusAlert.innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Telefoninumbris on viga!</div>";
        }
    }
}

function saadafile(){
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var vastusAlert = document.getElementById("vastusAlert");
            if(this.responseText == ""){
                vastusAlert.innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Ketas lisatud!</div>";
            }else{
                vastusAlert.innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Ketta lisamisel tekkis viga!</div>";
            }
        }
    };

    var pilt = document.getElementById('pilt');
    var file = pilt.files[0];
    var formData = new FormData();
    formData.append('pilt', file);

    xhttp.open("POST", "/imagePOST");
    xhttp.send(formData);
}