import * as socketio from "socket.io";
export interface BasicSocketController {
  registerHandlers: (io: socketio.Server, socket: socketio.Socket) => void;
}
