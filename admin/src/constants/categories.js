export const defaultCategories = [
  "Electronics",
  "Fashion",
  "Men's Clothing",
  "Women's Clothing",
  "Kids' Clothing",
  "Footwear",
  "Beauty & Personal Care",
  "Home & Kitchen",
  "Furniture",
  "Grocery",
  "Books",
  "Sports & Fitness",
  "Toys & Games",
  "Baby Products",
  "Health & Wellness",
  "Automotive",
  "Pet Supplies",
  "Jewelry & Accessories",
  "Mobile Phones & Accessories",
  "Computers & Laptops",
  "Watches",
  "Bags & Luggage",
  "Gift Items"
]

export const defaultSubCategories = defaultCategories

export const clothingCategoryKeywords = [
  "fashion",
  "clothing",
  "cloth",
  "wear",
  "shirt",
  "jeans",
  "dress",
  "kurta",
  "saree"
]

export const isClothingCategory = (value = "") => {
  const normalizedValue = String(value || "").toLowerCase()
  return clothingCategoryKeywords.some(keyword => normalizedValue.includes(keyword))
}

export const isWeightCategory = (value = "") => {
  return String(value || "").toLowerCase().includes("health")
}
