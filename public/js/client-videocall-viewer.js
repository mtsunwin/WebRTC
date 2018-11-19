var conn = new WebSocket('ws://localhost:3001');
var stream,
    yourConn,
    connectedUser;


conn.onopen = function (event) {
    console.log("Connected to the signaling server");
};

conn.onerror = function (err) {
    console.log("Got error", err);
};

//when we got a message from a signaling server 
conn.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    switch (data.type) {
        case "login":
            handleLogin(data.success);
            break;
        //when somebody wants to call us 
        case "offer":
            handleOffer(data.offer, data.name);
            break;
        case "answer":
            handleAnswer(data.answer);
            break;
        //when a remote peer sends an ice candidate to us 
        case "candidate":
            handleCandidate(data.candidate);
            break;
        case "leave":
            handleLeave();
            break;
        default:
            break;
    }
};

var remoteVideo = document.querySelector('#remoteVideo');
var callToUsernameInput = document.querySelector('#callToUsernameInput');
var callBtn = document.querySelector('#callBtn');
var hangUpBtn = document.querySelector('#hangUpBtn');
var usernameInput = document.querySelector('#usernameInput');
var loginBtn = document.querySelector('#loginBtn');

//alias for sending JSON encoded messages 
function send(message) {
    console.log('====================================');
    console.log("thangtm sent to server: ", message);
    console.log('====================================');
    //attach the other peer username to our messages 
    if (connectedUser) {
        message.name = connectedUser;
    }
    conn.send(JSON.stringify(message));
};


loginBtn.addEventListener("click", function (event) {
    name = usernameInput.value;
    if (name.length > 0) {
        send({
            type: "login",
            name: name
        });
    }
});

//using Google public stun server 

function handleLogin(success) {
    if (success === false) {
        alert("Ooops...try a different username");
    } else {
        var configuration = {
            "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]
        };
        yourConn = new webkitRTCPeerConnection(configuration);
        //when a remote user adds stream to the peer connection, we display it 
        yourConn.onaddstream = function (e) {
            console.log("thang stream ", window.URL.createObjectURL(e.stream));
            var resultFilter = listStreamming.filter(val => val == window.URL.createObjectURL(e.stream))
            if (resultFilter.length == 0) {
                listStreamming.push(window.URL.createObjectURL(e.stream))
            }
            remoteVideo.src = window.URL.createObjectURL(e.stream);
        };
        
        // Setup ice handling 
        yourConn.onicecandidate = function (event) {
            console.log('====================================');
            console.log("no chajy zo day ne");
            console.log('====================================');
            if (event.candidate) {
                send({
                    type: "candidate",
                    candidate: event.candidate
                });
            }
        };
    }
}

callBtn.addEventListener("click", function () {

    var callToUsername = callToUsernameInput.value;
    if (callToUsername.length > 0) {
        connectedUser = callToUsername;
        // create an offer
        yourConn.createOffer(function (offer) {
            send({
                type: "offer",
                offer: offer
            });
            yourConn.setLocalDescription(offer);
            
        }, function (error) {
            alert("Error when creating an offer");
        });
    }
});

function handleOffer(offer, name) {
    // let askConnect = await confirm(`Are you sure connect with ${name} ?`)
    // if (askConnect) {
    connectedUser = name;
    yourConn.setRemoteDescription(new RTCSessionDescription(offer));
    //create an answer to an offer 
    yourConn.createAnswer(function (answer) {
        // prepare sendding messenger over signaling server to End-Point
        yourConn.setLocalDescription(answer);
        send({
            type: "answer",
            answer: answer
        });
    }, function (error) {
        alert("Error when creating an answer");
    });
    // } else {
    // }
};

//when we got an answer from a remote user 
function handleAnswer(answer) {
    yourConn.setRemoteDescription(new RTCSessionDescription(answer));
};

//when we got an ice candidate from a remote user
function handleCandidate(candidate) {
    yourConn.addIceCandidate(new RTCIceCandidate(candidate));
};

//hang up 
hangUpBtn.addEventListener("click", function () {
    send({
        type: "leave"
    });
    handleLeave();
});

function handleLeave() {
    connectedUser = null;
    remoteVideo.src = null;
    yourConn.close();
    yourConn.onicecandidate = null;
    yourConn.onaddstream = null;
};