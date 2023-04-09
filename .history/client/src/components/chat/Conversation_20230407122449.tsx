import React from "react";
import axios from "axios";
import { useRouter } from "next/router";

function Conversation (nickname: any) {
  const router = useRouter();
  async function talk(nickname: any) {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_HOST + '/chat/privateMessages',
          {
            withCredentials: true,
            params: {
              nickname: nickname,
            },
          },
        );
        router.push('/chat/' + res.data);
      }
    return(
        <div className="flex flex-col w-[100%] h-[95%] border-t m-auto border">
            <div className="sm:flex flex-col relative flex mt-1">
                  <input type="text" name="nickname" id="nickname"
                    className=" border-white w-[90%]
                    peer block w-full appearance-none rounded-full border-2 bg-transparent
                    py-2.5 px-3  text-xs sm:text-sm 
                    text-white focus:border-blue-600 focus:outline-none focus:ring-0 overflow-hidden"
                    placeholder="player" required/>
                    <button />
                      <svg  type="submit"
                      className="lg:right-0 lg:top-0 lg:absolute border-white peer block appearance-none mt-2
                            rounded-full border-2 bg-transparent py-2.5 px-3 text-xs sm:text-sm w-[50%] sm:w-[100px]
                             text-white focus:border-blue-600 focus:outline-none focus:ring-0 bg-blue-500 sm:m-5 lg:m-0"
                             <path d="client/public/Send.svg" />
                             
                             >
                      send
                  </div>
        </div>
    );
}

export default Conversation;