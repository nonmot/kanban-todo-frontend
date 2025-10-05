import Header from "@/components/Header";
import LP from "@/components/LP";

export default async function Home() {

  return (
    <div className="mx-auto container">
      <Header />
      <main className="">
        <LP />
      </main>
    </div>
  );
}
