import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { LinkCard } from "@/components/Card";
import CreateQuestionBankModal from "./CreateQuestionBankModal";

type Props = {
  params: Promise<{ collectionId: string }>;
};

export default async function QuestionBanksPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { collectionId } = await params;

  if (!session?.user?.email) {
    return <p>You must be logged in to view this page.</p>;
  }

  const user = (await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  }))!;

  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
      OR: [
        {
          ownerId: user.id,
        },
        {
          users: {
            some: {
              id: user.id,
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
      owner: true,
    },
  });

  if (!collection) return notFound();

  const isOwner = collection.ownerId === user.id;

  return (
    <div>
      <h1 className="text-xl font-semibold uppercase">{collection.name}</h1>
      <p className="text-gray-400">{collection.description}</p>
      <p className="text-gray-400 mb-2">{collection.owner.name}</p>

      <h1 className="text-3xl font-bold mb-4">Question Banks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collection.banks.map((bank) => (
          <LinkCard
            key={bank.id}
            href={`/collections/${collectionId}/qb/${bank.id}`}
          >
            <h2 className="text-xl font-semibold">{bank.name}</h2>
            <p className="text-sm text-gray-400">
              {bank._count.questions} questions
            </p>
          </LinkCard>
        ))}
        {isOwner && <CreateQuestionBankModal collectionId={collectionId} />}
        {collection.banks.length === 0 && !isOwner && (
          <div>
            <h2 className="text-xl font-semibold">No Question Banks</h2>
            <p className="text-sm text-gray-400">
              This collection has no question banks. Ask the owner to create
              one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
