import * as deckFunctions from "./deckFunctions.js";
const allPlayers = ["player", "computer3", "computer2", "computer1"];
const playerArea = document.querySelector("#player");
const computer1Area = document.querySelector("#computer1");
const computer2Area = document.querySelector("#computer2");
const computer3Area = document.querySelector("#computer3");
const allAreas = [playerArea, computer3Area, computer2Area, computer1Area];
const playerCardIngame = document.querySelector("#playedCard4");
const computer1CardIngame = document.querySelector("#playedCard1");
const computer2CardIngame = document.querySelector("#playedCard2");
const computer3CardIngame = document.querySelector("#playedCard3");
const mainSuitCard = document.querySelector("#mainSuit");
let allHands = [];
let mainSuit = "";
let userHand = [];
let playedCards = [];

export function setPlayersHand(player, area) {
  let playerHand = [player, area, []];
  return playerHand;
}
export function createHands() {
  allHands = [];
  for (let index = 0; index < 4; index++) {
    allHands.push(setPlayersHand(allPlayers[index], allAreas[index]));
  }
  return allHands;
}
export function getHands() {
  return allHands;
}
export function addCard(hand, card) {
  hand[2].push(card);
}
export function createCard(hand, index, card) {
  //[player,area, [card,card,card]];
  const area = hand[1];
  if (index == null) {
    index = hand[2].length;
  }
  const cardSpan = document.createElement("span");
  cardSpan.id = index.toString() + hand[0];
  if (hand[0] == "player") {
    cardSpan.className = "playerCard centerImage";
    cardSpan.style.backgroundImage = `url(${card.getImagePath()})`;
  }
  if (hand[0] != "player") {
    cardSpan.className = "card";
  }

  area.appendChild(cardSpan);
}
export function createMainSuit(card) {
  const area = mainSuitCard;
  const cardSpan = document.createElement("span");
  cardSpan.id = "mainSuitCard";
  cardSpan.classList.add("card", "centerImage");
  cardSpan.style.backgroundImage = `url(${card.getImagePath()})`;
  mainSuit = card.getSuit();
  area.appendChild(cardSpan);
  //after the mainSuit is created, all is ready to play so I can show the buttons
  toggleButtons();
}
export function toggleButtons() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.classList.toggle("hidden");
  });
}
export function orderHandsByValue(playerHands) {
  playerHands.forEach((player) => {
    //[player,area, [card,card2,card3]]; player[2] are the cards
    let len = player[2].length;
    for (let i = 0; i < len - 1; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
        let pointsA =
          player[2][j].getSuit() == mainSuit
            ? player[2][j].points + 50
            : player[2][j].points;
        let pointsB =
          player[2][j + 1].getSuit() == mainSuit
            ? player[2][j + 1].points + 50
            : player[2][j + 1].points;
        if (pointsA > pointsB) {
          const temp = player[2][j];
          player[2][j] = player[2][j + 1];
          player[2][j + 1] = temp;
        }
      }
    }
    if (player[0] == "player") userHand = player; //I save the player hand in a global variable so I can use it on playCard function.
    const area = player[1];
    area.innerHTML = "";
    player[2].forEach((card, index) => {
      createCard(player, index + 1, card);
    });
  });
}
export function playerPlaysCard(event) {
  const selectedCard = event.target;
  const playerCards = Array.from(playerArea.querySelectorAll("span"));
  const seletedIndex = playerCards.indexOf(selectedCard);
  const userCardThatCorrespondsToSelectedIndex = userHand[2][seletedIndex];
  deckFunctions.removeCardFromHand(seletedIndex);
  playedCards.push(userCardThatCorrespondsToSelectedIndex);
  selectedCard.remove();
  playerCardIngame.style.backgroundImage = `url(${userCardThatCorrespondsToSelectedIndex.getImagePath()})`;
  playerCardIngame.classList.add("border");
  playerCards.forEach((card) => {
    card.removeEventListener("click", playerPlaysCard);
  });
}
export function computerPlaysCard(hand) {
  const computer = hand[0];
  const computerCardsArea = hand[1];
  const computerCardToPlay = hand[2][0];
  const firstComputerChild = computerCardsArea.firstChild;
  playedCards.push(computerCardToPlay);
  computerCardsArea.removeChild(firstComputerChild);
  if (computer == "computer1") {
    computer1CardIngame.style.backgroundImage = `url(${computerCardToPlay.getImagePath()})`;
    computer1CardIngame.classList.add("border");
  }
  if (computer == "computer2") {
    computer2CardIngame.style.backgroundImage = `url(${computerCardToPlay.getImagePath()})`;
    computer2CardIngame.classList.add("border");
  }
  if (computer == "computer3") {
    computer3CardIngame.style.backgroundImage = `url(${computerCardToPlay.getImagePath()})`;
    computer3CardIngame.classList.add("border");
  }
  hand[2].splice(0, 1);
}
export function playerPlaysDeathMatch(event) {
  // if playedcards > 0, the selected card must be a a roundSuit or a mainSuit card, if it cannot, if teamplayer is winning and playedcards == 3, can play a card with hight points.
  const selectedCard = event.target;
  const playerCards = Array.from(playerArea.querySelectorAll("span"));
  const seletedIndex = playerCards.indexOf(selectedCard);
  const userCardThatCorrespondsToSelectedIndex = userHand[2][seletedIndex];
  deckFunctions.removeCardFromHand(seletedIndex);
  playedCards.push(userCardThatCorrespondsToSelectedIndex);
  selectedCard.remove();
  playerCardIngame.style.backgroundImage = `url(${userCardThatCorrespondsToSelectedIndex.getImagePath()})`;
  playerCardIngame.classList.add("border");
  playerCards.forEach((card) => {
    card.removeEventListener("click", playerPlaysCard);
  });
}
export function computerPlaysDeathMatch(hand) {
  const computer = hand[0];
  const computerCardsArea = hand[1];
  const computerCardToPlay = hand[2][0]; //CHANGE!!!! if playedcards>0, computer should play a roundSuit or a mainSuit card, if it cannot, if teamplayer is winning and playedcards == 3, can play a card with hight points.
  const firstComputerChild = computerCardsArea.firstChild;
  playedCards.push(computerCardToPlay);
  computerCardsArea.removeChild(firstComputerChild);
  if (computer == "computer1") {
    computer1CardIngame.style.backgroundImage = `url(${computerCardToPlay.getImagePath()})`;
    computer1CardIngame.classList.add("border");
  }
  if (computer == "computer2") {
    computer2CardIngame.style.backgroundImage = `url(${computerCardToPlay.getImagePath()})`;
    computer2CardIngame.classList.add("border");
  }
  if (computer == "computer3") {
    computer3CardIngame.style.backgroundImage = `url(${computerCardToPlay.getImagePath()})`;
    computer3CardIngame.classList.add("border");
  }
  hand[2].splice(0, 1);
}
export function getPlayedCards() {
  return playedCards;
}
export function removePlayedCards() {
  playedCards = [];
}
export function getMainSuit() {
  return mainSuit;
}
