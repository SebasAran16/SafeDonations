import "../styles/globals.css";
import { MainLayout } from "../src/layouts/main-layout";
import { MoralisProvider } from "react-moralis";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { NotificationProvider } from "@web3uikit/core";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/49547/goerlisafedonations/v0.0.1",
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout || ((page) => <MainLayout>{page}</MainLayout>);
  return (
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <NotificationProvider>
          {getLayout(<Component {...pageProps} />)}
        </NotificationProvider>
      </ApolloProvider>
    </MoralisProvider>
  );
}
