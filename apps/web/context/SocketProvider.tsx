'use client'


import React, { useCallback, useContext, useEffect, useState } from "react"
import { io , Socket} from "socket.io-client"

interface SocketProviderProps{
    children?: React.ReactNode
}

interface ISocketContext {
    sendMessage: (msg:string) => any
    messages : string[]
}

const SocketContext = React.createContext<ISocketContext | null>(null)


export const useSocket = () => {
    const state = useContext(SocketContext)

    if(!state) throw new Error('state is undefined')
    
    return state
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
    const [socket, setScoket] = useState<Socket>()
    const [messages, setMessages] = useState<string[]>([])

    useEffect(()=>{
        const _socket = io("http://localhost:8000")
        _socket.on('message',onMessageRec)
        setScoket(_socket)
        return () => {
            _socket.disconnect()
            _socket.off('message',onMessageRec)
            setScoket(undefined)
        }
    },[])

    const sendMessage:ISocketContext['sendMessage'] = useCallback((msg)=>{
        console.log("send messageee", msg)
        if(socket){
            socket.emit('event:message',{message:msg})
        }
    },[socket])

    const onMessageRec = useCallback((msg:string)=>{
        console.log("From server message ",msg)
        const {message} = JSON.parse(msg) as {message:string}
        setMessages(prev => [...prev, message])
    },[])

    return (
        <SocketContext.Provider value={{sendMessage,messages}}>
            {children}
        </SocketContext.Provider>
    )
}