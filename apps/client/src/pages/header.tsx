import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-pink-500 to-purple-500">
      <div className="container mx-auto py-4 px-8 flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          My Website
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-white hover:text-gray-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-white hover:text-gray-200">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-white hover:text-gray-200">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
