import Head from 'next/head';
import Calendar from '../components/Calendar';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Calendrier Dynamique</title>
      </Head>
      <Calendar />
    </div>
  );
}
