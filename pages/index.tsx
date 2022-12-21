import Head from 'next/head'
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Teams Minesweeper</title>
        <meta name="description" content="Collaborative Minesweeper for Teams" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
          <h1>Minesweeper collab</h1>

        <div>
          <p>A collaborative minesweeper for Teams</p>
        </div>
        
      </main>
    </>
  )
}
