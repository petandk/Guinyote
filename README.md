# Guinyote

A browser version of **guiñote**, the Spanish trick-taking card game, built as an MVP for a hackathon organised by **Nayar Systems** (September 2023), where it won **2nd place**.

It is written in plain JavaScript (ES modules), HTML and CSS, with no frameworks or dependencies.

> **Status: hackathon MVP.** The game is playable from deal to game over, but the code was written against the clock and has not been refactored since. See [Known limitations](#known-limitations).

## Features

- **Four players in two teams**: you and `computer2` against `computer1` and `computer3`.
- **Full 40-card Spanish deck**: shuffled and dealt with an animation, 6 cards per player, and a trump card turned face up.
- **Hand sorting**: your hand is sorted by value, with trumps first.
- **First phase**: tricks with a draw from the deck after each one. The trick winner leads the next trick.
- **Arrastre (final phase)**: once the deck is empty, the follow-suit and must-beat rules are enforced, for both you and the computer players.
- **Cantes**: "las 20" (king and queen of a non-trump suit) and "las 40" (king and queen of trumps).
- **Cambiar el 7**: swap the 7 of trumps for the face-up trump card.
- **Scoring**: card points, cantes and "10 de últimas", shown as *malas* / *buenas* (50-point threshold).
- **Multi-hand matches**: a *Continuar* button carries the score into the next hand, and the first team past 100 wins.
- **Deck customisation**: 6 card backs (one of them Nayar-themed) and 4 card fronts (Spanish, colourful, alternative and poker).

## Run it locally

The game uses ES modules, so it needs to be served over HTTP; opening `index.html` directly from disk will not work.

```bash
git clone https://github.com/petandk/Guinyote.git
cd Guinyote
python3 -m http.server 8000
```

Then open <http://localhost:8000> and click the deck to start.

## Project structure

```
index.html            Game board, menu, customisation popup and score panels
lib/javascript.js     Entry point: game start and phase sequencing
lib/deckFunctions.js  Deck, shuffle, dealing, trick loop, trick winner, scoring
lib/handFunctions.js  Hands, playing cards, cantes, swapping the 7, arrastre rules
lib/card.js           Card class (suit, value, points, image path)
public/style/         Stylesheet
public/images/        Card backs and fronts
```

## Known limitations

This is a hackathon MVP, so:

- **Computer players are basic**: they play their first valid card, with no strategy or team play.
- **Timing is hard-coded** with `setTimeout` delays instead of being driven by animation events.
- **Match state between hands** is passed through URL query parameters.
- **Some rule edge cases** in the arrastre validation are not fully correct.
- **No automated tests.**
- **Interface text is in Spanish only.**

## Author

Raúl Manzanas Trillo · [rmanzanas.com](https://rmanzanas.com) · [GitHub](https://github.com/petandk)
