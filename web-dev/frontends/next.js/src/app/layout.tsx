// Global CSS
import "./globals.css"

// Mantine
import { ColorSchemeScript, MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"

export const metadata = {
  title: "Template - Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}