import Head from "next/head";
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import AuthedState from "@/components/AuthedState";
import UnauthenticatedState from "@/components/UnauthenticatedState";

export default function Home() {
  const [user, setUser] = useState({ loggedIn: null });

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  return (
    <div>
      <Head>
        <title>Flow Byte</title>
        <meta name="description" content="Explore code Users." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user.loggedIn ? <AuthedState /> : <UnauthenticatedState />}
    </div>
  );
}
