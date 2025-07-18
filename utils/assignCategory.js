// utils/assignCategory.js
function assignCategory(title = "", location = "") {
  const content = `${title} ${location}`.toLowerCase();

  if (content.includes("beach")) return "Beach";
  if (content.includes("mountain") || content.includes("hill")) return "Mountains";
  if (content.includes("city") || content.includes("downtown") || content.includes("metro")) return "City";
  if (content.includes("forest") || content.includes("jungle") || content.includes("woods")) return "Forest";
  if (content.includes("snow") || content.includes("winter") || content.includes("cold")) return "Winter";
  if (content.includes("hotel") || content.includes("resort") || content.includes("motel")) return "Hotel";
  if (content.includes("home") || content.includes("house") || content.includes("villa")) return "Home";

  return "Home"; // Default
}

module.exports = assignCategory;
