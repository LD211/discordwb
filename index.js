require("dotenv/config");
const { Client, IntentsBitField } = require("discord.js");
const fs = require("fs");
let wordContents; //containts word list
let promptContents; //containts prompt list
let prompt;
let consecutiveFlag = true;
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => console.log(`${client.user.username} is online.`));
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== "1118929349052219565") return;
  if (prompt && consecutiveFlag) {
    message.reply("the prompt is " + prompt);
    consecutiveFlag = false;
  }
  if (interpretWord(message.content.toUpperCase())) {
    message.reply("you have solved" + " " + prompt);
    generateNewPrompt();
    setTimeout(() => {
      message.reply("your prompt is " + prompt);
    }, 3000);
  }
});

fs.readFile("./wordsFolder/wordprompt.txt", "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  promptContents = data.split(/\r?\n/);
  prompt = promptContents[randomNumber(promptContents.length - 1)];
});

fs.readFile("./wordsFolder/words.txt", "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  wordContents = data.split(/\r?\n/);
});

function generateNewPrompt() {
  prompt = promptContents[randomNumber(promptContents.length - 1)];
}

function randomNumber(max) {
  return Math.floor(Math.random() * 4000) + 1; //can change to max if you want
}

function interpretWord(message) {
  for (let i = 0; i < wordContents.length; i++) {
    if (wordContents[i] === message && new RegExp(prompt).test(message)) {
      return true;
    }
  }
  return false;
}

client.login(process.env.TOKEN);
