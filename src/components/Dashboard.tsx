import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import NoCollections from "./NoCollections";
import PrimaryLink from "./PrimaryLink";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <p>You must be logged in to view this page.</p>;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  if (!user) {
    return <p>User not found</p>;
  }

  const collections = await prisma.collection.findMany({
    where: {
      OR: [
        {
          owner: {
            email: session.user.email,
          },
        },
        {
          users: {
            some: {
              email: session.user.email,
            },
          },
        },
      ],
    },
    include: {
      banks: {
        include: {
          _count: {
            select: { questions: true },
          },
        },
      },
      owner: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-400 mt-2">
        Welcome back, {session.user.name?.split?.(" ")?.[0]}!
      </p>

      {collections.length > 0 ? (
        <>
          <h1 className="text-2xl font-semibold mt-4">Your Collections</h1>
          <p className="text-gray-400 mt-2">
            Collections are groups of question banks that you can create and
            manage. They also have quizzes.
          </p>
          <div className="mt-4">
            {collections.map((collection) => (
              <div key={collection.id} className="rounded-lg">
                <h2 className="font-semibold uppercase text-gray-400">
                  {collection.name}{" "}
                  {collection.ownerId !== user.id &&
                    `(${collection.owner.name})`}
                </h2>
                <p className="text-gray-500 mt-1">{collection.description}</p>
                <div className="flex gap-4 mt-2">
                  <PrimaryLink to={`/collections/${collection.id}/qb`}>
                    Question Banks
                  </PrimaryLink>
                  <PrimaryLink to={`/collections/${collection.id}/quizzes`}>
                    Quizzes
                  </PrimaryLink>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <NoCollections />
      )}
    </div>
  );
}

/**
 * 
 * {collection.banks.map((bank) => (
                        <div
                          key={bank.id}
                          className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition duration-200 cursor-pointer"
                        >
                          <h3 className="font-semibold">{bank.name}</h3>
                          <p className="text-gray-400 mt-1">
                            {bank.description}
                          </p>
                          <p className="text-gray-500 mt-1">
                            {bank._count.questions} questions
                          </p>
                        </div>
                      ))}
                      <div className="bg-gray-900 border-dashed border-gray-400 border-3 text-white p-4 rounded-lg flex items-center justify-center min-h-20 hover:bg-gray-800 transition duration-200 cursor-pointer">
                        <p className="text-gray-400">+ Add Question Bank</p>
                      </div>
 */
