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
    message.reply(
      "<:wordbomb:1119094039258595369> **Quick!** type a word containing:\n\n" +
        prompt,
    );
    consecutiveFlag = false;
  }
  if (interpretWord(message.content.toUpperCase())) {
    const solvedWord = generateSolvedWord(message.content.toUpperCase());
    if (solvedWord == message.content.toUpperCase()) {
      message.reply(
        ":confetti_ball: Correct! :confetti_ball: good job! \n\n lucky! this prompt was generated from " +
          solvedWord,
      );
    }
    message.reply(
      ":confetti_ball: Correct! :confetti_ball: good job!\n\n this prompt was generated from: " +
        solvedWord,
    );
    generateNewPrompt();
    setTimeout(() => {
      message.reply(
        "<:wordbomb:1119094039258595369> **Quick!** type a word containing:\n\n" +
          prompt,
      );
    }, 3000);
  }
});

fs.readFile("./wordsFolder/wordprompt.txt", "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  promptContents = data.split(/\r?\n/);
  prompt = promptContents[randomNumber(2000)];
});

fs.readFile("./wordsFolder/words.txt", "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  wordContents = data.split(/\r?\n/);
});

function generateSolvedWord(message) {
  let listOfAnswers = [];
  for (let i = 0; i < wordContents.length; i++) {
    if (new RegExp(prompt).test(wordContents[i])) {
      listOfAnswers.push(wordContents[i]);
    }
  }
  console.log(listOfAnswers);
  return listOfAnswers[randomNumber(listOfAnswers.length - 1)];
}

function generateNewPrompt() {
  prompt = promptContents[randomNumber(4000)];
}

function randomNumber(max) {
  return Math.floor(Math.random() * max) + 1; //can change to max if you want
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
