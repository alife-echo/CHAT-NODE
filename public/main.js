
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
socket.on('user-ok',(listUsers)=>{ //--> quando o cliente receber um user-ok eu executo uma função que pega a lista de usuarios
    loginPage.style.display = 'none'
    chatPage.style.display = 'flex'
    textInputChat.focus()
    userList = listUsers
    renderUserList()
})