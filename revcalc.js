const STAT_LISTS = {
  base: ["agility", "strength", "focus", "intellect"],
  dom: ["start-agility", "start-strength", "start-focus", "start-intellect"],
};

function getChangedFields() {
  // read DOM fields
  const fields = [];
  STAT_LISTS.dom.forEach((selector) => {
    const field = Number(document.getElementById(selector).value);
    fields.push(field);
  });

  // read dragon name field
  const dragonName = document.getElementById("dragon-selector").value;
  const currentHighest = getCheckedTraits();
  const currentTrait = document.getElementById("trait-selector").value;
  const currentLowest = normalTraits.filter((trait) => trait.nameEn === currentTrait).map((trait) => trait.lowestTrait);

  // get dragon's trait data
  const dragonTraits = {};
  dragonList.forEach((data) => {
    if (data.name.includes(dragonName)) {
      dragonTraits.first = findTraitData(data.traitsKo[0]);
      dragonTraits.first.values = data[data.traitsEn[0]];
      dragonTraits.second = findTraitData(data.traitsKo[1]);
      dragonTraits.second.values = data[data.traitsEn[1]];
    }
  });
  console.log("dragonTraits ---");
  console.log(dragonTraits);

  const changes = new Stats(...fields);
  const test1 = new Stats(...dragonTraits.first.values);
  const test2 = new Stats(...dragonTraits.second.values);

  console.log("base stats ---------");
  console.log(test1);
  console.log(test2);

  // add the affected stats to base stats
  const added1 = getStatSum(test1, changes);
  const added2 = getStatSum(test2, changes);

  console.log("added stats ---------");
  console.log(added1);
  console.log(added2);

  // find final trait based on the changes
  const highest1 = added1.getMaxStatName();
  const highest2 = added2.getMaxStatName();
  console.log("theoretical higehst ---------");
  console.log(highest1);
  console.log(highest2);

  // check whether current highest matches theoretical highest
  const lowestStats1 = findLowestStatName(added1);
  const lowestStats2 = findLowestStatName(added2);

  console.log("theoretical lowest ---------");
  console.log(lowestStats1);
  console.log(lowestStats2);

  console.log(currentLowest)

  let matches1;
  let matches2;

  for (let i = 0; i < currentHighest.length; i++) {
    if (!highest1.includes(currentHighest[i])) {
      matches1 = false;
      break;
    }
    if (i === currentHighest.length - 1 && highest1.includes(currentHighest[i])) {
      matches1 = true;
    }
  }

  for (let i = 0; i < currentHighest.length; i++) {
    if (!highest2.includes(currentHighest[i])) {
      matches2 = false;
      break;
    }
    if (i === currentHighest.length - 1 && highest2.includes(currentHighest[i])) {
      matches2 = true;
    }
  }

  if (lowestStats1 !== currentLowest[0]) {
    matches1 = false;
  }

  if (lowestStats2 !== currentLowest[0]) {
    matches2 = false;
  }

  console.log(matches1) // expect false
  console.log(matches2) // expect true

  // test data:
  // { name: ["Knight Dragon", "나이트"], traitsKo: ["용감한", "똑똑한"], Brave: [0, 30, 10, 10], Smart: [10, 0, 0, 20] },
  // 나이트 순발+40, 성격 대담
  // 1 to match
  // expect: 성격 눈치빠른

  // both highest and lowest have to match

  // exception handling -- maybe I don't need to do this; completely depends on info provided by user

  // need to consider ties in stats -> change dropdown to checkbox

  // const trueTrait;
  // const resultDiv = document.getElementById("result");
  // resultDiv.innerHTML = trueTrait;
}

function findLowestStatName(stats) {
  const lowestStatList = stats.getMinStatName();

  if (lowestStatList.length >= 2) {
    return "none";
  }

  return lowestStatList;
}

function findTraitData(traitName) {
  const statInfo = normalTraits.reduce((final, cur) => {
    if (cur.nameKo === traitName) {
      final.highest = cur.highestTrait;
      final.lowest = cur.lowestTrait;
    }
    return final;
  }, {});

  return {
    trait: traitName,
    highestStat: statInfo.highest,
    lowestStat: statInfo.lowest,
  };
}

function getCheckedTraits() {
  const checked = [];

  STAT_LISTS.base.forEach((stat) => {
    if (document.getElementById(`checkbox-${stat}`).checked) {
      checked.push(stat);
    }
  });

  // const agilityCheckbox = document.getElementById("checkbox-agility").checked;
  // const strengthCheckbox = document.getElementById("checkbox-strength").checked;
  // const focusCheckbox = document.getElementById("checkbox-focus").checked;
  // const intellectCheckbox =
  //   document.getElementById("checkbox-intellect").checked;

  // console.log("agility checked: " + agilityCheckbox);
  // console.log("strength checked: " + strengthCheckbox);
  // console.log("focus checked: " + focusCheckbox);
  // console.log("intellect checked: " + intellectCheckbox);
console.log(checked);
  return checked;
}

function reset() {
  STAT_LISTS.dom.forEach((selector) => {
    const field = document.getElementById(selector);
    field.value = 0;
  });
}



// separate as utilities later
function getStatDifference(a, b) {
  const sub = new Stats();
  for (const stat of STAT_LISTS.base) {
    sub[stat] = Math.abs(a[stat] - b[stat]);
  }
  return sub;
}

function getStatSum(a, b) {
  const sum = new Stats();
  for (const stat of STAT_LISTS.base) {
    sum[stat] = a[stat] + b[stat];
  }
  return sum;
}

// delete later
class Stats {
  constructor(agility = 0, strength = 0, focus = 0, intellect = 0) {
    this.agility = agility;
    this.strength = strength;
    this.focus = focus;
    this.intellect = intellect;
  }

  getMaxStatName() {
    const maxVal = this.getMaxStatValue();
    const maxTraits = [];
    if (this.agility === maxVal) maxTraits.push("agility");
    if (this.strength === maxVal) maxTraits.push("strength");
    if (this.focus === maxVal) maxTraits.push("focus");
    if (this.intellect === maxVal) maxTraits.push("intellect");
    return maxTraits;
  }

  getMinStatName() {
    const minVal = this.getMinStatValue();
    const minTraits = [];
    if (this.agility === minVal) minTraits.push("agility");
    if (this.strength === minVal) minTraits.push("strength");
    if (this.focus === minVal) minTraits.push("focus");
    if (this.intellect === minVal) minTraits.push("intellect");
    return minTraits;
  }

  getMaxStatValue() {
    return Math.max(this.agility, this.strength, this.focus, this.intellect);
  }

  getMinStatValue() {
    return Math.min(this.agility, this.strength, this.focus, this.intellect);
  }

  getTotal() {
    return this.agility + this.strength + this.focus + this.intellect;
  }

  sortInc() {
    const cur = [this.agility, this.strength, this.focus, this.intellect];
    return cur.sort((a, b) => a - b);
  }

  getTraitsByValue(value) {
    const traits = [];
    if (this.agility === value) {
      traits.push("agility");
    }
  }
}
