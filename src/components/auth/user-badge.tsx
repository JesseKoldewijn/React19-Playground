"use client";

import { useAuth } from "@/providers/AuthProvider";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { useRouter } from "next/navigation";

const UserBadge = () => {
  const { user, clientIP } = useAuth();
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="fixed bottom-4 right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-foreground bg-foreground text-2xl text-background transition-colors duration-500 sm:bottom-5 sm:right-4 sm:h-14 sm:w-14 sm:text-3xl">
          <span
            className="inset-0"
            onClick={(e) => {
              if (!user?.username) {
                e.preventDefault();
                router.push("/login");
              }
            }}
          >
            {user?.username ? (
              <Initials username={user.username} />
            ) : (
              <Initials username="?" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent className="mb-4 mr-4 w-max rounded-lg bg-foreground px-3 py-2 text-sm text-background shadow-lg">
          {user?.username ? (
            <>
              <div className="flex gap-2">
                <strong className="w-20 whitespace-nowrap">Username</strong>
                <span className="ml-auto w-full text-right">
                  {user.username}
                </span>
              </div>
              <div className="flex gap-2">
                <strong className="w-20 whitespace-nowrap">Client IP</strong>
                <span className="ml-auto w-full text-right">{clientIP}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-2">Feel free to login!</div>
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserBadge;

const Initials = ({ username }: { username: string }) => {
  return (
    <div className="flex items-center justify-center">
      {username[0]?.toUpperCase()}
    </div>
  );
};
