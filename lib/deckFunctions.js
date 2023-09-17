import card from "./card.js";
import * as handFunctions from "./handFunctions.js";
const rootElement = document.documentElement;
const backgrounds = document.getElementsByClassName("backPreview");
const previewBackground = document.getElementById("previewBack");
const foregrounds = document.getElementsByClassName("frontPreview");
const previewForeground = document.getElementById("previewFront");
const foregroundStyles = ["alternative", "colorful", "spanish", "poker"];
let selectedBackground = "mexican";
let selectedForeground = "spanish";
const aceptButton = document.querySelector("#previewButton");
let suffledDeck = [];
const deckSize = 41;
let deckPosition = 0;
let lastRoundWinner = "";
let auxHands = [];
let winDecks = ["team1", [], "team2", []];
[...backgrounds].forEach((element) => {
  element.addEventListener("click", () => {
    changeBackgroundDeckPattern(element);
  });
});
[...foregrounds].forEach((element) => {
  element.addEventListener("click", () => {
    changeForegroundDeckPattern(element);
  });
});

aceptButton.addEventListener("click", () => {
  updateForegroundImages(suffledDeck, ".playerCard");
  document.querySelector("#configPopup").style.display = "none";
});

export function changeBackgroundDeckPattern(element) {
  rootElement.style.setProperty(
    "--back-deck-image",
    getComputedStyle(element).backgroundImage
  );
  previewBackground.style.backgroundImage =
    getComputedStyle(element).backgroundImage;
  const allcards = document.querySelectorAll(".card");
  allcards.forEach((card) => {
    card.classList.toggle("centerImage", element.id == "nayar");
  });
  selectedBackground = element.id;
}
export function changeForegroundDeckPattern(element) {
  previewForeground.style.backgroundImage =
    getComputedStyle(element).backgroundImage;
  selectedForeground = element.id;
}

function createDeck() {
  const suits = ["oros", "copas", "espadas", "bastos"];
  const deckValues = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  const fullDeck = [];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < deckValues.length; j++) {
      const newCard = new card(suits[i], deckValues[j], selectedForeground);
      fullDeck.push(newCard);
    }
  }
  return fullDeck;
}

export function suffleDeck() {
  suffledDeck = [];
  deckPosition = 0;
  const newDeck = createDeck();
  while (suffledDeck.length < 40) {
    let number = Math.floor(Math.random() * 40);
    if (!suffledDeck.includes(newDeck[number])) {
      suffledDeck.push(newDeck[number]);
    }
  }
  return suffledDeck;
}
export function updateForegroundImages(deck, area) {
  //updateDeckCards
  deck.forEach((card) => {
    card.updateImageFolder(selectedForeground);
  });
  //update players cards
  changeForeground(area);
  //update suit card
  changeForeground("#mainSuitCard");
  //update table cards
  changeForeground(".playedCard");
}
export function changeForeground(area) {
  document.querySelectorAll(area).forEach((card) => {
    const path = getComputedStyle(card).backgroundImage;
    foregroundStyles.some((string) => {
      if (path.includes(string)) {
        path.replace(string, selectedForeground);
        card.style.backgroundImage = path.replace(string, selectedForeground);
      }
    });
  });
}

export function setDeckSize() {
  deck.innerHTML = "";
  for (let i = 0; i < deckSize; i++) {
    const newCard = document.createElement("div");
    deck.classList.remove("card");
    newCard.classList.add("card");
    let desplazamiento = 0.03;
    newCard.style.position = "absolute";
    newCard.style.left = `${-i * desplazamiento}em`;
    newCard.style.top = `${i * desplazamiento}em`;
    newCard.style.zIndex = (i - 1) * -1;
    deck.appendChild(newCard);
  }
}
export function removeDeckCard() {
  const topCard = deck.firstElementChild;
  if (topCard) {
    deck.removeChild(topCard);
  }
}
export function dispenseCard(player) {
  removeDeckCard();
  handFunctions.addCard(player, suffledDeck[deckPosition]);
  handFunctions.createCard(player, null, suffledDeck[deckPosition]);
  deckPosition++;
  if (deckPosition == 41) {
    const mainSuit = document.querySelector("#mainSuit");
    mainSuit.removeChild(mainSuit.firstChild);
  }
}
export function dispense3Cards(player, count = 0) {
  if (count < 3) {
    dispenseCard(player);
    dispense3Cards(player, count + 1);
  }
}
export function dispenseAllplayersInOrder(playerHands) {
  for (let i = 0; i < playerHands.length; i++) {
    (function (index) {
      setTimeout(() => {
        dispenseCard(playerHands[index]);
      }, index * 1000);
    })(i);
  }
}
export function startGameDispenseCards(playerHands, delay) {
  for (let i = 0; i < playerHands.length; i++) {
    setTimeout(() => {
      dispense3Cards(playerHands[i]);
    }, i * delay);
  }
}
export function startGameDispenseCardsTwoTimes(playerHands, delayTime) {
  startGameDispenseCards(playerHands, delayTime);
  setTimeout(() => {
    startGameDispenseCards(playerHands, delayTime);
  }, playerHands.length * delayTime);
  setTimeout(() => {
    setMainSuit();
  }, playerHands.length * delayTime * 2);
}
export function setMainSuit() {
  removeDeckCard();
  const suitCard = suffledDeck[deckPosition];
  handFunctions.createMainSuit(suitCard);
  deckPosition++;
  suffledDeck.push(suitCard);
  return suitCard;
}

export async function playingCards(round = 0, hands = [], winner = "player") {
  if (hands.length == 0) {
    hands = handFunctions.getHands();
  }
  auxHands = hands;
  const playerTable = document.querySelectorAll("#player > *");
  if (round < 4) {
    function waitForCardSelection() {
      return new Promise((resolve) => {
        const cardClickHandler = (event) => {
          resolve();
          playerTable.forEach((card) => {
            card.removeEventListener("click", cardClickHandler);
          });
        };
        playerTable.forEach((card) => {
          card.addEventListener("click", cardClickHandler);
        });
      });
    }
    async function play() {
      for (const hand of hands) {
        if (hand[0] == "player") {
          await waitForCardSelection();
          handFunctions.playerPlaysCard(event);
        }
        if (hand[0] != "player") {
          await new Promise((resolve) => setTimeout(resolve, 500));
          handFunctions.computerPlaysCard(hand);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 500));

      await new Promise((resolve) => {
        winner = findWinnerPlayer();
        changeOrder(hands, winner);
        resolve();
      });
      emptyTable();

      await new Promise((resolve) => setTimeout(resolve, 1000));
      await new Promise((resolve) => {
        dispenseAllplayersInOrder(hands);
        resolve();
      });
      await new Promise((resolve) => setTimeout(resolve, 4000));
      await new Promise((resolve) => {
        handFunctions.orderHandsByValue(hands);
        resolve();
      });
    }
    await play();
    round++;

    await playingCards(round, hands, winner);
  }
}
export async function deatMatch(round = 0, hands = auxHands, winner = "") {
  const playerTable = document.querySelectorAll("#player > *");
  if (round < 5) {
    function waitForCardSelection() {
      return new Promise((resolve) => {
        const cardClickHandler = (event) => {
          resolve();
          playerTable.forEach((card) => {
            card.removeEventListener("click", cardClickHandler);
          });
        };
        playerTable.forEach((card) => {
          card.addEventListener("click", cardClickHandler);
        });
      });
    }
    async function play() {
      for (const hand of hands) {
        if (hand[0] == "player") {
          await waitForCardSelection();
          handFunctions.playerPlaysDeathMatch(event);
        }
        if (hand[0] != "player") {
          await new Promise((resolve) => setTimeout(resolve, 500));
          handFunctions.computerPlaysDeathMatch(hand);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      await new Promise((resolve) => {
        winner = findWinnerPlayer();
        changeOrder(hands, winner);
        resolve();
      });
      emptyTable();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    await play();
    round++;

    await deatMatch(round, hands, winner);
  }
}

export function findWinnerPlayer() {
  const allPlayedCards = handFunctions.getPlayedCards();
  const mainSuit = handFunctions.getMainSuit();
  let roundSuit = allPlayedCards[0].getSuit();
  let winnerCard = "";
  let winnerCardPosition = 0;
  let winnerCardPoints = 0;
  let posibleWinnerPoints = 0;

  allPlayedCards.forEach((playedCard, index) => {
    if (index == 0) {
      winnerCard = playedCard;
      winnerCardPosition = index;
      winnerCardPoints = playedCard.getPoints();
      if (playedCard.getSuit() == mainSuit) winnerCardPoints += 50;
      if (playedCard.getSuit() == roundSuit) winnerCardPoints += 20;
    } else {
      posibleWinnerPoints = playedCard.getPoints();
      if (playedCard.getSuit() == mainSuit) posibleWinnerPoints += 50;
      if (playedCard.getSuit() == roundSuit) posibleWinnerPoints += 20;
      if (posibleWinnerPoints > winnerCardPoints) {
        winnerCard = playedCard;
        winnerCardPosition = index;
        winnerCardPoints = posibleWinnerPoints;
      }
    }
  });
  const hands = handFunctions.getHands();
  const winnerName = hands[winnerCardPosition][0];
  let teamIndex;
  if (winnerName == "player" || winnerName == "computer2") teamIndex = 0;
  if (winnerName == "computer3" || winnerName == "computer1") teamIndex = 2;
  if (teamIndex !== -1) {
    winDecks[teamIndex + 1].push(...allPlayedCards);
  }
  return winnerName;
}
export function changeOrder(hands, lastRoundWinner) {
  const currentIndex = hands.findIndex((hand) => hand[0] === lastRoundWinner);
  const removedHands = hands.splice(0, currentIndex);
  hands.push(...removedHands);
}

export function removeCardFromHand(seletedIndex) {
  auxHands.forEach((hand) => {
    if (hand[0] == "player") {
      hand[2].splice(seletedIndex, 1);
    }
  });
}
export function emptyTable() {
  const playertable = document.querySelectorAll("#playingArea span");
  playertable.forEach((card) => {
    card.style.backgroundImage = "";
    card.classList.remove("border");
  });
  handFunctions.removePlayedCards();
}
