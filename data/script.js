let gateway = `ws://${window.location.hostname}/ws`;
window.addEventListener("load", onLoad);
let websocket, rcv, name;

function initWebSocket() {
    console.log("Trying to open a WebSocket connection...");
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage; // <-- add this line
}

function onOpen(event) {
    console.log("Connection opened");
    sndFirstReq();
    document.getElementsByClassName("time")[0].innerHTML =
        document.getElementsByClassName("time")[1].innerHTML =
            new Date().getHours() +
            ":" +
            (new Date().getMinutes() < 10 ? "0" : "") +
            new Date().getMinutes();
}

function onClose(event) {
    console.log("Connection closed");
    setTimeout(initWebSocket, 2000);
}

function onMessage(event) {
    rcv = JSON.parse(event.data);
    console.log(rcv);
    let flags = Boolean(rcv.name && rcv.msg && rcv.time);

    if (rcv.name != name && flags) {
        if (rcv.time == "NA")
            rcv.time =
                new Date().getHours() +
                ":" +
                (new Date().getMinutes() < 10 ? "0" : "") +
                new Date().getMinutes();
        document.getElementById("conv").innerHTML +=
            "<div class='text' id='left'><div class='name'>" +
            rcv.name +
            "</div><div class='txt'>" +
            rcv.msg +
            "</div><div class='time'>" +
            rcv.time +
            "</div></div>";
    }
}

function sndFirstReq() {
    name = prompt("Enter Your Name (Visible to others)");
    const info = {
        name,
    };
    console.log(info);
    websocket.send(JSON.stringify(info));
}

function onLoad(event) {
    initWebSocket();
    initButton();
}

function initButton() {
    document.getElementById("in").addEventListener("keypress", (event) => {
        if (event.key == "Enter") {
            document.getElementById("send").click();
        }
    });
}
function sndMsg() {
    let time =
        new Date().getHours() +
        ":" +
        (new Date().getMinutes() < 10 ? "0" : "") +
        new Date().getMinutes();
    const info = {
        msg: document.getElementById("in").value,
        time,
    };
    console.log(info);
    document.getElementById("in").value = "";
    document.getElementById("conv").innerHTML +=
        "<div class='text' id='right'><div class='txt'>" +
        info.msg +
        "</div><div class='time'>" +
        info.time +
        "</div></div>";
    websocket.send(JSON.stringify(info));
}