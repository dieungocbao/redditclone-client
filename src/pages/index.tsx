import React, { useState } from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { usePostsQuery } from '../generated/graphql'
import Layout from '../components/Layout'
import NextLink from 'next/link'
import { Box, Text } from '@chakra-ui/layout'
import { Button, Flex, Heading, Stack } from '@chakra-ui/react'
import UpdootSection from '../components/UpdootSection'

interface PropsIF {}

const Index: React.FC<PropsIF> = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null })
  const [{ data, fetching }] = usePostsQuery({
    variables,
  })
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
            {data.posts.posts.map((p) => (
              <Flex key={p._id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box>
                  <NextLink href={`/post/[id]`} as={`/post/${p._id}`}>
                    <Heading fontSize="xl" cursor="pointer">
                      {p.title}
                    </Heading>
                  </NextLink>
                  <Text mt={0.5} fontStyle="italic" color="gray" fontSize="md">
                    posted by {p.creator.username}
                  </Text>
                  <Text mt={2}>{p.textSnippet}</Text>
                </Box>
              </Flex>
            ))}
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
