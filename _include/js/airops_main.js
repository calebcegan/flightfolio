// Convert form data to JS object with jQuery
$.fn.serializeObject = function() {var o = {}; var a = this.serializeArray(); $.each(a, function() {if (o[this.name] !== undefined) {if (!o[this.name].push) {o[this.name] = [o[this.name]]; } o[this.name].push(this.value || ''); } else {o[this.name] = this.value || ''; } }); return o; };
// $.fn.refresh = function(){ this.selectpicker('refresh'); };
Array.prototype.getIndexBy = function(t,r){for(var e=0;e<this.length;e++)if(this[e][t]==r)return e};
String.prototype.toTitleCase = function(){
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
} 

var appy = {
    self: this,  
    sectorid: 1,
    air_id: 0,
    aircraftid: 0,
    aircraft: null, 
    autoupdate: null,
    now:   function(){ return moment(); },
    utc:   function(){ return moment.utc(); }, 
    today: function(){ return this.now().format("YYYY-MM-DD HH:mm:ss"); },
    ao_format: function(d){ 
        if(d != null) return moment(d).format("DD MMM YYYY"); 
        else return "None";
    },
    setID: function(id){ this.aircraftid = id; },
    getID: function(){ return this.aircraftid; },
    // Application Constructor
    initialize: function() {
        appy.bindEvents();
        console.log("Binding my way thru");
        
        if (window.localStorage['AppReset'] == "yes") {
            $("#resetAppy").hide();
        } 
    },
    bindEvents: function () {
        // body... 
        document.addEventListener("offline", this.isOffline, false);
        document.addEventListener("online", this.isOnline, false);
        this.setup(); 
    },
    setup: function(){ 
        window.setInterval(this.updateLocalUTC, 1000);  // Update Local & UTC Times
        $("#curDate, #_curDate").html(this.now().format("DD MMM YYYY"));   
    },
    isOffline:function(){ 
        if(navigator.connection.type == Connection.NONE){   
            // appdb.isConnected = false; 
            window.localStorage.isConnected = '0';
            $("#syncr").html('<div class="statCircle R"></div>');
            $("#syncStatus").html("Offline");
        } 
        // alert("Network State: "+window.localStorage.isConnected);
    },
    isOnline:function(){ 
        if(navigator.connection.type != Connection.NONE){ 
            // appdb.isConnected = true; 
            window.localStorage.isConnected = '1';
            $("#syncr").html("<img src='_include/assets/syncD.png'>")
                .css("margin-right", "5px");
            $("#syncStatus").html("Connected");
        } 
        // alert("Network State: "+window.localStorage.isConnected);
    },
    updateLocalUTC: function() {  // Start-up page
        $("#locTime, #_locTime").html(appy.now().format("HH:mm"));
        $("#utcTime, #_utcTime").html(appy.utc().format("HH:mm"));
    }, 
    updateTime: function() {
        $("#bOff").val(appy.utc().format("HHmm"));
        this.autoupdate = window.setInterval(function() {
            $("#bOn").val(appy.utc().format("HHmm"));  
            console.log("Blocks On Updated");
        }, 60 * 1000);
    },
    stopAutoUp: function() { 
        window.clearInterval(this.autoupdate);
        $("#bOn").val(appy.utc().format("HHmm"));   
    },
    convert: function(t){   // Convert military time to HH:MM 
        var x = this.pad(t);

        return x.substr(0,2)+':'+x.substr(2,2);
    },
    _convert: function(t){  // Convert HH:MM to military time
        var t = t.split(":");
        return t[0]+""+t[1];
    },
    strip: function(time){  // 00:00:00 to 00:00
        return time.substr(0,5);
    },
    pad: function (str) { 
        return str.length < 4 ? this.pad("0" + str) : str;
    },
    ival: function(v){ //
        return v == null ? 0 : v;
    },
    timeDiff: function(a,b){ // a > b
        if(a == undefined || b == undefined){ return false;}
        var x = moment.utc().format("YYYY-MM-DD"),
            a = moment(x + " " + a),
            b = moment(x + " " + b);
        
        var diff = parseFloat(a.diff(b, "m") / 60).toFixed(1);
        if(diff < 0) diff = (eval(24 + diff)).toFixed(1);
        
        return diff;
    }, 
    getTable: function(name){
        var i = appdb.tableToSync.getIndexBy("tableName", name); return appdb.tableToSync[i];
    },
    getAirportName: function(x){
        var name;
        appdb.execute("SELECT airport, city WHERE ICAO = ?", [x], function(a){
            name = a.airport+","+a.city;
        });
        return name;
    }, 
    getLastDestination: function(cb){
        appdb.execute("SELECT airport, ICAO, city FROM airports WHERE ICAO = ( SELECT [to] FROM sector WHERE aircraftid = ? ORDER BY sectorid DESC LIMIT 1 )", [appy.getID()], function(from) { cb(from); });
    },
    updateAirstats: function(id){
        if(id > 0){
            appdb.getAircraftDetails(id, function (data){ 
                if(data.length > 0){ 

                    appy.getLastDestination(function(from){//"SELECT airport, ICAO, city FROM airports WHERE ICAO = ( SELECT [to] FROM sector WHERE aircraftid = ? ORDER BY sectorid DESC LIMIT 1 )", [id], function(from) {
                        $("#secFrm, #curLoc, #_curLoc").html('----');
                        if(from.length > 0){
                            $("#curLoc, #_curLoc").html(from[0].ICAO+" - "+from[0].airport+", "+from[0].city);
                            $("#secFrm").html(from[0].ICAO);
                        }
                    });

                    $("#statCraft, #sumRegi, #_statCraft").html(data[0].registration);
                    $("#statCallNo, #_statCallNo").html(data[0].callsign);
                    $("#clSgn").val(data[0].callsign);
                    $("#statSerial, #_statSerial").html(data[0].serial);
                    $("#_sumType").html(data[0].type);

                    // Startup
                    $("#eng1Hrs").html(data[0].engine1_hours.toFixed(1));
                    $("#eng1Cyc").html(data[0].engine1_cycles);
                    $("#eng2Hrs").html(data[0].engine2_hours.toFixed(1));
                    $("#eng2Cyc").html(data[0].engine2_cycles);
                    $("#stAirhrs").html(data[0].airframe_hrs.toFixed(1));
                    $("#stLands").html(data[0].landings);
                    $("#apuHrs").val(data[0].apu_hours); // html - if static  

                    var next = moment(data[0].nextinspection);
                    $("#nxInsDate").html(next.format("Do MMMM YYYY")); 
                    $("#nxInsHrs, #_nxInsHrs").html(next.diff(moment(),"hours")+" HRS");

                    var nDiff = next.diff(moment(), "days"); 
                    if(nDiff >= 0 && nDiff < 14){
                        $("#nxInsDays").html(nDiff+" Days").css("color","#CC0000");
                        $("#statStat").html('STATUS: <span class="statCircle R"></span>');
                    }else if(nDiff > 14 && nDiff < 28){
                        $("#nxInsDays").html(nDiff+" Days").css("color","#FF4F00;");
                        $("#statStat").html('STATUS: <span class="statCircle O"></span>');
                    }else if(nDiff >28){
                        $("#nxInsDays").html(nDiff+" Days").css("color","#009900;");
                        $("#statStat").html('STATUS: <span class="statCircle G"></span>');
                    }else if(nDiff < 0){
                        $("#nxInsDays").html("OVERDUE").css("color","red");
                        $("#statStat").html('STATUS: <span class="statCircle R"></span>');
                    } 

                    appy.aircraft = data[0]; 
                }
            });
               
            this.getLogFilters(id);
        }
    },
    getAirstats: function(id){
        if (id > 0) {  

            appdb.getAircraftDetails(id, function (data){ 
                if(data.length > 0){ 

                    appy.getLastDestination(function(from){//"SELECT airport, ICAO, city FROM airports WHERE ICAO = ( SELECT [to] FROM sector WHERE aircraftid = ? ORDER BY sectorid DESC LIMIT 1 )", [id], function(from) {
                        $("#secFrm, #curLoc, #_curLoc").html('----');
                        if(from.length > 0){
                            $("#curLoc, #_curLoc").html(from[0].ICAO + " - " + from[0].airport + ", " + from[0].city);
                            $("#secFrm").html(from[0].ICAO);
                        }
                    });

                    $("#statCraft, #sumRegi, #_statCraft").html(data[0].registration);
                    $("#statCallNo, #_statCallNo").html(data[0].callsign);
                    $("#clSgn").val(data[0].callsign);
                    $("#statSerial, #_statSerial").html(data[0].serial);
                    $("#_sumType").html(data[0].type);

                    // Startup
                    $("#eng1Hrs").html(data[0].engine1_hours.toFixed(1));
                    $("#eng1Cyc").html(data[0].engine1_cycles);
                    $("#eng2Hrs").html(data[0].engine2_hours.toFixed(1));
                    $("#eng2Cyc").html(data[0].engine2_cycles);
                    $("#stAirhrs").html(data[0].airframe_hrs.toFixed(1));
                    $("#stLands").html(data[0].landings);
                    $("#apuHrs").val(data[0].apu_hours); // html - if static  

                    var next = moment(data[0].nextinspection);
                    $("#nxInsDate").html(next.format("Do MMMM YYYY")); 
                    $("#nxInsHrs, #_nxInsHrs").html(next.diff(moment(),"hours")+" HRS");

                    var nDiff = next.diff(moment(), "days"); 
                    if(nDiff >= 0 && nDiff < 14){
                        $("#nxInsDays").html(nDiff+" Days").css("color","#CC0000");
                        $("#statStat").html('STATUS: <span class="statCircle R"></span>');
                    }else if(nDiff >= 14 && nDiff < 28){
                        $("#nxInsDays").html(nDiff+" Days").css("color","#FF4F00;");
                        $("#statStat").html('STATUS: <span class="statCircle O"></span>');
                    }else if(nDiff >= 28){
                        $("#nxInsDays").html(nDiff+" Days").css("color","#009900;");
                        $("#statStat").html('STATUS: <span class="statCircle G"></span>');
                    }else if(nDiff < 0){
                        $("#nxInsDays").html("OVERDUE").css("color","red");
                        $("#statStat").html('STATUS: <span class="statCircle R"></span>');
                    } 

                    appy.aircraft = data[0]; 
                }
            });

            // Load Plane Crew
            appdb.loadCrew(id, function(data){ 
                var name;  
                $("#picSel, #sicSel, #caSel, #secPic, #secSic, #secCa").html(""); // Clear existing crew
                $("#pic, #sic, #hca").html("----");
                $.each(data, function(i, v){ 
                    name = (v.displayname).split(" ");   // Append Users where category = P
                    // $("#picSel, #sicSel, #caSel").append("<option value='"+v.crewid+"' data-codeno='"+v.codeno+"'>"+name[0].substring(0,1)+". "+name[1]+"</option>");
                    // $("#secPic, #secSic, #secCa").append("<option value='"+v.initials+"'>"+v.initials+"</option>");
                    
                    var a = "<option value='"+v.crewid+"' data-codeno='"+v.codeno+"'>"+name[0].substring(0,1)+". "+name[1]+"</option>",
                        b = "<option value='"+v.initials+"'>"+v.initials+"</option>";

                    if(v.position == "PIC"){ // Assign crew positions if assigned 
                        $("#picSel").append(a);
                        $("#secPic").append(b);  
                    }else if(v.position == "SIC"){ 
                        $("#sicSel").append(a);
                        $("#secSic").append(b);

                    }else if(v.position == "HCA" || v.position == "CA"){ 
                        $("#caSel").append(a);
                        $("#secCa").append(b);
                    }  
                }); 
                // Summary
                $("#sic").html($("#sicSel option:first").html()+' / ' + $("#sicSel option:first").data("codeno"));
                $("#pic").html($("#picSel option:first").html()+' / ' + $("#sicSel option:first").data("codeno"));
                $("#hca").html($("#caSel option:first").html() +' / ' + $("#sicSel option:first").data("codeno"));

                $(".selectpickerL, .selectpickerOp").refresh();
                $("#crewStat, #crewStat2").html('STATUS: <div class="statCircle"></div>');  
            
                // Verify Crew Documents HERE //
                var fPic = $("#picSel>option:selected").val(),
                    fSic = $("#sicSel>option:selected").val(),
                    fHca = $("#caSel>option:selected").val(); 

                appy.checkCrewStatus(fPic, fSic, fHca);

            });

            // Load Documents - Aircraft
            appdb.loadDocuments(id, function(data){
                if(data.length > 0){
                    $("#docTableM tbody").html(''); 

                    var diff,stat,inDays, docCount = [0,0,0]; // [r, o, g]
                    $.each(data, function (i,v) {
                        inDays = '';
                        diff = moment(v.expires).diff(moment(),"days"); 

                        if(diff < 14){
                            stat = '<span class="statCircle R"></span>';
                            inDays = 'tdRed';
                            docCount[0] += 1;
                        }else if(diff >= 14 && diff < 28){
                            stat = '<span class="statCircle O"></span>';
                            inDays = 'tdOr';
                            docCount[1] += 1;
                        }else{
                            stat = '<span class="statCircle G"></span>'; 
                            docCount[2] += 1;
                        }  

                        // $("#docTableM tbody").append('<tr> <td class="delRow"> <div class="roundedTwo"> <input type="checkbox" id="delRow_2" name="check"> <label for="delRow_2"></label> </div> </td> <td>'+v.documentTitle+'</td> <td>'+appy.ao_format(v.expires)+'</td> <td class="'+inDays+'">'+diff+'</td> <td class="docStat">'+stat+'</td> <td class="tdView">View</td> </tr>');
                        $("#docTableM tbody").append('<tr><td class="delRow"> <div class="roundedTwo" id="delDiv"> <input type="checkbox" id="delRow_2" name="check" data-doc-id="'+v.documentid+'"> <label for="delRow_2"></label> </div> </td> <td>'+v.documentTitle+'</td> <td>'+appy.ao_format(v.expires)+'</td> <td class="'+inDays+'">'+diff+'</td> <td class="docStat">'+stat+'</td> <td class="tdView">View</td><td id="toDel">Will Be Deleted</td> </tr>');
                    
                        //Document delete code goes here!!
                        $("div").on("click","#delDiv","#delRow_2",function(e){
                            e.preventDefault();
                            //update Documents table to reflect deletion
                            var docid = $("#delRow_2", this).attr("data-doc-id");
                            var mRow = $(this).parents("tr");
                            var mSibs = $(mRow).children();
                            $("#delRow_2", this).prop("checked", true).attr("id", "delRowed"); //.prop("disabled",true)
                            $(this).parent().siblings("#toDel").css("visibility", "visible");
                            $(this).attr("id", "delDivD");
                            $(mRow).addClass("dlrw");
                            $(mSibs).addClass("dlrw");
                            // Send to deleted docs area $("#defects_view").append(nRow);
                        });
                        
                        
                        $("div").on("click","#delDivD","#delRowed",function(e){
                            e.preventDefault();
                            //update Documents table to reflect deletion
                            var nRow = $(this).parents("tr");
                            var nSibs = $(nRow).children();
                            $("#delRowed", this).prop("checked", false).attr("id", "delRow_2"); //.prop("disabled",true)
                            $(this).parent().siblings("#toDel").css("visibility", "hidden");
                            $(this).attr("id", "delDiv");
                            $(nRow).removeClass("dlrw");
                            $(nSibs).removeClass("dlrw");
                            // Send to deleted docs area $("#defects_view").append(nRow);
                        });
                    });  
                    
                    // Update Aircraft Status
                    if(docCount[0] > 1 || docCount[1] > 1)
                        $("#craftStat, #statStat2").html('STATUS: <span class="statCircle O"></span>');
                    else
                        $("#craftStat, #statStat2").html('STATUS: <span class="statCircle G"></span>');
                }
            });  

            // Load Defects
            appdb.loadDefects(id, function(data){
                $("#numDefx, #sumNumDefx").val(0); 
                if (data.length > 0) { 
                    if(data.length > 5){ 
                        $("#defxStat").html('STATUS: <span class="statCircle R"></span>');
                    }else if(data.length < 6){
                        $("#defxStat").html('STATUS: <span class="statCircle O"></span>');
                    }

                    $("#defxTableM tbody").html(''); 
                    var diff, inDays;
                    $.each(data, function(i,v){
                        inDays = '';
                        diff = moment().diff(moment(v.created_at),"days");
                        if(diff < 14){ 
                            inDays = 'tdRed';
                        }else if(diff >= 14 && diff < 28){ 
                            inDays = 'tdOr';
                        } 
                        $("#defxTableM tbody").append('<tr> <td>'+v.defectid+'</td> <td>'+v.displayname+'</td> <td>'+appy.ao_format(v.created_at)+'</td> <td class="'+inDays+'">'+diff+'</td> <td>'+v.defect+'</td> </tr>');
                    });
                    appdb.execute("SELECT * FROM defects WHERE aircraftid = ?",[id], function(defects){
                        $("#numDefx, #sumNumDefx").val(defects.length);
                    }); 
                }else $("#defxStat").html('STATUS: <span class="statCircle G"></span>');
            }); 

            // Load sector numbers - if any 
            appdb.execute("SELECT sectorid FROM sector WHERE aircraftid = ? AND air_id = ?", [id, appy.air_id], function(sectors){
                $("#secNum").html('');
                if(sectors.length > 0){
                    sectorid = sectors.length + 1; // 3 + 1 = 4
                    $.each(sectors, function(i , data){ 
                        $("#secNum").append('<option value="' + (i + 1) + '" data-sid="'+ data.sectorid +'" >' + (i + 1) + '</option>');
                    });
                    $("#secNum").append('<option value="' + sectorid + '" >' + sectorid + '</option>');
                }else{
                    $("#secNum").html('<option value="1" >1</option>');
                }   
                $("#secNum option:last").prop("selected", true);//.trigger('change');
                $(".selectpickerOpsm").refresh(); 
            }); 

            this.getSummary(id);

            this.getLogFilters(id); // Load Sector log filters

        } 
    }, 
    // Add New Crew 
    addCrew: function(v){ 
        var name = v.fname.toTitleCase() +' '+ v.lname.toTitleCase();
        return new Promise(function(resolve, reject){
            appdb.execute("INSERT INTO crew(displayname, initials, position, codeno, aircraftid, created_at) VALUES(?,?,?,?,?,?)", [name, initials(name), v.position, v.licence, appy.getID(), appy.today()], 
            function(id){
                resolve(id);
            }, 1);
        });  
    },
    getSector: function(id){
        appdb.execute("SELECT * FROM sector WHERE sectorid = ? LIMIT 1", [id], 
            function(data){
                if(data.length > 0){    
                    // Sector
                    console.log(data);

                    var s = data[0];
                    // $("#sector_frm "+inClass+":first, .tConf "+inClass+":first").val(s.from);  
                    // $("#sector_frm "+inClass+":eq(1)").val(s.to); 

                    $("#secFrm").html(s.from);
                    $("#curLoc").html(s.from + " - " + "Airport");
                    $("#secTo").val(s.to);   
                    
                    $("#secPic").val(s.pic);
                    $("#secSic").val(s.sic);
                    $("#secCa").val(s.hca);
                    $("#secPax").val(s.pax);
                    $("#ntrFlt").val(s.nature);
                    $("#client").val(s.client); 

                    $("#bOff").val(appy._convert(s.block_off));
                    $("#tOff").val(appy._convert(s.flight_off));
                    $("#lndng").val(appy._convert(s.flight_on)).trigger('change');
                    $("#bOn").val(appy._convert(s.block_on)).trigger('change'); 

                    $("#dFuel").val(s.departure_fuel);
                    $("#aFuel").val(s.arrival_fuel);
                    $("#fUsed").val(s.departure_fuel - s.arrival_fuel);
                    $("#lndgs").val(s.leg);
                    $("#dist").val(s.dist); 
                    $("#distKM").html(eval(parseFloat($("#dist").val()) * 1.852).toFixed(2));

                    $("#fuelID").val(s.fuelid);

                    $(".selectpickerOp, .selectpickerOpsm").refresh(); 
                }else{
                    appdb.show("Sector ID "+id+" not found");
                }
        });
    },
    addSector: function(v, air_id, cb){
        // var query = "INSERT OR REPLACE INTO sector(aircraftid, fuelid, 'from', 'to', dist, pax, pic, sic, hca, block_off, block_on, flight_off, flight_on, airframe, departure_fuel, arrival_fuel, fuel_used, nature, client, leg, created_at, updated_at, air_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var query = "UPDATE sector SET fuelid=?, 'from'=?, 'to'=?, dist=?, block_off=?, block_on=?, flight_off=?, flight_on=?, airframe=?, departure_fuel=?, arrival_fuel=?, fuel_used=?, leg=?, created_at=?, updated_at=?, air_id=? WHERE sectorid=?";
        
        appdb.db.transaction(function(tx) {
            // tx.executeSql(query, [ v.aircraftid, v.fuelID, v.from, v.to, v.dist, v.pax, v.pic, v.sic, v.hca, appy.convert(v.block_off), appy.convert(v.block_on), appy.convert(v.flight_off), appy.convert(v.flight_on), v.airframe, v.departure_fuel, v.arrival_fuel, (v.departure_fuel - v.arrival_fuel), v.nature, v.client, v.leg, appy.today(), appy.today(), appy.air_id],
            tx.executeSql(query, [ v.fuelID, v.from, v.to, v.dist, appy.convert(v.block_off), appy.convert(v.block_on), appy.convert(v.flight_off), appy.convert(v.flight_on), v.airframe, v.departure_fuel, v.arrival_fuel, (v.departure_fuel - v.arrival_fuel), v.leg, appy.today(), appy.today(), appy.air_id, appy.sectorid],
                function(tx, result) {  
                    // UPDATE Aircraft Statistics
                    tx.executeSql("UPDATE aircraft SET airframe_hrs = airframe_hrs+" + v.airframe + ", engine1_hours = engine1_hours+" + v.airframe + ", engine2_hours = engine2_hours+" + v.airframe + ", engine1_cycles = engine1_cycles+" + v.leg + ", engine2_cycles = engine2_cycles+" + v.leg + ", landings = landings + " + v.leg + ", distance = distance + " + v.dist + ", updated_at = '" + appy.today() + "' WHERE aircraftid = " + v.aircraftid + ";", [], 
                        function(result){
                            
                            cb(appy.sectorid); 

                        }, appdb._errorHandler);
                }, appdb._errorHandler);
        }, appdb._errorHandler);
    },
    _addSector: function(){ // Temporarilly insert
        var v = $("form#sector_frm").serializeObject();
            v.from = $("#secFrm").html(); 

        appdb.execute("INSERT INTO sector(aircraftid, 'from', 'to', pax, pic, sic, hca, nature, client, air_id) VALUES (?,?,?,?,?,?,?,?,?,?)", 
            [v.aircraftid, v.from, v.to, v.pax, v.pic, v.sic, v.hca, v.nature, v.client, appy.air_id], 
            function(insertId){
                // Sync Here 
                appy.sectorid = insertId;
                console.log("New Sector ID: " + appy.sectorid);
                appdb.syncData([ appy.getTable('sector') ]); 
            }, 1);
    },
    updateSector: function(v, cb){  // Compare and Update
        var query = "UPDATE sector SET aircraftid=?, fuelid=?, 'from'=?, 'to'=?, dist=?, pax=?, pic=?, sic=?, hca=?, block_off=?, block_on=?, flight_off=?, flight_on=?, airframe=?, departure_fuel=?, arrival_fuel=?, fuel_used=?, nature=?, client=?, leg=?, updated_at=? WHERE sectorid=?";

        db.transaction(function(tx) {  
            tx.executeSql("SELECT airframe, dist, leg FROM sector WHERE sectorid = ?", [v.ID],
                function(tx, result) {
                    if (result != null && result.rows != null) {
                        var _old = result.rows.item(0);

                        tx.executeSql(query, [v.aircraftid, v.fuelID, v.from, v.to, v.dist, v.pax, v.pic, v.sic, v.hca,
                                v.block_off, v.block_on, v.flight_off, v.flight_on, v.airframe, v.departure_fuel,
                                v.arrival_fuel, (v.departure_fuel - v.arrival_fuel), v.nature, v.client, v.leg, appy.today(), v.ID],
                            function(tx, result) { // update aircraft stats here
                                appdb.execute("UPDATE aircraft SET airframe_hrs = airframe_hrs+" + (v.airframe - _old.airframe) + ", engine1_hours = engine1_hours+" + (v.airframe - _old.airframe) + ", engine2_hours = engine2_hours+" + (v.airframe - _old.airframe) + ", engine1_cycles = engine1_cycles+" + (v.leg - _old.leg) + ", engine2_cycles = engine2_cycles+" + (v.leg - _old.leg) + ", distance = distance + " + (v.dist - _old.dist) + ", updated_at = '" + appy.today() + "' WHERE aircraftid = " + v.aircraftid + ";");
                                cb(result);
                            }, appdb.errorHandler);
                    }
                }, appdb.errorHandler);
        }, appdb.errorHandler);
    }, 
    resetSectorForm: function(){
        appy.getLastDestination(function(from){ //"SELECT airport, ICAO, city FROM airports WHERE ICAO = ( SELECT [to] FROM sector WHERE aircraftid = ? ORDER BY sectorid DESC LIMIT 1 )", [appy.getID()], function(from) {
            $("#secFrm, #curLoc, #_converturLoc").html('----');
            if(from.length > 0){
                $("#curLoc, #_curLoc").html(from[0].ICAO+" - "+from[0].airport+", "+from[0].city);
                $("#secFrm").html(from[0].ICAO);
                
                $("#secTo option:first").prop("selected", true).focus();

                // Reset form fields 
                $('#sector_frm').find('input[type=text],input[type=time],input[type=number],input[type=file]').val("");
                $("#secPax, #fuelID, #lndgs").val(0); 
                // $("#adFlFm").text('Add Fuel Receipt'); 
                $("#lndgs").val(1); 

                $("#ntrFlt").val("---");
                $("#client").val("None Assigned"); 

                $("#bTime, #fTime, #distKM").html("0.0");
 
                $(".selectpickerOpbg, .selectpickerOpsm, .selectpickerOp").refresh();
            }else{
                alert("An error occured!! Please contact Support Team");
            }
        });
    },  
    getSummary: function(id){
        $("tbody.bwht, tr#tcfdRw, #sumSecDetDiv table > tfoot").html("");
        if(id > 0){ 
            var total_fTime = total_bTime = total_legs = total_fuel = total_pax = 0, // TBODY totals
                t_fTime = t_legs = 0, // THEAD totals
                q = "SELECT * FROM sector WHERE air_id = ? and aircraftid = ? ORDER BY sectorid ASC";

            appdb.execute(q, [appy.air_id, id], 
                function(sectors){

                    var html = ''; 
                    if(sectors.length > 0){

                        // THEAD
                        $("tr#tcfdRw").html(""); 
                        $.each(sectors, function(i, s){t_fTime+= Math.round(s.airframe * 10) / 10; t_legs += parseInt(s.leg); });
                        $("tr#tcfdRw").append('<th colspan="9" class="ttls tdBld">TOTALS CARRIED FWD:</th> <th class="bwht">'+(appy.aircraft.airframe_hrs - t_fTime).toFixed(1)+' HRS</th> <th class="bwht">'+(appy.aircraft.engine1_hours - t_fTime).toFixed(1)+'HRS</th> <th class="bwht">'+(appy.aircraft.engine2_hours - t_fTime).toFixed(1)+'HRS</th> <th class="bwht">'+(appy.aircraft.engine1_cycles - t_legs)+'</th> <th class="bwht">'+(appy.aircraft.engine2_cycles - t_legs)+'</th> <th class="bwht">'+(appy.aircraft.landings - t_legs)+'</th><th colspan="4"></th></tr>');

                        // TBODY
                        $("tbody.bwht").html("");  
                        $.each(sectors, function(i, s){
                            
                            html += '<tr><td>'+(i+1)+'</td> <td>'+s.from+'</td> <td>'+s.to+'</td> <td>'+s.dist+'</td> <td>'+s.pic+'</td> <td>'+s.sic+'</td> <td>'+s.hca+'</td> <td>OFF: '+s.block_off+'<br>ON: '+s.block_on+'<br>'+appy.timeDiff(s.block_on, s.block_off)+' HRS</td> <td>OFF: '+s.flight_off+'<br>ON: '+s.flight_on+'<br>'+appy.timeDiff(s.flight_on, s.flight_off)+' HRS</td> <td>'+s.airframe+'</td> <td>'+s.airframe+'</td> <td>'+s.airframe+'</td> <td>'+s.leg+'</td> <td>'+s.leg+'</td> <td>'+s.leg+'</td> <td>'+s.fuel_used+'</td> <td>'+s.pax+'</td> <td>'+s.nature+'</td> <td>'+s.client+'</td></tr>';
                            
                            total_fTime += Math.round(s.airframe * 10) / 10;
                            total_bTime += Math.round((appy.timeDiff(s.block_on, s.block_off)) * 10) / 10;
                            total_legs += parseInt(s.leg);
                            total_fuel += parseInt(s.fuel_used); 
                            total_pax += parseInt(s.pax);
                        }); 
                        $("tbody.bwht").append(html);

                        html = '<tr><td colspan="7" class="ttls tdBld bdLB btrns">TOTAL:</td> <td>'+total_bTime.toFixed(1)+' HRS</td> <td>'+total_fTime.toFixed(1)+' HRS</td> <td>'+total_fTime.toFixed(1)+' HRS</td> <td>'+total_fTime.toFixed(1)+' HRS</td> <td>'+total_fTime.toFixed(1)+' HRS</td> <td>'+total_legs+'</td> <td>'+total_legs+'</td> <td>'+total_legs+'</td> <td>'+total_fuel+' </td> <td>'+total_pax+' </td> <td class="bdRB btrns" colspan="2"></td></tr>';
  
                        $("#sumSecDetDiv table > tfoot").append(html);
                    }else{ 
                        $("tbody.bwht").append("<b>No Sectors</b>"); 
                    }

                    html= '<tr><td colspan="9" class="ttls tdBld bdLB btrns">GRAND TOTAL:</td> <td>'+appy.aircraft.airframe_hrs.toFixed(1)+'</td> <td>'+appy.aircraft.engine1_hours.toFixed(1)+'</td> <td>'+appy.aircraft.engine2_hours.toFixed(1)+'</td> <td>'+appy.aircraft.engine1_cycles+'</td> <td>'+appy.aircraft.engine2_cycles+'</td> <td>'+appy.aircraft.landings+'</td> <td colspan="4" class="tdBld bdRB btrns" id="apuHrs2">APU HOURS: '+appy.aircraft.apu_hours+'</td></tr>';
                    $("#sumSecDetDiv table > tfoot").append(html);
            });
        }
    },
    getSectorLog: function (month, year) { 

        var total_fTime = total_bTime = total_legs = total_fuel = total_pax = total_dist = total_uplift = 0,
            html = "", query = "", data = [];

        data[0] = appy.getID();

        if((month == undefined && year == undefined)){
            query = "SELECT s.*, f.invoiceno, f.loaded_lit FROM sector s LEFT JOIN fuel f on s.fuelid = f.fuelid WHERE s.aircraftid = ? AND s.created_at > ? ORDER BY s.created_at DESC";
            data[1] = appy.utc().subtract(30, 'days').format("YYYY-MM-DD HH:mm:ss");
        }else{ 
            query = "SELECT s.*, f.invoiceno, f.loaded_lit FROM sector s LEFT JOIN fuel f on s.fuelid = f.fuelid WHERE s.aircraftid = ? AND strftime('%m', s.created_at) = ? AND strftime('%Y', s.created_at) = ? ORDER BY s.created_at DESC";
            data[1] = month;
            data[2] = year;
        }

        console.log(query);
        console.log(data);

        appdb.execute(query, data, function(sectors){
            $("table#secLogTable tbody, table#secLogTable tfoot").html("");
            if(sectors.length > 0){
                var btime, ftime = 0; 
                $.each(sectors, function(i, s){
                    // Sum of all sector variables
                    total_fTime += Math.round(s.airframe * 10) / 10;
                    total_bTime += Math.round(btime * 10) / 10;
                    total_legs  += parseInt(s.leg);
                    total_fuel  += parseInt(s.fuel_used);
                    // total_uplift+= parseInt(appy.ival(s.loaded_lit));
                    total_uplift+= parseInt(appy.ival(s.departure_fuel));
                    total_pax   += parseInt(s.pax);
                    total_dist  += parseInt(s.dist);

                    btime = appy.timeDiff(s.block_on, s.block_off);
                    ftime = appy.timeDiff(s.flight_on, s.flight_off);
                    html+='<tr> <td>'+appy.ao_format(s.created_at)+'</td> <td>'+s.from+'</td> <td>'+s.to+'</td> <td>'+s.dist+'</td> <td>'+appy.strip(s.block_off)+'</td> <td>'+appy.strip(s.block_on)+'</td> <td>'+btime+'</td> <td>'+appy.strip(s.flight_off)+'</td> <td>'+appy.strip(s.flight_on)+'</td> <td>'+ftime+'</td> <td>'+(appy.aircraft.airframe_hrs - total_fTime).toFixed(1)+'</td> <td>'+s.leg+'</td> <td>'+appy.ival(s.departure_fuel)+'</td> <td>'+s.fuel_used+'</td> <td class="cliWrp">'+s.client+'</td> <td>'+s.pax+'</td> <td>'+s.pic+' / '+s.sic+'</td></tr>';
                });
                
                $("table#secLogTable tbody").append(html);
                $("table#secLogTable tfoot").append('<tr><td class="noBrd" colspan="9">TOTALS CARRIED FWD:</td><td>'+total_fTime.toFixed(1)+'</td> <td>'+total_fTime.toFixed(1)+'</td> <td>'+total_legs+'</td> <td>'+total_uplift+'</td> <td>'+total_fuel+'</td> <td></td> <td>'+total_pax+'</td> <td></td> <td class="noBrd"></td></tr>');

            }else{
                $("table#secLogTable tbody").append("<b>No Sectors</b>"); 
            }
        });
    },
    getLogFilters: function(id){ 
        appdb.execute("SELECT strftime('%Y', `created_at`) as 'year', created_at FROM sector WHERE aircraftid = ? GROUP BY strftime('%Y', `created_at`);", [id], 
            function(years){
                $("#fltrY").html("");
                if(years.length > 0){
                    $.each(years, function(i , data){ 
                        $("#fltrY").append('<option value="'+data['year']+'">'+moment(data['created_at']).format("YYYY")+'</option>');
                    });
                }
                $(".selectpickerFsecy").refresh();
        }); 

        appdb.execute("SELECT strftime('%m', `created_at`) as 'month', created_at FROM sector WHERE aircraftid = ? GROUP BY strftime('%m', `created_at`);", [id], 
            function(months){
                $("#fltrM").html("");
                if(months.length > 0){
                    $.each(months, function(i , data){ 
                        $("#fltrM").append('<option value="'+data['month']+'">'+moment(data['created_at']).format("MMMM")+'</option>');
                    });
                }
                $(".selectpickerFsecm").refresh();
        }); 
    },
    checkCrewStatus: function(pic, sic, hca){

        // Verify Crew Documents HERE //  
        appdb.checkCrew([pic, sic, hca], function(data){  
            var status = "statCircle";
            if(data.red.length > 0){
                status = "statCircle R";
            }else if(data.orange.length > 0){
                status = "statCircle O";
            }else if(data.red.length == 0 && data.orange.length == 0){
                status = "statCircle G";
            } 
            $("#crewStat, #crewStat2").html('STATUS: <div class="'+status+'"></div>');
        });
    }
}
// Initialize AirOps
// document.addEventListener('deviceready', appy.initialize(), false); 
var saved = 0, air_id, cursor = 0, sectorid = 1, 
strip = function(time){ 
    return time.substr(0,5); // 00:00:00 to 00:00
},
passwordCheck = function(username, passW, cb){
    var bcrypt = new bCrypt(); 
    appdb.execute("SELECT password FROM users WHERE username='"+username+"' LIMIT 1", [], function(data) {
        if (data.length > 0) { 
            var user = data[0],
                salt = user.password.substr(0, 30),
                begin = '';

            function result(hash) { 
                if (user.password == hash) cb(true);
                else cb(false);    
            };

            function crypt() {
                try {
                    bcrypt.hashpw(passW, salt, result, function() {});
                } catch (err) {
                    appdb.show(err);
                    return;
                }
            }
            crypt();
        }else{
            cb(false);
        }
    }); 
}, 
showCheckpoint = function(){
    $("#home-slider").hide("fast");
    $("#appView").show("fast");
    $(".con-start").trigger('click');
};

appy.initialize(); 

// Reset App function
$("#resetAppy").click(function(e){
    e.preventDefault(); 

    appdb.confirm('Restart the app once reset operation is complete! \n\nDo you want to continue?', // message
        onConfirm,   
        'AirOps',        // title
        ['Yes','No']     // buttonLabels
    );

    return false;
});

function onConfirm(index){ if(index == 1) appdb.resetApp(); }

// New Air
$("div#nwAir").click(function () {  
    // Create a new air
    var air = appdb.guid().then(
        function(a){ 
            appy.air_id = a;
            air_id = a;
            // alert("AIR: " + appy.air_id);
        });   // Using promises to create air

    showCheckpoint();   
});

// Continue Air
$("div.continue").click(function() {
    if(window.localStorage['AIR'] != '') {
        appy.air_id = air_id = window.localStorage['AIR'];
        showCheckpoint();  
    }else
        alert("No AIR Present, Start a new one"); 
});

// Previous Air
$("div#accAir").click(function() {  
    appdb.execute("SELECT * FROM air ORDER BY air_id DESC LIMIT ?,1", [cursor], function(data) {
        if(data.length > 0){ 
            appy.air_id = air_id = data[0].air; 
            $("select#regSel").val(data[0].aircraftid).trigger("change"); 
            appdb.show("Previous Air Loaded Successfully"); 
            showCheckpoint();
            cursor += 1;
        }else appdb.show("No Previous Air");  
    }); 
});

$("#stngsBtn, #statSett").on("click", function() {
    //Do Something
    $("#settingMod").modal("show");
});

/********* START UP *********/
// Select Aircraft 
$("select#regSel").change(function (e) {
    var aircraftid = $(this).val();
    $(".stCnfMv").css("left","14px");
    console.log("Selected Aircraft: " + aircraftid);
    appy.setID(aircraftid);
    if(aircraftid > 0){
        appy.getAirstats(aircraftid);
        $("input#aircraft_id").val(aircraftid);
    }else{
        // Update all Statuses 
        $("#crewStat, #craftStat, #statStat, #defxStat").html('STATUS: <div class="statCircle Gr"></div>');

        // Update Aircraft Stats
        $("#eng1Hrs, #eng2Hrs, #eng1Cyc, #eng2Cyc, #nxInsHrs, #nxInsDays, #nxInsCyc").html('0');

        // Crew
        $("#picSel, #sicSel, #caSel, #secPic, #secSic, #secCa").html(""); // Clear existing crew
        $("#pic, #sic, #hca, #stAirhrs, #stLands, #nxInsDate, #curLoc, #statCraft, #_statCraft, #statCallNo, #_statCallNo, #_sumType, #statSerial, #_statSerial, #_nxInsHrs, #_curLoc").html("----");
        $(".selectpickerL, .selectpickerOp").refresh();

        // Defects
        $("#numDefx, #sumNumDefx, #clSgn, #apuHrs").val(0);

        // Confirm toggles 
        $("#confMcraft, #confMcrew, #confDefx, #confAirStat").prop("checked", false);
    }
}); 

// Update APU Hours
$("#apuHrs").change(function(){
    var apu = $(this).val();
    if(apu > 0 && appy.getID() > 0){
        appdb.execute("UPDATE aircraft SET apu_hours = ? WHERE aircraftid = ?", [apu, appy.getID()], function(r){
            // $("#apuHrs").css({"border-color": "green", "border-width": "2px"});
            appdb.show("APU Hours Updated!");
            $("#apuHrs2").html(apu);
        });
    } 
}); 

// On Change of Crew, Check Documentation *
$("#picSel, #sicSel, #caSel").change(function(){ 

    var fPic = $("#picSel>option:selected").val(),
        fSic = $("#sicSel>option:selected").val(),
        fHca = $("#caSel>option:selected").val(); 

    if(fPic == fSic || fPic == fHca || fSic == fHca){
        appdb.show("Crew Member has already been picked!");
        $(this).focus();
    }else{
        appy.checkCrewStatus(fPic, fSic, fHca);
    } 
});

// Add New Crew 
$("#adcrSv").click(function(e){
    e.preventDefault(); 

    var err = 0;
    $("form#addCrewFrm input").each(function() {
        if (this.value == "" && $(this).prop("id") != "adcrConf"){
            appdb.show("Invalid input detected");   
            console.log($(this).prop("id"));
            $(this).focus();
            err = 1;
            return false;
        } 
    }); 
    if($("#adcrConf").prop("checked") == false){
        appdb.show("Please tick checkbox to continue");  
        err = 1; 
        return false;
    } 
    if(err == 0){
        var crew = $("#addCrewFrm").serializeObject();  

        appy.addCrew(crew)
            .then(function(insertId){  
                $("#adcrConf").prop("checked", false); 
                document.getElementById("addCrewFrm").reset();
                $("#adcrCncl").trigger('click'); 

                // Add Crew to Dropdown
                console.log(crew); 
                var name = crew.fname+' '+ crew.lname,
                    a = "<option value='"+insertId+"' data-codeno='"+crew.licence+"'>"+crew.fname.substring(0, 1).toUpperCase()+". "+crew.lname+"</option>",
                    b = "<option value='"+initials(name)+"'>"+initials(name)+"</option>";

                if(crew.position == "PIC"){ // Assign crew positions if assigned 
                    $("#picSel").append(a);
                    $("#secPic").append(b);  
                }else if(crew.position == "SIC"){ 
                    $("#sicSel").append(a);
                    $("#secSic").append(b);

                }else if(crew.position == "HCA" || crew.position == "CA"){ 
                    $("#caSel").append(a);
                    $("#secCa").append(b);
                }   

                $(".selectpickerL, .selectpickerOp").refresh();
                appdb.show("New Crew Added Successfully");

                // Sync new Crew
                appdb.syncData([ appy.getTable('crew') ]);
            }); 
    }
});

// process the prompt dialog results
function doPreFlightCheck(results) {
    if(results.buttonIndex == 1){ 
        var passW = results.input1,
            userN = $("#condBy").val(),
            username = $("#condBy option:selected").html();


        if(passW.length > 0){ 
            passwordCheck(userN, passW, function(valid){ 
                if(valid){
                    appdb.show("Pre-Flight Check Complete!");
                    $("#preFcndby").val($("#condBy option:selected").html());
                    $("#acceptStart").addClass("accStHover");
                }else{  
                    $("#condBy option:first").prop("selected", true);
                    appdb.prompt('Please Enter AirOps Manager password for '+username, doPreFlightCheck, 'Invalid Password', ['OK','Cancel']);
                }
            }); 
        }else{
            appdb.prompt('Please Enter AirOps Manager password for '+username, doPreFlightCheck, 'Incomplete Password', ['OK','Cancel']);
        }  
    }else $("#condBy option:first").prop("selected", true);

    $(".selectpickerLL").refresh();
} 

// Do a post flight check
function doPostFlightCheck(results) {
    if(results.buttonIndex == 1){
        var passW = results.input1,
            userN = $("#postCondby").val(),
            username = $("#postCondby option:selected").html();

        if(passW.length > 0){
            passwordCheck(userN, passW, function(valid){
                if(valid){
                    $(".sumStat").html('STATUS: <span class="statCircle G"></span>')
                    appdb.show("Post-Flight Check Complete!");
                }else{  
                    $("#postCondby option:first").prop("selected", true);
                    appdb.prompt('Please Enter AirOps Manager password for '+username, doPostFlightCheck, 'Invalid Password', ['OK','Cancel']);
                }
            }); 
        }else{
            appdb.prompt('Please Enter AirOps Manager password for '+username, doPostFlightCheck, 'Incomplete Password', ['OK','Cancel']);
        }  
    }else $("#postCondby option:first").prop("selected", true);

    $(".selectpickerPPF").refresh();
} 

// Set selected user in Pre-Flight Check 
$("#condBy").on("change", function() {
    var user = $("#condBy option:selected").html(); 
    
    // Trigger Notification here //  
    appdb.prompt('Please Enter AirOps Manager password for '+user, doPreFlightCheck, 'Pre-Flight Check', ['OK','Cancel']);
});

// Set selected user in Post-Flight Check 
$("#postCondby").on("change", function() {
    var user = $("#postCondby option:selected").html(); 
    
    // Trigger Notification here //  
    appdb.prompt('Please Enter AirOps Manager password for '+user, doPostFlightCheck, 'Pre-Flight Check', ['OK','Cancel']);
});

$("#acceptStart").on("click", function() {   
    if($("#condBy").val() != 0){
        $("#acceptStart").removeClass("accStHover");
        //Do Accept Startup Stuff
        $(".con-oper").addClass("con-operHover").click(); 
        $(".con-start").removeClass("con-startHover con-startFocus");
    } else {
        appdb.show("Please do a Pre-Flight Check. ");
        $("#acceptStart").removeClass("accStHover");
        return false;
    }
});

// ********** Operational ************* // 
// Get Sector by ID
$("#secNum").change(function () { 
    var _sectorID = $("#secNum option:selected").data("sid");
    if(_sectorID != undefined){ // Load Sector
        // $("#subSec").html("UPDATE SECTOR");
        console.log('Updating Sector');
        appy.getSector(_sectorID);
    }else{
        // $("#subSec").html("SUBMIT SECTOR");
        console.log('Submit Sector');
        appy.resetSectorForm();
    }
    console.log("Sector this: " + _sectorID); 
});

// Calculate and display fuel used
$("#aFuel, #dFuel").keyup(function(e) {
    var used = $("#dFuel").val() - $("#aFuel").val();
    
    if(used < 0) {
        appdb.show("Negative difference in Fuel used");
        $(this).focus();
        return;
    }
    $("#fUsed").val(used);
});

// Convert and display distance to km
$("#dist").keyup(function(e) { 
    $("#distKM").html(($(this).val() * 1.852).toFixed(2));
});

// Calculate Flight Times
$("#lndng").change(function(e){ 
    var tOff =  appy.convert($("#tOff").val()),
        landing = appy.convert($(this).val()),
        today = moment.utc().format("YYYY-MM-DD");

    if (!moment(today + " " + landing).isValid()) {
        appdb.show("Flight time cannot be Calculated");
        $(this).focus();
        return;
    }  
    $("input[name=airframe]").val(appy.timeDiff(landing, tOff));
    $("#fTime").html(appy.timeDiff(landing, tOff));
});

// Calculate Block Times
$("#bOn").change(function(e){  
    var bOff =  appy.convert($("#bOff").val()),
        bOn = appy.convert($(this).val()),
        today = moment.utc().format("YYYY-MM-DD");

    if (!moment(today + " " + bOn).isValid()) { 
        appdb.show("Block time cannot be Calculated");
        $(this).focus();
        return;
    }
    $("input[name=blockTime]").val(appy.timeDiff(bOn, bOff));
    $("#bTime").html(appy.timeDiff(bOn, bOff));
});

// Pad Zeros to time if less than 4
$("#stUp, #shtDn, #tOff, #lndng, #bOff, #bOn").blur(function(){var t = $(this).val(); $(this).val(appy.pad(t)); });
 
// Add Start Stop times to Sector Record
// Show alert to inform
$("#engSS").on("click", function() {
    // $("#engstMod").modal("show");
    appdb.confirm("Added fields allow for input of \n Engine Start and Stop times.", 
        function(results){
            if(results == 1){
                $(".stUp,.shtDn").show(); 
                $("#engSS").css("visibility", "hidden");
            }
        }, "Engine Start/Stop", ['OK','Cancel']);
}); 

// Submit Sector
$("#subSec").click(function () {
    // body...   
    var datasid = $("#secNum option:selected").data("sid");
    $("input[name=from]").val($("#secFrm").html());

    // Validate all fields
    var err = 0;
    $("form#sector_frm input").each(function() {
        if (this.value == "" && $(this).prop("id") != 'fuelID' && $(this).prop("id") != 'shtDn' && $(this).prop("id") != 'stUp' ){
            appdb.show("Invalid input detected");   
            console.log($(this).prop("id"));
            $(this).focus();
            err = 1;
            return false;
        } 
    }); 
    if(err == 0){
        if(datasid == undefined){// If data-sid is unset add sector  
            // push to global sector array 
            var sector = $("form#sector_frm").serializeObject();
            sector.from = $("#secFrm").html(); 
            console.log(sector);

            appy.addSector(sector, air_id, function(insertId){  

                $("#secNum option:selected").attr("data-sid", insertId); // Assign generated sector ID
                     
                appdb.show("Sector " + sectorid + " Saved! ", appy.resetSectorForm()); 
                // Update UI with new values
                appy.updateAirstats(appy.getID());
                appy.getSummary(appy.getID());
                
                sectorid += 1;
                $("#secNum").append('<option value="' + sectorid + '">' + sectorid + '</option>');
                $("#secNum option:last").prop("selected", true);   
                // $(".selectpickerOpsm").refresh();

                console.log("Sector ID: "+sectorid);
                
                // $("#secEdit").trigger('click'); 
            }); 
        }else{
            var sector = $("form#sector_frm").serializeObject();
            sector.from = $("#secFrm").html();
            sector.ID = datasid; // Pass the sector ID for processing... 
 
            // Update Sector, Update departure(from) airport code with last destination(to) code
            appy.updateSector(sector, function(data){
                console.log(sector);
                // Update UI with new values
                appy.updateAirstats(appy.getID());
                appy.getSummary(appy.getID());

                // console.log("Sector "+$("#secNum").val()+" Update Complete", resetSectorForm()); 
                $("#secNum option:last").prop("selected", true);
                // $("#subSec").html("SUBMIT SECTOR"); 
            });  
        }  
    } 
});
 
// ********** Summary ************* // 

// Submit Air
$("#subAir").click(function(e){
    e.preventDefault();
    // Submit to live db - Continue or Reset air
    if(air_id != ''){
        // Save to SB 
        appdb.execute("INSERT INTO air(aircraftid, air, created_at) values(?,?,?)", [appy.aircraftid, air_id, appy.today()], function(id){
            console.log("New Air: "+air_id+"\n Insert ID: "+id);
            saved = 1; 
            cursor = 0; // Reset Previous Air Cursor

            appdb.show("AIR Successfully Saved");
            window.localStorage['AIR'] = '';

            appy.resetSectorForm();
            // Reset All forms/displays
            $("#regSel").val($("#regSel option:first").val()).trigger('change'); // Reset aircraft
            $("#secNum").html('<option value="1">1</option>');
            $(".selectpickerOpsm").refresh();

            $(".con-start").click(); 
            $("#home-slider").show("fast");
            $("#appView").hide("fast"); 

            // Sync Data with Server
            appdb.syncData([
                appy.getTable('air'),  
                appy.getTable('aircraft'),  
                appy.getTable('sector')
            ]); 

        }, 1);
    }
}); 
// ********** Maintenance *************//
//Document delete code goes here!!
// $("div").on("click","#delDiv","#delRow_2",function(e){
//     e.preventDefault();
//     //update Documents table to reflect deletion
//     var docid = $("#delRow_2",this).attr("data-doc-id");
//     var mRow = $(this).parents("tr");
//     var mSibs = $(mRow).children();
//     $("#delRow_2",this).prop("checked",true).attr("id","delRowed");//.prop("disabled",true)
//     $(this).parent().siblings("#toDel").css("visibility","visible");
//     $(this).attr("id","delDivD");
//     $(mRow).addClass("dlrw");$(mSibs).addClass("dlrw");
//     // Send to deleted docs area $("#defects_view").append(nRow);
// });
 
// $("div").on("click","#delDivD","#delRowed",function(e){
//     e.preventDefault();
//     //update Documents table to reflect deletion
//     var nRow = $(this).parents("tr");
//     var nSibs = $(nRow).children();
//     $("#delRowed",this).prop("checked",false).attr("id","delRow_2");//.prop("disabled",true)
//     $(this).parent().siblings("#toDel").css("visibility","hidden");
//     $(this).attr("id","delDiv");
//     $(nRow).removeClass("dlrw");$(nSibs).removeClass("dlrw");
//     // Send to deleted docs area $("#defects_view").append(nRow);
// });


// ********** Sector Log ************* // 
$(".con-sect").click(function(){ 
    appy.getSectorLog();
});

// Date Filters 
$("#fltrY, #fltrM").change(function(){
    appy.getSectorLog($("#fltrM").val(), $("#fltrY").val());
});

// Print Sector
$("#prtSec").click(function(){  
    /** 
     * Generate Table for pdf 
     */
    var error = function(status) {
        appdb.show('Error: ' + status);
    }
    
    var filename = $("#regSel option:selected").text()+"_"+$("#fltrM option:selected").text() + "_" +$("#fltrY option:selected").text();
    
    window.html2pdf.create(
        '<table>' + $("#secLogTable").html() +'</table>',
        "~/Documents/SectorLog_"+filename+".pdf", // on iOS,
        appdb.show("PDF Generated and Ready to Print"),
        error
    );
});



/* LOGIN */   
$("#loginSubmit").click(function(){
    var userN = $("select#userSel option:selected").val();
    var passW = $("#passW").val();
    var bcrypt = new bCrypt(); 
    // var usrPic = $("#picURL").val();
    var usrType = $("#userSel option:selected").val(); // This is the username

    if(userN.length > 0 && passW.length > 0){  
        appdb.execute('SELECT first_name, last_name, password FROM users WHERE username=? LIMIT 1', [userN], function(data) {
            if (data.length > 0) { 
                var user = data[0],
                    salt = user.password.substr(0, 30),
                    begin = '';

                function result(hash) {
                    if (user.password == hash) { 
                        // appdb.show("Log-in successful");
                        
                        if(window.localStorage['AIR'] == '' || window.localStorage['AIR'] == undefined){
                            $("div.continue").hide("fast");
                        } 

                        $("#loginDiv").hide("fast");
                        $("#welCome").show("fast");
                        $("#welcUser, #statUser").html(user.first_name+" "+user.last_name);

                        // if(userType == "pilot"){        // Pilot login
                        //     $("#bGin").show("fast");
                        //     $("#regN").focus();
                        //     if(air_id != ""){
                        //         appdb.show("An air already exists - continue with air");
                        //     }
                        // } else if(userType == "admin"){ // Admin login
                        //     $("#bGin").show("fast");
                        //     $("#mButt").trigger("click");
                        //     $("#adminV").dialog("open"); // Select aircraft from dropdown

                        //     // $("#stButt,#oButt,#suButt,#fdButt").css("pointer-events", "none");
                        //     $("#mButt,#slButt").css("pointer-events", "auto"); //ableD(); 
                        // }  
                    } else {
                        appdb.show("Invalid Password!");
                        $("#passW").focus(); 
                    }
                };

                function crypt() {
                    try {
                        bcrypt.hashpw(passW, salt, result, function() {});
                    } catch (err) {
                        appdb.show(err);
                        return;
                    }
                }
                crypt();

            } else {
                appdb.show("Invalid Username!"); 
                 $("select#userSel").focus();
                return;
            }
        }); 
    }else{
        appdb.show("Invalid Username and Password");
        $("select#userSel").focus();
    }
});

// Logout function
$("#statLogout").click(function(e){  
    appdb.confirm('Are you sure?', logoutUser, 'AirOps', ['Yes','No']);   
});

// Logout function2
$("#logOut").click(function(e){  
    appdb.confirm( "Are you sure?", 
        function(results){
            if(results == 1){
                $("#loginDiv").show("fast");
                $("#welCome").hide("fast");
                $("select#userSel option:first").prop("selected", true);
                $(".selectpickerU").refresh();
                $("#passW").val("");
            } 
        }, 'AirOps', ['Yes','No']);   
});

function logoutUser(results){
    if(results == 1){
        $("#passW").val('');  
 
        $("#loginDiv").show("fast");
        $("#welCome").hide("fast");

        $("#home-slider").show("fast");
        $("#appView").hide("fast");  

        $("#regSel").val($("#regSel option:first").val()).trigger('change'); // Reset aircraft

        if(saved == 0 && appy.air_id != ''){            // AIR not saved to DB
            window.localStorage['AIR'] = appy.air_id;   // Persist to LocalStorage 
            $("div.continue").show("fast");             // Show Continue Button
        }else if($(this).prop("id") == 'statLogout' ){ 
            $("div.continue").hide("fast");             // Hide Continue Button
            cursor = saved = 0; 
            window.localStorage['AIR'] = '';
        }
    } 
}

// Validate all Numeric fields
$(".digit").keydown(function(e){
    var keys = [8, 9, /*16, 17, 18,*/ 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 48, 144, 145];
    if ($.inArray(e.which, keys) >= 0) {
        return true;
    }else if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        return false;
    }
});  

var initials = function(name) {
    var str = name.split(" ");
    var initials = str[0].trim().substring(0, 1).toUpperCase() + "." + str[1].trim().substring(0, 1).toUpperCase();
    return initials;
}