import React from "react";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";
import UserStartup from "@/components/UserStartup";
const page = async ({ params }: { params: { id: string } }) => {
  const id = (await params).id;
  const session = await auth();
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();
  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>
          <Image
            src={user?.image}
            alt={user.name}
            width={220}
            height={220}
            className="profile_image"
          />

          <h1 className="text-30-extrabold mt-7 text-center">
            {" "}
            @{user?.username}
          </h1>
          <span className="mt-1 text-center text-14-normal">{user?.bio} </span>
        </div>
        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {session?.id === id ? "Your" : "All"} Startups
          </p>
          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartup id={id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default page;
