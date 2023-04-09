/* eslint-disable @next/next/no-img-element */
import Layout from '@/components/layout/layout';
import { verifyToken } from '@/components/VerifyToken';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useState } from 'react';


import StartNew from '@/components/chat/startNew';
import OnlineNow from '@/components/chat/OnlineNow';
import RecentChat from '@/components/chat/recent_chat';

let socket: Socket;
//use the chat :
function Chat({ jwt_token, data }: { jwt_token: string; data: any }) {
  const [pictures, changePictures] = useState({ pfp: '', wp: '' });
  const [isLoading, setLoading] = useState(true);
  const [showStartNew, setStartNew] = useState(false);

  const handelClickBtn = () => {
    setStartNew(!showStartNew);
  }

  useEffect(() => {
    const fetchPFP = async () => {
      setLoading(true);
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_HOST+'/players/avatar?' +
          new URLSearchParams({ pfp: data.avatar }),
        {
          credentials: 'include',
        },
      );
      const pfp = await res.blob();
      const url = URL.createObjectURL(pfp);

      changePictures((pictures) => ({
        ...pictures,
        ...{ pfp: url, wp: pictures.wp },
      }));
    };
    if (pictures.pfp != data.avatar) fetchPFP();
    setLoading(false);
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat`, {
      auth: {
        token: jwt_token,
      },
    });
    socket.on('connect', () => {
      socket.emit('message', { username: 'test', message: 'hello' });
    });
    return () => {
      socket.disconnect();
    };
    
  }, []);
  
  return (
    <>
     
      <div className="flex w-[80%] h-[600px] md:h-[800px] mt-10 flex-row rounded-2xl border border-neutral-300 max-w-[1200px] ">
      <div className="h-[100%] w-[100%] md:w-[360px] flex-col  md:border-r">
          <div className="flex h-[5%] items-center border-b pl-5 w-[100%]">
            Chat Room
          </div>

          <div className="flex h-[15%] w-[100%] flex-col pl-5 pr-5">
              <div >Online Now</div>
            <div className="scroll-hide flex w-[90%] space-x-1 flex-row overflow-hidden overflow-x-auto scrollbar-hide ">
              {
                <OnlineNow player={data.nickname} avatar={pictures.pfp} />
              }  
            </div>
            <div className="flex flex-wrap justify-center overflow-y-auto sm:justify-start ">
          </div>
          </div>
          <div className="flex h-[80%] flex-col p-1 sm:p-5 sm:pt-0">
            <div className="flex flex-row justify-between border-t pt-1">
            <div>Recent Chat</div>
            <div className="md:hidden">Start New</div>
            </div>
            <div className="flex-col h-full overflow-hidden overflow-y-auto space-y-3 mt-2 onClick={}">
            {
                <RecentChat avatar={pictures.pfp} player={data.nickname} />
            }
            </div>
          </div>
        </div>
        <div className="hidden md:flex w-full justify-between flex-col ">
          <div className="flex h-[5%] w-full items-center border-b "></div>
          {
            <StartNew />
          }
         
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies['jwt_token'];

  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
    if (res.ok) {
      try {
        console.log("here")
        const data = await res.json();
        console.log("data  ", {data});
        return {
          props: {
            data,
            jwt_token: jwt_token,
          },
        };
      } catch (error: any) {
        console.error(error.message);
        return {
          props: {
            data: [],
            jwt_token: jwt_token,
          },
        };
      }
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

Chat.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
export default Chat;
