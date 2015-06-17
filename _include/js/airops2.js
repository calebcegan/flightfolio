
/*Toggle Function*/
(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){e.fn.funcToggle=function(t,n){var r="jqp_eventtoggle_"+t+(new Date).getTime(),i=Array.prototype.slice.call(arguments,2),s=i.length,o=function(){},u=function(){return false};if(typeof t==="object"){for(var a in t){e.fn.funcToggle.apply(this,[a].concat(t[a]))}return this}if(e.isFunction(n)||n===false){i=[n].concat(i);s+=1;n=undefined}i=e.map(i,function(t){if(t===false){return u}if(!e.isFunction(t)){return o}return t});this.data(r,0);this.bind(t,n,function(t){var n=e(this).data(),o=n[r];i[o].call(this,t);n[r]=(o+1)%s});return this}});
//Modal Reset
$.clearModal=function(sturvz){$(sturvz).find('input,select').val('');};

// Auto jump between fields
var downStrokeField;

function autojump(e, t, n) {
    var r = document.getElementById("sector_frm");
    var i = r.elements[e];
    i.nextField = r.elements[t];
    if (i.maxLength == null) i.maxLength = n;
    i.onkeydown = autojump_keyDown;
    i.onkeyup = autojump_keyUp
}

function autojump_keyDown() {
    this.beforeLength = this.value.length;
    downStrokeField = this
}

function autojump_keyUp() {
    if (this == downStrokeField && this.value.length > this.beforeLength && this.value.length >= this.maxLength) this.nextField.focus();
    downStrokeField = null
};

autojump('block_off', 'flight_off', 4);
autojump('flight_off', 'flight_on', 4); 
autojump('flight_on', 'block_on', 4); 
autojump('block_on', 'departure_fuel', 4); 
autojump('departure_fuel', 'arrival_fuel', 5);
autojump('arrival_fuel', 'apprch', 5); 


$(document).ready(function() {
    //Demo Functions
    var syncEls = $("#startTab td:not(:last-child), #startTab .statCircle");

    function syncStat() {
        $("#syncr").removeClass("syncr").html("<img src='_include/assets/syncD.png'>").css("margin-right", "5px");
        $("#syncStatus").html("Connected");
        // $("#statUser").html("Ryan Martin");
        syncEls.removeClass("syncing");
        $(".con-start").addClass("con-startHover");
    };

    $("#userSel").on("change", function() {
        $("#loginStat .statCircle").addClass("G");
        $("#usrPic").attr("src", "_include/assets/photoHold.png");
        $(".login.disclaimer").css("color", "#007aff");
        $("#loginSubmit").addClass("subUp");
    })

    //Login
    $("#loginSubmit").mousedown(function() {
        $(this).addClass("subDn");
    }).mouseup(function() {
        $(this).removeClass("subDn");
    });
    // $("#loginSubmit").on("click", function() {
    //     $("#loginDiv").hide("fast");
    //     $("#welCome").show("fast");
    // });
    $("#stngsBtn").mousedown(function() {
        $(this).addClass("stngsDn");
    }).mouseup(function() {
        $(this).removeClass("stngsDn");
    }); 
    $("#accAir").mousedown(function() {
        $(this).addClass("accairDn");
    }).mouseup(function() {
        $(this).removeClass("accairDn");
    });
    $("#accAir").on("click", function() {
        //Do Something
    });
    $("#nwAir").mousedown(function() {
        $(this).addClass("nwairDn");
    }).mouseup(function() {
        $(this).removeClass("nwairDn");
    });
    $("#contAir").mousedown(function() {
       $(this).addClass("contairDn");
    }).mouseup(function() {
       $(this).removeClass("contairDn");
    });
    $("#logOut").mousedown(function() {
        $(this).addClass("logoutDn");
    }).mouseup(function() {
        $(this).removeClass("logoutDn");
    });
    $("#logOut").on("click", function() {
        //Do Something
    });

    //Sync Status

    $("#syncr").addClass("syncr");
    syncEls.addClass("syncing");
    window.setTimeout(syncStat, 1000);
    //After Connected do --> $("#syncr").removeClass("syncr");

    //Navigation
    $(".con-start").mousedown(function() {
        $(this).addClass("con-startFocus")
    }), $(".con-start").mouseup(function() {
        $(this).removeClass("con-startFocus").addClass("con-startHover")
    }), $(".con-oper,.con-maint,.con-summ,.con-flight,.con-sect").on("mousedown", function() {
        $(".con-start").removeClass("con-startHover")
    }), $(".con-oper").mousedown(function() {
        $(this).addClass("con-operFocus")
    }), $(".con-oper").mouseup(function() {
        $(this).removeClass("con-operFocus").addClass("con-operHover")
    }), $(".con-start,.con-maint,.con-summ,.con-flight,.con-sect").on("mousedown", function() {
        $(".con-oper").removeClass("con-operHover")
    }), $(".con-maint").mousedown(function() {
        $(this).addClass("con-maintFocus")
    }), $(".con-maint").mouseup(function() {
        $(this).removeClass("con-maintFocus").addClass("con-maintHover")
    }), $(".con-oper,.con-start,.con-summ,.con-flight,.con-sect").on("mousedown", function() {
        $(".con-maint").removeClass("con-maintHover")
    }), $(".con-summ").mousedown(function() {
        $(this).addClass("con-summFocus")
    }), $(".con-summ").mouseup(function() {
        $(this).removeClass("con-summFocus").addClass("con-summHover")
    }), $(".con-oper,.con-maint,.con-start,.con-flight,.con-sect").on("mousedown", function() {
        $(".con-summ").removeClass("con-summHover")
    }), $(".con-flight").mousedown(function() {
        $(this).addClass("con-flightFocus")
    }), $(".con-flight").mouseup(function() {
        $(this).removeClass("con-flightFocus").addClass("con-flightHover")
    }), $(".con-oper,.con-maint,.con-summ,.con-start,.con-sect").on("mousedown", function() {
        $(".con-flight").removeClass("con-flightHover")
    }), $(".con-sect").mousedown(function() {
        $(this).addClass("con-sectFocus")
    }), $(".con-sect").mouseup(function() {
        $(this).removeClass("con-sectFocus").addClass("con-sectHover")
    }), $(".con-oper,.con-maint,.con-summ,.con-flight,.con-start").on("mousedown", function() {
        $(".con-sect").removeClass("con-sectHover")
    });

    //SelectPickers
    $(".selectpicker").selectpicker({
        dropupAuto: false,
        width: "104px",
        caretHTML: '<span></span>',
        style: 'selButt'
    });
    $(".selectpickerL").selectpicker({
        dropupAuto: false,
        width: "142px",
        caretHTML: '<span></span>',
        style: 'selButt'
    });
    $(".selectpickerLL").selectpicker({
        dropupAuto: false,
        width: "145px",
        caretHTML: '<span></span>',
        style: 'selButt'
    });
    $(".selectpickerU").selectpicker({
        dropupAuto: false,
        width: "215px",
        caretHTML: '<span></span>',
        style: 'selButt'
    });
    $(".selectpickerOpsm").selectpicker({
        dropupAuto: false,
        width: "62px",
        caretHTML: '<span></span>',
        style: 'selButt'
    });
    $(".selectpickerOp").selectpicker({
        dropupAuto: false,
        width: "87px",
        caretHTML: '<span></span>',
        style: 'selButt'
    });
    $(".selectpickerOpbg").selectpicker({
        dropupAuto: false,
        width: "150px",
        caretHTML: '<span></span>',
        style: 'selButt'
    });
    $(".selectpickerAD").selectpicker({
        dropupAuto: false,
        width: "160px",
        caretHTML: '<span></span>',
        style: 'selButt'
    });
    $(".selectpickerPPF").selectpicker({
        dropupAuto: false,
        width: "145px",
        caretHTML: '<span></span>',
        style: 'selButt'
    });
    $(".selectpickerFsecm").selectpicker({
        dropupAuto: false,
        width: "120px",
        caretHTML: '<span></span>',
        style: 'selButt'
    });
    $(".selectpickerFsecy").selectpicker({
        dropupAuto: false,
        width: "95px",
        caretHTML: '<span></span>',
        style: 'selButt'
    });

    //SelectPicker Functions
    $(".selDiv.reg").funcToggle("click", function() {
        $(this).addClass("selExp");
        $(".dropdown-menu.open", this).css("display", "block");
        $(".selButt", this).addClass("selButtOpen");
    }, function() {
        $(this).removeClass("selExp");
        $(".dropdown-menu.open", this).css("display", "none");
        $(".selButt", this).removeClass("selButtOpen");
    });
    $(".selDiv.seL").funcToggle("click", function() {
        $(this).addClass("selExpL");
        $(".dropdown-menu.open", this).css("display", "block");
        $(".selButt", this).addClass("selButtOpen");
    }, function() {
        $(this).removeClass("selExpL");
        $(".dropdown-menu.open", this).css("display", "none");
        $(".selButt", this).removeClass("selButtOpen");
    });
    $(".selDiv.seLL").funcToggle("click", function() {
        $(this).addClass("selExpLL");
        $(".dropdown-menu.open", this).css("display", "block");
        $(".selButt", this).addClass("selButtOpen");
        $(".btn-group.bootstrap-select.LL").addClass("btLL");
    }, function() {
        $(this).removeClass("selExpLL");
        $(".dropdown-menu.open", this).css("display", "none");
        $(".selButt", this).removeClass("selButtOpen");
        $(".btn-group.bootstrap-select.LL").removeClass("btLL");
    });
    $(".selDiv.userSel").funcToggle("click", function() {
        $(this).addClass("selExpU");
        $(".dropdown-menu.open", this).css("display", "block");
        $(".selButt", this).addClass("selButtOpen"); //$(".btn-group.bootstrap-select.LL").addClass("btLL");
    }, function() {
        $(this).removeClass("selExpU");
        $(".dropdown-menu.open", this).css("display", "none");
        $(".selButt", this).removeClass("selButtOpen"); //$(".btn-group.bootstrap-select.LL").removeClass("btLL");
    });
    $(".selDiv.op").funcToggle("click", function() {
        $(this).addClass("selExpOp");
        $(".dropdown-menu.open", this).css("display", "block");
        $(".selButt", this).addClass("selButtOpen");
    }, function() {
        $(this).removeClass("selExpOp");
        $(".dropdown-menu.open", this).css("display", "none");
        $(".selButt", this).removeClass("selButtOpen");
    });
    $(".selDiv.op.sm").funcToggle("click", function() {
        $(this).addClass("selExpOpsm");
        $(".dropdown-menu.open", this).css("display", "block");
        $(".selButt", this).addClass("selButtOpen");
    }, function() {
        $(this).removeClass("selExpOpsm");
        $(".dropdown-menu.open", this).css("display", "none");
        $(".selButt", this).removeClass("selButtOpen");
    });
    $(".selDiv.op.bg").funcToggle("click", function() {
        $(this).addClass("selExpOpbg");
        $(".dropdown-menu.open", this).css("display", "block");
        $(".selButt", this).addClass("selButtOpen");
    }, function() {
        $(this).removeClass("selExpOpbg");
        $(".dropdown-menu.open", this).css("display", "none");
        $(".selButt", this).removeClass("selButtOpen");
    });
    $(".selDiv.adcrSel").funcToggle("click", function() {
        $(this).addClass("selExpAD");
        $(".dropdown-menu.open", this).css("display", "block");
        $(".selButt", this).addClass("selButtOpen");
    }, function() {
        $(this).removeClass("selExpAD");
        $(".dropdown-menu.open", this).css("display", "none");
        $(".selButt", this).removeClass("selButtOpen");
    });
    $(".selDiv.ppfSel").funcToggle("click", function() {
        $(this).addClass("selExpPPF");
        $(".dropdown-menu.open", this).css("display", "block");
        $(".selButt", this).addClass("selButtOpen");
    }, function() {
        $(this).removeClass("selExpPPF");
        $(".dropdown-menu.open", this).css("display", "none");
        $(".selButt", this).removeClass("selButtOpen");
    });
    $(".selDiv.fSecM").funcToggle("click", function() {
        $(this).addClass("selExpFsecm");
        $(".dropdown-menu.open", this).css("display", "block");
        $(".selButt", this).addClass("selButtOpen");
    }, function() {
        $(this).removeClass("selExpFsecm");
        $(".dropdown-menu.open", this).css("display", "none");
        $(".selButt", this).removeClass("selButtOpen");
    });
    $(".selDiv.fSecY").funcToggle("click", function() {
        $(this).addClass("selExpFsecy");
        $(".dropdown-menu.open", this).css("display", "block");
        $(".selButt", this).addClass("selButtOpen");
    }, function() {
        $(this).removeClass("selExpFsecy");
        $(".dropdown-menu.open", this).css("display", "none");
        $(".selButt", this).removeClass("selButtOpen");
    });
    /*$("body *").not($(".selDiv")).on("click",function(){
        if($(".dropdown-menu.open").css("display")=="block"){
        $(".dropdown-menu.open").each().css("display","none");$(".selButt").removeClass("selButtOpen")
        };
    });*/
    //Selectpicker Extras
    $(".selDiv, input").on("change", function() {
        $(this).css("background-color", "transparent");
    });
    //Modals
    var nUsrSpan = "a[data-normalized-text='<span class=\"text\">Add New User</span>']";
    $(".modal").on("hidden.bs.modal", function() {
        $.clearModal(this);
    });
    //Reset Time            
    $("#reseTime").on("click", function() {
        $("#rstMod").modal("show");
    });
    // Add Crew
    $(".addIcon").on("click", function() {
        if (appy.getID() == 0) {
            appdb.show("Please pick an Aircraft to continue");   
            return false; 
        }else{
            $("#adcrMod").modal("show");
        } 
    });
    
    $(nUsrSpan).on("click", function() {
        $("#nusrMod").modal("show");
        $("input#nusrPass").focus();
    }); 

    //Startup Page
    $("#confMcraft, #confMcrew, #confDefx, #confAirStat").on("change", function(e) {
        if(appy.aircraftid > 0){
            if ($("#confMcraft").prop("checked") && $("input#confMcrew").prop("checked") && $("input#confDefx").prop("checked") && $("input#confAirStat").prop("checked")) {
                $("#acceptStart").addClass("accStHover"); 
            }else {
                $("#acceptStart").removeClass("accStHover"); 
            }   
        }else{
            appdb.show("Please select an Aircraft");
            $(this).prop("checked", false);
            return false;
        }
    }); 

    // Crew dropdown Section
    $("#picSel").on("change", function() {
        $("#secPic").val(initials($("#picSel option:selected").html()));
        $("#pic").html($("#picSel option:selected").html() +' / '+$("#picSel option:selected").data('codeno'));
        $(".selectpickerL, .selectpickerOp").refresh();
    });
    $("#sicSel").on("change", function() {
        $("#secSic").val(initials($("#sicSel option:selected").html()));
        $("#sic").html($("#sicSel option:selected").html()+' / '+$("#picSel option:selected").data('codeno'));
        $(".selectpickerL, .selectpickerOp").refresh();
    });
    $("#caSel").on("change", function() {
        $("#secCa").val(initials($("#caSel option:selected").html()));
        $("#hca").html($("#caSel option:selected").html()+' / '+$("#picSel option:selected").data('codeno'));
        $(".selectpickerL, .selectpickerOp").refresh();
    }); 

    $("#tmpClick").on("click", function() {
        $("#stNotes").addClass("blBrd");
        $("#acceptStart").addClass("accStHover").mousedown(function() {
            $(this).addClass("accStFocus")
        }).mouseup(function() {
            $(this).removeClass("accStFocus")
        });
    });
    //PreFlight Login
    $("#prfltSv").on("click", function() {
        //Do login stuff
    }); 
    //OperationalPage       
    $("li .con-oper").on("click", function() {
        //$(".Opsm").highlight();
        //$("#secDur *").attr("readonly",true);
    });
    $("#secEdit").funcToggle("click", function() {
        $("#secDur .selDiv,#secDur input").removeClass("secDurable");
        $(".secDetDiv .selDiv,.secDetDiv input").addClass("secDetAble");
        $(this).html("Done").addClass("donEdit");
        //$("#secEdit").css("margin","12px 97px 0 45px");
        $("#tmCtrl").attr("src", "_include/assets/Btn_Start_Inactive.png");
        $("#reseTime").css("visibility", "hidden");
    }, function() {  
        if($("#secFrm").html() != $("#secTo").val()){
            $("#secDur .selDiv,#secDur input").addClass("secDurable");
            $(".secDetDiv .selDiv,.secDetDiv input").removeClass("secDetAble");
            $(this).html("Edit").removeClass("donEdit");
            //$("#secEdit").css("margin","13px 100px 0 45px");
            $("#tmCtrl").attr("src", "_include/assets/Btn_Start_Active.png");
            $("#subSec").addClass("subSecHover");

            // Sync Here
            if($("#secNum option:selected").data("sid") == undefined)  
                appy._addSector();
        }else{
            appdb.show("WARNING: Same Departure and Arrival Airport")
            $("#secTo").focus();
            return false;
        } 
    });
    //Time Controls
    $("#tmCtrl").funcToggle("click", function() {
        if ($(this).attr("src") == "_include/assets/Btn_Start_Active.png") {
            $(this).attr("src", "_include/assets/Btn_Stop_Active.png");
            //start the timer
            appy.updateTime();

            $("#reseTime").css("visibility", "visible");
            $("#subSec").addClass("subSecHover");
            $("#ntDur").addClass("blBrd");
        }
    }, function() {
        if ($(this).attr("src") == "_include/assets/Btn_Stop_Active.png") {
            $(this).attr("src", "_include/assets/Btn_Start_Active.png");
            //stop the timer
            appy.stopAutoUp();
            $("#bOn").trigger('change');
            //$("#reseTime").show();
        }
    });
    //RESET TIME            
    $("#rstSv").on("click", function() {
        $("#tmCtrl").attr("src", "_include/assets/Btn_Start_Active.png");
        $("#rstMod").modal("hide");
        //empty all inputs or whatever
    });

    //Engine Start/Stop Show
    // $("#engstSv").on("click", function() {
    //     $(".stUp,.shtDn").show();
    //     $("#engstMod").modal("hide");
    //     $("#engSS").css("visibility", "hidden");
    // });
    //Submit Sector
    $("#subSec").on("mousedown", function() {
        $(this).addClass("subSecFocus")
    }).on("mouseup", function() {
        $(this).removeClass("subSecFocus")
    });

    //Maintenance Page      
    $("#secEditM").funcToggle("click", function() {
        $(this).html("Done").addClass("donEdit");
        $("#defxTableM td:nth-child(5)").css("background-color", "white").attr("contenteditable", "true");
    }, function() {
        $(this).html("Edit").removeClass("donEdit");
        $("#defxTableM td:nth-child(5)").css("background-color", "transparent").attr("contenteditable", "false");
    });
    $("#secEditDoc").funcToggle("click", function() {
        $(this).html("Done").addClass("donEdit");
        $(".delCncl").css("visibility", "visible");
        //$("#docTableM").css("right","16px");
    }, function() {
        $(".delCncl").css("visibility", "hidden");
        $(this).html("Edit").removeClass("donEdit");
        $("#cnclDel").click();
        //$("#docTableM").css("right","13px");
    });
    $("#delButt").on("click", function() {
        $("#docTableM td:nth-child(1),#docTableM th:nth-child(1)").css("visibility", "visible");
        $("#cnclDel").css("color", "#0079ff");
    });
    $("#cnclDel").on("click", function() {
        $("#docTableM td:nth-child(1),#docTableM th:nth-child(1)").css("visibility", "hidden");
        $(this).css("color", "#666");
    }); 
    $(".delRow,.delRow .roundedTwo label").funcToggle("click", function() {
        $(".delRow").closest("tr").addClass("dlrw");
        $(".delRow").siblings().addClass("dlrwTD");
        }, function() {
        $(".delRow").closest("tr").removeClass("dlrw");
        $(".delRow").siblings().removeClass("dlrwTD");
    });

    //Summary Page
    $("#sumEditPPF").funcToggle("click", function() {
        $(this).html("Done").addClass("donEdit");
        //Do Other Stuff
    }, function() {
        $(this).html("Edit").removeClass("donEdit");
        //Undo Other Stuff You Just Did
        $("#subAir").addClass("subAirHover");
        $("div.subAirSec").addClass("blBrd");
    });
    
    $("#subAir").on("mousedown", function() {
        $(this).addClass("subAirFocus")
    }).on("mouseup", function() {
        $(this).removeClass("subAirFocus")
    })

    //$('#myModal').modal('hide') -- hide modal
    
}); //DocumentReadyFunc
