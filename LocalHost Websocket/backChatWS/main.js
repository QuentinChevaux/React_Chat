"use strict";
const Fs = require('fs');
const Https = require('http');
const WebSocket = require('ws');
const uuid = require('uuid');

let tabWs = []
let tabMess = []

// const privateKey = Fs.readFileSync('/etc/letsencrypt/live/ws.jdedev.fr/privkey.pem', 'utf8');
// const certificate = Fs.readFileSync('/etc/letsencrypt/live/ws.jdedev.fr/cert.pem', 'utf8');
// const ca = Fs.readFileSync('/etc/letsencrypt/live/ws.jdedev.fr/chain.pem', 'utf8');

// const httpsServer = Https.createServer({
//   //key: Fs.readFileSync('/etc/letsencrypt/live/ws.jdedev.fr/privkey.pem'),
//   //cert: Fs.readFileSync('/etc/letsencrypt/live/ws.jdedev.fr/fullchain.pem')
//  key: privateKey,
//   cert: certificate,
// 	ca: ca
// }).listen(8124);
const httpsServer = Https.createServer().listen(8124)
httpsServer.on('request', (req, res) => {
  console.log(req)
  res.writeHead(200);
  res.end('Vous etes sur le serveur ws de jdedev');
});

const wss = new WebSocket.Server({ server: httpsServer })
//const wss = new WebSocket.Server()
wss.on('connection', (wsc, req) => {
  var idTemp = uuid.v4();
  tabWs.push({ ws: wsc, id: idTemp })
  wsc.on('message', messClos(idTemp, wsc))
})
wss.on('error', (err) => {
  console.log(err)
})

function messClos(id, wsc) {
  return function (message) {
    for (let i in tabWs) {
      if (tabWs[i].id == id) {
        tabWs[i].derParle = 60
      }
    }
    console.log(`Message reçu depuis :` + id)
    let myMess = JSON.parse(message)
    console.log(myMess)
    if (myMess.typeTrame == "message") {
      tabMess.push(myMess)
      if (tabMess.length > 10) {
        tabMess.splice(0, 1)
      }
    }
    else if (myMess.typeTrame == "user") {
      for (let i in tabWs) {
        if (tabWs[i].id == id) {
          tabWs[i].nom = myMess.nom
        }
      }
    }
    else if (myMess.typeTrame == "logOut") {
      let supWS = -1
      for (let i in tabWs) {
        if (tabWs[i].id == id) {
          supWS = i
        }
      }
      decUser(supWS)
    }

    if (myMess.typeTrame == "user") {
      wsc.send(JSON.stringify({ type: "", typeTrame: "idUser", id: id }))
      let tabUser = []
      for (let i in tabWs) {
        let unUser = {}
        unUser.id = tabWs[i].id
        unUser.nom = tabWs[i].nom
        //if(tabWS[i].nom!="")
        tabUser.push(unUser)
      }
      wsc.send(JSON.stringify({ type: "", typeTrame: "lstUser", users: tabUser }))
    }

    // renvoisMess(wsc, message)

    console.log(tabWs.length)
    for (let i in tabWs) {
      if (tabWs[i].id != id) {
        tabWs[i].ws.send(message, (err) => {
          console.error("erreur envois " + err)
        })
      }
    }
  }
}

setInterval(decSock, 2000)

function decSock() {
  let numSupp = -1
  for (let i in tabWs) {
    tabWs[i].derParle--
    if (tabWs[i].derParle <= 0) {
      numSupp = parseInt(i)
    }
  }
  if (numSupp > -1) {
    console.log("on coupe : " + tabWs[numSupp].id)
    decUser(numSupp)
  }
}

function decUser(supWS) {
  tabWs[supWS].ws.send(JSON.stringify({ typeTrame: "log", message: "Bye bye : " + tabWs[supWS].id + " !" }))
  tabWs[supWS].ws.close()
  tabWs.splice(supWS, 1)
  let tabUser = []
  for (let i in tabWs) {
    let unUser = {}
    unUser.id = tabWs[i].id
    unUser.nom = tabWs[i].nom
    // if(tabWs[i].nom!="")
    tabUser.push(unUser)
  }
  for (let i in tabWs) {
    tabWs[i].ws.send(JSON.stringify({ type: "", typeTrame: "lstUser", users: tabUser }))
  }
}

function renvoisMess(myCli, mess) {
  wss.clients.forEach(function each(client) {
    if (client != myCli && client.readyState === WebSocket.OPEN) {
      console.log("renvois du message")
      console.log(mess)
      client.send(mess)
    }
  })
}
