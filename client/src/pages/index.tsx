import Head from 'next/head';
import Image from 'next/image';
import { AnimatePresence, motion, AnimateSharedLayout } from 'framer-motion';
import { useEffect, useState } from 'react';
import Login from '@/components/home/LoginHome';
import NavBar from '@/components/home/NavBar';
import HomeText from '@/components/home/homeText';
import { verifyToken } from '@/components/VerifyToken';
import Router from 'next/router';

export default function Home({ authenticated }: { authenticated: boolean }) {
  const [state, setState] = useState([
    { name: 'Home', current: true, animation: { rotate: 0 } },
    { name: 'About', current: false, animation: { rotate: -90 } },
    { name: 'Contact', current: false, animation: { rotate: 0 } },
  ]);
  const [animate, setAnimation] = useState({ rotate: 0 });
  const [join, setJoin] = useState(false);

  function handleClick(e: any, index: number) {
    e.preventDefault();
    setJoin(false);
    const updatedState = state.map((item, i) => {
      if (i == index) {
        item.current = true;
        setAnimation(item.animation);
      } else item.current = false;
      return item;
    });
    setState(updatedState);
  }

  function handleJoin(e: any) {
    const updatedState = state.map((item, i) => {
      item.current = false;
      return item;
    });
    setState(updatedState);
    setJoin(true);
  }

  function getImageStyle() {
    if (state[0].current) return 'px-4 shrink-0';
    else if (state[1].current) return 'w-3/5 md:max-xl:w-4/5 xl:w-full';
    else return 'px-4 shrink-0';
  }

  useEffect(() => {
    if (authenticated) Router.push('/profile');
  }, []);

  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Ping Pong</title>

          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        {/* Navigation bar component */}
        <NavBar state={state} handleClick={handleClick} />

        {/* Home Content components */}
        <div className="relative pt-12">
          <div
            className={` flex items-center   gap-12
                      ${state[1].current ? 'xl:flex-row' : 'flex-col-reverse'}
                      ${
                        state[2].current
                          ? 'mr-12 justify-end'
                          : 'justify-center'
                      } 
                      ${join ? 'xl:flex-row-reverse' : 'xl:flex-row'}`}
          >
            <motion.div
              key="img"
              layoutId="test"
              initial={true}
              animate={animate}
              transition={{ type: 'Tween' }}
              exit={{ opacity: 0 }}
            >
              <div className={getImageStyle()}>
                <Image src="/game.png" alt="game" width={700} height={700} />
              </div>
            </motion.div>
            {state[0].current && <HomeText handleJoin={handleJoin} />}
            {join && <Login />}
          </div>
        </div>
      </>
    );
  }
}

export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];
  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
    if (res.ok) {
      return {
        props: {
          authenticated: true,
        },
      };
    }
  }
  return {
    props: {
      authenticated: false,
    },
  };
}
