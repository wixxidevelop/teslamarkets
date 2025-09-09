import '../styles/globals.css'
import Layout from '../components/Layout'
import { AdminProvider } from '../contexts/AdminContext'
import { ProductProvider } from '../contexts/ProductContext'
import { ConfigProvider } from '../contexts/ConfigContext'

export default function App({ Component, pageProps }) {
  return (
    <ConfigProvider>
      <AdminProvider>
        <ProductProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ProductProvider>
      </AdminProvider>
    </ConfigProvider>
  )
}
