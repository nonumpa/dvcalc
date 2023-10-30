const BASEINCREMENT = 3;
const STATCOUNT = 4;
const trainValues = [3, 5, 9];
let dragonName, dragonIndex;
let reqAgility, reqStrength, reqFocus, reqIntellect;
const adjustments = new Map([
    [8, 9],
    [13, 14],
    [16, 18],
    [20, 21],
    [26, 27],
    [28, 27],
    [31, 32],
    [33, 32],
    [125, 126],
    [130, 131],
]);

// Attach event listeners to base stat input fields (to disable/enable dull trait)
for (const stat of statList) {
    const field = document.getElementById(`start-${stat}`);
    field.addEventListener("change", detectBase);
}

function detectBase() {
    if (event.target.value <= 25) return enableDull();
    else disableDull();
}

function selectDragon() {
    // Initialize variables
    let baseStats = ["#start-agility", "#start-strength", "#start-focus", "#start-intellect"];
    let firstTrait = document.querySelector("#trait1");
    let secondTrait = document.querySelector("#trait2");
    dragonName = document.querySelector("#dragon-selector").value;
    dragonIndex = dragonList.findIndex((dragons) => { return dragons.name[0] === dragonName; });

    // Enable trait selector
    document.querySelector("#start-trait-selector").removeAttribute("disabled");

    // Reset previously selected base stat values and trait
    document.querySelector("#start-trait-selector").selectedIndex = 0;
    for (let i = 0; i < STATCOUNT; i++) {
        document.querySelector(baseStats[i]).value = 0;
    }

    // Fill in trait dropdown choices
    firstTrait.textContent = dragonList[dragonIndex].traitsKo[0];
    firstTrait.value = dragonList[dragonIndex].traitsEn[0];
    secondTrait.textContent = dragonList[dragonIndex].traitsKo[1];
    secondTrait.value = dragonList[dragonIndex].traitsEn[1];
}

// Print the selected dragon's base stats 
function selectStartTrait() {
    let traitSelected = event.target.value;
    dragonName = document.querySelector("#dragon-selector").value;
    dragonIndex = dragonList.findIndex((dragons) => { return dragons.name[0] === dragonName; });
    let baseStats = ["#start-agility", "#start-strength", "#start-focus", "#start-intellect"];

    // Fill in base stats
    for (let i = 0; i < STATCOUNT; i++) {
        document.querySelector(baseStats[i]).value = dragonList[dragonIndex][traitSelected][i];
    }

    // Disable selector for end traits where applicable
    unavailabilityCheck(dragonIndex, traitSelected);
}

// Print recommended end stats for selected special trait
function selectSpecialTrait() {
    let traitSelected = event.target.value;
    traitIndex = specialTraits.findIndex((traits) => { return traits.nameEn === traitSelected; });
    let baseStats = [];
    let startStats = ["#start-agility", "#start-strength", "#start-focus", "#start-intellect"];
    let endStats = ["#end-agility", "#end-strength", "#end-focus", "#end-intellect"];
    let maxValue;

    // Store dragon's base stats
    const base = getStatFields("#start-");
    for (let i = 0; i < STATCOUNT; i++) {
        baseStats[i] = Number(document.querySelector(startStats[i]).value);
    }

    switch (traitSelected) {
        case "Meticulous":
            {
                const startSum = base.getTotal();
                const reqSum = 100 - startSum;
                const goal = new Stats(reqSum);
                const final = addStats(base, goal);
                printStatFields(final, "#end-");
                break;
            }

        case "Distracted":
            {
                const curFocus = base.focus;
                const goal = new Stats();
                if (curFocus) {
                    const low = [getKeyByValue(base, 0), 0];
                    const rest = statList.filter((x) => {
                        if (x !== low[0] && x !== "focus") return x;
                    });
                    const middletest = [rest[0], base[rest[0]]];
                    const hightest = [rest[1], base[rest[1]]];
                    console.log(low)
                    console.log(middletest)
                    console.log(hightest)
                    console.log("------")
                    console.log(compareTraining(middletest[1], hightest[1]));
                }
                // if (curFocus ===) {

                // }
                break;
            }

        case "Immersed":
            for (let i = 0; i < STATCOUNT; i++) {
                document.querySelector(endStats[i]).value = specialTraits[traitIndex].stats[i];
            }

            let highestEnd = "#end-".concat(statList[baseStats.indexOf(Math.max(...baseStats))]);
            document.querySelector(highestEnd).value = 150;
            break;

        case "Dull":
            maxValue = Math.max(...baseStats);
            if (maxValue <= 20) {
                for (let i = 0; i < STATCOUNT; i++) {
                    document.querySelector(endStats[i]).value = specialTraits[traitIndex].stats[i];
                }
            }
            else {
                for (let i = 0; i < STATCOUNT; i++) {
                    document.querySelector(endStats[i]).value = 25;
                }
            }
            break;

        case "Capable":
            maxValue = Math.max(...baseStats);
            if (maxValue < 30) {
                for (let i = 0; i < STATCOUNT; i++) {
                    document.querySelector(endStats[i]).value = specialTraits[traitIndex].stats[i];
                }
            }
            else {
                for (let i = 0; i < STATCOUNT; i++) {
                    document.querySelector(endStats[i]).value = 30;
                }
            }
            break;

        default:
            for (let i = 0; i < STATCOUNT; i++) {
                document.querySelector(endStats[i]).value = specialTraits[traitIndex].stats[i];
            }
    }
}

class Stats {
    constructor(agility, strength, focus, intellect) {
        this.agility = agility || 0;
        this.strength = strength || 0;
        this.focus = focus || 0;
        this.intellect = intellect || 0;
    }

    getMaxTrait() {
        const maxVal = this.getMaxVal();
        const maxTraits = [];
        if (this.agility === maxVal) maxTraits.push("agility");
        if (this.strength === maxVal) maxTraits.push("strength");
        if (this.focus === maxVal) maxTraits.push("focus");
        if (this.intellect === maxVal) maxTraits.push("intellect");
        return maxTraits;
    }

    getMinTrait() {
        const minVal = this.getMinVal();
        const minTraits = [];
        if (this.agility === minVal) minTraits.push("agility");
        if (this.strength === minVal) minTraits.push("strength");
        if (this.focus === minVal) minTraits.push("focus");
        if (this.intellect === minVal) minTraits.push("intellect");
        return minTraits;
    }

    getMaxVal() {
        return Math.max(this.agility, this.strength, this.focus, this.intellect);
    }

    getMinVal() {
        return Math.min(this.agility, this.strength, this.focus, this.intellect);
    }

    getTotal() {
        return this.agility + this.strength + this.focus + this.intellect;
    }

    sortInc() {
        const cur = [this.agility, this.strength, this.focus, this.intellect];
        return cur.sort((a, b) => a - b);
    }
}

function getStatFields(prefix) {
    const values = new Stats();
    for (const stat of statList) {
        values[stat] = Number(document.querySelector(`${prefix}${stat}`).value);
    }
    return values;
}

function printStatFields(stats, prefix) {
    for (const stat in stats) {
        document.querySelector(`${prefix}${stat}`).value = stats[stat];
    }
}

function getKeyByValue(obj, value) {
    return Object.keys(obj).find((key) => obj[key] === value) || null;
}

// Print recommended end stats for selected normal trait
function selectNormalTrait() {
    // Store dragon's base stats
    const base = getStatFields("#start-");

    const traitSelected = event.target.value;
    const traitIndex = normalTraits.findIndex((trait) => { return trait.nameEn === traitSelected; });
    const highestReq = normalTraits[traitIndex].highestTrait;
    const lowestReq = normalTraits[traitIndex].lowestTrait;
    let req;

    if (lowestReq === "none") req = doubleTraining(base, highestReq);
    else req = singleTraining(base, highestReq, lowestReq);

    printStatFields(req, "#end-");

    // Make coloring the borders optional for now
    // colorStatFields(traitIndex);
}

function doubleTraining(base, highest) {
    let req = calcSingleHighest(base, highest);
    const sortedArr = req.sortInc();

    if (sortedArr[0] !== sortedArr[1]) req = calcDoubleLowest(req, sortedArr);

    const diff = subtractStats(base, req)
    const optimized = optimizeHighest(base, diff, highest);
    const final = addStats(base, optimized);

    return final;
}

function singleTraining(base, highest, lowest) {
    // Determine lowest required state
    let req = calcSingleLowest(base, lowest);

    // Determine highest required stat
    req = calcSingleHighest(req, highest);

    const diff = subtractStats(base, req)

    // Optimization
    const optimized = optimizeAll(base, diff, highest, lowest);
    const final = addStats(base, optimized);

    return final;
}

function optimizeAll(base, change, highest, lowest) {
    const newStats = copyStats(change);
    for (const stat in newStats) {
        const curValue = newStats[stat];
        if (adjustments.has(curValue)) {
            // try inserting new value
            newStats[stat] = adjustments.get(curValue);
            // replace value and see if highest of stats and lowest of stats changed (compare newStats highest and lowest using getMax and getMin)
        }
    }
    const application = addStats(base, newStats);
    const newMax = application.getMaxTrait();
    const newMin = application.getMinTrait();
    if (newMax.length === 1 && newMin.length === 1 && newMax.includes(highest) && newMin.includes(lowest)) return newStats;
    return change;
}

function optimizeHighest(base, change, highest) {
    const newStats = copyStats(change);
    for (const stat in newStats) {
        const curValue = newStats[stat];
        if (adjustments.has(curValue)) {
            newStats[stat] = adjustments.get(curValue);
        }
    }
    const application = addStats(base, newStats);
    const newMax = application.getMaxTrait();
    if (newMax.length === 1 && newMax.includes(highest)) return newStats;
    return change;
}

function colorStatFields(index) {
    const high = normalTraits[index].highestTrait;
    const low = normalTraits[index].lowestTrait;
    document.querySelector(`#end-${high}`).style.border = "solid 2px red";
    document.querySelector(`#end-${low}`).style.border = "solid 2px blue";
}

function copyStats(object) {
    const newAgility = Number(object.agility);
    const newStrength = Number(object.strength);
    const newFocus = Number(object.focus);
    const newIntellect = Number(object.intellect);
    const newObject = new Stats(newAgility, newStrength, newFocus, newIntellect);
    return newObject;
}

function subtractStats(a, b) {
    const sub = new Stats();
    for (const stat of statList) {
        sub[stat] = Math.abs(a[stat] - b[stat]);
    }
    return sub;
}

function addStats(a, b) {
    const sum = new Stats();
    for (const stat of statList) {
        sum[stat] = a[stat] + b[stat];
    }
    return sum;
}

// Will always return one lowest trait
function calcSingleLowest(curStats, lowestReq) {
    const newStats = copyStats(curStats);
    const baseMinTrait = curStats.getMinTrait();
    const reqVal = curStats[lowestReq];

    if (baseMinTrait.length === 1 && baseMinTrait[0] === lowestReq) return newStats;
    for (const stat in curStats) {
        if (stat === lowestReq) continue;
        if (curStats[stat] <= reqVal) newStats[stat] = reqVal + BASEINCREMENT;
    }
    return newStats;
}

function calcDoubleLowest(curStats, array) {
    const newStats = copyStats(curStats);
    const lowestValue = array[0];
    const adjustmentValue = array[1];
    const adjustmentKey = getKeyByValue(newStats, lowestValue);

    newStats[adjustmentKey] = adjustmentValue;
    return newStats;
}

// Always returns one highest trait
function calcSingleHighest(curStats, highestReq) {
    const newStats = copyStats(curStats);
    const baseMaxTrait = curStats.getMaxTrait();
    const baseMaxValue = curStats.getMaxVal();
    const includesReq = baseMaxTrait.includes(highestReq);

    if (baseMaxTrait.length === 1 && includesReq) return newStats;
    if (baseMaxTrait.length > 1 && includesReq || baseMaxTrait[0] !== highestReq) newStats[highestReq] = baseMaxValue + BASEINCREMENT;
    return newStats;
}

function calculate() {
    printTrainingCount("agility");
    printTrainingCount("strength");
    printTrainingCount("focus");
    printTrainingCount("intellect");
}

function printTrainingCount(traitType) {
    let reqStat = document.querySelector(`#end-${traitType}`).value - document.querySelector(`#start-${traitType}`).value;
    if (reqStat < 0) {
        reqStat = 0;
        document.querySelector(`#required-${traitType}`).textContent = "+0";
    }
    else {
        document.querySelector(`#required-${traitType}`).textContent = "+" + reqStat;
    }

    const trainCount = calculateTrainCount(reqStat, trainValues);
    let trainText;

    if (trainCount[5] === 9) {
        let nineCount = trainCount.lastIndexOf(9) + 1;
        trainCountCondensed = trainCount.slice(nineCount);
        trainText = `<span class="nine">9</span><sub>(x${nineCount})</sub> ` + trainCountCondensed.map((e) => {
            return e === 5 ? `<span class="five">${e}</span>` : `<span class="three">${e}</span>`;
        }).join(" ");
    }
    else {
        trainText = trainCount.map((e) => {
            return e === 9 ? `<span class="nine">${e}</span>` : e === 5 ? `<span class="five">${e}</span>` : `<span class="three">${e}</span>`;
        }).join(" ");
    }

    if (trainCount.length === 0) {
        document.querySelector(`#train-count-${traitType}`).textContent = "-";
    }
    else {
        document.querySelector(`#train-count-${traitType}`).innerHTML = trainText;
    }
}

function calculateTrainCount(targetSum, trainValues, memo = {}) {
    if (targetSum in memo) return memo[targetSum];
    if (targetSum === 0) return [];
    if (targetSum < 0) return null;

    let shortestCombination = null;

    for (let num of trainValues) {
        const remainder = targetSum - num;
        const remainderResult = calculateTrainCount(remainder, trainValues, memo);
        if (remainderResult !== null) {
            const combination = [...remainderResult, num];
            if (shortestCombination === null || combination.length < shortestCombination.length) {
                shortestCombination = combination;
            }
        }
    }
    memo[targetSum] = shortestCombination;
    return shortestCombination;
};

function disableDull() {
    document.getElementById("special-trait-selector").selectedIndex = 0;
    const dull = document.getElementById("Dull");
    dull.setAttribute("disabled", "");
    dull.textContent = "平凡的 (超出條件)";
}

function enableDull() {
    const dull = document.getElementById("Dull");
    dull.removeAttribute("disabled");
    dull.textContent = "平凡的";
}

function unavailabilityCheck(dragonIndex, traitSelected) {
    if (dragonList[dragonIndex][traitSelected].findIndex((item) => item > 25) === -1) return enableDull();

    for (let i = 0; i < STATCOUNT; i++) {
        if (dragonList[dragonIndex][traitSelected][i] > 25) return disableDull();
    }
}

function reset() {
    let endStats = ["#end-agility", "#end-strength", "#end-focus", "#end-intellect"];

    for (let i = 0; i < STATCOUNT; i++) {
        document.querySelector(endStats[i]).value = 0;
    }

    document.querySelector("#special-trait-selector").selectedIndex = 0;
    document.querySelector("#normal-trait-selector").selectedIndex = 0;
}
