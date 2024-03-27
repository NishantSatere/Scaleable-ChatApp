import http from "http"
import SocketService from "./services/socket";
async function init() {
    const socketService = new SocketService();

    const httpserver = http.createServer();
    const PORT = process.env.PORT || 8000;

    socketService.io.attach(httpserver)
    socketService.initListeners()
    httpserver.listen(PORT , () => {console.log(`server running on port ${PORT}`)})
}

init()