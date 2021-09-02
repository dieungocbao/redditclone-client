import React, { useState } from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { usePostsQuery } from '../generated/graphql'
import Layout from '../components/Layout'
import NextLink from 'next/link'
import { Box, Text } from '@chakra-ui/layout'
import { Button, Flex, Heading, Stack } from '@chakra-ui/react'

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
      <Flex align="center">
        <Heading>LiReddit</Heading>
        <Button ml="auto" colorScheme="teal">
          <NextLink href="/create-post">Create post</NextLink>
        </Button>
      </Flex>
      <Box mt={8}>
        {!data && fetching ? (
          <Box>Loading...</Box>
        ) : (
          <Stack spacing={8}>
            {data.posts.posts.map((p) => (
              <Box key={p._id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={0.5} fontStyle="italic" color="gray" fontSize="md">
                  posted by {p.creator.username}
                </Text>
                <Text mt={2}>{p.textSnippet}</Text>
              </Box>
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
