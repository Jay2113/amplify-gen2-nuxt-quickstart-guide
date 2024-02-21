import {
  fetchAuthSession,
  fetchUserAttributes,
  signIn,
  signOut,
} from "aws-amplify/auth";
import { list } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import config from "../amplifyconfiguration.json";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default defineNuxtPlugin({
  name: "AmplifyAPIs",
  enforce: "pre",
  setup() {
    return {
      provide: {
        // You can call the API by via the composable `useNuxtApp()`. For example:
        // `useNuxtApp().$Amplify.Auth.fetchAuthSession()`
        Amplify: {
          Auth: {
            fetchAuthSession,
            fetchUserAttributes,
            signIn,
            signOut,
          },
          Storage: {
            list,
          },
          GraphQL: {
            client,
          },
        },
      },
    };
  },
});
