import React, { useEffect, useRef, useState } from "react";

export default function DinoGame() {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const stateRef = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const W = 800;
    const H = 200;
    canvas.width = W;
    canvas.height = H;

    const dino = {
      x: 50,
      y: H - 40,
      w: 30,
      h: 30,
      vy: 0,
      jumping: false,
    };

    let gravity = 0.6;
    let obstacles = [];
    let frame = 0;
    let speed = 6;

    function reset() {
      obstacles = [];
      frame = 0;
      speed = 6;
      dino.y = H - 40;
      dino.vy = 0;
      dino.jumping = false;
      setScore(0);
      setGameOver(false);
      setRunning(true);
    }

    function spawnObstacle() {
      obstacles.push({
        x: W,
        y: H - 30,
        w: 20 + Math.random() * 20,
        h: 30,
      });
    }

    function update() {
      ctx.clearRect(0, 0, W, H);

      // ground
      ctx.fillStyle = "#222";
      ctx.fillRect(0, H - 10, W, 10);

      // dino
      dino.vy += gravity;
      dino.y += dino.vy;

      if (dino.y > H - 40) {
        dino.y = H - 40;
        dino.vy = 0;
        dino.jumping = false;
      }

      ctx.fillStyle = "green";
      ctx.fillRect(dino.x, dino.y, dino.w, dino.h);

      // obstacles
      ctx.fillStyle = "red";
      for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        o.x -= speed;
        ctx.fillRect(o.x, o.y, o.w, o.h);

        // collision
        if (
          dino.x < o.x + o.w &&
          dino.x + dino.w > o.x &&
          dino.y < o.y + o.h &&
          dino.y + dino.h > o.y
        ) {
          setGameOver(true);
          setRunning(false);
        }
      }

      obstacles = obstacles.filter((o) => o.x + o.w > 0);

      if (frame % 90 === 0) {
        spawnObstacle();
      }

      frame++;

      if (frame % 10 === 0) setScore((s) => s + 1);

      speed += 0.002;

      ctx.fillStyle = "black";
      ctx.fillText("Score: " + score, 700, 20);

      if (running) {
        requestRef.current = requestAnimationFrame(update);
      }
    }

    stateRef.current.reset = reset;
    stateRef.current.dino = dino;
    stateRef.current.running = running;

    if (running) update();

    return () => cancelAnimationFrame(requestRef.current);
  }, [running]);

  function jump() {
    const dino = stateRef.current.dino;
    if (!dino.jumping && running) {
      dino.vy = -10;
      dino.jumping = true;
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-xl font-bold">Offline Dino Runner</h1>
      <canvas
        ref={canvasRef}
        className="border"
        onClick={jump}
        style={{ background: "#f5f5f5" }}
      />

      <div className="flex gap-2">
        {!running && !gameOver && (
          <button
            className="px-3 py-1 border"
            onClick={() => setRunning(true)}
          >
            Start
          </button>
        )}

        {gameOver && (
          <button
            className="px-3 py-1 border"
            onClick={() => stateRef.current.reset()}
          >
            Restart
          </button>
        )}

        <button className="px-3 py-1 border" onClick={jump}>
          Jump
        </button>
      </div>

      <p>Score: {score}</p>
      {gameOver && <p className="text-red-500">Game Over</p>}
    </div>
  );
}
