import React from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql'
import { useDebouncedCallback } from 'use-debounce'

interface UpdootSectionProps {
  post: PostSnippetFragment
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [, vote] = useVoteMutation()

  const dowwOrUpVote = (value) => {
    if (post.voteStatus === value) {
      return
    }
    vote({ postId: post._id, value })
  }

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      mr="1.25rem"
    >
      <ChevronUpIcon
        w={8}
        h={8}
        cursor="pointer"
        onClick={() => dowwOrUpVote(1)}
      />
      <Text fontSize="lg">{post.points}</Text>
      <ChevronDownIcon
        w={8}
        h={8}
        cursor="pointer"
        onClick={() => dowwOrUpVote(-1)}
      />
    </Flex>
  )
}

export default UpdootSection
