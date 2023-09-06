
const socket = io() // se for outro servidor, colocar a url dele neste parametro
let username = ''
let userList = []

let loginPage = document.querySelector('#loginPage')
let chatPage = document.querySelector('#chatPage')

let loginInput = document.querySelector('#loginNameInput')
let textInputChat = document.querySelector('#chatTextInput')


loginPage.style.display = 'flex'
chatPage.style.display = 'none'

function renderUserList(){
    let ul = document.querySelector('.userList')
    ul.innerHTML = ''
    userList.forEach(i => { 
         ul.innerHTML += `<li>${i}</li>`
    })
}
function addMessage(type,user,message){
    let ul = document.querySelector('.chatList')
    switch(type){
        case 'status':
            ul.innerHTML += `<li class='m-status'>${message}</li>`
        break
        case 'message':
            if(username == user){
                ul.innerHTML += `<li class='m-txt'><span class='me'>${user}</span>:${message}</li>`
            }
            else{
            ul.innerHTML += `<li class='m-txt'><span>${user}</span>:${message}</li>`
        }
        break
        }
        ul.scrollTop = ul.scrollHeight // sempre quando uma mensagem for adicionada a barra de rolagem sera jogada para o final
}
loginInput.addEventListener('keyup',(e)=>{
     if(e.keyCode === 13){
        let name = loginInput.value.trim() // retiro os espaços em branco
        if(name != ''){
            username = name
            document.title = `Chat (${username})`

            socket.emit('join-request',username) // no cliente eu emito uma mensagem chamada 'join-request' enviando o nome do usuario
        }
     }
})

textInputChat.addEventListener('keyup',(e)=>{
    if(e.keyCode === 13){
       let txt = textInputChat.value.trim()
       textInputChat.value = ''
       if( txt != ''){
           socket.emit('send-msg',txt)
       }
    }
})


socket.on('user-ok',(listUsers)=>{ //--> quando o cliente receber um user-ok eu executo uma função que pega a lista de usuarios
    loginPage.style.display = 'none'
    chatPage.style.display = 'flex'
    textInputChat.focus()
    addMessage('status',null,'Conectado!')
    userList = listUsers
    renderUserList()
})


socket.on('list-update',(data)=>{
    if(data.joined){
        addMessage('status',null,data.joined + ' entrou no chat.')
    }
    if(data.left){
        addMessage('status',null,data.left + ' saiu do chat.')
    }
     userList = data.list
     renderUserList()
})

socket.on('show-msg',(data)=>{
     addMessage('message',data.username,data.message)
})

socket.on('disconnect',()=>{
     addMessage('status',null,'Você foi desconectado!')
     userList=[]
     renderUserList()
})
socket.on('connect_error',()=>{
     addMessage('status',null,'Tentando reconectar...')
})
socket.io.on('reconnect',()=>{
     addMessage('status',null,'Reconectado!')
     if(username!=''){
        socket.emit('join-request',username)
     }
     
})