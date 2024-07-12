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
  const [isInitialSet, setIsInitialSet] = useState(true);
  const [randomWordsArray, setRandomWordsArray] =
    useState<string[]>(initialPass);

  useEffect(() => {
    const setRandomWords = () => {
      const words = generate(initialPass.length) as string[];
      setRandomWordsArray(words);
      setIsInitialSet(false);
    };
    setTimeout(() => {
      setRandomWords();

      setInterval(() => {
        setRandomWords();
      }, 500);
    }, 2000);
  }, []);

  return (
    <>
      {randomWordsArray.map((word, idx) => {
        return (
          <div key={word + idx} className={cn(isInitialSet && "animate-pulse")}>
            {word}
          </div>
        );
      })}
    </>
  );
};

export default RandomWords;
