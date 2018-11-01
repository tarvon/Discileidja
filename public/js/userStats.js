var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var tulemused = JSON.parse(xhttp.responseText);
        var andmed = document.getElementById("andmed");
        var vastus = "";
        for(x=0; x<tulemused.length; x++){
            var date = tulemused[x].date ;
            var time = tulemused[x].time ;
            var linn = tulemused[x].city ;
            if (linn=="") {linn = "-"} ;
            var riik = tulemused[x].country ;
            var ip = tulemused[x].ip ;
            let host = tulemused[x].hostname;
            vastus += "<tr><td>" + date + time + "</td><td>" + linn + "</td><td>" + riik + "</td><td>" + ip + "</td><td>" + host;
        }
        console.log(vastus);
        andmed.insertAdjacentHTML("beforeend", vastus);
    }
};
xhttp.open("GET", "/statsGET" + window.location.search, true);
xhttp.send();