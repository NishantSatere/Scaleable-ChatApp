import { Server, Socket } from "socket.io";
import { Redis } from "ioredis";

const pub = new Redis({
    host: 'redis-325a079d-nishantd28satere-daaa.a.aivencloud.com',
    port: 11587, // port should be a number, not a string
    username: 'default',
    password: 'AVNS_JNGT9VnyiisdPeUQ0UI'
});

const sub = new Redis({
    host: 'redis-325a079d-nishantd28satere-daaa.a.aivencloud.com',
    port: 11587, // port should be a number, not a string
    username: 'default',
    password: 'AVNS_JNGT9VnyiisdPeUQ0UI'
});

class SocketService {
    private _io: Server

    constructor(){
        console.log("Init socket service")
        this._io = new Server({
            cors:{
                allowedHeaders: ['*'],
                origin: '*'
            }
        })
        sub.subscribe("MESSAGES")
    }

    public initListeners(){
        const io = this.io
    
        console.log("Init socket listeners")
        io.on("connect", (socket) => {
            console.log(`New Socket Connected `, socket.id)

            socket.on('event:message', async ({message}:{message:string})=>{
                console.log("New Message recived ",message)
                await pub.publish('MESSAGES',JSON.stringify({message}))
            })
        })

        sub.on('message',(channel, message)=>{
            if(channel === 'MESSAGES'){
                io.emit("message",message)
            }
        })
    }

    get io(){
        return this._io
    }
}

export default SocketService