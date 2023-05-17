import Image from 'next/image'
import styles from './page.module.css'
import QRCode from 'react-qr-code'

export default function Home()
{
  return (
    <main className={styles.main}>
      <QRCode value='https://bengeendokter.be/en'></QRCode>
    </main>
  )
}
