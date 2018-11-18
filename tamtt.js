const URL = "https://support.gamevui888.com/api/v1/";
const USER_ID = "BicfZksP3XLiZrQRZ";
const USER_TOKEN = "zjmLNnIltSo6N8UwrW6Rh-2kkg7C02p6-u6bf-74mcR";

var createUser = (_username, _password, _email) => {
    var data = {
        "email": _email,
        "name": _username,
        "password": _password,
        "username": _username
    }

    $.ajax({
        method: "POST",
        url: URL + "users.create",
        dataType: 'json',
        headers: {
            'X-Auth-Token': USER_TOKEN,
            'X-User-Id': USER_ID,
            'Content-Type': 'application/json'
        },
        data: data,
        success: (data) => {
            //Ketqua
            console.log("ketqua", data)
        }
    }).done((data) => {
        //Ketqua
        console.log("ketqua", data)
    });
}

var createRoom = (_room_name, _list_user) => {
    var data = {
        "name": _room_name,
        "members": _list_user // ["thangtm", "nhungbh"]
    }

    $.ajax({
        method: "POST",
        url: URL + "groups.create",
        dataType: 'json',
        headers: {
            'X-Auth-Token': USER_TOKEN,
            'X-User-Id': USER_ID,
            'Content-Type': 'application/json'
        },
        data: data,
        success: (data) => {
            //Ketqua
            console.log("ketqua", data)
        }
    }).done((data) => {
        //Ketqua
        console.log("ketqua", data)
    });
}

var sendMsg = (_room_id, _msg) => {
    var data = {
        "message": 
            { 
                "rid": _room_id, 
                "msg": _msg
            }
    }

    $.ajax({
        method: "POST",
        url: URL + "chat.sendMessage",
        dataType: 'json',
        headers: {
            'X-Auth-Token': USER_TOKEN,
            'X-User-Id': USER_ID,
            'Content-Type': 'application/json'
        },
        data: data,
        success: (data) => {
            //Ketqua
            console.log("ketqua", data)
        }
    }).done((data) => {
        //Ketqua
        console.log("ketqua", data)
    });
}

var login = (_username, _password) => {
    var data = { "username": _username, "password": _password }

    $.ajax({
        method: "POST",
        url: URL + "login",
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data,
        success: (data) => {
            //Ketqua
            console.log("ketqua", data)
        }
    }).done((data) => {
        //Ketqua
        console.log("ketqua", data)
    });
}