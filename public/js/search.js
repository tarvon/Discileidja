if(window.location.hash == ""){
    buttonSend();
} else{
    getData(window.location.hash.substring(1, window.location.hash.length));
}

function buttonSend(){
    var rada = document.getElementById('rada').value;
    var nimi = document.getElementById('nimi').value;
    var telefoninumber = document.getElementById('telefoninumber').value;
    var värvus = document.getElementById('värvus').value;
    var tootja = document.getElementById('tootja').value;
    var mudel = document.getElementById('mudel').value;

    var get = "/andmed?";

    if(rada != "") {get += "rada=" + rada + "&"};
    if(nimi != "") {get += "nimi=" + nimi + "&"};
    if(telefoninumber != "") {get += "telefoninumber=" + telefoninumber + "&"};
    if(värvus != "") {get += "värvus=" + värvus + "&"};
    if(tootja != "") {get += "tootja=" + tootja + "&"};
    if(mudel != "") {get += "mudel=" + mudel + "&"};

    if(get[get.length - 1] == "&"){
        get = get.substring(0, get.length-1);
    }
    getData(get);
}

function getData(hash) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var tulemused = JSON.parse(xhttp.responseText);

            var otsing = tulemused[0];
            if(typeof otsing.rada != 'undefined'){
                document.getElementById('rada').value = otsing.rada;
            }
            if(typeof otsing.nimi != 'undefined'){
                document.getElementById('nimi').value = otsing.nimi;
            }
            if(typeof otsing.telefoninumber != 'undefined'){
                document.getElementById('telefoninumber').value = otsing.telefoninumber;
            }
            if(typeof otsing.värvus != 'undefined'){
                document.getElementById('värvus').value = otsing.värvus;
            }
            if(typeof otsing.tootja != 'undefined'){
                document.getElementById('tootja').value = otsing.tootja;
            }
            if(typeof otsing.mudel != 'undefined'){
                document.getElementById('mudel').value = otsing.mudel;
            }

            var andmed = document.getElementById("andmed");
            while(andmed.firstChild) {
                andmed.removeChild(andmed.firstChild);
            }
            andmed.insertAdjacentHTML('beforeend', '<col width="80">\n' +
                '        <thead class="thead-dark">\n' +
                '            <tr>\n' +
                '                <th class="font-weight-bold">Rada</th>\n' +
                '                <th class="font-weight-bold">Nimi</th>\n' +
                '                <th class="font-weight-bold">Tel. nr</th>\n' +
                '                <th class="font-weight-bold">Värvus</th>\n' +
                '                <th class="font-weight-bold">Tootja</th>\n' +
                '                <th class="font-weight-bold">Mudel</th>\n' +
                '                <th class="font-weight-bold">Lisainfo</th>\n' +
                '                <th class="font-weight-bold"></th>\n' +
                '            </tr>\n' +
                '        </thead>'
                );

            var vastus = "";
            for (x = 1; x < tulemused.length; x++) {
                var rada = tulemused[x].rada;
                var nimi = tulemused[x].nimi;
                if (nimi == "") {
                    nimi = "-"
                }
                ;
                var nr = tulemused[x].telefoninumber;
                if (nr == 0) {
                    nr = "-"
                }
                ;
                var värvus = tulemused[x].värvus;
                var tootja = tulemused[x].tootja;
                if (tootja == "") {
                    tootja = "-"
                }
                ;
                var mudel = tulemused[x].mudel;
                if (mudel == "") {
                    mudel = "-"
                }
                ;
                vastus += "<tr><td>" + rada + "</td><td>" + nimi + "</td><td>" + nr + "</td><td>" + värvus + "</td><td>"
                    + tootja + "</td><td>" + mudel + "</td><td>" + tulemused[x].lisainfo + "</td><td><button type=\"button\" class=\"btn btn-success\" data-toggle=\"modal\" data-target=\"#contactModal\">Võta ühendust</button></td></tr>";
            }


            andmed.insertAdjacentHTML("beforeend", vastus);
            document.getElementById("tabeliInfo").innerText = "Leiti " + String(tulemused.length-1) + " ketast!";
            window.location.hash = hash;
        }
    };
    xhttp.open("GET", hash, true);
    xhttp.send();
}

