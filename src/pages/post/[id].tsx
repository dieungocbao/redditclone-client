import React, { useState } from 'react'
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import NextLink from 'next/link'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { usePostQuery } from '../../generated/graphql'

const SinglePost: NextPage = () => {
  const router = useRouter()
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  })
  if (fetching) {
    return (
      <Layout>
        <Box>Loading...</Box>
      </Layout>
    )
  }
  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find post</Box>
      </Layout>
    )
  }
  return (
    <Layout>
      <Heading>{data.post.title}</Heading>
      <Box mt={8}>{data.post.text}</Box>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(SinglePost)
