import { Box, Button } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import InputField from "../components/InputField"
import Wrapper from "../components/Wrapper"
import { useCreatePostMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = () => {
  const router = useRouter()
  const [, createPost] = useCreatePostMutation()
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await createPost({ input: values })
          if (response.error.message) {
            // toast({
            //   title: "Account created.",
            //   description: "We've created your account for you.",
            //   status: "success",
            //   duration: 9000,
            //   isClosable: true,
            // })
          } else if (response.data?.createPost._id) {
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
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost)
