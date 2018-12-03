var bgImgCount = 5;
var selectBG = './images/bgImg/bg-' + Math.floor(Math.random() * bgImgCount + 1) + '.jpg';
$('body').prepend('<img class="img-fluid bg-img position-fixed" src=' + selectBG + '></img>');
$('#filterPanel').toggle();
checkLoginState();

function requestServer(data, route) {
    return new Promise(
        function (res, rej) {
            $.ajax({
                url: 'http://18.188.103.56:3002' + route,
                data: data,
                type: 'POST',
                jsonpCallback: 'callback',
                success: function (data) {
                    console.log(data);
                    res(data);
                },
                error: function (xhr, status, error) {
                    console.log('Error: ' + error.message);
                    rej(false);
                },
            });
        }
    );
}

$('#logo').on('click', function () {
    $(location).attr('href', './index.html')
});

$('#loginBtn').on('click', function () {
    $('#loginModal').modal('toggle');
});
$('#registerBtn').on('click', function () {
    $('#registerModal').modal('toggle');
});

$('#main_dp').daterangepicker({
    "startDate": "01/05/2019",
    "endDate": "11/11/2019",
    "opens": "center"
}, function (start, end, label) {
    console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
});
$('#register_dp').daterangepicker({
    "singleDatePicker": true,
    "showDropdowns": true,
    "startDate": "11/05/2018",
    "endDate": "11/11/2018",
    "opens": "top",
    "drops": "up"
}, function (start, end, label) {
    console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
});


$('#reservation_dp').daterangepicker({
    "startDate": "11/05/2018",
    "endDate": "11/11/2018",
    "opens": "right",
    "drops": "right"
}, function (start, end, label) {
    console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
});

$('#filter_dp').daterangepicker({
    "startDate": "11/05/2018",
    "endDate": "11/11/2018",
    "opens": "top",
    "drops": "up"
}, function (start, end, label) {
    console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
});


$('#filterMinPrice, #filterMaxPrice, #filter_dp').on('change', async function () {
    $('#mainPanel').empty();
    $('#mainPanel').append('<div id="roomList" class="list-group"></div>');
    var money = [];
    money[0] = $('#filterMinPrice').val() ? $('#filterMinPrice').val() : 0;
    money[1] = $('#filterMaxPrice').val() ? $('#filterMaxPrice').val() : 9999;
    var timeRange = $('#filter_dp').val();
    timeRange = timeRange.split(' - ');
    var data = await filterRequest(timeRange, money);
    if (data.status) {
            console.log(data);
            var room = findAllAvRoom(data.message[0], data.message[1])
            populateList(room);
    }
})

$('#main_search_btn').on('click', async function () {
    var money = [];
    money[0] = 0;
    money[1] = $('#mainMoney').val() ? $('#mainMoney').val() : 9999;
    var timeRange = $('#main_dp').val();
    $('#filterMinPrice').val(0);
    $('#filterMaxPrice').val(money[1]);
    $('#filter_dp').val(timeRange);
    timeRange = timeRange.split(' - ');
    $('#mainPanel').empty();
    $('#mainPanel').append('<div id="roomList" class="list-group"></div>');
    var data = await filterRequest(timeRange, money);
    $('#logo').animate({
        height: "-=80"
    }, 500, function () {
        $('#mainPanel').animate({
            width: "+=500",
            height: "+=40"
        }, 500, function () {
            $('#filterPanel').fadeToggle('slow');
            console.log(data);
            setTimeout(function () {
                if (data.status) {
                    console.log(data);
                    var room = findAllAvRoom(data.message[0], data.message[1])
                    populateList(room);
                }

            }, 600);

        });
    });
    $('#main_search_btn').unbind();
    // getReservationRequest(timeRange[0], timeRange[1]);

});

$('#registerSubmit').on('click', function () {
    var fname = $('#registerFname').val();
    var lname = $('#registerLname').val();
    var email = $('#registerEmail').val();
    var password = $('#registerPassword').val();
    var bdate = $('#register_dp').val();
    var smoke = $('#registerSmoke').is(":checked") ? 1 : 0;
    var pet = $('#registerPet').is(":checked") ? 1 : 0;
    $('#registerModal').modal('toggle');
    registerRequest(fname, lname, email, password, bdate, smoke, pet);
});

$('#loginSubmit').on('click', function () {
    var email = $('#loginEmail').val();
    var password = $('#loginPassword').val();
    $('#loginEmail').val('');
    $('#loginPassword').val('');
    $('#loginModal').modal('toggle');
    loginRequest(email, password);
});

var wifiIcon = '<i class="fas fa-wifi py-2"></i> ';
var tvIcon = '<i class="fas fa-tv py-2"></i>';

function populateList(roomInfo) {
    for (var i of roomInfo) {
        var price = i.price;
        var title = i.roomNo;
        var desc = 'No one died in this one so far. Nothing to worry.';
        desc += 'The room size is ' + i.room_size + ' sqft. ';
        var setup = wifiIcon + tvIcon;
        var listItem = '<a href="#" class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">Room ' + title + '</h5><p class="lead">$' + price + '</p></div><p class="mb-1">' + desc + '</p><small>' + setup + '</small></a>';
        $(listItem).appendTo('#roomList').on('click', function () {
            $('#reserveRoomNo').text(title);
            $('#reserveRoomPrice').text(price);
            $('#reservationModal').modal('toggle');
        });
    }
}
$('#reservation_dp').on('change', function () {
    var time = $('#reservation_dp').val().split(' - ')
    var day = moment(time[1]).diff(time[0], 'days');
    var priceb4Tax = $('#reserveRoomPrice').html() * day;
    $('#reservePriceBeforeTax').text(priceb4Tax.toFixed(2));
    var totalPrice = priceb4Tax * (1 + 0.06)
    $('#reserveFinalPrice').text(totalPrice.toFixed(2));
    $('#reserveSubmit').removeClass('disabled');
});

$('#reserveSubmit').on('click', function() {
    var roomNo = $('#reserveRoomNo').text().trim();
    var time = $('#reservation_dp').val();
    time = time.split(' - ');
    if(checkLoginState()) {
        var email = localStorage.getItem('email');
        reservationRequest(roomNo, time[0], time[1], email);
    } else {
        var email = 'guest'+ time[0] + time[1] +'@'+roomNo+'.com'
        reservationRequest(roomNo, time[0], time[1], email);
    }
    
});

function getReservationRequest(startDate, endDate) {
    var route = '/reservation/getAllReservations';
    var request = {
        'startDate': startDate,
        'endDate': endDate
    }
    // requestServer(request, route);
}

async function reservationRequest(roomNo, startDate, endDate, email) {
    var route = '/reservation/makeReservation';
    var request = {
        'roomNo': roomNo,
        'email': email,
        'reserve_date': startDate,
        'check_out_date': endDate
    };
    var status = await requestServer(request, route);
    if(status.status) {
        hotelAlert('Room successfully reserved!', 2000, 'success');
    } else {
        hotelAlert('Failed to reserve room!', 2000, 'danger');
    }
}

async function loginRequest(email, password) {
    var route = '/login';
    var request = {
        'email': email,
        'password': password
    };
    var token = await requestServer(request, route);
    if (token.status) {
        setLoginState(token);
        localStorage.setItem('email', email);
    } else {
        hotelAlert('Invalid user information.', 2000, 'danger');
    }
}

async function registerRequest(fname, lname, email, password, bdate, smoke, pet) {
    var route = '/register';
    var request = {
        'fname': fname,
        'lname': lname,
        'bdate': bdate,
        'pref_smoking': smoke,
        'pref_pets': pet,
        'email': email,
        'password': password
    };
    var status = await requestServer(request, route);
    if (status.status) {
        hotelAlert('Successfully register!', 2000, 'success');
    } else {
        hotelAlert('Failed to register!', 2000, 'danger');
    }
}

async function filterRequest(dateArr, priceArr, sizeArr) {
    var route = '/roomInfo/filterRoom';
    var request = {};

    if (typeof (dateArr) !== 'undefined') {
        request['date'] = {};
        request['date']['start'] = dateArr[0];
        request['date']['end'] = dateArr[1];
    }

    if (typeof (priceArr) !== 'undefined') {
        request['price'] = {};
        request['price']['smallest'] = priceArr[0];
        request['price']['largest'] = priceArr[1];
    }

    if (typeof (sizeArr) !== 'undefined') {
        request['room_size'] = {};
        request['room_size']['smallest'] = sizeArr[0];
        request['room_size']['largest'] = sizeArr[1];

    }
    var roomInfo = await requestServer(request, route);
    return roomInfo;
}

async function checkToken(token) {
    var route = '/login/authenticate';
    var data = await $.ajax({
        url: 'http://18.188.103.56:3002' + route,
        headers: {
            // 'Authorization': 'Bearer ' + token
            'Authorization': token
        },
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data.message);
            return data;
        }
    });
    if (data.status) {
        return setLoginState(data);
    } else {
        localStorage.removeItem("token");
        $('#logRegGrp').show();
        hotelAlert('Login session expired! Please relogin.', 2000, 'warning');
        return false;
    }
    // var valid = await requestServer(request, route);
}

function checkLoginState() {
    var token = localStorage.getItem("token");
    if (token) {
        return checkToken(token);
    }

    $('#logRegGrp').show();
    return false;
}

function setLoginState(token) {
    try {
        console.log(token);
        localStorage.setItem("token", token.message);
        $('#logRegGrp').hide();
        hotelAlert('Welcome back!', 2000, 'light');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * @param {string} msg - The message to pass to the alert notification
 * @param {number} time - The amount of time the alert will live for
 * @param {string} alertType - primary=blue , secondary, success, danger, warning, info, light, dark
 */

function hotelAlert(msg, time, alertType) {
    try {
        var alertType = (typeof (alertType) !== 'undefined') ? alertType.toLowerCase() : 0;
    } catch (err) {
        console.log("Incorrect hotelAlert Format.");
    }
    var alertTypeList = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    if (alertTypeList.indexOf(alertType) == -1) {
        alertType = 'primary';
    }
    ($("#hotelAlert").length) ? $("#hotelAlert").remove(): 0;
    var alertDiv = '<div id="hotelAlert" class="noborder w-100 alert alert-' + alertType + '" role="alert"><h5>' + msg + '</h5></div>';
    $('body').append(alertDiv);
    if (time > 0) {
        $("#hotelAlert").fadeTo(time, 500).fadeOut(500, function () {
            $("#hotelAlert").fadeOut(500);
        });
    } else {
        $("#hotelAlert").show();
    }

}

function findAllAvRoom(room, reservedRoom) {
    var usedRoomList = [];
    for(var i of room) {
        for(var j of reservedRoom) {
            if(i.roomNo == j.roomNo) {
                if(usedRoomList.indexOf(i.roomNo) < 0) {
                    usedRoomList.push(i.roomNo);
                }
            }
        }
    }
    var tempList = [];
    for(var i of room) {
        if(usedRoomList.indexOf(i.roomNo) < 0) {
            tempList.push(i);
        }
    }
    return tempList;
}
