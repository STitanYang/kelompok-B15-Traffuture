import React from "react";
import Image from "next/image";
import Link from "next/link";

// Menyimpan data menu dalam array
const menus = [
  { name: "Home", href: "/" },
  { name: "News", href: "/News" },
  { name: "Account", href: "/Account" },
];

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white h-[68px] shadow-xl flex items-center hover:bg-gray-200 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        
        {/* Logo */}
        <Image
          src="/assets/Traffuture.png"
          alt="Traffuture Logo"
          width={150}
          height={39}
        />

        {/* Navigation Menu */}
        <ul className="absolute left-1/2 -translate-x-1/2 flex space-x-6">
          {/* Looping melalui menu items */}
          {menus.map((menu, index) => (
            <li key={index}>
              <Link href={menu.href} className="text-black hover:font-bold">
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;
