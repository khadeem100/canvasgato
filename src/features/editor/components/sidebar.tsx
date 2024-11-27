"use client";

import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  ImageIcon,
  InfoIcon,
  LayoutTemplate,
  MailIcon,
  Pencil,
  Settings,
  Shapes,
  Shirt,
  ShoppingCartIcon,
  Sparkles,
  Type,
} from "lucide-react";

import { ActiveTool, Editor } from "@/features/editor/types";
import { SidebarItem } from "@/features/editor/components/sidebar-item";

// Initial product categories
const productCategories = {
  Tshirts: [],
  Hoodies: [],
  Pants: [],
  Longsleeves: [],
  Bags: [],
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
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof productCategories>("Tshirts");
  const [selectedProduct, setSelectedProduct] = useState<null | any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | "">("");
  const [selectedGender, setSelectedGender] = useState<string | "">("");
  const [isAdminFormVisible, setAdminFormVisible] = useState(false); // Track visibility of the admin form

  // New product state for managing product creation
  const [newProduct, setNewProduct] = useState({
    id: "",
    category: "Tshirts",
    name: "",
    size: "",
    color: "",
    image: "",
  });

  // Load saved products from localStorage on mount
  const loadProductsFromStorage = () => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  };

  // Save products to localStorage
  const saveProductsToStorage = (products: any[]) => {
    localStorage.setItem("products", JSON.stringify(products));
  };

  // Array to store created products, loaded from localStorage
  const [products, setProducts] = useState<any[]>(loadProductsFromStorage);

  // Handle the form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle product creation and save to localStorage
  const handleCreateProduct = () => {
    const newProductData = { ...newProduct, id: Date.now() }; // Set unique ID using timestamp
    const updatedProducts = [...products, newProductData];
    setProducts(updatedProducts);
    saveProductsToStorage(updatedProducts); // Save the updated products to localStorage
    setNewProduct({
      id: "",
      category: "Tshirts",
      name: "",
      size: "",
      color: "",
      image: "",
    }); // Reset form after submission
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    if (editor && product) {
      // Check if the editor object has the addImage method
      if (typeof editor.addImage === "function") {
        editor.addImage(product.image); // Add the image of the selected product to the editor
      }
    }
    setPopupOpen(false); // Close the popup after selecting a product
  };

  const handleResetFilters = () => {
    setSelectedColor("");
    setSelectedGender("");
    setSearchQuery("");
  };

  // Filter products based on category, search query, color, and gender
  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((product) => (selectedColor ? product.color === selectedColor : true))
    .filter((product) => (selectedGender ? product.gender === selectedGender : true))
    .filter((product) => product.category === selectedCategory); // Filter by selected category

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
            icon={Shirt}
            label="Product"
            isActive={activeTool === "templates"}
            onClick={() => setPopupOpen(true)} // Open popup
          />
          <SidebarItem
            icon={Settings}
            label="Settings"
            isActive={activeTool === "settings"}
            onClick={() => onChangeActiveTool("settings")}
          />
          {/* Admin button to toggle the product creation form */}
          <SidebarItem
            icon={ShoppingCartIcon}
            label="Admin"
            onClick={() => setAdminFormVisible(!isAdminFormVisible)} // Toggle form visibility
          />
        </ul>
      </aside>

      {/* Admin Product Creation Form (Visible only when admin button is clicked) */}
      {isAdminFormVisible && (
        <div className="p-4 bg-white shadow-lg mt-4">
          <h2 className="text-lg font-bold">Create a New Product</h2>
          <form
            className="flex flex-col mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateProduct();
            }}
          >
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="p-2 border rounded-md"
            />
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="p-2 border rounded-md"
            >
              <option value="Tshirts">T-shirt</option>
              <option value="Hoodies">Hoodie</option>
              <option value="Pants">Pants</option>
              <option value="Longsleeves">Longsleeve</option>
              <option value="Bags">Bag</option>
            </select>
            <input
              type="text"
              name="size"
              value={newProduct.size}
              onChange={handleInputChange}
              placeholder="Size (S, M, L, XL)"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="color"
              value={newProduct.color}
              onChange={handleInputChange}
              placeholder="Color"
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              name="image"
              value={newProduct.image}
              onChange={handleInputChange}
              placeholder="Image URL"
              className="p-2 border rounded-md"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md mt-4"
            >
              Create Product
            </button>
          </form>
        </div>
      )}

      {/* Popup for product selection */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[1000px] h-[900px] flex flex-col">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-xl text-gray-600"
              onClick={() => setPopupOpen(false)} // Close popup
            >
              &times;
            </button>

            <div className="flex">
              {/* Left Sidebar for filtering products */}
              <div className="w-[250px] border-r p-4">
                <h3 className="font-bold mb-2">Categories</h3>
                <ul className="space-y-2">
                  {Object.keys(productCategories).map((category) => (
                    <li
                      key={category}
                      className={`cursor-pointer p-2 rounded-md hover:bg-gray-200 ${
                        selectedCategory === category ? "bg-gray-300" : ""
                      }`}
                      onClick={() => setSelectedCategory(category as keyof typeof productCategories)}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Section to Display Created Products */}
              <div className="flex-1 p-4 overflow-y-auto max-h-[600px]">
                {/* Filters Section */}
                <div className="flex space-x-4 mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Products"
                    className="p-2 border rounded-md"
                  />
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    <option value="">All Colors</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                  </select>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <button
                    className="bg-gray-300 text-black p-2 rounded-md"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </button>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border p-4 rounded-md cursor-pointer"
                      onClick={() => handleProductSelect(product)}
                    >
                      <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                      <h4 className="text-lg font-bold">{product.name}</h4>
                      <p>{product.size}</p>
                      <p>{product.color}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


