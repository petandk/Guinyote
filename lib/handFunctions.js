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
const cantarButton = document.querySelector("#cantar");
const cantarText = document.querySelector("#cantarText");
const switch7 = document.querySelector("#switch7");
let allHands = [];
let mainSuit = "";
let mainsuitPoints;
let mainSuitAux;
let userHand = [];
let playedCards = [];
let nayar = false;
let cantar20 = [];
let cantar40 = "";
let mainSuitValue = 0;
let queenAndKingArray = [false, false, false, false];
cantarButton.addEventListener("click", () => {
  console.log("canta");
  checkIfKingAndQueen(allHands, true);
});
export function isNayar(isit) {
  nayar = isit;
}
switch7.addEventListener("click", () => {
  checkIfSeven(allHands, true);
});
export function cantarTextRemove() {
  cantarText.innerHTML = "";
}
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
    cardSpan.classList.add("card");
    if (nayar) {
      cardSpan.classList.add("centerImage");
    } else {
      cardSpan.classList.remove("centerImage");
    }
  }

  area.appendChild(cardSpan);
}
export function createMainSuit(card) {
  const area = mainSuitCard;
  const cardSpan = document.createElement("span");
  cardSpan.id = "mainSuitCard";
  cardSpan.classList.add("card", "centerImage");
  cardSpan.style.backgroundImage = `url(${card.getImagePath()})`;
  mainSuitValue = card.getValue();
  mainsuitPoints = card.getPoints();
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

  checkIfKingAndQueen(playerHands);
  checkIfSeven(playerHands);
}
export function checkIfSeven(playerHands, playerSwitch = false) {
  playerHands.forEach((player) => {
    if ((player[0] == "player" && playerSwitch) || player[0] != "player") {
      const sevenCardIndex = player[2].findIndex(
        (card) =>
          card.getValue() == 7 &&
          card.getSuit() == mainSuit &&
          mainsuitPoints > 7
      );
      if (sevenCardIndex != -1) {
        const suffledDeck = deckFunctions.getSuffledDeck();
        mainSuitCard.removeChild(mainSuitCard.firstChild);
        createMainSuit(player[2][sevenCardIndex]);
        const spantToRemove = player[1].children[sevenCardIndex];
        player[1].removeChild(spantToRemove);
        deckFunctions.dispenseCard(
          player,
          suffledDeck[suffledDeck.length - 1],
          true
        );
        suffledDeck[suffledDeck.length - 1] == player[2][sevenCardIndex];
      }
    }
  });
}
export function checkIfKingAndQueen(playerHands, playerCanta = false) {
  let orosKingAndQueen;
  let copasKingAndQueen;
  let espadasKingAndQueen;
  let bastosKingAndQueen;
  cantarText.innerHTML = "";
  playerHands.forEach((player) => {
    if (player[0] != "player" || playerCanta) {
      orosKingAndQueen =
        player[2].filter((card) => {
          return (
            card.getImageName() == "oros12.png" ||
            card.getImageName() == "oros10.png"
          );
        }).length == 2;
      copasKingAndQueen =
        player[2].filter((card) => {
          return (
            card.getImageName() == "copas12.png" ||
            card.getImageName() == "copas10.png"
          );
        }).length == 2;
      espadasKingAndQueen =
        player[2].filter((card) => {
          return (
            card.getImageName() == "espadas12.png" ||
            card.getImageName() == "espadas10.png"
          );
        }).length == 2;
      bastosKingAndQueen =
        player[2].filter((card) => {
          return (
            card.getImageName() == "bastos12.png" ||
            card.getImageName() == "bastos10.png"
          );
        }).length == 2;
    }
    if (
      (orosKingAndQueen && mainSuit == "oros") ||
      (copasKingAndQueen && mainSuit == "copas") ||
      (espadasKingAndQueen && mainSuit == "espadas") ||
      (bastosKingAndQueen && mainSuit == "bastos")
    ) {
      let palo = "";
      if (orosKingAndQueen && queenAndKingArray[0] == false) {
        queenAndKingArray[0] = true;
        const lineToAdd = `${player[0]} canta las 40`;
        cantar40 = player[0];
        cantarText.innerHTML += "<br>" + lineToAdd;
      }
      if (copasKingAndQueen && queenAndKingArray[1] == false) {
        queenAndKingArray[1] = true;
        const lineToAdd = `${player[0]} canta las 40`;
        cantar40 = player[0];
        cantarText.innerHTML += "<br>" + lineToAdd;
      }
      if (espadasKingAndQueen && queenAndKingArray[2] == false) {
        queenAndKingArray[2] = true;
        const lineToAdd = `${player[0]} canta las 40`;
        cantar40 = player[0];
        cantarText.innerHTML += "<br>" + lineToAdd;
      }
      if (bastosKingAndQueen && queenAndKingArray[3] == false) {
        queenAndKingArray[3] = true;
        const lineToAdd = `${player[0]} canta las 40`;
        cantar40 = player[0];
        cantarText.innerHTML += "<br>" + lineToAdd;
      }
    }
    if (
      (orosKingAndQueen && mainSuit != "oros") ||
      (copasKingAndQueen && mainSuit != "copas") ||
      (espadasKingAndQueen && mainSuit != "espadas") ||
      (bastosKingAndQueen && mainSuit != "bastos")
    ) {
      let palo = "";
      if (
        orosKingAndQueen &&
        mainSuit != "oros" &&
        queenAndKingArray[0] == false
      ) {
        palo = "oros";
        const lineToAdd = `${player[0]} canta las 20 en ${palo}`;
        cantar20.push(player[0]);
        cantarText.innerHTML += "<br>" + lineToAdd;
        queenAndKingArray[0] = true;
      }
      if (
        copasKingAndQueen &&
        mainSuit != "copas" &&
        queenAndKingArray[1] == false
      ) {
        palo = "copas";
        const lineToAdd = `${player[0]} canta las 20 en ${palo}`;
        cantar20.push(player[0]);
        cantarText.innerHTML += "<br>" + lineToAdd;
        queenAndKingArray[1] = true;
      }
      if (
        espadasKingAndQueen &&
        mainSuit != "espadas" &&
        queenAndKingArray[2] == false
      ) {
        palo = "espadas";
        const lineToAdd = `${player[0]} canta las 20 en ${palo}`;
        cantar20.push(player[0]);
        cantarText.innerHTML += "<br>" + lineToAdd;
        queenAndKingArray[2] = true;
      }
      if (
        bastosKingAndQueen &&
        mainSuit != "bastos" &&
        queenAndKingArray[3] == false
      ) {
        palo = "bastos";
        const lineToAdd = `${player[0]} canta las 20 en ${palo}`;
        cantar20.push(player[0]);
        cantarText.innerHTML += "<br>" + lineToAdd;
        queenAndKingArray[3] = true;
      }
    }
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
  const selectedCard = event.target;
  if (playedCards.length > 0) {
    const playerCards = Array.from(playerArea.querySelectorAll("span"));
    const seletedIndex = playerCards.indexOf(selectedCard);
    const userCardThatCorrespondsToSelectedIndex = userHand[2][seletedIndex];
    const playerCardIsValid = isAValidCard(
      userCardThatCorrespondsToSelectedIndex,
      userHand
    );
    if ((playerCards.length = 0)) {
      playerCardIsValid = true;
    }
    if (playerCardIsValid) {
      deckFunctions.removeCardFromHand(seletedIndex);
      playedCards.push(userCardThatCorrespondsToSelectedIndex);
      selectedCard.remove();
      playerCardIngame.style.backgroundImage = `url(${userCardThatCorrespondsToSelectedIndex.getImagePath()})`;
      playerCardIngame.classList.add("border");
      playerCards.forEach((card) => {
        card.removeEventListener("click", playerPlaysCard);
      });
    }
  } else {
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
}
export function isAValidCard(card, hand) {
  if (playedCards.length == 0) return true;
  let playerHasRoundSuit = false;
  let playerHasMainSuit = false;
  const roundSuit = playedCards[0].getSuit();
  let playerCardPoints = card.points;
  if (card.getSuit() == roundSuit) playerCardPoints += 20;
  if (card.getSuit() == mainSuit) playerCardPoints += 50;
  hand[2].forEach((card) => {
    if (card.getSuit() == roundSuit) playerHasRoundSuit = true;
    if (card.getSuit() == mainSuit) playerHasMainSuit = true;
  });
  let playedCardsPoints = [];
  playedCards.forEach((card) => {
    let cardPoints = 0;
    if (card.getSuit() == roundSuit) cardPoints = card.points + 20;
    if (card.getSuit() == mainSuit) cardPoints = card.points + 50;
    if (card.getSuit() != roundSuit || card.getSuit() != mainSuit)
      cardPoints = card.points;
    playedCardsPoints.push(cardPoints);
  });
  let playerCardIsValid = false;
  playedCardsPoints.forEach((points) => {
    if (
      playerHasRoundSuit &&
      card.getSuit() == roundSuit &&
      points < playerCardPoints
    )
      playerCardIsValid = true;
    if (
      playerHasMainSuit &&
      card.getSuit() == mainSuit &&
      points < playerCardPoints
    )
      playerCardIsValid = true;
    if (!playerHasMainSuit && !playerHasRoundSuit) playerCardIsValid = true;
  });
  return playerCardIsValid;
}
export function computerPlaysDeathMatch(hand) {
  const computer = hand[0];
  const computerCardsArea = hand[1];
  let computerCardToPlay;
  let computerCardIndex;
  if (playedCards.length > 0) {
    const computerCards = hand[2];
    const firstComputerChild = computerCardsArea.firstChild;
    computerCards.forEach((card, index) => {
      if (isAValidCard(card, hand)) {
        computerCardToPlay = card;
        computerCardIndex = index;
        return;
      }
    });
  } else {
    computerCardToPlay = hand[2][0];
    computerCardIndex = 0;
  }
  playedCards.push(computerCardToPlay);
  const childToRemove = computerCardsArea.childNodes[computerCardIndex];
  computerCardsArea.removeChild(childToRemove);
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
  hand[2].splice(computerCardIndex, 1);
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
export function getExtraPoints() {
  return [cantar20, cantar40];
}
