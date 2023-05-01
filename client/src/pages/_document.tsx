import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href='/fonts/fonts.css' as="style"/>
        <link rel="shortcut icon" href="/favicon.svg"/>
      </Head>
      <body>
      <Main />
      <NextScript />
      </body>
    </Html>
  )
}