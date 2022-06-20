import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MoralisProvider
        appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}
        serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MoralisProvider>
    </>
  );
}

export default MyApp;
