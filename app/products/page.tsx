import Layout from "@/components/layout"
import ProductsTable from "@/components/products/products-table"

export const metadata = {
  title: "Products - MyStoree App",
  description: "Manage your products",
}

export default function ProductsPage() {
  return (
    <Layout>
      <ProductsTable />
    </Layout>
  )
}
