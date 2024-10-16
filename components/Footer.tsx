export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About NextShop</h3>
            <p className="text-sm">NextShop is your modern e-commerce solution, offering a wide range of products with a seamless shopping experience.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:underline">Home</a></li>
              <li><a href="#" className="text-sm hover:underline">Products</a></li>
              <li><a href="#" className="text-sm hover:underline">About Us</a></li>
              <li><a href="#" className="text-sm hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm">123 E-commerce Street</p>
            <p className="text-sm">Shopville, SH 12345</p>
            <p className="text-sm">Email: info@nextshop.com</p>
            <p className="text-sm">Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm">&copy; 2023 NextShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}