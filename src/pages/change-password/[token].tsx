import React, { useState } from "react"
import { Box, Button, Flex, Link } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import { NextPage } from "next"
import { useRouter } from "next/router"
import InputField from "../../components/InputField"
import { useChangepasswordMutation } from "../../generated/graphql"
import { toErrorMap } from "../../utils/toErrorMap"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../../utils/createUrqlClient"
import NextLink from "next/link"
import Layout from "../../components/Layout"

const ChangePassword: NextPage = () => {
  const router = useRouter()
  const [, changePassword] = useChangepasswordMutation()
  const [tokenError, setTokenError] = useState("")
  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ newPassword: "", confirmPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          if (values.newPassword !== values.confirmPassword) {
            setErrors({ confirmPassword: "Password do not match" })
          } else {
            const response = await changePassword({
              token: typeof router.query.token === 'string' ?  router.query.token: "",
              newPassword: values.newPassword,
            })
            if (response.data?.changePassword.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors)
              if ("token" in errorMap) {
                setTokenError(errorMap.token)
              }
              setErrors(errorMap)
            } else if (response.data?.changePassword.user) {
              router.push("/")
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='newPassword'
              placeholder='New password'
              label='New password'
              type='password'
            />
            <Box mt={4}>
              <InputField
                name='confirmPassword'
                placeholder='Confirm password'
                label='Confirm password'
                type='password'
              />
            </Box>
            {tokenError ? (
              <Flex mt={2}>
                <Box mr={2} color='red'>
                  {tokenError}
                </Box>
                <NextLink href='/forgot-password'>
                  <Link>Click here to get a new one</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              mt={4}
              colorScheme='teal'
              isLoading={isSubmitting}
              type='submit'
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(ChangePassword)
