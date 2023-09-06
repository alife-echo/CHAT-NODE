import express,{Request,Response} from 'express'
import path from 'path'
import http from 'http'
import {Socket, Server as SocketIOServer} from 'socket.io'

interface CustomSocket extends Socket {
    username?: string;  // quando uma propriedad não existe em uma função, voce pode criar um interface herdando os types daquela função e adicionando sua propriedade/variavel
}

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server) //criação de um server socket io

app.use(express.static(path.join(__dirname,'../public')))
server.listen(3000)

//quando estou no server e emito uma mensagem quem recebe eo cliente
//quando estou no cliente e emito uma mensagem quem recebe é o servidor

let connectedUsers:string[] = []
// on = listener ou seja caso algo especificado aconteça o meu servidor vai escutar e executar algo
io.on('connection',(socket:CustomSocket)=>{  //quando a função io rodar no main.js, essa função de conexão sera chamada
    console.log('Conexão de socket detectada...')
    socket.on('join-request',(username:string)=>{ // quando o servidor receber uma mensagem chamada 'join-request' ele vai executar uma função. nessa caso executamos funão e passamos o nome do usuario
        socket.username = username  //adioconando uma variavel chamada username ao socket, para quando tiver o servidor pegar o nome do usuario
        connectedUsers.push(username) // adiciono o usuario a uma lista
        console.log(connectedUsers)
        socket.emit('user-ok',connectedUsers) // respondo com 'user-ok' enviando a lista de usuarios
        socket.broadcast.emit('list-update',{
             joined:username,
             list:connectedUsers
        }) // mando a mensagem pra todo mundo menos aquele usuario em especifico
    })

    socket.on('disconnect',()=>{
        connectedUsers = connectedUsers.filter(u => u != socket.username) // quando houver um usuario fechar a guia, eu pego o nome do usuario e retiro da lista
        console.log(connectedUsers)
        socket.broadcast.emit('list-update',{ // mando um emmit para atualizar a lista
            left:socket.username, // passo o usuario que saiu
            list:connectedUsers // e a lista de usuarios atualizada
        })
    })

    socket.on('send-msg',(txt:string)=>{
         let obj = {
            username:socket.username,
            message:txt
         }
         socket.emit('show-msg',obj)
         socket.broadcast.emit('show-msg',obj)
    })
})