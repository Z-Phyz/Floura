// Database of ingredient densities (grams per cup)
const ingredientDensities = {
  flour: 120,
  "all-purpose flour": 120,
  "cake flour": 112,
  "bread flour": 127,
  "whole wheat flour": 128,
  sugar: 200,
  "granulated sugar": 200,
  "brown sugar": 220,
  "powdered sugar": 120,
  "confectioners sugar": 120,
  butter: 227,
  oil: 224,
  milk: 240,
  water: 240,
  salt: 288,
  "baking powder": 192,
  "baking soda": 220,
  "cocoa powder": 85,
  "rolled oats": 85,
  rice: 185,
  honey: 340,
  "maple syrup": 322,
  yogurt: 245,
  "sour cream": 230,
  "cream cheese": 230,
  nuts: 150,
  "chopped nuts": 120,
  "chocolate chips": 170,
  raisins: 150,
  "coconut flakes": 80,
  cornstarch: 120,
  cornmeal: 138,
  "almond flour": 96,
  "coconut flour": 112,
  "ground cinnamon": 124,
  "ground nutmeg": 100,
  "vanilla extract": 208,
  "vegetable oil": 218,
  "olive oil": 216,
  "canola oil": 218,
  "corn syrup": 328,
  molasses: 328,
  "peanut butter": 258,
  jam: 325,
  ketchup: 270,
  mayonnaise: 230,
  "soy sauce": 255,
  "heavy cream": 238,
  "half and half": 242,
  buttermilk: 242,
  "greek yogurt": 245,
  "cream of tartar": 192,
  "dried cranberries": 120,
  "dried cherries": 140,
  "dried apricots": 130,
  walnuts: 125,
  pecans: 110,
  almonds: 145,
  cashews: 130,
  "pine nuts": 135,
  "sunflower seeds": 140,
  "pumpkin seeds": 130,
  "chia seeds": 192,
  "flax seeds": 168,
  "sesame seeds": 144,
  "poppy seeds": 144,
}

// Conversion factors for different measurements
const measurementConversions = {
  cup: 1,
  cups: 1,
  tablespoon: 0.0625, // 1/16 of a cup
  tablespoons: 0.0625,
  tbsp: 0.0625,
  teaspoon: 0.0208, // 1/48 of a cup
  teaspoons: 0.0208,
  tsp: 0.0208,
  oz: 0.125, // 1/8 of a cup
  ounce: 0.125,
  ounces: 0.125,
  pound: 2, // 2 cups
  pounds: 2,
  lb: 2,
  stick: 0.5, // 1/2 cup (for butter)
  sticks: 0.5,
}

// Utensil type conversion factors
const utensilFactors = {
  standard: 1, // US Standard
  metric: 0.95, // Metric cups are slightly smaller
  uk: 1.04, // UK cups are slightly larger
}

interface ConversionOptions {
  utensilType: string
  nutsAreWhole: boolean
  humidity: number | null
}

export async function convertRecipe(recipeText: string, options: ConversionOptions): Promise<string> {
  const { utensilType, nutsAreWhole, humidity } = options

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Split recipe into lines
  const lines = recipeText.split("\n")
  const convertedLines = lines.map((line) => {
    // Regular expression to match ingredient quantities
    // This regex is improved to catch more measurement formats
    const regex =
      /(\d+(?:\.\d+)?(?:\s*\/\s*\d+)?)\s*(cup|cups|tablespoon|tablespoons|tbsp|teaspoon|teaspoons|tsp|oz|ounce|ounces|pound|pounds|lb|stick|sticks)s?\s+(?:of\s+)?(.+?)(?:,|$|\n)/i

    const match = line.match(regex)
    if (!match) return line // Return unchanged if no match

    const [fullMatch, quantityStr, unit, ingredient] = match

    // Convert fraction to decimal
    let quantity = Number.parseFloat(quantityStr)
    if (isNaN(quantity)) {
      // Handle fractions like "1/2"
      const fractionParts = quantityStr.split("/")
      if (fractionParts.length === 2) {
        quantity = Number.parseFloat(fractionParts[0]) / Number.parseFloat(fractionParts[1])
      }
    }

    // Convert to cups first
    const cupsEquivalent = quantity * (measurementConversions[unit.toLowerCase()] || 1)

    // Apply utensil factor
    const adjustedCups = cupsEquivalent * (utensilFactors[utensilType] || 1)

    // Find the ingredient density
    const ingredientKey = ingredient.trim().toLowerCase()
    let density = ingredientDensities[ingredientKey]

    // Handle special case for nuts
    if (ingredientKey.includes("nuts") || ingredientKey.includes("nut")) {
      density = nutsAreWhole ? ingredientDensities["nuts"] : ingredientDensities["chopped nuts"]
    }

    // If ingredient not found, use a default density
    if (!density) {
      // Try to find a partial match
      const partialMatches = Object.keys(ingredientDensities).filter(
        (key) => ingredientKey.includes(key) || key.includes(ingredientKey),
      )

      if (partialMatches.length > 0) {
        // Use the first partial match
        density = ingredientDensities[partialMatches[0]]
      } else {
        // Default density if no match found
        density = 150
      }
    }

    // Calculate grams
    let grams = adjustedCups * density

    // Apply humidity adjustment for flour and other dry ingredients
    if (
      humidity &&
      humidity > 60 &&
      (ingredientKey.includes("flour") ||
        ingredientKey.includes("sugar") ||
        ingredientKey.includes("powder") ||
        ingredientKey.includes("meal"))
    ) {
      // Reduce amount slightly for high humidity
      const humidityFactor = 1 - (humidity - 60) * 0.002
      grams *= humidityFactor
    }

    // Round to nearest whole number
    grams = Math.round(grams)

    // Replace the original measurement with grams
    return line.replace(fullMatch, `${grams}g ${ingredient}`)
  })

  return convertedLines.join("\n")
}

