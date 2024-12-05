import { rules, values } from "./data.js";

const formatRule = (rule) => {
  return rule.split("|").map((num) => Number(num));
};

const applyRulesToPages = (pages) => {
  return pages.toSorted((a, b) => {
    const ruleSet = rules.find((r) => r.includes(a) && r.includes(b));
    if (!ruleSet) return 0;
    const [first, _NOT_USED] = formatRule(ruleSet);
    return a === first ? -1 : 1;
  });
};

const getCenterPage = (pages) => {
  return pages[Math.floor(pages.length / 2)];
};

const sortedPages = values.map((v) => applyRulesToPages(v));

let answer1 = 0;

values.forEach((set, ind) => {
  const correct = set.every((p, i) => p === sortedPages[ind][i]);
  if (correct) {
    const centerPage = getCenterPage(set);
    answer1 += centerPage;
  }
});

let answer2 = 0;

values.forEach((set, ind) => {
  const correct = set.every((p, i) => p === sortedPages[ind][i]);
  if (!correct) {
    const centerPage = getCenterPage(sortedPages[ind]);
    answer2 += centerPage;
  }
});

console.log(answer2);
