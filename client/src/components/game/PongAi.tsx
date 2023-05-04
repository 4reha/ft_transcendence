import Board from './Board';
import Paddle from './Paddle';
import Ball from './Ball';
import {
  MouseEventHandler,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';

const BOARD_WIDHT = 700;
const BOARD_HEIGHT = BOARD_WIDHT * 1.4;
const PADDLE_OFFSET = 10;
const PADDLE_WIDTH = BOARD_WIDHT / 8;
const PADDLE_HEIGHT = PADDLE_WIDTH / 5;
const BALL_DIAMETER = PADDLE_HEIGHT;
const BALL_RADIUS = BALL_DIAMETER / 2;

interface PongAiProps {
  gameRef: React.RefObject<HTMLDivElement>;
  newScore: (player: string) => void;
}

const PongAi = ({ gameRef, newScore }: PongAiProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const [ballPosition, setBallPosition] = useState({ x: 400, y: 565 });
  const [ballVelocity, setBallVelocity] = useState({ x: 5, y: -5 });
  const [ballSpeed, setBallSpeed] = useState(5);
  const [Paddle1Position, setPaddle1Position] = useState({
    x: 350,
    y: PADDLE_OFFSET,
  });
  const [Paddle2Position, setPaddle2Position] = useState({
    x: 350,
    y: BOARD_HEIGHT - PADDLE_OFFSET - PADDLE_HEIGHT,
  });

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (boardRef.current) {
      const rec = boardRef.current.getBoundingClientRect();
      const mousePosition =
        (700 * (e.clientX - rec.left)) / boardRef.current.offsetWidth - PADDLE_WIDTH/2;
      setPaddle2Position((prev) => ({ x: mousePosition, y: prev.y }));
    }
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {};

  function resetBall() {
    console.log('GOOOOOOOAAAAALLLLLLL!!!');
    if (ballPosition.y > BOARD_HEIGHT / 2) {
      newScore('AI');
    } else {
      newScore('Player');
    }
    setBallPosition((prev) => ({ x: prev.x, y: BOARD_HEIGHT / 2 }));
  }

  function checkWallCollision() {
    if (
      ballPosition.x + ballVelocity.x <= 5 ||
      ballPosition.x + BALL_DIAMETER + ballVelocity.x >= 695
    ) {
      setBallVelocity((prev) => ({ x: -prev.x, y: prev.y }));
    }
    if (
      ballPosition.y + ballVelocity.y <= 5 ||
      ballPosition.y + BALL_DIAMETER + ballVelocity.y >= 975
    ) {
      setBallVelocity((prev) => ({ x: prev.x, y: -prev.y }));
      resetBall();
    }
  }

  function checkPaddleCollision() {
    if (
      ballPosition.x + ballVelocity.x >= Paddle2Position.x &&
      ballPosition.x + BALL_DIAMETER + ballVelocity.x <=
        Paddle2Position.x + PADDLE_WIDTH
    ) {
      if (
        ballPosition.y + ballVelocity.y >=
        Paddle2Position.y - BALL_DIAMETER
      ) {
        setBallVelocity((prev) => ({ x: prev.x, y: -prev.y }));
      }
    }
    if (
      ballPosition.x + ballVelocity.x >= Paddle1Position.x &&
      ballPosition.x + BALL_DIAMETER + ballVelocity.x <=
        Paddle1Position.x + PADDLE_WIDTH
    ) {
      if (
        ballPosition.y + ballVelocity.y <=
        Paddle1Position.y + PADDLE_HEIGHT
      ) {
        setBallVelocity((prev) => ({ x: prev.x, y: -prev.y }));
      }
    }
  }

  function chaseBall() {
    if (ballVelocity.y < 0) {
      if (
        ballPosition.x > PADDLE_WIDTH / 2 - BALL_RADIUS &&
        ballPosition.x < BOARD_WIDHT - PADDLE_WIDTH / 2 - BALL_RADIUS
      ) {
        // com.y += ((ball.y - (com.y + com.height/2)))*0.1;
        setPaddle1Position((prev) => ({
          x: prev.x+ ((ballPosition.x - (prev.x + PADDLE_WIDTH / 2))) * 0.1,
          y: prev.y,
        }));
      }
    }
    // FOR SECOND PADDLE 'BOTTOM'
    else {
      if (
        ballPosition.x > PADDLE_WIDTH / 2 - BALL_RADIUS &&
        ballPosition.x < BOARD_WIDHT - PADDLE_WIDTH / 2 - BALL_RADIUS
      ) {
        setPaddle2Position((prev) => ({
          x: prev.x + ((ballPosition.x - (prev.x + PADDLE_WIDTH / 2))) * 0.1,
          y: prev.y,
        }));
      }
    }
  }

  useEffect(() => {
    // console.log(Paddle1Position.y + PADDLE_HEIGHT, ballPosition.y);

    const interval = setInterval(() => {
      setBallPosition((prev) => ({
        x: prev.x + ballVelocity.x,
        y: prev.y + ballVelocity.y,
      }));
      checkWallCollision();
      checkPaddleCollision();
      chaseBall();
    }, 1000 / 50);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ballPosition, ballVelocity]);

  return (
    <Board
      position="Bottom"
      parentRef={gameRef}
      boardRef={boardRef}
      mouseHandler={handleMouseMove}
      touchHandler={handleTouchMove}
    >
      <Paddle position={Paddle1Position} boardRef={boardRef} />
      <Ball position={ballPosition} ballRef={ballRef} />
      <Paddle position={Paddle2Position} boardRef={boardRef} />
    </Board>
  );
};

export default PongAi;
