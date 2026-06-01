export const noSizeKey = "default"

const clothingCategoryKeywords = [
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
