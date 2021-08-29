import React from 'react'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { usePostsQuery } from '../generated/graphql'
import Layout from '../components/Layout'
import NextLink from 'next/link'
import { Box, Link, Text } from '@chakra-ui/layout'
import { Button, Flex, Heading, Stack } from '@chakra-ui/react'

interface PropsIF {}

const Index: React.FC<PropsIF> = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
    },
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
            {data.posts.map((p) => (
              <Box key={p._id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
      {data ? (
        <Flex>
          <Button colorScheme="facebook" m="auto" my={8}>
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
