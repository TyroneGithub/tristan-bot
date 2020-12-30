require('dotenv').config()

function playAudio(voiceChannel, path, name){
  if (voiceChannel){
    voiceChannel.join()
      .then(connection =>{
        let audio = path.concat(name + '.mp3')
        const dispatcher = connection.play(audio);
        dispatcher.pause();
        dispatcher.resume();
        dispatcher.on('finish', ()=>{
          console.log('audio finished')
          connection.disconnect();
        })
      })
      .catch((err)=>{
        console.log(err)
    });
  }
}

function getRandomAudio(){

  let fs = require ('fs')
  const audioPath = './assets/audio/'
  const directories = fs.readdirSync(audioPath);

  let pathIndex =  Math.floor(Math.random() * directories.length);
  const filePath = audioPath + directories[pathIndex] + '/'

  const files =  fs.readdirSync(filePath);
  let fileIndex = Math.floor(Math.random() * files.length);
  const fileName =files[fileIndex].split(".")
  
  return [filePath, fileName]

}


const Discord = require('discord.js');

const config = require('./config.json');
let prefix = config.prefix;
const commands = config.commands;
const phrases = config.phrases;
const paths = config.paths;
const client = new Discord.Client();

client.once('ready', () =>{
  console.log('Ready!');
});

client.login(process.env.TOKEN)

client.on('message', async message=>{
  let voiceChannel = message.member.voice.channel
  let messageContent = message.content
  let [command, name] = messageContent.split(" ");
  // console.log(command)

  if (command == prefix + 'ping'){
    message.channel.send('pong');
  } 
  else if (command == prefix + commands.bro){
    message.channel.send('yo katip bro');
  }
  else if (command == prefix + commands.yosi){
    message.channel.send('tara yosi yung galing probinsya');
  }
  else if (command == prefix + commands.randomPhrase){
    let index = Math.floor(Math.random() * phrases.length);
    message.channel.send(phrases[index])
  }
  else if (command == prefix + commands.fuckYou){
    playAudio(voiceChannel, paths.fuckYou, name)
  } 
  else if (command == prefix + commands.tanginamo){
    playAudio(voiceChannel, paths.tanginamo, name)
  } 
  else if (command == prefix + commands.jaenier){
    let fs = require ('fs')
    const files = fs.readdirSync(paths.jaenier);
    const audios = files.map((file) => {
      return file.split(".")[0] 
    });
    let index = Math.floor(Math.random() * audios.length)
    playAudio(voiceChannel, './assets/audio/jaenier/', audios[index])
  }
  else if (command == prefix + commands.randomMura){
    const [filePath, fileName] = getRandomAudio()
    console.log(filePath, fileName)
    playAudio(voiceChannel, filePath, fileName[0])

  }
})