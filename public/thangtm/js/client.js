const connection = new WebSocket('wss://server-webrtc-thangtm.herokuapp.com');

const configuration = {
    "iceServers": [
        {
            urls: [
                'stun:ss-turn1.xirsys.com',
                'turn:ss-turn1.xirsys.com:80?transport=udp',
                'turn:ss-turn1.xirsys.com:3478?transport=udp',
                'turn:ss-turn1.xirsys.com:80?transport=tcp',
                'turn:ss-turn1.xirsys.com:3478?transport=tcp',
                'turns:ss-turn1.xirsys.com:443?transport=tcp',
                'turns:ss-turn1.xirsys.com:5349?transport=tcp'
            ],
            credential: '9d61b156-f159-11e8-807d-32b0c04e5b2c',
            username: '	9d61b0d4-f159-11e8-96d8-adf817ff6a2f'
        }
    ]
};

var yourConnect_WebRTC;
var yourConnect_WebRTC_v2;
const constraints = window.constraints = {
    audio: false,
    video: true
};

connection.onopen = () => {
    console.log("Connected");
};
connection.onerror = err => {
    console.log("Got error", err);
};

connection.onmessage = function (msg) {
    msg = JSON.parse(msg.data)
    switch (msg.type) {
        case 'login':
            handleLogin(msg.status, msg.message);
            break;
        case 'offer':
            alert("thang" + msg.type);
            console.log("thangtm offer: ", msg)
            console.log("thangtm offer: ", msg.v.length)
            if (msg.v) {
                handleOffer_v2(msg.offer, msg.name);
            } else {
                handleOffer(msg.offer, msg.name);
            }
            break;
        case 'answer':
            if (msg.v) {
                handlAnswer_v2(msg.answer);
            } else {
                handlAnswer(msg.answer);
            }
            break;
        case "candidate":
            if (msg.v) {
                handleCandidate_v2(msg.candidate);
            } else {
                handleCandidate(msg.candidate);
            }
            break;
        case "leave":
            if (msg.v) {
                handleLeave();
            } else {
                handleLeave_v2();
            }
            break;
    }
}

/**
 * Function WSS
 */
function sendToServer(message) {
    // console.log('====================================');
    // console.log("Client send to server: ", message);
    // console.log('====================================');
    connection.send(JSON.stringify(message));
};
// END Function WSS

/**
 * Processing WSS
 * @param {*} message 
 */

// User Login
function handleLogin(status, message) {
    if (!status) {
        alert(message)
    } else {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(
                myStream => {
                    document.getElementById("yourVideosStream").srcObject = myStream;

                    yourConnect_WebRTC = new webkitRTCPeerConnection(configuration);

                    yourConnect_WebRTC.addStream(myStream);

                    yourConnect_WebRTC.onaddstream = function (e) {
                        document.getElementById('VdeosStream').srcObject = e.stream;
                        console.log("webrtc: ", yourConnect_WebRTC.getRemoteStreams())
                    };

                    yourConnect_WebRTC.onicecandidate = function (event) {
                        if (event.candidate) {
                            sendToServer({
                                type: "candidate",
                                candidate: event.candidate,
                                name: document.getElementById("iptCallTo").value
                            });
                        }
                    };
                    // yourConnect_WebRTC.createDataChannel("chat", {});
                    // yourConnect_WebRTC.ondatachannel = (ev) => {
                    //     ev.channel.onopen = function () {
                    //         console.log('Data channel is open and ready to be used.');
                    //     };
                    //     ev.channel.onmessage = function (event) {
                    //         alert("Client: " + event.data);
                    //     };
                    // };
                    yourConnect_WebRTC_v2 = new webkitRTCPeerConnection(configuration);
                    yourConnect_WebRTC_v2.addStream(myStream);
                    yourConnect_WebRTC_v2.onaddstream = function (e) {
                        document.getElementById('VdeosStream_v2').srcObject = e.stream;
                    };
                    yourConnect_WebRTC_v2.onicecandidate = function (event) {
                        if (event.candidate) {
                            sendToServer({
                                type: "candidate",
                                candidate: event.candidate,
                                name: document.getElementById("iptCallTo_v2").value,
                                v: 2
                            });
                        }
                    };
                })
            .catch(
                err => {
                    console.log('webkitGetUserMedia', err);
                })
    }
}

function handleOffer(offer, nameReceiver) {
    yourConnect_WebRTC.setRemoteDescription(new RTCSessionDescription(offer));
    yourConnect_WebRTC.createAnswer(function (answer) {
        yourConnect_WebRTC.setLocalDescription(answer);
        sendToServer({
            type: "answer",
            answer: answer,
            name: nameReceiver // nameReceiver
        });
    }, function (error) {
        alert("Error when creating an answer");
    });
}

function handlAnswer(answer) {
    yourConnect_WebRTC.setRemoteDescription(new RTCSessionDescription(answer));
}

function handleCandidate(candidate) {
    yourConnect_WebRTC.addIceCandidate(new RTCIceCandidate(candidate));
}

function handleLeave() {
    document.getElementById("VdeosStream").src = null;
    yourConnect_WebRTC.close();
    yourConnect_WebRTC.onicecandidate = null;
    yourConnect_WebRTC.onaddstream = null;
};

// END Processing WSS

/**
 * HTML Event
 */
document.getElementById("btnLogin").addEventListener('click', event => {
    var data = {
        type: "login",
        name: document.getElementById("iptLogin").value
    }
    sendToServer(data);
})

document.getElementById("btnCall").addEventListener("click", event => {
    let callto = document.getElementById("iptCallTo").value;
    if (callto.length > 0) {

        yourConnect_WebRTC.createOffer(offer => {
            yourConnect_WebRTC.setLocalDescription(offer);
            let data = {
                type: "offer",
                offer: offer,
                name: callto
            }
            sendToServer(data);
        }, error => {
            alert("Error when creating an offer");
        });
    }
})

document.getElementById("btnHangup").addEventListener("click", event => {
    sendToServer({
        type: "leave",
        nameReceiver: document.getElementById("iptCallTo").value
    });
    handleLeave();
})

// v2
document.getElementById("btnCall_v2").addEventListener("click", event => {
    let callto = document.getElementById("iptCallTo_v2").value;
    if (callto.length > 0) {
        yourConnect_WebRTC_v2.createOffer(offer => {
            yourConnect_WebRTC_v2.setLocalDescription(offer);
            console.log("thangtm click btn 2")
            let data = {
                type: "offer",
                offer: offer,
                name: callto,
                v: 2
            }
            sendToServer(data);
        }, error => {
            alert("Error when creating an offer");
        });
    }
})

document.getElementById("btnHangup_v2").addEventListener("click", event => {
    sendToServer({
        type: "leave",
        nameReceiver: document.getElementById("iptCallTo_v2").value,
        v: 2
    });
    handleLeave();
})

function handleLeave_v2() {
    document.getElementById("VdeosStream_v2").src = null;
    yourConnect_WebRTC_v2.close();
    yourConnect_WebRTC_v2.onicecandidate = null;
    yourConnect_WebRTC_v2.onaddstream = null;
};

function handleOffer_v2(offer, nameReceiver) {
    console.log("handleOffer_v2");
    yourConnect_WebRTC_v2.setRemoteDescription(new RTCSessionDescription(offer));
    yourConnect_WebRTC_v2.createAnswer(function (answer) {
        yourConnect_WebRTC_v2.setLocalDescription(answer);
        sendToServer({
            type: "answer",
            answer: answer,
            name: nameReceiver, // nameReceiver
            v: 2
        });
    }, function (error) {
        alert("Error when creating an answer");
    });
}

function handlAnswer_v2(answer) {
    yourConnect_WebRTC_v2.setRemoteDescription(new RTCSessionDescription(answer));
}

function handleCandidate_v2(candidate) {
    yourConnect_WebRTC_v2.addIceCandidate(new RTCIceCandidate(candidate));
}
