import React, { useState } from "react"
import { Formik, Form } from "formik"
import { Box, Button } from "@chakra-ui/react"
import InputField from "../components/InputField"
import { useForgotPasswordMutation } from "../generated/graphql"
import { useRouter } from "next/router"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient"
import Layout from "../components/Layout"

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const router = useRouter()
  const [complete, setComplete] = useState(false)
  const [, forgotPassword] = useForgotPasswordMutation()
  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword(values)
          setComplete(true)
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              If an account with that email exists, we sent you an email
            </Box>
          ) : (
            <Form>
              <InputField name='email' placeholder='Email' label='Email' />
              <Button
                mt={4}
                colorScheme='teal'
                isLoading={isSubmitting}
                type='submit'
              >
                Forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)
