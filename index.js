const http = require("http"),
  express = require("express"),
  fs = require("fs"),
  { Server } = require("socket.io"),
  //{ MongoClient } = require("mongodb"),
  path = require("path"),
  dotenv = require("dotenv"); //{Schema, Model} = require('mongoose');

// configurar dotenv para variáveis de processo
dotenv.config();

// const mongoServer = new MongoClient("mongodb://127.0.0.1:27017");

// async function run() {
//   await server.connect();

//   const db = server.db("emp");
//   const collection = db.collection("notes");

//   // data = await collection.findOne();

//   // console.log(data);

//   collection
//     .findOne()
//     .then((data) => console.log(data))
//     .catch((error) => console.error(error));
// }

//run();

// Criamos um servidor http, um app express e um socket io
// e uma porta de conexão
const app = express();
const server = http.createServer(app);
const io = new Server(server);
porta = process.env.PORTA;

// definir caminhos (paths) que o aplicativo precisa
const viewsFolder = path.join(process.cwd(), "./", "client");
const staticFolder = path.join(process.cwd(), "./", "client", "static");

// server a espera de clientes na porta definida
server.listen(porta, () =>
  console.log(
    `Servidor a espera de clientes na porta definida, porta: ${porta}`
  )
);

// express app middleware configuration
app.use(express.static(staticFolder));

// app.use("/", (req, res, next) => {
//     console.log("Hello Express App");
//     next(); // vai para próximas etapas no código
// })

/***** Testando usando console.log() function ******/
// fs.readdir(path.join(staticFolder, "images", "gallery"), (error, files) => {
//     console.log(files);
// })

const getFiles = async (folderName) => {
  function files() {
    return new Promise((resolve, reject) => {
      fs.readdir(folderName, (error, files) => {
        if (error) {
          reject("An Error Occured while getting the files' names!");
        } else {
          resolve(files);
        }
      });
    });
  }

  const data = await files(folderName);
  //console.log(data);
  return data;
};

// calling the promise-returning function getFiles()

/***** Testando usando console.log() function ******/

// routes para o applicativo express
app.get("/", (req, res) => {
  console.log(`O Servidor recebeu um pedido para a página ${req.url}`);

  res.sendFile(path.join(viewsFolder, "index.html"));
});

app.get("/getFilesLength", async (req, res) => {
  /******** Testando folder Content and send it to the client */
  let folderName = path.join(staticFolder, "images", "gallery");
  const folderContent = await getFiles(folderName);
  //res.setHeader("filesLength", folderContent.length)

  res.send(String(folderContent.length));
});

app.get("/getFiles", async (req, res) => {
  const index = req.headers.index;
  //console.log(index);

  /******** Testando folder Content and send it to the client */
  let folderName = path.join(staticFolder, "images", "gallery");
  const folderContent = await getFiles(folderName);
  //console.log(folderContent);
  /******** Testando folder Content */
  res.send(fs.readFileSync(path.join(folderName, folderContent[index])));

  //next(); // go to the next code in chain code
});
