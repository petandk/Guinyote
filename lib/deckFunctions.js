import card from "./card.js";
import * as handFunctions from "./handFunctions.js";
const params = new URLSearchParams(window.location.search);
const param1 = params.get("team1Points");
const param2 = params.get("team2Points");
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
let auxHands = [];
let auxWinner = "";
let winDecks = ["team1", [], "team2", []];
const gameOver = document.querySelector("#gameOver");
const matchPointsPanel = document.querySelector("#matchPoints");
const comebackMatchPoints = document.querySelector("#comebackMatchPoints");
if (param1 != null && param2 != null) {
  comebackMatchPoints.classList.remove("hidden");
  document.querySelector("#winnerTeamComebackSpan").innerHTML =
    parseInt(param1) < 50
      ? param1 + " malas"
      : parseInt(param1) - 50 + " buenas";
  document.querySelector("#computerTeamComebackSpan").innerHTML =
    parseInt(param2) < 50
      ? param2 + " malas"
      : parseInt(param2) - 50 + " buenas";
}
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
    if (element.id == "nayar") {
      card.classList.add("centerImage", element.id == "nayar");
      handFunctions.isNayar(true);
    }
    if (element.id != "nayar") {
      card.classList.remove("centerImage", element.id == "nayar");
      handFunctions.isNayar(false);
    }
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
    card.updateImageFolder("/public/images/front/" + selectedForeground);
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
export function dispenseCard(
  player,
  cardToDispense = suffledDeck[deckPosition],
  isSwitch = false
) {
  handFunctions.addCard(player, cardToDispense);
  handFunctions.createCard(player, null, cardToDispense);
  if (!isSwitch) {
    removeDeckCard();
    deckPosition++;
  }
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
      }, index * 500);
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
  auxWinner = winner;
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
  if (round < 6) {
    function waitForCardSelection() {
      return new Promise((resolve) => {
        const cardClickHandler = (event) => {
          const selectedCard = event.target;
          const playerArea = document.querySelector("#player");
          const playerCards = Array.from(playerArea.querySelectorAll("span"));
          const seletedIndex = playerCards.indexOf(selectedCard);
          const playerHand = hands.find((hand) => hand[0] === "player");
          const playerCard = playerHand[2][seletedIndex];
          const cardIsValidSoWeKeepPlaying = handFunctions.isAValidCard(
            playerCard,
            playerHand
          );
          if (cardIsValidSoWeKeepPlaying) {
            resolve();
            playerTable.forEach((card) => {
              card.removeEventListener("click", cardClickHandler);
            });
          }
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
    handFunctions.cantarTextRemove();
  });
  handFunctions.removePlayedCards();
  if (param1 != null && param2 != null) {
    countPoints();
  }
}
export function countPoints() {
  let team1Points = 0;
  let team2Points = 0;
  //let winDecks = ["team1", [], "team2", []];
  winDecks[1].forEach((wonCard) => {
    if (wonCard.getPoints() > 0) {
      team1Points += wonCard.getPoints();
    }
  });
  winDecks[3].forEach((wonCard) => {
    if (wonCard.getPoints() > 0) {
      team2Points += wonCard.getPoints();
    }
  });
  const extraPoints = handFunctions.getExtraPoints();
  if (extraPoints[0].length != 0) {
    // si se cantan las 20
    extraPoints[0].forEach((player) => {
      if (player == "player" || player == "computer2") {
        team1Points += 20;
      }
      if (player == "computer3" || player == "computer1") {
        team2Points += 20;
      }
    });
  }
  if (extraPoints[1] != "") {
    if (extraPoints[1] == "player" || extraPoints[1] == "computer2") {
      team1Points += 40;
    }
    if (extraPoints[1] == "computer3" || extraPoints[1] == "computer1") {
      team2Points += 40;
    }
  }
  if (auxWinner == "player" || auxWinner == "computer2") {
    team1Points += 10;
  }
  if (auxWinner == "computer3" || auxWinner == "computer1") {
    team2Points += 10;
  }
  if (param1 != null && param2 != null) {
    team1Points += parseInt(param1);
    team2Points += parseInt(param2);
    parseInt(team1Points) > 50
      ? (comebackMatchPoints.querySelector(
          "#winnerTeamComebackSpan"
        ).innerHTML = parseInt(team1Points) - 50 + " buenas")
      : (comebackMatchPoints.querySelector(
          "#winnerTeamComebackSpan"
        ).innerHTML = parseInt(team1Points) + " malas");
    parseInt(team2Points) > 50
      ? (comebackMatchPoints.querySelector(
          "#computerTeamComebackSpan"
        ).innerHTML = parseInt(team2Points) - 50 + " buenas")
      : (comebackMatchPoints.querySelector(
          "#computerTeamComebackSpan"
        ).innerHTML = parseInt(team2Points) + " malas");
    if (parseInt(team1Points) > 100) {
      gameOver.style.display = "block";
      gameOver.innerHTML = "Has ganado";
    }
    if (parseInt(team2Points) > 100) {
      gameOver.style.display = "block";
      gameOver.innerHTML = "Has perdido";
    }
  }
  if (param1 == null && param2 == null) {
    parseInt(team1Points) > 50
      ? (matchPointsPanel.querySelector("#winnerTeamSpan").innerHTML =
          parseInt(team1Points) - 50 + " buenas")
      : (matchPointsPanel.querySelector("#winnerTeamSpan").innerHTML =
          parseInt(team1Points) + " malas");
    parseInt(team2Points) > 50
      ? (matchPointsPanel.querySelector("#computerTeamSpan").innerHTML =
          parseInt(team2Points) - 50 + " buenas")
      : (matchPointsPanel.querySelector("#computerTeamSpan").innerHTML =
          parseInt(team2Points) + " malas");

    matchPointsPanel.classList.remove("hidden");
    document.querySelector("#continueButton").classList.remove("hidden");
    document.querySelector("#continueButton").addEventListener("click", () => {
      comeback(team1Points, team2Points);
    });
  }
}
export function comeback(team1, team2) {
  var url = "index.html?team1Points=" + team1 + "&team2Points=" + team2;
  window.location.href = url;
}
export function getSuffledDeck() {
  return suffledDeck;
}
export function getMainSuit() {
  return mainSuit;
}
