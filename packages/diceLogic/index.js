function calculateBonification(value) {
  return Math.floor((value - 10) / 2);
}

function compressNotation(notation) {
  return notation.trim().replace(/\s+/g, '');
}

function parseDiceString(str) {
  const regex = /([-+]?\s*\d*)[dD](\d+)|([-+]\s*\d+)(?![dD])/g;
  let match;
  const dices = [];
  let modifier = 0;

  while ((match = regex.exec(compressNotation(str))) !== null) {
    if (match[1] !== undefined && match[2] !== undefined) {
      let count = match[1] ? parseInt(match[1], 10) : 1;
      if (count < 0) {
        count *= -1;
      }
      const sides = parseInt(match[2], 10);
      const sign = match[1] && match[1].trim().startsWith('-') ? -1 : 1;
      for (let i = 0; i < count; i += 1) {
        dices.push(sign * sides);
      }
    } else if (match[3] !== undefined) {
      modifier += parseInt(match[3].replace(/\s+/g, ''), 10);
    }
  }

  return { dices, modifier };
}

function rollDice(dices, randomizer) {
  const fnRandomizer = randomizer || Math.random;
  let totalizer = 0;
  const diceResults = dices.dices.map((dice) => {
    const result = Math.floor(fnRandomizer() * dice) + (dice < 0 ? 0 : 1);
    totalizer += result;
    return { value: result, dice: dice < 0 ? dice * -1 : dice };
  });

  return { total: totalizer + dices.modifier, dices: diceResults, modifier: dices.modifier };
}

function rollDiceString(str) {
  return rollDice(parseDiceString(str));
}

function rollMaxDice(dices) {
  let totalizer = 0;
  const diceResults = dices.dices.map((dice) => {
    totalizer += dice;
    return { value: dice, dice };
  });
  return { total: totalizer + dices.modifier, dices: diceResults, modifier: dices.modifier };
}

function rollAdvantage(dices, randomizer) {
  const fnRandomizer = randomizer || Math.random;
  const roll1 = rollDice(dices, fnRandomizer);
  const roll2 = rollDice(dices, fnRandomizer);
  if (roll1.total > roll2.total) {
    roll1.valid = true;
    roll2.valid = false;
  } else {
    roll1.valid = false;
    roll2.valid = true;
  }
  return [roll1, roll2];
}

function rollDisadvantage(dices, randomizer) {
  const fnRandomizer = randomizer || Math.random;
  const roll1 = rollDice(dices, fnRandomizer);
  const roll2 = rollDice(dices, fnRandomizer);
  if (roll1.total < roll2.total) {
    roll1.valid = true;
    roll2.valid = false;
  } else {
    roll1.valid = false;
    roll2.valid = true;
  }
  return [roll1, roll2];
}

function rollAdvantageDiceString(str) {
  return rollAdvantage(parseDiceString(str));
}

function rollDisadvantageDiceString(str) {
  return rollDisadvantage(parseDiceString(str));
}

function rollMaxDiceString(str) {
  return rollMaxDice(parseDiceString(str));
}

module.exports = {
  calculateBonification,
  parseDiceString,
  rollDice,
  rollDiceString,
  rollMaxDice,
  rollAdvantage,
  rollDisadvantage,
  rollAdvantageDiceString,
  rollDisadvantageDiceString,
  rollMaxDiceString,
};
