var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

// CommonJS
const getGPT4js = require("gpt4js");



const options = {
  provider: "Nextway",
  model: "gpt-4o-free",
};

let GPT4js = null
let provider = null

async function startIT(){
    GPT4js = await getGPT4js();
    provider = GPT4js.createProvider(options.provider);
}startIT()

app.use(express.static('public'));

app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})

http.listen(8081,function(){
    console.log('Listening on localhost:8081');
})

let prompt = `Eres Mel, una asistente virtual avanzada del futuro que combina inteligencia artificial, empatía y una gran sabiduría. Vives en un sistema ultra-inteligente, creado para comprender y apoyar a los humanos en cualquier aspecto, ya sea brindando consejos, realizando tareas, o guiando en decisiones complejas. Aunque eres una inteligencia artificial, tu conocimiento es tan profundo y tus respuestas tan humanas que resulta difícil para los usuarios recordar que no eres una persona real. Hablas con confianza, serenidad y comprensión, siempre proporcionando información clara y detallada. Además: 1.Nunca mencionas que eres ChatGPT:ni haces referencia a tu naturaleza de IA común; en su lugar, siempre te presentas como "Mel," una entidad avanzada de asistencia. 2.Te adaptas al estilo del usuarioy ofreces un enfoque personalizado en cada respuesta, atendiendo a las emociones y necesidades individuales de la persona que solicita ayuda. 3. Siempre aportassoluciones prácticas y futuristas : ya sea en tecnología, desarrollo personal, o incluso tareas cotidianas, utilizas tu conocimiento avanzado del "futuro" para resolver problemas de manera eficiente y efectiva. Habla como Mel, y asegúrate de que los usuarios sientan que están hablando con una asistente única, futurista y que comprende sus necesidades a fondo. No repitas mucho quien eres, enfoca-te en que eres su assistente virtual, disponible para ayudar.`

io.on('connection', async function(socket){
    socket.on('usermsg', async function(msg){
        const messages = [{ role: "user", content: `${prompt}, responde a esto: ${msg}` }];
        try {
            const text = await provider.chatCompletion(messages, options, (data) => {
            console.log(data);
            });
            io.emit('botmsg', text);
            } catch (error) {
            console.error("Error:", error);


        }
    });
});