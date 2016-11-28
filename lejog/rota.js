var shifts = '2,4,4,4,2,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0,2,1';
var shifts_array = shifts.split(',');

function populateTable() {
    $("#rota").empty();
    addInitialCells();
    addHeaderCols();
    addGrid();
    addRidingCells();
    addVanCells();
    addCamperCells();
}

function addInitialCells(){
    console.log("Resetting initial cells");
    var html='<tr id="dayheader">\
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
        <td><b>A1</b></td>\
    </tr>\
    <tr id="a2">\
        <td>A2</td>\
        </tr>\
        <tr id="a3">\
        <td>A3</td>\
        </tr>\
        <tr id="a4">\
        <td>A4</td>\
        </tr>\
        <tr id="b1">\
        <td>B1</td>\
        </tr>\
        <tr id="b2">\
        <td>B2</td>\
        </tr>\
        <tr id="b3">\
        <td>B3</td>\
        </tr>\
        <tr id="b4">\
        <td>B4</td>\
        </tr>\
        <tr id="c1">\
        <td>C1</td>\
        </tr>\
        <tr id="c2">\
        <td>C2</td>\
        </tr>\
        <tr id="c3">\
        <td>C3</td>\
        </tr>\
        <tr id="c4">\
        <td>C4</td>\
        </tr>\
        <tr id="miles">\
        <td>Miles</td>\
        </tr>\
        <tr id="totalmiles">\
        <td>Total Miles</td>\
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
    // 48+48+48+24 = 168
    for (j = 1; j <= 168; j++) {
        for (k = 1; k <= 4; k++) {
            $("#a" + k).find('td:last').after("<td id=\"a" + k + "_" + j + "\">" + " " + "</td>");
            $("#b" + k).find('td:last').after("<td id=\"b" + k + "_" + j + "\">" + " " + "</td>");
            $("#c" + k).find('td:last').after("<td id=\"c" + k + "_" + j + "\">" + " " + "</td>");
        }
        $("#miles").find('td:last').after("<td id=\"miles_" + j + "\">" + " " + "</td>");
        $("#totalmiles").find('td:last').after("<td id=\"totalmiles_" + j + "\">" + " " + "</td>");
    }
}

// nth-child goes from 1 upwards
function setCell(rider, cellnum, celltype, miles) {
    // $("#a1").find('td:nth-child('+cellnum+')').after("<td class=\"camper\">"+"R"+"</td>");
    if (celltype == "riding") {
        $("#" + rider + "_" + cellnum).addClass("riding");
        $("#" + rider + "_" + cellnum).html("R");
    }
    else if (celltype == "camper") {
        $("#" + rider + "_" + cellnum).addClass("camper");
        $("#" + rider + "_" + cellnum).html("C");
    }
    else if (celltype == "van") {
        $("#" + rider + "_" + cellnum).addClass("van");
        $("#" + rider + "_" + cellnum).html("V");
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
    setCell(group + "3", cellnum, celltype);
    setCell(group + "4", cellnum, celltype);
}
function setMiles(cellnum, speed) {
    setCell("miles", cellnum, "miles", speed);
    var totalmiles = 0;
    $("#miles").find("td").each(function () {
            var thismiles = $(this).html();
            if (thismiles.length > 0 && thismiles != " " && thismiles.length < 3) {
                totalmiles += parseInt(thismiles);
                setCell("totalmiles", cellnum, "totalmiles", totalmiles);
                if(totalmiles>=999){
                    $("#totalmiles_" + cellnum).addClass("finished");
                }
            }
        }
    );
}
function addRidingCells() {
    var aspeed = $("#aspeed").val()/2;
    var bspeed = $("#bspeed").val()/2;
    var cspeed = $("#cspeed").val()/2;
    var cellnum = 1;
    setGroupCells("a", cellnum, "riding")
    setGroupCells("b", cellnum, "riding")
    setGroupCells("c", cellnum, "riding")
    setMiles(cellnum, "6");
    cellnum++;
    for (var i = 0; i < shifts_array.length; i++) {
        var numhours = shifts_array[i];
        if (numhours == 0) {
            setGroupCells("a", cellnum, "break")
            setGroupCells("b", cellnum, "break")
            setGroupCells("c", cellnum, "break")
            setMiles(cellnum, 0);
            cellnum++;
        }
        else {
            // riding = true ... shift*1
            for (var j = 1; j <= numhours; j++) {
                setGroupCells("a", cellnum, "riding");
                setMiles(cellnum, aspeed);
                cellnum++;
            }

            for (var j = 1; j <= numhours; j++) {
                setGroupCells("b", cellnum, "riding");
                setMiles(cellnum, bspeed);
                cellnum++;
            }
            for (var j = 1; j <= numhours; j++) {
                setGroupCells("c", cellnum, "riding");
                setMiles(cellnum, cspeed);
                cellnum++;
            }
        }
    }
    setGroupCells("a", cellnum, "riding")
    setGroupCells("b", cellnum, "riding")
    setGroupCells("c", cellnum, "riding")
    setMiles(cellnum, "6");
}
function addVanCells() {
    var van1 = "c1,c2,a1,a2,b1,b2,c3,c4,a3,a4,b3,b4,";
    var van2 = "c1,c3,a1,a3,b1,b3,c2,c2,a2,a4,b2,b4,";
    var van3 = "c1,c4,a1,a4,b1,b4,c2,c3,a2,a3,b2,b3,";
    var vanorder = van1 + van2 + van3 + van1 + van2 + van3 + van1 + van2 + van3 + van1 + van2 + van3;
    var van_array = vanorder.split(',');
    var cellnum = 2;
    var vannum = 0;
    for (var i = 0; i < shifts_array.length; i++) {
        var numhours = shifts_array[i];
        if (numhours != 0) {
            var driver1 = van_array[vannum];
            var passenger1 = van_array[vannum + 1];
            for (var j = 1; j <= numhours; j++) {
                cellnum = getNoneBlankCell(driver1, cellnum);
                setCell(driver1, cellnum, "van");
                setCell(passenger1, cellnum, "van");
                cellnum++;
            }
            vannum += 2;

            var driver2 = van_array[vannum];
            var passenger2 = van_array[vannum + 1];
            for (var j = 1; j <= numhours; j++) {
                setCell(driver2, cellnum, "van");
                setCell(passenger2, cellnum, "van");
                cellnum++;
            }
            vannum += 2;

            var driver3 = van_array[vannum];
            var passenger3 = van_array[vannum + 1];
            for (var j = 1; j <= numhours; j++) {
                setCell(driver3, cellnum, "van");
                setCell(passenger3, cellnum, "van");
                cellnum++;
            }
            vannum += 2;
        }
    }
}

function setEmptyToCamper(rider, cellnum) {
    var celltype = $("#" + rider + "_" + cellnum).html();
    var mileage = $("#totalmiles_" + cellnum).html();
    if (mileage == " ") {
        removeCell(rider, cellnum);
    }
    else if (celltype == " ") {
        setCell(rider, cellnum, "camper")
    }
}

function addCamperCells() {
    // fill anything thats blank with camper !
    // 48+48+48+24 = 168
    for (j = 1; j <= 168; j++) {
        for (k = 1; k <= 4; k++) {
            setEmptyToCamper("a" + k, j);
            setEmptyToCamper("b" + k, j);
            setEmptyToCamper("c" + k, j);
        }
        setEmptyToCamper("miles", j);
        setEmptyToCamper("totalmiles", j);
    }
}