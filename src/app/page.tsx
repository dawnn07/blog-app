import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await getServerSession();
  
  const user = session?.user;
  
  if(user) redirect("/blog");
  if(!user) redirect("/sign-in");
}
