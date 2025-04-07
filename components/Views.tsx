import React from "react";
import Ping from "./Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
const Views = async ({ id }: { id: { id: string } }) => {
  const { views: totalView } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <div className="view-text">
        <span className="font-black">views : {totalView}</span>
      </div>
    </div>
  );
};

export default Views;
