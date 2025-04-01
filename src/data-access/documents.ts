import { Document } from '@prisma/client'

import db from '@/lib/prisma'

export async function getDocumentById(documentId: string) {
  const document = await db.document.findUnique({
    where: {
      id: documentId,
    },
  })

  return document
}

export interface GetUserDocumentsByParentDocumentIdInterface
  extends Omit<Partial<Document>, 'userId' | 'parentDocumentId'> {
  userId: string
  parentDocumentId: string | null
}
export async function getUserDocumentsByParentDocumentId({
  userId,
  parentDocumentId = null,
  ...rest
}: GetUserDocumentsByParentDocumentIdInterface) {
  const documents = await db.document.findMany({
    where: {
      userId,
      parentDocumentId,
      ...rest,
    },
  })

  return documents
}

export async function getDocumentsByUserId(userId: string) {
  const documents = await db.document.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return documents
}

export async function createDocument({ title, userId }: { title: string; userId: string }) {
  const newDoc = await db.document.create({
    data: {
      title,
      userId,
    },
  })

  return newDoc
}
