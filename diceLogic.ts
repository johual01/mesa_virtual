
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
    if (!randomizer) {
        randomizer = Math.random;
    }
    let totalizer = 0;
    const diceResults = dices.dices.map((dice) => {
        const result = Math.floor(randomizer() * dice) + (dice < 0 ? 0 : 1);
        totalizer += result;
        return { value: result, dice: dice < 0 ? dice * -1 : dice };
    })
    return { total: totalizer + dices.modifier, dices: diceResults, modifier: dices.modifier };
}

export function rollDiceString(str: string, randomizer?: Function): IDicesTotalizer {
    return rollDice(parseDiceString(str), randomizer);
}
