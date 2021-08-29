import { Box, Button } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import InputField from "../components/InputField"
import Layout from "../components/Layout"
import { useCreatePostMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = () => {
  const router = useRouter()
  const [, createPost] = useCreatePostMutation()
  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values })
          if (!error) {
            router.push("/")
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='title' placeholder='Ttle' label='Title' />
            <Box mt={4}>
              <InputField
                textarea
                name='text'
                placeholder='Text'
                label='Text'
              />
            </Box>
            <Button
              mt={4}
              colorScheme='teal'
              isLoading={isSubmitting}
              type='submit'
            >
              Create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost)
