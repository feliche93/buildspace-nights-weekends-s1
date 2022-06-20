import Head from "next/head";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";

const Meta = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        {/* <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-WR7S90EQHG'
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WR7S90EQHG', { page_path: window.location.pathname });
            `,
          }}
        /> */}
      </Head>
      <DefaultSeo
        titleTemplate="Commit 2 Earn | %s"
        defaultTitle="Commit 2 Earn"
        description="Put your crypto where your mouth is. Commit to a goal and stake your crypto."
        openGraph={{
          title: "Commit 2 Earn",
          description:
            "Put your crypto where your mouth is. Commit to a goal and stake your crypto.",
          type: "website",
          locale: "en_US",
          url: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}${router.pathname}`,
          site_name: "Commit 2 Earn",
          // images: [
          //   {
          //     url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/limeDaoLogo.png`,
          //     alt: "Commit 2 Earn Website",
          //   },
          // ],
        }}
        // TODO: Adjust Twiter Handle
        // twitter={{
        //   handle: '@cryptoneur_eth',
        //   site: '@cryptoneur_eth',
        //   cardType: 'summary_large_image',
        // }}
      />
    </>
  );
};

export default Meta;
