import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ISL Interpreter',
  description: 'Multilingual Bidirectional Indian Sign Language Interpreter',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-3xl">sign_language</span>
            <h1 className="text-xl font-semibold tracking-tight">ISL Interpreter</h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</a>
            <a href="/conversation" className="text-gray-600 hover:text-blue-600 font-medium">Conversation</a>
            <a href="/translate" className="text-gray-600 hover:text-blue-600 font-medium">Translate</a>
            <a href="/learn" className="text-gray-600 hover:text-blue-600 font-medium">Dictionary</a>
            <a href="/settings" className="text-gray-600 hover:text-blue-600 font-medium">Settings</a>
          </nav>
          <div className="md:hidden">
            <button className="p-2"><span className="material-symbols-outlined">menu</span></button>
          </div>
        </header>
        <main className="flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
