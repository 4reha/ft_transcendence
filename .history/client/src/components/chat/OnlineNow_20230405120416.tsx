import React from "react";
import Link from 'next/link';
import Image from "next/image";

function OnlineNow ({player, avatar}: any)
{
    return (
        <Link href={`/users/${player}`}>
            <Image className="h-16 w-10 cursor-pointer rounded-full border" src={avatar} alt="Avatar" width={12} height={12} />
        </Link>
    );
}

export default OnlineNow;