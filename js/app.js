/**
 * app.js
 *
 * The entry point for JavaScript. Delegates to /js/visuals.js for drawing Bob
 * on the screen, and to /js/conversation.js for Bob's conversational behaviour.
 */
let canvas;
let chatLog;
let voiceSelect;
let bob;
let avatar;







let bot = new RiveScript();
let riveLoaded = false;
bot.loadFile('js/bot.rive').then(loading_done).catch(loading_error);

function loading_done() {
  console.log("Bot is loaded.");
  riveLoaded = true;
  bot.sortReplies();
}

function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}

function riveChat(message) {
  if (riveLoaded) {
    bot.reply('local-user', message).then(reply => console.log(reply));
  } else {
    console.log('Wait a second while we get things up and running...');
  }
}









/**
 * Initializes all of the variables needed for Bob to run
 *
 * Called by p5.js
 */
function setup() {
  canvas = createCanvas(500, 500);
  canvas.parent('bob-container');
  chatLog = createElement('ul');

  bob = new KingBobIII();
  bob.handleSpeechRecognized = chat;
  bob.onSpeak = speech => logMessage('BOB', speech);
  bob.listen();

  voiceSelect = createSelect();
  voiceSelect.parent('option-container');

  bob.voice.onLoad = () => {
    for (let voice of bob.voice.voices) {
      voiceSelect.option(voice.name);
    }

    voiceSelect.elt.selectedIndex = 1;
  };

  voiceSelect.changed(() => {
    bob.setVoice(voiceSelect.value());
  });

  avatar = new KingBobIIIPresenter(bob);
}

/**
 * Draws a single frame
 *
 * Called by p5.js
 */
function draw() {
  background(BACKGROUND_COLOUR);
  avatar.draw();
}

/**
 * Logs a message to the screen
 *
 * @param speaker  The name of the person who said the message
 * @param message  The message that was uttered
 */
function logMessage(speaker, message) {
  let el = createElement('li', `${speaker}: ${message}`);
  el.parent(chatLog);
  chatLog.elt.scrollTo(0, chatLog.elt.scrollHeight);
}
