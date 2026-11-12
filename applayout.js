import './globals.css'

export const metadata = {
  title: 'Education Notes App',
  description: 'AI-powered study notes generator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="si">
      <body>{children}</body>
    </html>
  )
}