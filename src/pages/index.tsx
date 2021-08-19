import React from "react"
import { withUrqlClient } from "next-urql"
import Navbar from "../components/Navbar"
import { createUrqlClient } from "../utils/createUrqlClient"

interface PropsIF {}

const Index: React.FC<PropsIF> = () => {
  return (
    <>
      <Navbar />
      <div>Hello world</div>
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
