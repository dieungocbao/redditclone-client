import React from "react"
import { Box, Button, Flex, Link } from "@chakra-ui/react"
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from "../generated/graphql"

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const [{ data, fetching }] = useMeQuery()
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
  let body = null
  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link>Register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <Flex>
        <Box mr='2'>{data.me.username}</Box>
        <Button
          onClick={() => logout()}
          isLoading={logoutFetching}
          variant='link'
        >
          Logout
        </Button>
      </Flex>
    )
  }
  return (
    <Flex bg='tomato' p={4}>
      <Box ml='auto'>{body}</Box>
    </Flex>
  )
}

export default Navbar
