import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { ConfigProvider, Layout } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import Header from './components/common/Header'
import Footer from './components/common/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'VinShuttle',
  description: 'VinHome Grand Park Internal Transportation Service',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1890ff',
              },
            }}
          >
            <Layout className="min-h-screen">
              <Header />
              <main className="">
                <div className="">
                  {children}
                </div>
              </main>
              <Footer />
            </Layout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

