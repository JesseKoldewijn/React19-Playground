"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

const UserBadge = () => {
  const { user, clientIP } = useAuth();
  const [hovering, isHovering] = useState(false);

  const router = useRouter();

  return (
    <div
      className="fixed bottom-6 right-6 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-2 bg-neutral-950 text-3xl text-neutral-100"
      onMouseEnter={() => isHovering(true)}
      onMouseLeave={() => isHovering(false)}
      onClick={(e) => {
        e.preventDefault();
        const isMobile = window.innerWidth < 768;
        if (user.value?.username) {
          if (isMobile) {
            isHovering(!hovering);
          }
        } else {
          router.push("/login");
        }
      }}
    >
      {user.value?.username ? (
        <Initials username={user.value?.username} />
      ) : (
        <Initials username={"?"} />
      )}
      <div
        style={{ display: hovering ? "block" : "none" }}
        className="fixed bottom-24 right-6 w-max rounded-lg bg-neutral-950 px-3 py-2 text-sm text-neutral-100 shadow-lg"
      >
        {user.value?.username ? (
          <>
            <div className="flex gap-2">
              <strong className="w-20 whitespace-nowrap">Username</strong>
              <span className="ml-auto w-full text-right">
                {user.value?.username}
              </span>
            </div>
            <div className="flex gap-2">
              <strong className="w-20 whitespace-nowrap">Client IP</strong>
              <span className="ml-auto w-full text-right">
                {clientIP.value}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-2">Feel free to login!</div>
          </>
        )}
      </div>
    </div>
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