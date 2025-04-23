/* eslint-disable @next/next/no-img-element */
import React from "react";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Views from "@/components/Views";
import { PLAYLIST_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import { StartupTypeCard } from '@/components/StartupCard';
import StartUpCard from '@/components/StartupCard';

const Page = async ({ params }: { params: { id: string } }) => {
  const id = (await params).id;

  const [post , {select : editorPosts}] = await Promise.all([
     client.fetch(STARTUP_BY_ID_QUERY, { id }),
     client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "editor-picks-new" })
  ])
 
  if (!post) return notFound();

  return (
    <>
      <section className="pink_container pattern !min-h-[230px]">
        <p className="tag tag-tri">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="container mx-auto">
        <img
          src={post.image}
          alt="thumbnail"
          className="w-full max-h-[600px] rounded-xl aspect-auto mt-10"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author?.image}
                alt="thumbnail"
                width={64}
                height={64}
                className="rounded-[100%] drop-shadow-lg aspect-square"
              />
              <div>
                <p className="text-20-medium">{post.author?.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author?.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {post?.pitch ? (
            <div className="prose max-w-4xl font-work-sans break-words">
              <ReactMarkdown>{post.pitch}</ReactMarkdown>
            </div>
          ) : (
            <p className="no-result">No Details Provided</p>
          )}
          <hr className="divider" />

          {editorPosts.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <p className="text-30-semibold capitalize">editor picks</p>
              <ul className="grid_card-sm mt-7">
                {editorPosts.map((posts:StartupTypeCard , i:number)=>(
                  <StartUpCard key={i} post={post} />
                ))}
              </ul>
            </div>
          )}

        </div>
        <Suspense fallback={<Skeleton className="view_skeleton"></Skeleton>}>
          <Views id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default Page;
