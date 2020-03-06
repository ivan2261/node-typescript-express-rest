const url = `http://localhost:8080`;
const socket = require('socket.io-client').connect(url, {
    query: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoiSmF2aWVyIEF2aWxlcyIsImVtYWlsIjoiYXZpbGVzbG9wZXouamF2aWVyQGdtYWlsLmNvbSJ9.rgOobROftUYSWphkdNfxoN2cgKiqNXd4Km4oz6Ex4ng'
});

socket.on('connect', async () => {
    console.log(`connect to ${url}`);

    socket.emit('onUserCreate', { aaa: 'aaa' });
});

socket.on("error", function (error) {
    if (error.type == "UnauthorizedError" || error.code == "invalid_token") {
        // redirect user to login page perhaps?
        console.log("User's token has expired");
    }
});