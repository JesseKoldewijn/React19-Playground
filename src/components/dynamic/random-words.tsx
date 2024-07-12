"use client";

import { cn } from "@/utils/cn";
import { generate } from "random-words";
import { useEffect, useState } from "react";

const initialPass = [
  "Some",
  "Random",
  "Words",
  "Together",
  "In",
  "React19",
  "Playground",
];

const RandomWords = () => {
  const [animation, setAnimation] = useState<"in" | "out" | false>(false);
  const [randomWordsArray, setRandomWordsArray] =
    useState<string[]>(initialPass);

  const setAnimationHandler = async (direction: "in" | "out") => {
    const delay = new Promise((resolve) =>
      setTimeout(resolve, direction == "in" ? 1500 : 1000),
    );
    await delay;
    setAnimation(direction);
  };

  useEffect(() => {
    const setRandomWords = () => {
      const words = generate(initialPass.length) as string[];
      setRandomWordsArray(words);
    };

    setTimeout(() => {
      void setAnimationHandler("in")
        .then(() => setRandomWords())
        .finally(() => {
          void setAnimationHandler("out");
        });

      setInterval(() => {
        void setAnimationHandler("in")
          .then(() => setRandomWords())
          .finally(() => {
            void setAnimationHandler("out");
          });
      }, 2500);
    }, 2000);
  }, []);

  return (
    <>
      {randomWordsArray.map((word, idx) => {
        return (
          <div
            key={word + idx}
            className={cn(
              "transition-colors duration-500 ease-linear",
              animation === "in" ? "text-background" : "text-foreground",
            )}
          >
            {word}
          </div>
        );
      })}
    </>
  );
};

export default RandomWords;
