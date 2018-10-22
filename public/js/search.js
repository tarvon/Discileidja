var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var tulemused = JSON.parse(xhttp.responseText);
        var andmed = document.getElementById("andmed");
        var vastus = "";
        for(x=0; x<tulemused.length; x++){
            var rada = tulemused[x].rada ;
            var nimi = tulemused[x].nimi ;
            if (nimi=="") {nimi = "-"} ;
            var nr = tulemused[x].discinumber ;
            if (nr==0) {nr = "-"} ;
            var värvus = tulemused[x].värvus ;
            var tootja = tulemused[x].tootja ;
            if (tootja=="") {tootja = "-"} ;
            var mudel = tulemused[x].mudel ;
            if (mudel=="") {mudel = "-"} ;
            vastus += "<tr><td>" + rada + "</td><td>" + nimi + "</td><td>" + nr + "</td><td>" + värvus + "</td><td>"
                + tootja + "</td><td>" + mudel + "</td><td>" + tulemused[x].lisainfo + "</td><td><button type=\"button\" class=\"btn btn-success\" data-toggle=\"modal\" data-target=\"#contactModal\">Võta ühendust</button></td></tr>";
        }
        console.log(vastus);
        andmed.insertAdjacentHTML("beforeend", vastus);
        document.getElementById("tabeliInfo").innerText = "Leiti " + x + " ketast!" ;
    }
};
xhttp.open("GET", "/andmed" + window.location.search, true);
xhttp.send();