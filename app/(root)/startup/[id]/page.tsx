/* eslint-disable @next/next/no-img-element */
import React from "react";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Views from './../../../../components/Views';

const Page = async ({ params }: { params: { id: string } }) => {
  const id = (await params).id;

  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

  if (!post) return notFound();

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="text-base leading-7">{children}</p>
      ),
    },
    marks: {
      code: ({ children }) => (
        <code className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-sm">
          {children}
        </code>
      ),
    },
    types: {
      code: ({ value }) => (
        <pre className="bg-black text-white p-4 rounded-md overflow-x-auto my-4">
          <code>{value.code}</code>
        </pre>
      ),
    },
  };

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
          className="w-full h-auto rounded-xl"
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
                className="rounded-full drop-shadow-lg"
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
            <div className="prose max-w-4xl font-work-sans break-all">
              <PortableText value={post?.pitch} components={components} />
            </div>
          ) : (
            <p className="no-result">No Details Provided</p>
          )}
          <hr className="divider" />
        </div>
        <Suspense
          fallback={<Skeleton className="view_skeleton"></Skeleton>}
        > <Views id={id}/></Suspense>
      </section>
    </>
  );
};

export default Page;
