
/*
Admin panel
*/

$('#adminBtnRoomInfo').on('click', function() {
    adminShowList('roomInfo');
});

$('#adminBtnCustomer').on('click', function() {
    adminShowList('customer');
});

$('#adminBtnReservation').on('click', function() {
    adminShowList('reservation');
});

function adminShowList(type) {
    var data = false;
    if(type == 'customer') {
        data = adminCustomer
        return true;
    }
    
    if(type == 'roomInfo') {
        return true;
    }

    if(type == 'reservation') {
        return true;
    }

    adminPopulateList(data);
    return false;
}

function adminPopulateList(data) {
    if(data) {


    } else {
        hotelAlert('Sorry cannot display the result. Please try again.', 1000, 'danger');
    }

}

async function adminCustomer() {
    var route = '';
    var request = '';
    
    return await requestServer(request, route);
}


async function adminReservation() {
    var route = '';
    var request = '';
    
    return await requestServer(request, route);
}


async function adminRoomInfo() {
    var route = '';
    var request = '';
    
    return await requestServer(request, route);
}



