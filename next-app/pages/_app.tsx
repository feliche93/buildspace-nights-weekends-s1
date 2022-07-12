import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import Layout from "../components/layout/Layout";
import PlausibleProvider from "next-plausible";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MoralisProvider
        appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}
        serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}
      >
        <PlausibleProvider
          domain="commit2earn.xyz"
          trackOutboundLinks={true}
          trackLocalhost={false}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PlausibleProvider>
      </MoralisProvider>
    </>
  );
}

export default MyApp;
