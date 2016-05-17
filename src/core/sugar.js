import {RoomClient} from "./client/RoomClient";
import {RoomServer} from "./server/RoomServer";
import {Service} from "./server/Service";

function roomClient(url) {
    return new RoomClient(url);
}

function roomServer(server) {
    return new RoomServer(server);
}

export {
    roomClient,
    roomServer,
    Service
}
