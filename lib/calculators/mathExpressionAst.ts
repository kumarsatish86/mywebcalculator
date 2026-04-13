import { formatNumForDisplay } from "@/lib/calculators/basicMathDisplay";

export type AngleMode = "rad" | "deg";

export type CallName = "sqrt" | "sin" | "cos" | "tan" | "log" | "ln" | "abs";

export type AstNode =
  | { type: "number"; value: number }
  | { type: "const"; name: "pi" | "e" }
  | { type: "unaryMinus"; inner: AstNode }
  | { type: "binary"; op: "+" | "-" | "*" | "/" | "^"; left: AstNode; right: AstNode }
  | { type: "call"; name: CallName; arg: AstNode };

export type ParseResult = { ok: true; ast: AstNode } | { ok: false; error: string };

const FN_NAMES = new Set(["sqrt", "sin", "cos", "tan", "log", "ln", "abs"]);

function fmt(n: number): string {
  return formatNumForDisplay(n);
}

export function parseExpressionToAst(src: string): ParseResult {
  const s = src.trim();
  if (s === "") return { ok: false, error: "Enter an expression." };

  let i = 0;
  const peek = () => s[i];
  const eat = (c: string) => {
    if (peek() === c) {
      i++;
      return true;
    }
    return false;
  };
  const skipWs = () => {
    while (i < s.length && /\s/.test(s[i]!)) i++;
  };

  function readNumber(): AstNode {
    skipWs();
    const start = i;
    while (i < s.length && /[0-9.]/.test(s[i]!)) i++;
    if (peek()?.toLowerCase() === "e") {
      i++;
      if (peek() === "+" || peek() === "-") i++;
      while (i < s.length && /[0-9]/.test(s[i]!)) i++;
    }
    const chunk = s.slice(start, i);
    const n = Number(chunk);
    if (!Number.isFinite(n)) throw new Error(`Invalid number near position ${start + 1}`);
    return { type: "number", value: n };
  }

  function readIdent(): string {
    skipWs();
    let j = i;
    while (j < s.length && /[a-zA-Z_]/.test(s[j]!)) j++;
    const id = s.slice(i, j);
    i = j;
    return id;
  }

  function parseAtom(): AstNode {
    skipWs();
    if (eat("(")) {
      const v = parseExpr();
      skipWs();
      if (!eat(")")) throw new Error("Missing closing )");
      return v;
    }
    if (/[0-9.]/.test(peek() ?? "")) {
      return readNumber();
    }
    const id = readIdent();
    if (!id) throw new Error("Unexpected character");
    const low = id.toLowerCase();
    if (low === "pi") return { type: "const", name: "pi" };
    if (low === "e") return { type: "const", name: "e" };
    if (!FN_NAMES.has(low)) throw new Error(`Unknown: ${id}`);
    skipWs();
    if (!eat("(")) throw new Error(`Expected ( after ${id}`);
    const arg = parseExpr();
    skipWs();
    if (!eat(")")) throw new Error(`Missing ) after ${id}`);
    return { type: "call", name: low as CallName, arg };
  }

  function parsePostfix(): AstNode {
    const left = parseAtom();
    skipWs();
    if (eat("^")) {
      const right = parseUnaryPost();
      return { type: "binary", op: "^", left, right };
    }
    return left;
  }

  function parseUnaryPost(): AstNode {
    skipWs();
    if (eat("-")) {
      const inner = parseUnaryPost();
      return { type: "unaryMinus", inner };
    }
    if (eat("+")) return parseUnaryPost();
    return parsePostfix();
  }

  function parseMulDiv(): AstNode {
    let left = parseUnaryPost();
    skipWs();
    for (;;) {
      if (eat("*")) {
        const right = parseUnaryPost();
        left = { type: "binary", op: "*", left, right };
      } else if (eat("/")) {
        const right = parseUnaryPost();
        left = { type: "binary", op: "/", left, right };
      } else break;
      skipWs();
    }
    return left;
  }

  function parseAddSub(): AstNode {
    let left = parseMulDiv();
    skipWs();
    for (;;) {
      if (eat("+")) {
        const right = parseMulDiv();
        left = { type: "binary", op: "+", left, right };
      } else if (eat("-")) {
        const right = parseMulDiv();
        left = { type: "binary", op: "-", left, right };
      } else break;
      skipWs();
    }
    return left;
  }

  function parseExpr(): AstNode {
    return parseAddSub();
  }

  try {
    const ast = parseExpr();
    skipWs();
    if (i < s.length) throw new Error(`Unexpected trailing: "${s.slice(i)}"`);
    return { ok: true, ast };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid expression";
    return { ok: false, error: msg };
  }
}

function constValue(name: "pi" | "e"): number {
  return name === "pi" ? Math.PI : Math.E;
}

function toRad(x: number, mode: AngleMode): number {
  return mode === "deg" ? (x * Math.PI) / 180 : x;
}

function applyCall(name: CallName, arg: number, mode: AngleMode): number {
  switch (name) {
    case "sqrt": {
      const y = Math.sqrt(arg);
      if (!Number.isFinite(y)) throw new Error(`Invalid result for sqrt(${arg})`);
      return y;
    }
    case "sin":
      return Math.sin(toRad(arg, mode));
    case "cos":
      return Math.cos(toRad(arg, mode));
    case "tan":
      return Math.tan(toRad(arg, mode));
    case "log": {
      const y = Math.log10(arg);
      if (!Number.isFinite(y)) throw new Error(`Invalid result for log(${arg})`);
      return y;
    }
    case "ln": {
      const y = Math.log(arg);
      if (!Number.isFinite(y)) throw new Error(`Invalid result for ln(${arg})`);
      return y;
    }
    case "abs":
      return Math.abs(arg);
    default:
      throw new Error(`Unknown function ${name}`);
  }
}

function applyBinary(op: "+" | "-" | "*" | "/" | "^", a: number, b: number): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) throw new Error("Division by zero");
      return a / b;
    case "^": {
      const v = a ** b;
      if (!Number.isFinite(v)) throw new Error("Invalid power result");
      return v;
    }
    default:
      return NaN;
  }
}

export type EvalOpts = { angleMode?: AngleMode };

export function evaluateAst(ast: AstNode, opts: EvalOpts = {}): number {
  const mode = opts.angleMode ?? "rad";
  switch (ast.type) {
    case "number":
      return ast.value;
    case "const":
      return constValue(ast.name);
    case "unaryMinus":
      return -evaluateAst(ast.inner, opts);
    case "call":
      return applyCall(ast.name, evaluateAst(ast.arg, opts), mode);
    case "binary":
      return applyBinary(ast.op, evaluateAst(ast.left, opts), evaluateAst(ast.right, opts));
  }
}

export function evaluateAstWithTrace(
  ast: AstNode,
  opts: EvalOpts = {},
): { value: number; steps: string[] } {
  const mode = opts.angleMode ?? "rad";

  function walk(n: AstNode): { value: number; steps: string[] } {
    switch (n.type) {
      case "number":
        return { value: n.value, steps: [] };
      case "const": {
        const v = constValue(n.name);
        return { value: v, steps: [] };
      }
      case "unaryMinus": {
        const inner = walk(n.inner);
        const v = -inner.value;
        const step =
          inner.steps.length > 0
            ? `Unary minus: −(${fmt(inner.value)}) = ${fmt(v)}`
            : `Unary minus: −${fmt(inner.value)} = ${fmt(v)}`;
        return { value: v, steps: [...inner.steps, step] };
      }
      case "call": {
        const a = walk(n.arg);
        const fv = applyCall(n.name, a.value, mode);
        if (!Number.isFinite(fv)) throw new Error(`Invalid result for ${n.name}(${a.value})`);
        const argStr = mode === "deg" && (n.name === "sin" || n.name === "cos" || n.name === "tan")
          ? `${fmt(a.value)}°`
          : fmt(a.value);
        const step = `${n.name}(${argStr}) = ${fmt(fv)}`;
        return { value: fv, steps: [...a.steps, step] };
      }
      case "binary": {
        const L = walk(n.left);
        const R = walk(n.right);
        const v = applyBinary(n.op, L.value, R.value);
        if (!Number.isFinite(v)) throw new Error("Result is not a finite number");
        const step = `${fmt(L.value)} ${n.op} ${fmt(R.value)} = ${fmt(v)}`;
        return { value: v, steps: [...L.steps, ...R.steps, step] };
      }
      default:
        return { value: NaN, steps: [] };
    }
  }

  try {
    const out = walk(ast);
    if (!Number.isFinite(out.value)) throw new Error("Result is not a finite number");
    return out;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid expression";
    throw new Error(msg);
  }
}

export function evalExpressionFromString(
  src: string,
  opts?: EvalOpts,
): { ok: true; value: number } | { ok: false; error: string } {
  const p = parseExpressionToAst(src);
  if (!p.ok) return p;
  try {
    const value = evaluateAst(p.ast, opts);
    if (!Number.isFinite(value)) return { ok: false, error: "Result is not a finite number" };
    return { ok: true, value };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid expression" };
  }
}

export function evalExpressionWithTraceFromString(
  src: string,
  opts?: EvalOpts,
): { ok: true; value: number; steps: string[] } | { ok: false; error: string } {
  const p = parseExpressionToAst(src);
  if (!p.ok) return p;
  try {
    const { value, steps } = evaluateAstWithTrace(p.ast, opts);
    return { ok: true, value, steps };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid expression" };
  }
}
