import axios from 'axios';
import Link from 'next/link';
import React, { SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import StatusBubble from '../game/StatusBubble';

export interface friend {
  nickname: string;
  avatar: string;
  id: number;
}

export interface Status {
  friend: friend;
  status: string;
}

function OnlineNow({ player, token, ws }: any) {
  const [friends, setFriends] = useState<Status[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (ws) {
      ws.emit('getOnlineFriends', (res: []) => {
        setFriends(res);
      });
      ws.on('statusChange', (data: Status) => {
        setFriends((prev) => {
          const updatedFriends = prev.map((iter) => {
            if (iter.friend.id === data.friend.id) {
              return { ...iter, status: data.status };
            } else {
              return iter;
            }
          });

          if (data.status === 'OFFLINE') {
            return updatedFriends.filter(
              (friend) => friend.friend.id !== data.friend.id,
            );
          } else {
            return updatedFriends;
          }
        });
      });
    }
    return () => {
      // ws.off('NewLogIn')
      // ws.off('NewLogOut')
    };
  }, [ws]);

  async function getRoom(event: React.FormEvent, player1: any, player2: any) {
    event.preventDefault();

    const room = player1 + player2;

    const res = await axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/chat/getRoom?player1=${player1}&creator=${player2}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        console.log(res.data);
        router.push(`/chat/${res.data}`);
      })
      .catch((err) => console.log(err));
  }

  // useEffect(() => {
  //   async function fetchFriends() {
  //     try {
  //       const response = await axios.get(
  //         process.env.NEXT_PUBLIC_BACKEND_HOST + '/players/friends',
  //         {
  //           withCredentials: true,
  //           headers: { Authorization: `Bearer ${token}` },
  //         },
  //       );
  //       setFriends(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   fetchFriends();
  // }, []);

  return (
    <div className="flex h-[15%] w-[100%] flex-col border-b pl-5 pr-5">
      <div>Friends : </div>
      <div className="scroll-hide flex w-[90%] flex-row space-x-1 overflow-hidden overflow-x-auto scrollbar-hide">
        {friends.map((friend: any, key: number) => {
          return (
            <StatusBubble
              data={friend}
              key={key}
              className="cursor-pointer"
              onClick={(e) => getRoom(e, player, friend.nickname)}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center overflow-y-auto sm:justify-start"></div>
    </div>
  );
}

export default OnlineNow;
