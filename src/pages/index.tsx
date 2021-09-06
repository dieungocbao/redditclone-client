import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, Text } from '@chakra-ui/layout'
import { Button, Flex, Heading, IconButton, Stack } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import React, { useState } from 'react'
import Layout from '../components/Layout'
import UpdootSection from '../components/UpdootSection'
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

interface PropsIF {}

const Index: React.FC<PropsIF> = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null })
  const [{ data, fetching }] = usePostsQuery({
    variables,
  })
  const [{ data: meData }] = useMeQuery()
  const [, deletePost] = useDeletePostMutation()
  if (!fetching && !data) {
    return <Box>You got query failed for some reason</Box>
  }
  return (
    <Layout>
      <Box mt={8}>
        {!data && fetching ? (
          <Box>Loading...</Box>
        ) : (
          <Stack spacing={8}>
            {data.posts.posts.map((p) =>
              !p ? null : (
                <Flex key={p._id} p={5} shadow="md" borderWidth="1px">
                  <UpdootSection post={p} />
                  <Box width="100%">
                    <NextLink href={`/post/[id]`} as={`/post/${p._id}`}>
                      <Heading fontSize="xl" cursor="pointer">
                        {p.title}
                      </Heading>
                    </NextLink>
                    <Text
                      mt={0.5}
                      fontStyle="italic"
                      color="gray"
                      fontSize="md"
                    >
                      posted by {p.creator.username}
                    </Text>
                    <Text mt={2}>{p.textSnippet}</Text>
                    {meData?.me?._id !== p.creatorId ? null : (
                      <Flex mt={2}>
                        <Box ml="auto">
                          <NextLink
                            href="/post/edit/[id]"
                            as={`/post/edit/${p._id}`}
                          >
                            <IconButton
                              colorScheme="blackAlpha"
                              aria-label="Edit Post"
                              icon={<EditIcon color="blue" />}
                            />
                          </NextLink>
                          <IconButton
                            ml={4}
                            colorScheme="blackAlpha"
                            aria-label="Edit Post"
                            icon={
                              <DeleteIcon color="tomato" cursor="pointer" />
                            }
                            onClick={() => deletePost({ id: p._id })}
                          />
                        </Box>
                      </Flex>
                    )}
                  </Box>
                </Flex>
              )
            )}
          </Stack>
        )}
      </Box>
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            colorScheme="facebook"
            m="auto"
            my={8}
            isLoading={fetching}
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
