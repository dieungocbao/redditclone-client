import { cacheExchange } from "@urql/exchange-graphcache"
import { debugExchange, Exchange, fetchExchange } from "urql"
import { pipe, tap } from "wonka"
import {
  CreatePostMutation,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  PostsDocument,
  PostsQuery,
  RegisterMutation,
} from "../generated/graphql"
import { betterUpdateQuery } from "../utils/betterUpdateQuery"
import Router from "next/router"

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.toLowerCase().includes("access denied")) {
          Router.replace("/login")
        }
      })
    )
  }

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    debugExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({
                me: null,
              })
            )
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query
                } else {
                  return {
                    me: result.login.user,
                  }
                }
              }
            )
          },
        },
        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.register.errors) {
                return query
              } else {
                return {
                  me: result.register.user,
                }
              }
            }
          )
        },
        createPost: (_result, args, cache, info) => {
          betterUpdateQuery<PostsQuery, PostsQuery>(
            cache,
            { query: PostsDocument },
            _result,
            (result, query) => {
              if (!result.posts) {
                return query
              } else {
                return {
                  posts: result.posts,
                }
              }
            }
          )
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
})
