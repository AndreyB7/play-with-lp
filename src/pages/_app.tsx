import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>The Game</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet"/>
        <link rel="shortcut icon" href="favicon.svg"/>
      </Head>
      <Component { ...pageProps } />
    </>
  )
}

export default MyApp