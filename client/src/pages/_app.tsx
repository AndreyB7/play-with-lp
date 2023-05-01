import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>The Game</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        <link rel="preload" href='/fonts/Celtasmigoria.ttf' as="font"/>
        <link rel="preload" href='/fonts/CENSCBK.ttf' as="font"/>
        <link rel="stylesheet" href='/fonts/fonts.css'/>
        <link rel="shortcut icon" href="/favicon.svg"/>
      </Head>
      <Component { ...pageProps } />
    </>
  )
}

export default MyApp