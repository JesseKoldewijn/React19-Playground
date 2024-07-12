import RandomWords from "@/components/dynamic/random-words";

const HomePage = () => {
  return (
    <main className="flex min-h-[94svh] flex-col items-center justify-center">
      <div className="flex max-w-sm flex-col gap-2 text-center md:max-w-md">
        <h1 className="text-balance text-2xl font-bold">
          Welcome to the React19 Playground
        </h1>
        <p className="text-balance font-light">
          This application is a playground for React.js 19 features.
        </p>
      </div>
      <div className="inset-0 flex min-h-[250px] w-full max-w-sm select-none flex-wrap content-center items-center justify-center gap-x-1 gap-y-0 text-balance px-4 align-middle capitalize sm:min-h-[400px] sm:max-w-md sm:px-0">
        <RandomWords />
      </div>
    </main>
  );
};
export default HomePage;
