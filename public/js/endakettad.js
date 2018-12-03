hangiAndmed();

function hangiAndmed(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var tulemused = JSON.parse(xhttp.responseText);

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
                vastus += "<tr id=" + x + "><td>" + rada + "</td><td>" + nimi + "</td><td>" + nr + "</td><td>" + värvus + "</td><td>"
                    + tootja + "</td><td>" + mudel + "</td><td>" + tulemused[x].lisainfo + "</td><td><button type=\"button\" class=\"btn btn-danger\" onclick=\"eemalda(this)\" >Eemalda</button></td></tr>";
            }

            andmed.insertAdjacentHTML("beforeend", vastus);
        }
    };
    xhttp.open("POST", "/endakettadPOST");
    xhttp.send();
}


function eemalda(nupp){
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            hangiAndmed();
        }
    }

    var id = nupp.parentNode.parentNode.id;
    var rida = document.getElementById(id).getElementsByTagName("td");

    if(rida[0].textContent == "-"){
        var rada = "";
    }else{
        var rada = rida[0].textContent;
    }

    if(rida[1].textContent == "-"){
        var nimi = "";
    }else{
        var nimi = rida[1].textContent;
    }

    if(rida[2].textContent == "-"){
        var telefoninumber = 0;
    }else{
        var telefoninumber = rida[2].textContent;
    }

    if(rida[3].textContent == "-"){
        var värvus = "";
    }else{
        var värvus = rida[3].textContent;
    }

    if(rida[4].textContent == "-"){
        var tootja = "";
    }else{
        var tootja = rida[4].textContent;
    }

    if(rida[5].textContent == "-"){
        var mudel = "";
    }else{
        var mudel = rida[5].textContent;
    }

    if(rida[6].textContent == "-"){
        var lisainfo = "";
    }else{
        var lisainfo = rida[6].textContent;
    }

    var info = {rada:rada, nimi:nimi, telefoninumber:telefoninumber, värvus:värvus,tootja:tootja, mudel:mudel, lisainfo:lisainfo};

    xhttp.open("POST", "/endakettadkustutaPOST");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(info));
}

