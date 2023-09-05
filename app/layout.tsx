import './globals.css'

export const metadata = {
  title: 'Local Vote',
  description: 'Make your own rankings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
