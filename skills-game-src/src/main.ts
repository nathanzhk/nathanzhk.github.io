import "./style.css";

type Vec2 = {
  x: number;
  y: number;
};

type Pad = Vec2 & {
  size: number;
  color: string;
  label: string;
};

type Player = Vec2 & {
  radius: number;
};

type Jump = {
  active: boolean;
  from: Vec2;
  to: Vec2;
  startTime: number;
  duration: number;
};

type Feedback = {
  successAt: number;
  failAt: number;
};

type GameState = {
  width: number;
  height: number;
  dpr: number;
  currentPad: Pad;
  targetPad: Pad;
  player: Player;
  score: number;
  charging: boolean;
  chargeStart: number;
  chargeValue: number;
  gameOver: boolean;
  jump: Jump;
  feedback: Feedback;
};

function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Missing required DOM node: ${selector}`);
  }

  return element;
}

const canvas = requiredElement<HTMLCanvasElement>("#game");
const scoreNode = requiredElement<HTMLElement>("#score");
const restartButton = requiredElement<HTMLButtonElement>("#restart");
const hintNode = requiredElement<HTMLElement>("#hint");

const context = canvas.getContext("2d");

if (!context) {
  throw new Error("Canvas 2D is not supported.");
}

const ctx: CanvasRenderingContext2D = context;

const state: GameState = {
  width: 0,
  height: 0,
  dpr: 1,
  currentPad: { x: 0, y: 0, size: 118, color: "#ffffff", label: "Java Expert" } satisfies Pad,
  targetPad: { x: 0, y: 0, size: 118, color: "#ffffff", label: "Cybersecurity Degree" } satisfies Pad,
  player: { x: 0, y: 0, radius: 18 } satisfies Player,
  score: 0,
  charging: false,
  chargeStart: 0,
  chargeValue: 0,
  gameOver: false,
  jump: {
    active: false,
    from: { x: 0, y: 0 },
    to: { x: 0, y: 0 },
    startTime: 0,
    duration: 420,
  } satisfies Jump,
  feedback: {
    successAt: -1000,
    failAt: -1000,
  } satisfies Feedback,
};

const maxChargeMs = 1300;
const minJumpDistance = 54;
const maxJumpDistance = 330;
const minPadGap = 38;
const padPalette = ["#ffffff"];
const skillHighlights = [
  "Java Expert",
  "Cybersecurity Degree",
  "Python Proficiency",
  "TypeScript + Node.js",
  "Frontend Engineering",
  "Security Mindset",
  "API Design",
  "Automation Scripting",
  "Cloud Deployment",
  "Debugging",
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function normalize(v: Vec2): Vec2 {
  const length = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / length, y: v.y / length };
}

function tileMargin(size: number): number {
  return size / 2 + 24;
}

function clampPadToBounds(pad: Pad): void {
  const margin = tileMargin(pad.size);
  pad.x = clamp(pad.x, margin, state.width - margin);
  pad.y = clamp(pad.y, margin + 36, state.height - margin);
}

function tilesAreSeparated(a: Pad, b: Pad, gap = minPadGap): boolean {
  const minAxisGap = a.size / 2 + b.size / 2 + gap;

  return Math.abs(a.x - b.x) >= minAxisGap || Math.abs(a.y - b.y) >= minAxisGap;
}

function scalePoint(point: Vec2, scaleX: number, scaleY: number): void {
  point.x *= scaleX;
  point.y *= scaleY;
}

function resize(): void {
  const previousWidth = state.width;
  const previousHeight = state.height;
  const rect = canvas.getBoundingClientRect();
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.width = rect.width;
  state.height = rect.height;
  canvas.width = Math.floor(rect.width * state.dpr);
  canvas.height = Math.floor(rect.height * state.dpr);
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

  if (previousWidth === 0 || previousHeight === 0) {
    reset();
    return;
  }

  const scaleX = state.width / previousWidth;
  const scaleY = state.height / previousHeight;
  scalePoint(state.currentPad, scaleX, scaleY);
  scalePoint(state.targetPad, scaleX, scaleY);
  scalePoint(state.player, scaleX, scaleY);
  scalePoint(state.jump.from, scaleX, scaleY);
  scalePoint(state.jump.to, scaleX, scaleY);
  clampPadToBounds(state.currentPad);
  clampPadToBounds(state.targetPad);
  state.player.x = clamp(state.player.x, state.player.radius, state.width - state.player.radius);
  state.player.y = clamp(state.player.y, state.player.radius, state.height - state.player.radius);

  if (!tilesAreSeparated(state.currentPad, state.targetPad)) {
    state.targetPad = randomTargetPad(state.currentPad);
  }
}

function randomTargetPad(from: Pad): Pad {
  const size = lerp(96, 168, Math.random());
  const visualMargin = tileMargin(size);
  const minDistance = from.size / 2 + size / 2 + minPadGap;
  const maxDistance = Math.min(320, state.width * 0.38, state.height * 0.36);
  const distanceRange = Math.max(24, maxDistance - minDistance);
  let position: Vec2 | null = null;
  const isInBounds = (point: Vec2): boolean =>
    point.x >= visualMargin &&
    point.x <= state.width - visualMargin &&
    point.y >= visualMargin + 36 &&
    point.y <= state.height - visualMargin;
  const candidateTile = (point: Vec2): Pad => ({
    x: point.x,
    y: point.y,
    size,
    color: "",
    label: "",
  });
  const isSeparated = (point: Vec2, gap = minPadGap): boolean => tilesAreSeparated(from, candidateTile(point), gap);
  const useCandidate = (point: Vec2): boolean => {
    if (!isInBounds(point) || !isSeparated(point)) {
      return false;
    }

    position = point;
    return true;
  };

  for (let attempt = 0; attempt < 18; attempt += 1) {
    const angleBase = -Math.PI * 0.28;
    const angle = angleBase + (Math.random() - 0.5) * Math.PI * 1.25;
    const dist = minDistance + Math.random() * distanceRange;
    const candidate = {
      x: from.x + Math.cos(angle) * dist,
      y: from.y + Math.sin(angle) * dist,
    };

    if (useCandidate(candidate)) {
      break;
    }
  }

  if (!position) {
    const directions = [
      { x: 1, y: -0.25 },
      { x: 1, y: 0.4 },
      { x: -1, y: -0.25 },
      { x: -1, y: 0.4 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
    ].map(normalize);

    for (const direction of directions) {
      for (const dist of [minDistance, minDistance + 48, minDistance + 96, maxDistance]) {
        if (
          useCandidate({
            x: from.x + direction.x * dist,
            y: from.y + direction.y * dist,
          })
        ) {
          break;
        }
      }

      if (position) {
        break;
      }
    }
  }

  if (!position) {
    let best: Vec2 | null = null;
    let bestDistance = -Infinity;
    const step = 18;

    for (let y = visualMargin + 36; y <= state.height - visualMargin; y += step) {
      for (let x = visualMargin; x <= state.width - visualMargin; x += step) {
        const point = { x, y };

        if (!isSeparated(point, 0)) {
          continue;
        }

        const candidateDistance = Math.hypot(point.x - from.x, point.y - from.y);

        if (candidateDistance > bestDistance) {
          best = point;
          bestDistance = candidateDistance;
        }
      }
    }

    position = best ?? {
      x: clamp(from.x + minDistance, visualMargin, state.width - visualMargin),
      y: clamp(from.y + minDistance, visualMargin + 36, state.height - visualMargin),
    };
  }

  const color = padPalette[(state.score + 1) % padPalette.length] ?? "#ffffff";
  const label = skillHighlights[(state.score + 1) % skillHighlights.length] ?? "Technical Strength";

  return {
    x: position.x,
    y: position.y,
    size,
    color,
    label,
  };
}

function reset(): void {
  state.currentPad = {
    x: state.width * 0.3,
    y: state.height * 0.62,
    size: 118,
    color: "#ffffff",
    label: skillHighlights[0] ?? "Java Expert",
  };
  state.targetPad = randomTargetPad(state.currentPad);
  state.player.x = state.currentPad.x;
  state.player.y = state.currentPad.y;
  state.score = 0;
  state.charging = false;
  state.chargeValue = 0;
  state.gameOver = false;
  state.jump.active = false;
  state.feedback.successAt = -1000;
  state.feedback.failAt = -1000;
  scoreNode.textContent = "0";
  hintNode.textContent = "Hold and Release";
}

function getJumpDirection(): Vec2 {
  return normalize({
    x: state.targetPad.x - state.player.x,
    y: state.targetPad.y - state.player.y,
  });
}

function startCharge(now: number): void {
  if (state.gameOver) {
    reset();
    return;
  }

  if (state.jump.active) {
    return;
  }

  state.charging = true;
  state.chargeStart = now;
}

function releaseCharge(now: number): void {
  if (!state.charging || state.jump.active) {
    return;
  }

  state.charging = false;
  const chargeMs = clamp(now - state.chargeStart, 0, maxChargeMs);
  const charge = chargeMs / maxChargeMs;
  const power = minJumpDistance + charge * maxJumpDistance;
  const direction = getJumpDirection();

  state.jump = {
    active: true,
    from: { x: state.player.x, y: state.player.y },
    to: {
      x: state.player.x + direction.x * power,
      y: state.player.y + direction.y * power,
    },
    startTime: now,
    duration: lerp(260, 560, charge),
  };
  state.chargeValue = 0;
}

function finishJump(now: number): void {
  state.jump.active = false;
  const hitPadding = state.player.radius * 0.35;
  const half = state.targetPad.size / 2 - hitPadding;
  const hit =
    Math.abs(state.player.x - state.targetPad.x) <= half &&
    Math.abs(state.player.y - state.targetPad.y) <= half;

  if (!hit) {
    state.gameOver = true;
    state.feedback.failAt = now;
    hintNode.textContent = "Missed. Click to Restart";
    return;
  }

  state.score += 1;
  scoreNode.textContent = String(state.score);
  state.feedback.successAt = now;
  state.currentPad = {
    ...state.targetPad,
    color: padPalette[state.score % padPalette.length] ?? "#ffffff",
  };
  state.targetPad = randomTargetPad(state.currentPad);
}

function update(now: number): void {
  if (state.charging) {
    state.chargeValue = clamp((now - state.chargeStart) / maxChargeMs, 0, 1);
  }

  if (state.jump.active) {
    const t = clamp((now - state.jump.startTime) / state.jump.duration, 0, 1);
    const eased = easeOutCubic(t);
    state.player.x = lerp(state.jump.from.x, state.jump.to.x, eased);
    state.player.y = lerp(state.jump.from.y, state.jump.to.y, eased);

    if (t >= 1) {
      finishJump(now);
    }
  }
}

function clearScene(): void {
  ctx.clearRect(0, 0, state.width, state.height);
  ctx.fillStyle = "#f4f2ed";
  ctx.fillRect(0, 0, state.width, state.height);
}

function wrapLabel(text: string, maxWidth: number, fontSize: number): string[] {
  ctx.font = `700 ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;

  const tokens = text.includes(" ") ? text.split(/\s+/) : Array.from(text);
  const lines: string[] = [];
  let current = "";

  for (const token of tokens) {
    const separator = text.includes(" ") && current ? " " : "";
    const next = `${current}${separator}${token}`;

    if (ctx.measureText(next).width <= maxWidth || !current) {
      current = next;
    } else {
      lines.push(current);
      current = token;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function fitLabel(text: string, maxWidth: number, maxLines: number): { lines: string[]; fontSize: number } {
  for (let fontSize = 16; fontSize >= 10; fontSize -= 1) {
    const lines = wrapLabel(text, maxWidth, fontSize);

    if (lines.length <= maxLines && lines.every((line) => ctx.measureText(line).width <= maxWidth)) {
      return { lines, fontSize };
    }
  }

  const lines = wrapLabel(text, maxWidth, 10).slice(0, maxLines);
  return { lines, fontSize: 10 };
}

function drawPadLabel(pad: Pad): void {
  const maxWidth = pad.size - 22;
  const { lines, fontSize } = fitLabel(pad.label, maxWidth, 3);
  const lineHeight = fontSize + 3;
  const blockHeight = (lines.length - 1) * lineHeight;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
  ctx.fillStyle = "#1d1d1f";
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  lines.forEach((line, index) => {
    ctx.fillText(line, pad.x, pad.y - blockHeight / 2 + index * lineHeight);
  });

  ctx.restore();
}

function drawPad(pad: Pad, isTarget: boolean, now: number): void {
  const pulseAge = now - state.feedback.successAt;
  const showPulse = !isTarget && pulseAge >= 0 && pulseAge < 420;
  const half = pad.size / 2;
  const bevel = 8;

  ctx.save();
  ctx.fillStyle = pad.color;
  ctx.beginPath();
  ctx.roundRect(pad.x - half, pad.y - half, pad.size, pad.size, bevel);
  ctx.fill();

  ctx.strokeStyle = "rgba(29, 29, 31, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(pad.x - half + 1, pad.y - half + 1, pad.size - 2, pad.size - 2, bevel);
  ctx.stroke();

  drawPadLabel(pad);

  if (isTarget) {
    ctx.strokeStyle = "rgba(29, 29, 31, 0.22)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 9]);
    ctx.beginPath();
    ctx.roundRect(pad.x - half - 10, pad.y - half - 10, pad.size + 20, pad.size + 20, bevel + 5);
    ctx.stroke();
  }

  if (showPulse) {
    const t = pulseAge / 420;
    const spread = 14 + t * 34;
    ctx.strokeStyle = `rgba(29, 29, 31, ${0.28 * (1 - t)})`;
    ctx.lineWidth = 5 * (1 - t);
    ctx.beginPath();
    ctx.roundRect(
      pad.x - half - spread,
      pad.y - half - spread,
      pad.size + spread * 2,
      pad.size + spread * 2,
      bevel + spread * 0.2,
    );
    ctx.stroke();
  }

  ctx.restore();
}

function drawCharge(now: number): void {
  if (!state.charging) {
    return;
  }

  const direction = getJumpDirection();
  const charge = state.chargeValue;
  const cappedPulse = charge >= 0.98 ? 1 + Math.sin(now / 70) * 0.08 : 1;
  const lineLength = (52 + charge * 190) * cappedPulse;
  const ringRadius = (state.player.radius + 10 + charge * 30) * cappedPulse;

  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = `rgba(29, 29, 31, ${0.22 + charge * 0.38})`;
  ctx.lineWidth = 3 + charge * 5;
  ctx.beginPath();
  ctx.moveTo(state.player.x, state.player.y);
  ctx.lineTo(state.player.x + direction.x * lineLength, state.player.y + direction.y * lineLength);
  ctx.stroke();

  ctx.strokeStyle = `rgba(29, 29, 31, ${0.18 + charge * 0.28})`;
  ctx.lineWidth = 2 + charge * 4;
  ctx.beginPath();
  ctx.arc(state.player.x, state.player.y, ringRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawPlayer(now: number): void {
  const charge = state.chargeValue;
  const failAge = now - state.feedback.failAt;
  const failShake = failAge >= 0 && failAge < 460 ? Math.sin(now / 20) * (1 - failAge / 460) * 5 : 0;
  const jumpLift = state.jump.active ? Math.sin(clamp((now - state.jump.startTime) / state.jump.duration, 0, 1) * Math.PI) : 0;
  const squash = state.charging ? 1 - charge * 0.24 : 1 + jumpLift * 0.1;
  const stretch = state.charging ? 1 + charge * 0.14 : 1 - jumpLift * 0.04;
  const liftShadow = 1 - jumpLift * 0.45;

  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${0.28 * liftShadow})`;
  ctx.beginPath();
  ctx.ellipse(
    state.player.x + 7,
    state.player.y + 14 + jumpLift * 18,
    state.player.radius * (1.1 + jumpLift * 0.6),
    state.player.radius * 0.42,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(state.player.x + failShake, state.player.y - jumpLift * 22);
  ctx.scale(stretch, squash);

  const ball = ctx.createRadialGradient(
    -state.player.radius * 0.36,
    -state.player.radius * 0.44,
    state.player.radius * 0.18,
    0,
    0,
    state.player.radius * 1.1,
  );
  ball.addColorStop(0, "#f7f4ec");
  ball.addColorStop(0.16, "#d8d2c4");
  ball.addColorStop(0.78, "#5f5c56");
  ball.addColorStop(1, "#262626");
  ctx.fillStyle = ball;
  ctx.beginPath();
  ctx.arc(0, 0, state.player.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.24)";
  ctx.beginPath();
  ctx.arc(-state.player.radius * 0.34, -state.player.radius * 0.36, state.player.radius * 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function render(now: number): void {
  clearScene();
  drawPad(state.targetPad, true, now);
  drawPad(state.currentPad, false, now);
  drawCharge(now);
  drawPlayer(now);
}

function frame(now: number): void {
  update(now);
  render(now);
  requestAnimationFrame(frame);
}

canvas.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  startCharge(performance.now());
});

canvas.addEventListener("pointerup", (event) => {
  event.preventDefault();
  releaseCharge(performance.now());
});

canvas.addEventListener("pointercancel", () => {
  state.charging = false;
  state.chargeValue = 0;
});

restartButton.addEventListener("click", reset);
window.addEventListener("resize", resize);

resize();
requestAnimationFrame(frame);
