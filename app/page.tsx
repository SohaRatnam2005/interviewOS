import { prisma } from "@/lib/prisma";
import CreateUserForm from "./components/create-user-form";

export default async function Home() {
  const users = await prisma.user.findMany({
    include: {
      interviews: true,
    },
  });

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">InterviewOS</h1>

      <CreateUserForm />

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Users & Their Interviews</h2>

        {users.map((user) => (
          <div key={user.id} className="mt-4 rounded border p-4">
            <h3 className="font-bold">{user.name}</h3>

            <p>{user.email}</p>

            <div className="mt-2">
              <p className="font-semibold">Interviews:</p>

              {user.interviews.map((interview) => (
                <p key={interview.id}>
                  {interview.role} — {interview.difficulty}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
