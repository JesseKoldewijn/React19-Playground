const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex max-w-sm flex-col gap-2 text-center md:max-w-md">
        <h1 className="text-balance text-2xl font-bold">
          Welcome to the React19 Playground
        </h1>
        <p className="text-balance font-light">
          This application is a playground for React.js 19 features.
        </p>
      </div>
    </main>
  );
};
export default HomePage;
