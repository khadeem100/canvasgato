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

import { ActiveTool, Editor } from "@/features/editor/types";
import { SidebarItem } from "@/features/editor/components/sidebar-item";

// Mock product data
const productCategories = {
  Tshirts: Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `T-shirt ${i + 1}`,
    image: `/images/tshirt.png`,
    colors: ["Red", "Blue", "Black", "White"],
  })),
  Hoodies: Array.from({ length: 5 }, (_, i) => ({
    id: i + 6,
    name: `Hoodie ${i + 1}`,
    image: `/images/hoodie${i + 1}.png`,
    colors: ["Gray", "Black", "White"],
  })),
  Pants: Array.from({ length: 5 }, (_, i) => ({
    id: i + 11,
    name: `Pants ${i + 1}`,
    image: `/images/pants${i + 1}.png`,
    colors: ["Black", "Navy"],
  })),
  Longsleeves: Array.from({ length: 5 }, (_, i) => ({
    id: i + 16,
    name: `Longsleeve ${i + 1}`,
    image: `/images/longsleeve${i + 1}.png`,
    colors: ["Red", "Blue"],
  })),
  Bags: Array.from({ length: 5 }, (_, i) => ({
    id: i + 21,
    name: `Bag ${i + 1}`,
    image: `/images/bag${i + 1}.png`,
    colors: ["Brown", "Black"],
  })),
};

interface SidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Sidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: SidebarProps) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isColorPickerOpen, setColorPickerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof productCategories>("Tshirts");
  const [selectedProduct, setSelectedProduct] = useState<null | (typeof productCategories)[keyof typeof productCategories][0]>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleProductSelect = (product: (typeof productCategories)[keyof typeof productCategories][0]) => {
    setSelectedProduct(product);
    setColorPickerOpen(true);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (editor && selectedProduct) {
      editor.addImage(`${selectedProduct.image}?color=${color}`); // Add product image with selected color to canvas
    }
    setColorPickerOpen(false);
    setPopupOpen(false);
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <input
                type="text"
                placeholder="Search products..."
                className="w-[400px] p-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="text-red-500 hover:underline"
                onClick={() => setPopupOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="flex flex-1">
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
              <div className="flex-1 p-4 grid grid-cols-3 gap-4 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border p-4 rounded-md hover:shadow-md cursor-pointer"
                    onClick={() => handleProductSelect(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[100px] object-cover rounded-md mb-2"
                    />
                    <h4 className="font-bold text-center">{product.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup for color selection */}
      {isColorPickerOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-lg font-bold mb-4">Select a Color</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.colors.map((color) => (
                <button
                  key={color}
                  className={`p-2 rounded-md border hover:shadow-md ${
                    selectedColor === color ? "border-black" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => handleColorSelect(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
