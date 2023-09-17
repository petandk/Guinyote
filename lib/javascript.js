import * as handFunctions from "./handFunctions.js";
import * as deckFunctions from "./deckFunctions.js";

const deck = document.querySelector("#deck");
const welcomeMessage = document.querySelector("#welcome");
const cantarButton = document.querySelector("#cantar");
const switch7Button = document.querySelector("#switch7");
const customizeButton = document.querySelector("#customize");
const computer1Area = document.querySelector("#computer1");
const computer2Area = document.querySelector("#computer2");
const computer3Area = document.querySelector("#computer3");
const playerArea = document.querySelector("#player");
const playerCards = document.querySelectorAll(".playerCard");
const mainSuit = document.querySelector("#mainSuit");
let mainSuitCard;
let mainSuitValue = "";
const playerCardPlayed = document.querySelector("#playedCard4");
const computer1CardPlayed = document.querySelector("#playedCard1");
const computer2CardPlayed = document.querySelector("#playedCard2");
const computer3CardPlayed = document.querySelector("#playedCard3");
let playerHand = null;
let computer1Hand = null;
let computer2Hand = null;
let computer3Hand = null;
const playedCardsArea = [
  playerCardPlayed,
  computer1CardPlayed,
  computer2CardPlayed,
  computer3CardPlayed,
];
let dispenseAreas = [playerArea, computer3Area, computer2Area, computer1Area];
let playersOrder = [playerHand, computer3Hand, computer2Hand, computer1Hand];
const rootElement = document.documentElement;
let selectedBackground = "mexican";
let selectedForeground = "spanish";
let suffledDeck = [];
const deckSize = 40;
let deckPosition;
let roundCards = [];
let team1 = ["player", "computer2"];
let team2 = ["computer1", "computer3"];
let winStack1 = [];
let winStack2 = [];

switch7Button.addEventListener("click", () => {});
customizeButton.addEventListener("click", () => {
  document.querySelector("#configPopup").style.display = "block";
});

deck.addEventListener("click", clickHandler);
function clickHandler() {
  welcomeMessage.style.display = "none";
  deck.removeEventListener("click", clickHandler);
  letsPlay();
}

function letsPlay() {
  const playingDeck = deckFunctions.suffleDeck();
  let deckPosition = 0;
  let delayTime = 1000;
  deckFunctions.setDeckSize();
  let playerHands = handFunctions.createHands();
  deckFunctions.startGameDispenseCardsTwoTimes(playerHands, delayTime);
  const waitForDispenseToFinish = playerHands.length * delayTime * 2;
  delay(waitForDispenseToFinish).then(() => {
    handFunctions.orderHandsByValue(playerHands);
  });
  delay(waitForDispenseToFinish + 500)
    .then(() => deckFunctions.playingCards())
    .then(() => deckFunctions.deatMatch())
    .then(() => deckFunctions.countPoints());
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/*
console.log('Hello');
delay(2000).then(() => { console.log('World!'); });
*/
