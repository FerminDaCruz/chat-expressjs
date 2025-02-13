const socket = io();
let user;
let chatBox = document.getElementById("chatBox");

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator: (value) => {
        return (
            !value && "Necesitas escribir un nombre de usuario para continuar"
        );
    },
    allowOutsideClick: false,
}).then((result) => {
    user = result.value;
    socket.emit("userAuthenticated", user);
});

chatBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        let message = chatBox.value.trim();
        if (message.length > 0) {
            socket.emit("message", { user, message });
            chatBox.value = "";
        }
    }
});

socket.on("messageLogs", (data) => {
    let log = document.getElementById("messageLogs");

    let messages = "";
    data.forEach((message) => {
        messages = messages + `${message.user} dice: ${message.message}</br>`;
    });
    log.innerHTML = messages;
});

socket.on("newUserConnected", (newUser) => {
    Swal.fire({
        title: `${newUser} se ha conectado`,
        toast: true,
        position: "top-right",
        timer: 5000,
        showConfirmButton: false,
        icon: "info",
    });
});
