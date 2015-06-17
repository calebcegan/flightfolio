/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("offline", this.isOffline, false);
        document.addEventListener("online", this.isOnline, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    isOffline:function(){
        if(navigator.connection.type == Connection.NONE){ 
            $("#test").val("Red");
        } 
    },
    isOnline:function(){
        if(navigator.connection.type != Connection.NONE){ 
            $("#test").val("Green");
        } 
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

//        console.log('Received Event: ' + id);
//        navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
        
    }
};

app.initialize();

$("#test").click(function(e){
    navigator.geolocation.getCurrentPosition(getLocation, onError);
    // navigator.camera.getPicture(onSuccess, onError, {
    //     quality: 100,
    //     encodingType: Camera.EncodingType.JPEG,
    //     destinationType: Camera.DestinationType.FILE_URI
    // });
    // navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
});

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    // if(navigator.connection.type == Connection.NONE){
    //     $("#test").val("Offline");
    // }else{
    //     $("#test").val("Connected");
    // }
    
    alert('Connection type: ' + states[networkState]);
}

function onSuccess(acceleration) {
    var image = document.getElementById('testimg');
    image.src = imageURI; 
};

function getLocation(position){
    $("#geo").html(
        'Latitude: ' + position.coords.latitude + ' | ' +
        'Longitude: ' + position.coords.longitude+' | ' +
        'Altitude: ' + position.coords.altitude + ' | ' +
        'Accuracy: ' + position.coords.accuracy + ' | ' +
        'Speed: ' + position.coords.speed);
}

function onError() {
    alert('onError!');
};





