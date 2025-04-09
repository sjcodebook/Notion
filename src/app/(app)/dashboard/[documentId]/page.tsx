'use client'

import { use, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useServerAction } from 'zsa-react'

import { getDocumentByIdAction } from '../../actions'
import { updateDocumentAction } from '../../actions'

import { useServerActionQuery, QueryKeyFactory } from '@/hooks/use-server-action-hooks'

import Toolbar from '@/components/toolbar'
import Cover from '@/components/cover'
import { Skeleton } from '@/components/ui/skeleton'

interface DocumentIdPageParams {
  documentId: string
}

const DocumentIdPage = ({ params }: { params: Promise<DocumentIdPageParams> }) => {
  const Editor = useMemo(
    () =>
      dynamic(() => import('@/components/editor'), {
        ssr: false,
      }),
    []
  )
  const { documentId } = use(params)
  const { isLoading, data: document } = useServerActionQuery(getDocumentByIdAction, {
    input: {
      documentId,
    },
    queryKey: QueryKeyFactory.getDocumentByIdAction(documentId),
  })

  const { execute: updateDoc } = useServerAction(updateDocumentAction)

  const updateData = useCallback(
    async (content: any) => {
      await updateDoc({
        id: documentId,
        content: content,
      })
    },
    [documentId, updateDoc]
  )

  if (isLoading) {
    return (
      <div>
        <Cover.Skeleton />
        <div className='md:max-w-3xl lg:max-w-4xl mx-auto mt-10'>
          <div className='space-y-4 pl-8 pt-4'>
            <Skeleton className='h-14 w-[50%]' />
            <Skeleton className='h-4 w-[80%]' />
            <Skeleton className='h-4 w-[40%]' />
            <Skeleton className='h-4 w-[60%]' />
          </div>
        </div>
      </div>
    )
  }

  if (document?.error) {
    return <div>Something went wrong</div>
  }

  if (!document?.data) {
    return <div>Document not found</div>
  }

  return (
    <div className='pb-40'>
      <div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
        <Cover url={document.data.coverImage ?? ''} />
        <Toolbar
          initialData={{
            id: document.data.id,
            title: document.data.title,
            content: document.data.content,
            coverImage: document.data.coverImage,
            icon: document.data.icon,
          }}
          preview={false}
        />
        <Editor
          onChange={(content) => {
            updateData(content)
          }}
          initialContent={document.data.content}
        />
      </div>
    </div>
  )
}

export default DocumentIdPage
