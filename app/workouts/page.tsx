import { redirect } from "next/navigation";

export default function WorkoutsIndex() {
  redirect("/workouts/history");
}
