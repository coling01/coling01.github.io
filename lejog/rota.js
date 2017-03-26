var shifts_array;
// 48+48+48+24 = 168
var maxcells = 168;

function populateTable() {
    clearTableInputs;
    $("#rota").empty();
    addInitialCells();
    addHeaderCols();
    addGrid();
    setAllCells();
    updateTableInputs();
    addPlaces("reverse");
}

function addInitialCells() {
    var shifts = $("#shift").val();
    shifts_array = shifts.split(',');

    var html = '<tr id="dayheader">\
        <th></th>\
        <th colspan="48">Friday</th>\
        <th colspan="48">Saturday</th>\
        <th colspan="48">Sunday</th>\
        <th colspan="24">Monday</th>\
        </tr>\
        <tr id="hourheader">\
        <th>Rider</th>\
        </tr>\
        <tr id="a1">\
        <td><b>AHQ</b></td>\
        </tr>\
        <tr id="a2">\
        <td><b>AS</b></td>\
        </tr>\
        <tr id="a3">\
        <td><b>AV1</b></td>\
        </tr>\
        <tr id="a4">\
        <td><b>AV2</b></td>\
        </tr>\
        <tr id="b1">\
        <td><b>BHQ</b></td>\
        </tr>\
        <tr id="b2">\
        <td><b>BS</b></td>\
        </tr>\
        <tr id="b3">\
        <td><b>BV1</b></td>\
        </tr>\
        <tr id="b4">\
        <td><b>BV2</b></td>\
        </tr>\
        <tr id="c1">\
        <td><b>CHQ</b></td>\
        </tr>\
        <tr id="c2">\
        <td><b>CS</b></td>\
        </tr>\
        <tr id="c3">\
        <td><b>CV1</b></td>\
        </tr>\
        <tr id="c4">\
        <td><b>CV2</b></td>\
        </tr>\
        <tr id="miles">\
        <td><b>Miles</b></td>\
        </tr>\
        <tr id="totalmiles">\
        <td><b>Total Miles</b></td>\
        </tr>\
        <tr id="towns">\
        <td><b>Towns</b></td>\
        </tr>';
    $("#rota").html(html);
}
function zeropad(n) {
    if (n.toString().length < 2)
        return "0" + n;
    else
        return n;
}
function addHeaderCols() {
    // Fri Sat Sun Mon
    // 00:00 -> 23:59
    for (i = 1; i <= 3; i++) {
        for (j = 0; j <= 23; j++) {
            $("#hourheader").find('th:last').after("<th class=\"hh_" + j + "\" colspan=\"2\">" + zeropad(j) + "</th>");
        }
    }
    for (j = 0; j <= 12; j++) {
        $("#hourheader").find('th:last').after("<th class=\"hh_" + j + "\" colspan=\"2\">" + zeropad(j) + "</th>");
    }
}
function addGrid() {
    for (j = 1; j <= maxcells; j++) {
        for (k = 1; k <= 4; k++) {
            $("#a" + k).find('td:last').after("<td id=\"a" + k + "_" + j + "\">" + " " + "</td>");
            $("#b" + k).find('td:last').after("<td id=\"b" + k + "_" + j + "\">" + " " + "</td>");
            $("#c" + k).find('td:last').after("<td id=\"c" + k + "_" + j + "\">" + " " + "</td>");
        }
        $("#miles").find('td:last').after("<td id=\"miles_" + j + "\">" + " " + "</td>");
        $("#totalmiles").find('td:last').after("<td id=\"totalmiles_" + j + "\">" + " " + "</td>");
        $("#towns").find('td:last').after("<td id=\"towns_" + j + "\">" + " " + "</td>");
    }
}

// nth-child goes from 1 upwards
function setCell(rider, cellnum, celltype, miles) {
    // $("#a1").find('td:nth-child('+cellnum+')').after("<td class=\"sleeper\">"+"R"+"</td>");
    if (celltype == "riding") {
        $("#" + rider + "_" + cellnum).addClass("riding");
        $("#" + rider + "_" + cellnum).html("R");
    }
    else if (celltype == "hq") {
        $("#" + rider + "_" + cellnum).addClass("hq");
        $("#" + rider + "_" + cellnum).html("HQ");
    }
    else if (celltype == "van") {
        $("#" + rider + "_" + cellnum).addClass("van");
        $("#" + rider + "_" + cellnum).html("V");
    }
    else if (celltype == "sleeper") {
        $("#" + rider + "_" + cellnum).addClass("sleeper");
        $("#" + rider + "_" + cellnum).html("S");
    }
    else if (celltype == "break") {
        $("#" + rider + "_" + cellnum).addClass("break");
        $("#" + rider + "_" + cellnum).html("B");
    }
    else if (celltype == "miles") {
        $("#miles_" + cellnum).html(miles);
    }
    else if (celltype == "totalmiles") {
        $("#totalmiles_" + cellnum).html(miles);
    }
}

function removeCell(rider, cellnum) {
    $("#" + rider + "_" + cellnum).remove();
}

function getNoneBlankCell(rider, cellnum) {
    var celltype = $("#" + rider + "_" + cellnum).html();
    while (celltype == 'B') {
        cellnum++;
        celltype = $("#" + rider + "_" + cellnum).html();
    }
    return cellnum;
}

function setGroupCells(group, cellnum, celltype) {
    setCell(group + "1", cellnum, celltype);
    setCell(group + "2", cellnum, celltype);
    if (celltype == "hq") {
        setCell(group + "3", cellnum, "van");
        setCell(group + "4", cellnum, "van");
    }
    else {
        setCell(group + "3", cellnum, celltype);
        setCell(group + "4", cellnum, celltype);
    }
}
function setMiles(cellnum, speed) {
    setCell("miles", cellnum, "miles", speed);
    var totalmiles = 0;
    $("#miles").find("td").each(function () {
            var thismiles = $(this).html();
            if (thismiles.length > 0 && thismiles != " " && thismiles.length < 4) {
                totalmiles += Math.round(thismiles * 10) / 10;
                setCell("totalmiles", cellnum, "totalmiles", totalmiles);
                if (totalmiles >= 999) {
                    $("#totalmiles_" + cellnum).addClass("finished");
                }
            }
        }
    );
}
function setAllCells() {
    // Each rider goes ride ... rest ... hq/van
    // With offset for starting
    var aspeed = $("#aspeed").val() / 2;
    var bspeed = $("#bspeed").val() / 2;
    var cspeed = $("#cspeed").val() / 2;
    var cellnum = 1;
    for (var i = 0; i < shifts_array.length; i++) {
        var numhours = shifts_array[i];
        if (numhours == 0 || numhours == "B") {
            setGroupCells("a", cellnum, "break")
            setGroupCells("b", cellnum, "break")
            setGroupCells("c", cellnum, "break")
            setMiles(cellnum, 0);
            cellnum++;
        }
        else {
            // a ride b duty c rest
            // riding = true ... shift*1
            for (var j = 1; j <= numhours; j++) {
                setGroupCells("a", cellnum, "riding");
                setGroupCells("b", cellnum, "hq");
                setGroupCells("c", cellnum, "sleeper");
                setMiles(cellnum, aspeed);
                cellnum++;
            }

            for (var j = 1; j <= numhours; j++) {
                setGroupCells("a", cellnum, "sleeper");
                setGroupCells("b", cellnum, "riding");
                setGroupCells("c", cellnum, "hq");
                setMiles(cellnum, bspeed);
                cellnum++;
            }
            for (var j = 1; j <= numhours; j++) {
                setGroupCells("a", cellnum, "hq");
                setGroupCells("b", cellnum, "sleeper");
                setGroupCells("c", cellnum, "riding");
                setMiles(cellnum, cspeed);
                cellnum++;
            }
        }
    }
//    setGroupCells("a", cellnum, "riding")
//    setGroupCells("b", cellnum, "riding")
//    setGroupCells("c", cellnum, "riding")
//    setMiles(cellnum, "6");

}

function setEmptyToSleeper(rider, cellnum) {
    var celltype = $("#" + rider + "_" + cellnum).html();
    var mileage = $("#totalmiles_" + cellnum).html();
    if (mileage == " ") {
        removeCell(rider, cellnum);
    }
    else if (celltype == " ") {
        setCell(rider, cellnum, "sleeper")
    }
}

function addPlaces(direction) {
    jQuery.fn.reverse = [].reverse;
    $.ajax({
        url: "routetimingstable.html?x=" + $.now()
    }).done(function (data) {
        $("#timingstable").html(data);
        if (direction == "reverse") {
            rows = $("#timingstable tr.timing").reverse();
            cell = "down"
        }
        else {
            rows = $("#timingstable tr.timing");
            cell = "total"
        }
        rows.each(function () {
            var thistown = $(this).find(".town").html();
            var thismiles = parseInt($(this).find(".miles").html());
            var thistotal = parseInt($(this).find("." + cell).html());
            updateTown(thistown, thistotal);
        });
    });
}

function updateTown(town, mileage) {
    var towncolspan = 4;
    if (town.length > 10) {
        var towncolspan = 6;
    }
    for (j = 1; j <= maxcells; j++) {
        var total = parseInt($("#totalmiles_" + j).html());
        if (total > mileage) {
            $("#towns_" + j).html("&uarr; " + town + " " + mileage);
            $("#towns_" + j).attr("colspan", towncolspan);
            for (n = 1; n <= ( towncolspan - 1); n++) {
                var removecell = j + n;
                $("#towns_" + removecell).remove();
            }
            break;
        }
    }
}

function clearTableInputs() {
    $("#aset").html("-");
    $("#bset").html("-");
    $("#cset").html("-");
}

function updateTableInputs() {
    var aspeed = $("#aspeed").val();
    var bspeed = $("#bspeed").val();
    var cspeed = $("#cspeed").val();

    $("#aset").html(aspeed);
    $("#bset").html(bspeed);
    $("#cset").html(cspeed);
}