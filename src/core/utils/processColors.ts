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

const cyrb53 = (seed: number, str: string = "") => {
  let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};


function pickRandomColor(pid: number, processName: string = "low_n") {
  const num = cyrb53(pid, processName);
  return PROCESSCOLORS[ num % PROCESSCOLORS.length ];
};

let colorBank: {[key: number]: string} = {}

function getRandomColor(n: number): string {
  if (colorBank[n])
    return colorBank[n];
  let hsl = [20, '50%', '50%'];
  hsl[0] = cyrb53(n, `${(new Date()).getTime()}`)%256;
  colorBank[n] =  `hsl(${hsl.join(', ')})`;
  return colorBank[n];
}


export {pickRandomColor, getRandomColor};