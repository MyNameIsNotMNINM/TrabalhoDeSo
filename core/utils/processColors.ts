const PROCESSCOLORS= [
  "#fad390",
  "#f6b93b",
  "#fa983a",
  "#e58e26",
  "#f8c291",
  "#e55039",
  "#eb2f06",
  "#b71540",
  "#6a89cc",
  "#4a69bd",
  "#1e3799",
  "#0c2461",
  "#82ccdd",
  "#60a3bc",
  "#3c6382",
  "#0a3d62",
  "#b8e994",
  "#78e08f",
  "#38ada9",
  "#079992",
  "#ff9ff3",
  "#f368e0",
  "#54a0ff",
  "#2e86de",
  "#5f27cd",
  "#341f97",
  "#1dd1a1",
  "#10ac84",
  "#3C3B5C",
  "#FFB563",
  "#54777D",
  "#EADB9D",
  "#FEFFE4",
  "#E7E3C5"
];

function pickRandomCollor() {
  return PROCESSCOLORS[Math.floor(Math.random() * PROCESSCOLORS.length)];
};

export default pickRandomCollor;