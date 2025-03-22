import { formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Author, Startup } from "@/sanity/types";
export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };

const StartUpCard = ({ post }: { post: StartupTypeCard }) => {
  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup-card_date">{formatDate(post._createdAt)}</p>

        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{post.views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${post?.author._id}`}>
            <p className="text-16-medium">{post?.author.name}</p>
          </Link>
          <Link href={`/startup/${post?._id}`}>
            <h3 className="text-26-semibold line-clamp-1">{post.title}</h3>
          </Link>
        </div>
        <Link href={`/user/${post?.author.id}`}>
          <Image
            src="/images/logo.png"
            alt="logo"
            width={80}
            height={30}
            className="rounded-full"
          />
        </Link>
      </div>
      <Link href={`/startup/${post._Id}`}>
        <p className="startup-card_des">{post.description}</p>
        <Image src={post.image} alt="placeHold" className="startup-card_img" width={25} height={25}/>
      </Link>
      <div className="flex justify-between mt-5 gap-3">
        <Link href={`/${post.category}`} className="">
          <p>{post.category}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${post._id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export default StartUpCard;
