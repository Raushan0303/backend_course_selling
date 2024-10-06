import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content="worker-src 'self' blob:;" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}