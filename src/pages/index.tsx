import React from "react"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { usePostsQuery } from "../generated/graphql"
import Layout from "../components/Layout"
import NextLink from "next/link"
import { Box, Link } from "@chakra-ui/layout"

interface PropsIF {}

const Index: React.FC<PropsIF> = () => {
  const [{ data }] = usePostsQuery()
  return (
    <Layout>
      <NextLink href='/create-post'>
        <Link>Create post</Link>
      </NextLink>
      <Box mt={8}>
        {!data ? (
          <Box>Loading...</Box>
        ) : (
          data.posts.map((p) => (
            <Box key={p._id} mt={2}>
              {p.title}
            </Box>
          ))
        )}
      </Box>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
