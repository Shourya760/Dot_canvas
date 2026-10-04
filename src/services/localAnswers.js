const number = "[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)";

function calculate(source) {
  const expression = source.replace(/,/g, "").replace(/×/g, "*").replace(/÷/g, "/").replace(/\s+/g, "");
  const tokens = expression.match(/(?:\d+(?:\.\d*)?|\.\d+)|[()+\-*/%^]/g) || [];
  if (!tokens.length || tokens.join("") !== expression || tokens.length > 100) return null;
  let i = 0;
  const primary = () => {
    if (tokens[i] === "(") {
      i++;
      const value = sum();
      if (tokens[i++] !== ")") throw Error();
      return value;
    }
    const value = Number(tokens[i++]);
    if (!Number.isFinite(value)) throw Error();
    return value;
  };
  const power = () => {
    const value = primary();
    return tokens[i] === "^" ? (i++, value ** unary()) : value;
  };
  const unary = () => tokens[i] === "+" ? (i++, unary()) : tokens[i] === "-" ? (i++, -unary()) : power();
  const product = () => {
    let value = unary();
    while (["*", "/", "%"].includes(tokens[i])) {
      const op = tokens[i++], next = unary();
      value = op === "*" ? value * next : op === "/" ? value / next : value % next;
    }
    return value;
  };
  const sum = () => {
    let value = product();
    while (["+", "-"].includes(tokens[i])) {
      const op = tokens[i++], next = product();
      value = op === "+" ? value + next : value - next;
    }
    return value;
  };
  try {
    const result = sum();
    return i === tokens.length && Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

const format = (value) => String(Number(value.toPrecision(8)));

export function answerLocally(rawPrompt) {
  const prompt = rawPrompt.trim()
    .replace(/^(?:what is|calculate|solve)\s+/i, "")
    .replace(/[?.!]+$/, "")
    .trim();
  const percent = prompt.match(new RegExp(`^(${number})\\s*%\\s*of\\s*(${number})$`, "i"));
  if (percent) return `${percent[1]}% of ${percent[2]}=${format(Number(percent[1]) * Number(percent[2]) / 100)}`;
  const result = calculate(prompt);
  return result === null ? null : `${prompt.replace(/\s+/g, "").replace(/×/g, "*").replace(/÷/g, "/")}=${format(result)}`;
}
