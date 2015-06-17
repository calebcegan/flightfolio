/** 
 *  App-wide Parameters
 */
var last_sync,
    shortName = 'AirOpsDBa',
    version = '1.0',
    displayName = 'AirOpsDBa', 
    // DOMAIN = "http://192.168.15.34:81/airops 2/server_src/",
    // DOMAIN = "http://localhost:81/airops 2/server_src/",
    DOMAIN = "http://bamlagos.com/airops/server_src/",
    appVersion = "1.6.3",
    // Camera Variables
    pictureSource = null,
    destinationType = null; 

var initQuery = [   // This should be auto-generated in future
    "CREATE TABLE IF NOT EXISTS users (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `first_name` TEXT, `last_name`   TEXT, `username`    TEXT, `email`   TEXT, phonenumber TEXT, `password`    TEXT, `picture` TEXT, `permissions` TEXT, `reason_for_login`    TEXT, `catid`   INTEGER, `activated`    INTEGER, `activation_code`  TEXT, `activated_at`    DATETIME, `last_login`  DATETIME, `persist_code`    TEXT, `reset_password_code` TEXT DEFAULT 'c', `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME );",
    // "CREATE TABLE IF NOT EXISTS sector ( `sectorid` INTEGER PRIMARY KEY AUTOINCREMENT, `aircraftid` INTEGER, `fuelid` INTEGER, `leg` INTEGER, `from` TEXT, `to` TEXT, dist REAL, pax INTEGER, pic TEXT, sic TEXT, hca TEXT, block_off TEXT, block_on TEXT, flight_off TEXT, flight_on TEXT, airframe REAL, `departure_fuel` REAL, `arrival_fuel` REAL, `fuel_used` REAL, `nature` TEXT, `client` TEXT, `startup` TEXT, `shutdown` TEXT, `approach_type` TEXT, `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME, `air_id` TEXT );",
    "CREATE TABLE IF NOT EXISTS sector ( `sectorid` INTEGER PRIMARY KEY AUTOINCREMENT, `aircraftid` INTEGER, `fuelid` INTEGER, `leg` INTEGER, `from` TEXT, `to` TEXT, dist REAL, pax INTEGER, pic TEXT, sic TEXT, hca TEXT, block_off TEXT, block_on TEXT, flight_off TEXT, flight_on TEXT, airframe REAL, `departure_fuel` REAL, `arrival_fuel` REAL, `fuel_used` REAL, `nature` TEXT, `client` TEXT, `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME, `air_id` TEXT );",
    "CREATE TABLE IF NOT EXISTS fuel (`fuelid` INTEGER PRIMARY KEY AUTOINCREMENT, sectorid INTEGER, `fuelcompany`    TEXT, `fueling_location`    TEXT, `refueler_name`   TEXT, `invoiceno`   TEXT, `receipt_img` TEXT, `loaded_gal`  float, `loaded_lit` integer, `comments` text, `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME );",
    "CREATE TABLE IF NOT EXISTS document (`documentid` INTEGER PRIMARY KEY AUTOINCREMENT, `documentTitle`  TEXT, `documentNo`  TEXT, `dateissued`   TEXT, `expires` TEXT, `status`  INTEGER, `location` TEXT, `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at` DATETIME, `entityid`    INTEGER, `entityType`   TEXT );",
    "CREATE TABLE IF NOT EXISTS defects (`defectid` INTEGER PRIMARY KEY AUTOINCREMENT, `aircraftid` INTEGER, `defect`   TEXT, `actiontaken` TEXT, `crewid` INTEGER, `logged`  TEXT, `daysleft`    INTEGER, `deffered` TEXT, `status`  INTEGER, `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at`    DATETIME, `due_date`    DATETIME, `fix_date`    DATETIME );",
    "CREATE TABLE IF NOT EXISTS crew (crewid INTEGER PRIMARY KEY AUTOINCREMENT, displayname TEXT, initials TEXT, position TEXT, codeno TEXT, dateCreated TEXT , aircraftid INTEGER , created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME, assigned TEXT );",
    "CREATE TABLE IF NOT EXISTS client (clientid INTEGER PRIMARY KEY AUTOINCREMENT, clientname TEXT, emailaddress TEXT, phonenumber TEXT, address TEXT, logo TEXT, created_at DATETIME, updated_at DATETIME);",
    "CREATE TABLE IF NOT EXISTS airports (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `airport`    TEXT, `ICAO`    TEXT, `city`    TEXT, `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP, `updated_at`    DATETIME );",
    "CREATE TABLE IF NOT EXISTS aircraft ('aircraftid' INTEGER PRIMARY KEY AUTOINCREMENT, 'registration' TEXT , 'type' TEXT , 'serial' TEXT, 'callsign' TEXT , 'nextinspection' DATETIME , 'status' INTEGER  , 'airframe_hrs' REAL  , 'landings' INTEGER, 'distance' REAL, 'engine1_cycles' INTEGER  , 'engine1_hours' REAL  , 'engine2_cycles' INTEGER  , 'engine2_hours' REAL  , 'apu_hours' INTEGER  , 'apu_service_due_date' DATETIME  , 'next_service_due' DATETIME  , 'service_due_hours' REAL  , 'service_due_date' DATETIME  , 'created_at' DATETIME DEFAULT CURRENT_TIMESTAMP  , 'updated_at' DATETIME DEFAULT CURRENT_TIMESTAMP, 'image' TEXT );",
    "CREATE TABLE IF NOT EXISTS air (`air_id`  INTEGER PRIMARY KEY AUTOINCREMENT, `aircraftid` INTEGER, `air`  TEXT, `created_at`  DATETIME, `updated_at`  DATETIME DEFAULT CURRENT_TIMESTAMP);",
    "CREATE TABLE IF NOT EXISTS notes( id INTEGER PRIMARY KEY, notes TEXT, `created_at`  DATETIME, `updated_at`  DATETIME DEFAULT CURRENT_TIMESTAMP )",
    "CREATE TABLE IF NOT EXISTS flight_check( id INTEGER PRIMARY KEY, crewid INTEGER, air_id INTEGER, created_at DATETIME, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
];

/** 
 * Database Util  
 */
var appdb = {
    // url: 'http://localhost:81/airops 2/server_src/syncData.php', 
    url: DOMAIN + 'syncData.php', 
    db: null,
    tableToSync: [ 
        { tableName: 'airports', idName:'id' },         // 0
        { tableName: 'aircraft', idName:'aircraftid' }, // 1
        { tableName: 'document', idName:'documentid' }, // 2
        // { tableName: 'users',    idName:'id' },         // 3
        { tableName: 'client',   idName:'clientid' },   // 4
        { tableName: 'defects',  idName:'defectid' },   // 5
        { tableName: 'crew',     idName:'crewid' },     // 6
        { tableName: 'fuel',     idName:'fuelid' },     // 7
        { tableName: 'air',      idName:'air_id' },     // 8
        { tableName: 'notes',    idName:'id' },         // 9
        { tableName: 'flight_check', idName:'id' },     // 10
        { tableName: 'sector',   idName:'sectorid' }],  // 11
    sync_info: {    //Example of user info
        userEmail: 'test@gmail.com',//the user mail is not always here
        device_uuid: 'UNIQUE_DEVICE_ID_287CHBE873JB', // get device serial number
        lastSyncDate: 0,
        device_version: '5.1',
        device_name: 'AirOps',
        userAgent: navigator.userAgent,
        //app data
        appName: 'AirOps',
        appVersion: '1.6.3',
        lng: 'en',
        token: 'MTQLwRMiVaw2I6xde4RnoOJ54z7d4JRv34HngR.CmZ7RREjrUH.hC', 
        firstSync: false
    }, 
    isConnected: null,
    init: function(cb){ 
        var self = this;  
        if (self.db === null) { 
            try{
                // if(!window.openDatabase){
                if(!window.sqlitePlugin.openDatabase){
                    appdb.show('SQLite Databases are not supported!');
                    return;
                } 
                // self.db = window.openDatabase(shortName, version, displayName, -1);
                // self.db = window.sqlitePlugin.openDatabase({name: "AirOpsDB.db", location: 1});
                self.db = window.sqlitePlugin.openDatabase("AirOpsDBase", "1.0", "AirOpsDBase" , -1);

                // appdb.show("App Database Initiated"); 

                self.db.transaction(function(tx){
                    tx.name = 'initTestDb general tx';
                    //drop the table (will drop automatically the triggers)
                    tx.executeSql('DROP TABLE IF EXISTS sync_info;', [], null, self._errorHandler);
                    tx.executeSql('DROP TABLE IF EXISTS new_elem;', [], null, self._errorHandler); 

                    // Reset all app data
                    // self.resetApp();

                    // Create all necessary Tables   
                    for (var i = 0; i < initQuery.length; i++) {
                        tx.executeSql(initQuery[i], [], null, self._errorHandler);
                    }  
                    cb(true);
                });//end tx

            } catch (e) {
                appdb.show("App Database Error: "+e);
            }
        }else{
            appdb.show("Database Instance already exists");
        }  
    },  
    execute: function (sql, data, cb, type) {
        var rows = [];
        this.db.transaction(function(tx) {
            tx.sql = sql; 
            tx.executeSql(sql, data, function(tx, result) {
                if (type == undefined) { // Select Query
                    if (result != null && result.rows != null) {
                        for (var i = 0; i < result.rows.length; i++) {
                            rows.push(result.rows.item(i));
                        }
                        if (cb != undefined) cb(rows); //Use callback if available
                    } // else its an Update Query no results returned
                } else if (type == 1) { // Insert Query
                    if (cb != undefined) cb(result.insertId);
                } else if (type == 2) {
                    if (cb != undefined) cb(result.rowsAffected);
                }
            }, self._errorHandler);
        }, self._errorHandler);
    },
    // Checks if the table is empty before insert
    recordExists: function (table, cb){
        this.db.transaction(function(tx){
            tx.executeSql("SELECT * FROM "+table, [], function(tx,result){
                if (result != null && result.rows != null) {
                    cb(result.rows.length);
                }
            }, this._errorHandler);
        }, this._errorHandler);
    },
    /** Aicraft **/ 
    getAircraftDetails: function (id, cb){
        if(id != 0){
            this.execute("SELECT * FROM aircraft WHERE aircraftid = ?",[id], function(result){
                cb(result);
            });
        }
    },
    checkAircraft: function(id, cb){  
        this.execute("SELECT a.aircraftid ,a.registration, d.documentTitle, d.documentNo, d.dateissued, d.expires AS 'daysleft' FROM document d INNER JOIN aircraft a ON d.entityid = a.aircraftid WHERE d.entityid = ? AND d.entityType = 'A'", id, function(result){
            cb(result);
        });
    },
    updateAPUHours: function(data, cb){ 
        this.execute("UPDATE aircraft SET apu_hours = ? WHERE aircraftid = ?", data, function(result){
            cb(result);
        }, 2); 
    },
    getDepartureAirport: function(id, cb){
        this.execute("SELECT [to], airport FROM sector WHERE aircraftid = ? ORDER BY sectorid DESC LIMIT 1", [id], function(result) {
            cb(result);
        });
    },

    /** Sector **/
    loadSectors: function(id, cb){
        this.execute("SELECT * FROM sectors WHERE sectorid = ? AND aircraftid = ?", [id], function(result) {
            cb(result);
        });
    }, 
    /** Airport **/
    // Get All Airports
    getAirports: function(cb) {
        this.execute("SELECT * FROM airports ORDER BY ICAO ASC",[], function(result){
            cb(result); 
        }); 
    },
    addAirport: function(data, cb){
        return;
    },
    /** Crew **/
    loadCrew: function (id, cb){
        if(id != 0){
            this.execute("SELECT * FROM crew WHERE aircraftid = ? ORDER BY displayname ASC",[id], function(result){
                cb(result);
            });
        }
    },
    checkCrew: function(crew, cb){ 
        var data = { red: [], orange: [], green: [] },
            query = "SELECT c.displayname, d.documentTitle, d.documentNo, d.dateissued, d.expires FROM document d INNER JOIN crew c ON d.entityid = c.crewid WHERE d.entityid in (?,?,?) AND d.entityType = 'P'";

        this.execute(query, crew, function(result){  
            if(result.length > 0){ 
                $.each(result, function(i, v){ 
                    var daysleft = moment(v.expires).diff(moment(), "days");
                    if (daysleft >= 28) { 
                        data.green.push(v);
                    } else if(daysleft >= 14 && daysleft < 28){
                        data.orange.push(v);
                    } else {
                        data.red.push(v);
                    }
                });
                cb(data);
            }
        }); 
    }, 
    /** Defects */
    loadDefects: function(id, cb){
        if (id > 0) {
            this.execute("SELECT d.*, c.displayname FROM defects d inner join crew c on d.crewid = c.crewid WHERE d.aircraftid=? AND d.status=0",[id],function(x){ cb(x); });
        }
    },
    /** Documents **/
    loadDocuments: function(id, cb){ // Aircraft Documents
        if(id != 0){
            this.execute("SELECT * FROM document WHERE entityid = ? AND entityType = 'A' ORDER BY expires ASC",[id], function(result){
                cb(result);
            });
        }
    },
    /** Clients **/
    loadClients: function(cb){
        this.execute("SELECT clientname FROM client ORDER BY clientname ASC",[], function(result){
            cb(result);
        });
    }, 
    /********************* Util functions *********************/
    /** 
     * [guid Generate a 32-bit Global Unique ID]
     * @return {string} guid
     */
    _guid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }();
    },  
    guid: function(){  // Check if air already exists in db;
        var id = this._guid();
        return new Promise(function(resolve, reject){
            appdb.execute("SELECT * FROM air WHERE air = ?", [id], function (air) {
                resolve(air); 
            });
        }).then(function(air){
            if(air.length > 0) appdb.guid();
            else return id;
        }) 
    },
    resetApp: function (){
        var self = this;
        
        window.localStorage['AppReset'] = "yes";
        // if (window.localStorage['AppReset'] == "yes") {  
            this.db.transaction(function(tx) {  
                // Delete all necessary Tables    
                $.each(self.tableToSync, function(i, v){
                    tx.executeSql("DROP TABLE IF EXISTS "+ v.tableName, [], null, self._errorHandler);
                });  
                // DBSYNC.setSyncDate(0);  // Reset last sync
                self.show("App DB Cleared");
            }, this._errorHandler);
            $("#resetAppy").hide(); 
            // window.localStorage['AppReset'] = "no";
        // }
    }, 
    syncData: function(tables){ // Sync specific tables
        // alert("state >> "+window.localStorage.isConnected);
        // if(window.localStorage.isConnected == '1'){
            // $("#syncr").addClass("syncr").css("margin-right", "5px").html("");
            // $("#syncStatus").html("Connecting...");
            DBSYNC.syncNow(appdb._syncProgress, function(syncResult){ 
                // console.log(syncResult); 
                appdb.show("Sync Complete");
                // $("#syncStatus").html("Connected");
                // $("#syncr").removeClass("syncr");
            }, tables);
        // }else{
        //     appdb.show("App currently offline - Sync Terminated");
        // }
    },
    _errorHandler: function(tx, error){
        appdb.log(error);
    }, 
    _nullHandler: function(tx, error){
        this.log(error);
    },
    _successCallBack: function(){
        this.log("Successfully executed!");
    },
    log: function(msg){
        console.log(msg);
    },
    show: function(msg, callback){
        if(navigator.notification != undefined)
            navigator.notification.alert("\n" +msg, (callback == undefined) ? true : callback, 'AirOps', 'OK');
        else {
            alert(msg);
            callback;
        }
    },
    confirm: function (msg, callback, title, labels) { 
        navigator.notification.confirm( "\n" + msg, (callback == undefined) ? true : callback, title, labels); 
    },
    prompt: function (msg, callback, title, labels) { 
        navigator.notification.prompt("\n" +msg, (callback == undefined) ? true : callback, title, labels, '' );
    },
    takePhoto: function(){  // Capture a photo using Camera
        navigator.camera.getPicture(onPhotoURISuccess, onFail, 
        { 
          quality: 30,  
          saveToPhotoAlbum: false,
          encodingType: Camera.EncodingType.JPEG, 
          destinationType: destinationType.FILE_URI  
        }); 
    },
    pickPhoto: function(){  // Select A photo from Library
        navigator.camera.getPicture(onPhotoURISuccess, onFail, 
        { 
          quality: 50,
          destinationType: destinationType.FILE_URI,
          sourceType: pictureSource.PHOTOLIBRARY 
        });
    },
    onError: function(error){
        appdb.show("Operation Failed : \n"+error);
    },
    _syncProgress: function(message, percent, msgKey){
        console.log(msgKey +': '+message+'...'+percent+'%');
    }
};

// Wait for Cordova to Loaded
// For iPad 
// document.addEventListener("deviceready", function(){ initAirOpsDB(); }, false);

// For Web Browser
document.addEventListener("deviceready", initAirOpsDB(), false);

$.fn.refresh = function(){this.selectpicker('refresh'); this.selectpicker('render'); }

// Cordova is ready - Initiate Application
function initAirOpsDB(){ 
    // Initiate Fastclick API
    FastClick.attach(document.body);    
    
    pictureSource   = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;

    appdb.init(function(a){      
        DBSYNC.initSync(appdb.tableToSync, appdb.db, appdb.sync_info, appdb.url, function(firstSync){
            if(firstSync){   
                console.log('This is a first sync');
                // SYNC data with server
                DBSYNC.syncNow(appdb._syncProgress, function(syncResult){ 
                    console.log(syncResult);   
                });   
            }     
        });

        // Load Aircrafts
        appdb.execute("SELECT aircraftid, registration FROM aircraft ORDER BY registration DESC", [], 
            function(data){ 
                if (data.length > 0) {  
                    $.each(data, function(i, v) {
                        $("select#regSel").append("<option value='" + v.aircraftid + "'>" + v.registration + "</option>");
                        $('.selectpicker').refresh();
                    });
                } 
        }); 

        // Load Clients
        appdb.loadClients(function(data){
            if (data.length > 0) {
                $("#client").html('<option value="----">None Assigned</option>');
                $.each(data, function(i,v){
                    $("#client").append('<option value="'+v.clientname+'">'+v.clientname+'</option>');
                });
                $(".selectpickerOpbg").refresh();
            }
        });

        // Load Airports
        appdb.getAirports(function(data){
            if(data.length > 0){  
                $.each(data, function(i, v) {
                    $("#secTo").append("<option value='" + v.ICAO + "'>" + v.ICAO + "</option>");
                    $('.selectpickerOp').refresh();
                });
            }
        }); 

        // Load Users
        appdb.execute("SELECT username, first_name, last_name, picture FROM users WHERE catid = 1 ORDER BY first_name", [], 
            function(data){  
                $("select#userSel, select#condBy, select#postCondby").html('<option value="0">----</option>');
                if (data.length > 0) {   
                    $.each(data, function(i, v) {
                        $("select#userSel, select#condBy, select#postCondby").append("<option value='" + v.username + "'>"+v.first_name+' '+v.last_name + "</option>"); 
                    });
                }
                $("select#userSel").append('<option id="addUsr">Add New User</option>'); 
                $('.selectpickerU, .selectpickerLL, .selectpickerPPF').refresh();
        }); 
    });  
} 