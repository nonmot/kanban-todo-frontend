import Header from "@/components/Header";
import LP from "@/components/LP";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await auth();

  return (
    <div className="mx-auto container">
      <Header />
      <main className="">
        <LP />
      </main>
    </div>
  );
}
