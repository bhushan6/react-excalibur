/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-target-blank */
import { Canvas, useExcalibur } from "react-excalibur";
import "./App.css";
import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { Color, CollisionType, vec } from "excalibur";

const paddleProps = {
  x: 150,
  y: 240,
  width: 200,
  height: 20,
  color: Color.Chartreuse,
};

const ballProps = {
  x: 100,
  y: 300,
  radius: 10,
  color: Color.Red,
};

const Ball = () => {
  const ref = useRef();

  const engine = useExcalibur((state) => state.engine);

  const colliding = useRef(false);
  const ballSpeed = useMemo(() => vec(100, 100), []);

  useEffect(() => {
    ref.current.body.collisionType = CollisionType.Passive;

    let t = setTimeout(() => {
      ref.current.vel = ballSpeed;
    }, 2000);

    return () => t && clearInterval(t);
  }, [engine.drawWidth, engine.drawHeight, ballSpeed]);

  return (
    <>
      <actor
        ref={ref}
        {...ballProps}
        collisionstart={(ev) => {
          const ball = ref.current;
          let intersection = ev.contact.mtv.normalize();
          if (!colliding.current) {
            colliding.current = true;
            if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
              ball.vel.x *= -1;
            } else {
              ball.vel.y *= -1;
            }
          }
        }}
        collisionend={(ev) => {
          colliding.current = false;
        }}
        postupdate={() => {
          const ball = ref.current;

          if (ball.pos.x < ball.width / 2) {
            ball.vel.x = ballSpeed.x;
          }

          if (ball.pos.x + ball.width / 2 > engine.drawWidth) {
            ball.vel.x = ballSpeed.x * -1;
          }

          if (ball.pos.y < ball.height / 2) {
            ball.vel.y = ballSpeed.y;
          }
        }}
      />
    </>
  );
};

const Paddle = () => {
  const ref = useRef();

  const engine = useExcalibur((state) => state.engine);

  useLayoutEffect(() => {
    ref.current.body.collisionType = CollisionType.Fixed;
  }, []);

  useEffect(() => {
    if (!engine) return;

    engine.input.pointers.primary.on("move", (evt) => {
      ref.current.pos.x = evt.worldPos.x;
    });
  }, [engine]);

  return (
    <>
      <actor ref={ref} {...paddleProps} y={engine.drawHeight - 40} />
    </>
  );
};

const Brick = (props) => {
  const ref = useRef();

  return (
    <actor
      ref={ref}
      {...props}
      collisionstart={() => {
        ref.current.kill();
      }}
    />
  );
};

const Bricks = () => {
  const padding = 20;
  const xoffset = 65;
  const yoffset = 20;
  const columns = 5;
  const rows = 3;

  const brickColor = [Color.Violet, Color.Orange, Color.Yellow];

  const engine = useExcalibur((state) => state.engine);

  const brickWidth = engine.drawWidth / columns - padding - padding / columns;
  const brickHeight = 30;

  return (
    <>
      {new Array(columns).fill(null).map((_, i) => {
        return new Array(rows).fill(null).map((a, j) => {
          const data = {
            x: xoffset + i * (brickWidth + padding) + padding,
            y: yoffset + j * (brickHeight + padding) + padding,
            width: brickWidth,
            height: brickHeight,
            color: brickColor[j % brickColor.length],
            id: Math.random() * 100000000,
          };
          return (
            <>
              <Brick {...data} key={data.id} />
            </>
          );
        });
      })}
    </>
  );
};

function App() {
  const [mount, setMount] = useState(true);

  return (
    <>
      <button onClick={() => setMount((m) => !m)}>Toggle</button>
      <Canvas
        style={{ width: "100%", height: "100vh", border: "3px solid red" }}
      >
        <Paddle />
        <Ball />
        {mount && <Bricks />}
      </Canvas>
    </>
  );
}

export default App;
