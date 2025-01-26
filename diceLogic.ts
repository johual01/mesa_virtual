
interface IDices {
    dices: number[];
    modifier: number;
}

interface IDicesTotalizer {
    total: number;
    dices: {
            value: number, 
            dice: number
    }[];
    modifier: number;
    valid?: boolean;
}

export function calculateBonification(value: number): number {
    return Math.floor((value - 10) / 2)
}

function compressNotation (notation: string) {
    return notation.trim().replace(/\s+/g, '');
}

export function parseDiceString(str: string): IDices {
    const regex =/([-+]?\s*\d*)[dD](\d+)|([-+]\s*\d+)(?![dD])/g;
    let match;
    let dices: number[] = [];
    let modifier = 0;

    while ((match = regex.exec(compressNotation(str))) !== null) {
        if (match[1] !== undefined && match[2] !== undefined) {
            let count = match[1] ? parseInt(match[1], 10) : 1;
            if (count < 0) { count *= -1 };
            const sides = parseInt(match[2], 10);
            const sign = match[1] && match[1].trim().startsWith('-') ? -1 : 1;
            for (let i = 0; i < count; i++) {
                dices.push(sign * sides);
            }
        } else if (match[3] !== undefined) {
            modifier += parseInt(match[3].replace(/\s+/g, ''), 10);
        }
    }
    console.log(dices, modifier);
    return { dices, modifier };
}

export function rollDice(dices: IDices, randomizer?: Function): IDicesTotalizer {
    const fnRandomizer = randomizer || Math.random;
    let totalizer = 0;
    const diceResults = dices.dices.map((dice) => {
        const result = Math.floor(fnRandomizer() * dice) + (dice < 0 ? 0 : 1);
        totalizer += result;
        return { value: result, dice: dice < 0 ? dice * -1 : dice };
    })
    return { total: totalizer + dices.modifier, dices: diceResults, modifier: dices.modifier };
}

export function rollDiceString(str: string): IDicesTotalizer {
    return rollDice(parseDiceString(str));
}

export function rollMaxDice(dices: IDices): IDicesTotalizer {
    let totalizer = 0;
    const diceResults = dices.dices.map((dice) => {
        totalizer += dice;
        return { value: dice, dice: dice };
    })
    return { total: totalizer + dices.modifier, dices: diceResults, modifier: dices.modifier };
}

export function rollAdvantage(dices: IDices, randomizer?: Function): IDicesTotalizer[] {
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

export function rollDisadvantage(dices: IDices, randomizer?: Function): IDicesTotalizer[] {
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

export function rollAdvantageDiceString(str: string): IDicesTotalizer[] {
    return rollAdvantage(parseDiceString(str));
}

export function rollDisadvantageDiceString(str: string): IDicesTotalizer[] {
    return rollDisadvantage(parseDiceString(str));
}

export function rollMaxDiceString(str: string): IDicesTotalizer {
    return rollMaxDice(parseDiceString(str));
}