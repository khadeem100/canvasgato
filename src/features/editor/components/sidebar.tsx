"use client";

import React, { useState } from "react";
import {
  LayoutTemplate,
  ImageIcon,
  Pencil,
  Settings,
  Shapes,
  Sparkles,
  Type,
} from "lucide-react";

import { ActiveTool } from "@/features/editor/types";
import { SidebarItem } from "@/features/editor/components/sidebar-item";

// Mock product data
const productCategories = {
  Tshirts: [
    { id: 1, name: "Classic T-shirt", image: "/images/tshirt.png", colors: ["Red", "Blue", "Black", "White"] },
  ],
  Hoodies: [
    { id: 2, name: "Comfort Hoodie", image: "/images/hoodie.png", colors: ["Gray", "Black", "White"] },
  ],
  Pants: [
    { id: 3, name: "Jogger Pants", image: "/images/pants.png", colors: ["Black", "Navy"] },
  ],
  Longsleeves: [
    { id: 4, name: "Long Sleeve Tee", image: "/images/longsleeve.png", colors: ["Red", "Blue"] },
  ],
  Bags: [
    { id: 5, name: "Stylish Bag", image: "/images/bag.png", colors: ["Brown", "Black"] },
  ],
  Sponges: [
    { id: 6, name: "Kitchen Sponge", image: "/images/sponge.png", colors: ["Yellow", "Green"] },
  ],
};

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Sidebar = ({
  activeTool,
  onChangeActiveTool,
}: SidebarProps) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof productCategories>("Tshirts");
  const [selectedProduct, setSelectedProduct] = useState<null | (typeof productCategories)[keyof typeof productCategories][0]>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleProductSelect = (product: (typeof productCategories)[keyof typeof productCategories][0]) => {
    setSelectedProduct(product);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setPopupOpen(false); // Close the popup after selecting the color
  };

  const filteredProducts = productCategories[selectedCategory].filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <aside className="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto">
        <ul className="flex flex-col">
          <SidebarItem
            icon={LayoutTemplate}
            label="Design"
            isActive={activeTool === "templates"}
            onClick={() => onChangeActiveTool("templates")}
          />
          <SidebarItem
            icon={LayoutTemplate}
            label="Product"
            isActive={activeTool === "templates"}
            onClick={() => setPopupOpen(true)} // Open popup
          />
          <SidebarItem
            icon={ImageIcon}
            label="Image"
            isActive={activeTool === "images"}
            onClick={() => onChangeActiveTool("images")}
          />
          <SidebarItem
            icon={Type}
            label="Text"
            isActive={activeTool === "text"}
            onClick={() => onChangeActiveTool("text")}
          />
          <SidebarItem
            icon={Shapes}
            label="Shapes"
            isActive={activeTool === "shapes"}
            onClick={() => onChangeActiveTool("shapes")}
          />
          <SidebarItem
            icon={Pencil}
            label="Draw"
            isActive={activeTool === "draw"}
            onClick={() => onChangeActiveTool("draw")}
          />
          <SidebarItem
            icon={Sparkles}
            label="AI"
            isActive={activeTool === "ai"}
            onClick={() => onChangeActiveTool("ai")}
          />
          <SidebarItem
            icon={Settings}
            label="Settings"
            isActive={activeTool === "settings"}
            onClick={() => onChangeActiveTool("settings")}
          />
        </ul>
      </aside>

      {/* Popup for product selection */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] h-[600px] flex">
            {/* Sidebar for categories */}
            <div className="w-[200px] border-r p-4">
              <h3 className="text-lg font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                {Object.keys(productCategories).map((category) => (
                  <li
                    key={category}
                    className={`cursor-pointer p-2 rounded-md ${
                      selectedCategory === category ? "bg-gray-200 font-bold" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedCategory(category as keyof typeof productCategories)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4">
              {/* Search bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full p-2 border rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {selectedProduct ? (
                <div>
                  <h3 className="text-md font-semibold mb-2">
                    Select a color for {selectedProduct.name}
                  </h3>
                  <div className="flex gap-2">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        className="px-3 py-2 bg-gray-100 border rounded-lg hover:bg-gray-200"
                        onClick={() => handleColorSelect(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-lg p-4 hover:shadow-lg cursor-pointer"
                      onClick={() => handleProductSelect(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <h3 className="text-center text-sm font-medium mt-2">
                        {product.name}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
