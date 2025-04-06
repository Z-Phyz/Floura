interface ConversionOptions {
  utensilType: string;
  nutsAreWhole: boolean;
  humidity: number | null;
}

export async function convertRecipeImage(
  imageUrl: string,
  options: ConversionOptions
) {
  console.log("✅ convertRecipe is running!");
  console.log("🔹 Sending recipeText:", imageUrl);
  console.log("🔹 Sending options:", options);

  try {
    const response = await fetch("http://localhost:5000/convertz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: imageUrl,
        humidity: options["humidity"],
        utensils: options["utensilType"],
        nutsWhole: options["nutsAreWhole"],
      }),
    });

    console.log("🔹 Waiting for response...");
    const data = await response.json();
    console.log("✅ Response from server:", data);
    return data;
  } catch (error) {
    console.error("❌ Fetch error:", error);
  }
}
