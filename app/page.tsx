"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, CloudRain } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
//import { recognizeRecipe } from "@/lib/ocr";
import { convertRecipe } from "@/lib/converter";
import { getHumidity } from "@/lib/weather";
import Image from "next/image";
import GoogleTranslate from "@/lib/translate";
import VoiceInput from "@/lib/voice";
import axios from "axios";

export default function RecipeConverter() {
  const [recipeText, setRecipeText] = useState("");
  const [convertedRecipe, setConvertedRecipe] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [humidity, setHumidity] = useState(null);
  const [isLoadingHumidity, setIsLoadingHumidity] = useState(false);
  const [utensilType, setUtensilType] = useState("standard");
  const [nutsAreWhole, setNutsAreWhole] = useState(true);
  const { toast } = useToast();
  const [locationInput, setLocationInput] = useState("");
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);

  const handleTextConvert = async () => {
    if (!recipeText.trim()) {
      toast({
        title: "Recipe text is empty",
        description: "Please enter a recipe to convert.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    try {
      const result = await convertRecipe(recipeText, {
        utensilType,
        nutsAreWhole,
        humidity,
      });
      setConvertedRecipe(result);
    } catch (error) {
      toast({
        title: "Conversion failed",
        description:
          error.message || "Failed to convert recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes("image")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post("http://localhost:5000", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImageUrl(response.data.image_url);
      toast({
        title: "Image processed",
        description:
          "Recipe text extracted successfully. You can now convert it to grams.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchHumidity = async () => {
    setIsLoadingHumidity(true);
    try {
      const humidityData = await getHumidity(locationInput);
      setHumidity(humidityData);
      toast({
        title: "Humidity data fetched",
        description: `Current humidity: ${humidityData}%`,
      });
    } catch (error) {
      toast({
        title: "Failed to fetch humidity",
        description:
          error.message || "Could not get humidity data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHumidity(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5efe7]">
      <header className="py-6 px-4 border-b border-[#e5d7c3]">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-serif text-[#8b7b6b]">
            Recipe to Grams
          </h1>
          <h1>My Multilingual Page</h1>
          <GoogleTranslate />
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-[#8b7b6b] hover:text-[#6d5d4b]">
              Home
            </a>
            <a href="#" className="text-[#8b7b6b] hover:text-[#6d5d4b]">
              About
            </a>
            <a href="#" className="text-[#8b7b6b] hover:text-[#6d5d4b]">
              Contact
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-serif text-[#8b7b6b] mb-6">
            Recipe to Grams Converter
          </h2>
          <p className="text-[#8b7b6b] max-w-2xl mx-auto mb-10">
            Transform your recipes with precise gram measurements for perfect
            results every time.
          </p>
          <Button
            className="bg-[#d4c4b0] text-[#5c4f41] hover:bg-[#c5b5a1] rounded-full px-8 py-6"
            onClick={() =>
              document
                .getElementById("converter")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get Started
          </Button>
        </div>
      </section>

      <section id="services" className="py-16 px-4 bg-[#f0e9e0]">
        <div className="container mx-auto">
          <h2 className="text-4xl font-serif text-[#8b7b6b] text-center mb-16">
            Our Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 text-center">
                <div className="w-24 h-24 bg-[#f5efe7] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-[#8b7b6b]">📝</span>
                </div>
                <h3 className="text-xl font-serif text-[#8b7b6b] mb-3">
                  Text Conversion
                </h3>
                <p className="text-[#8b7b6b] mb-6">
                  Enter your recipe text and get precise gram measurements
                  instantly.
                </p>
                <Button
                  className="bg-[#d4c4b0] text-[#5c4f41] hover:bg-[#c5b5a1] rounded-full"
                  onClick={() =>
                    document
                      .getElementById("converter")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Convert Now
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 text-center">
                <div className="w-24 h-24 bg-[#f5efe7] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-[#8b7b6b]">📷</span>
                </div>
                <h3 className="text-xl font-serif text-[#8b7b6b] mb-3">
                  Image Conversion
                </h3>
                <p className="text-[#8b7b6b] mb-6">
                  Upload a photo of your recipe and we'll extract and convert it
                  for you.
                </p>
                <Button
                  className="bg-[#d4c4b0] text-[#5c4f41] hover:bg-[#c5b5a1] rounded-full"
                  onClick={() =>
                    document
                      .getElementById("converter")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Upload Image
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 text-center">
                <div className="w-24 h-24 bg-[#f5efe7] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-[#8b7b6b]">🌧️</span>
                </div>
                <h3 className="text-xl font-serif text-[#8b7b6b] mb-3">
                  Humidity Adjustment
                </h3>
                <p className="text-[#8b7b6b] mb-6">
                  Get humidity-adjusted measurements for perfect baking results.
                </p>
                <Button
                  className="bg-[#d4c4b0] text-[#5c4f41] hover:bg-[#c5b5a1] rounded-full"
                  onClick={fetchHumidity}
                >
                  Check Humidity
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="converter" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-serif text-[#8b7b6b] mb-6">
                Get More Than Just Recipes
              </h2>
              <p className="text-[#8b7b6b] mb-6">
                Our Recipe to Grams Converter transforms your favorite recipes
                into precise gram measurements, ensuring consistent results
                every time. Whether you're a professional baker or a home cook,
                our tool helps you achieve perfection with every dish.
              </p>
              <p className="text-[#8b7b6b] mb-6">
                We account for different utensil sizes across regions and even
                adjust for humidity levels to give you the most accurate
                measurements possible.
              </p>
              <Button className="bg-[#d4c4b0] text-[#5c4f41] hover:bg-[#c5b5a1] rounded-full">
                Learn More
              </Button>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm p-8">
                <Image
                  src="/bread.jpg?height=300&width=300"
                  alt="Recipe conversion illustration"
                  width={300}
                  height={300}
                  className="mx-auto rounded-full mb-6"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#f0e9e0]">
        <div className="container mx-auto">
          <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <h2 className="text-3xl font-serif text-[#8b7b6b] text-center mb-10">
                Convert Your Recipe
              </h2>
              <div>
                <h1>Voice Input Test</h1>
                <VoiceInput
                  onTextRecognized={(recognizedText) => setText(recognizedText)}
                />
                <p>Recognized Text: {text}</p>
              </div>
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#f5efe7]">
                  <TabsTrigger
                    value="text"
                    className="data-[state=active]:bg-[#d4c4b0] data-[state=active]:text-[#5c4f41]"
                  >
                    Convert from Text
                  </TabsTrigger>
                  <TabsTrigger
                    value="image"
                    className="data-[state=active]:bg-[#d4c4b0] data-[state=active]:text-[#5c4f41]"
                  >
                    Convert from Image
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipe" className="text-[#8b7b6b]">
                      Enter your recipe
                    </Label>
                    <Textarea
                      id="recipe"
                      placeholder="Paste your recipe here... (e.g., 1 cup flour, 2 tablespoons sugar)"
                      className="min-h-[200px] border-[#d4c4b0] focus:border-[#8b7b6b] focus:ring-[#8b7b6b]"
                      value={recipeText}
                      onChange={(e) => setRecipeText(e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="image" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipe-image" className="text-[#8b7b6b]">
                      Upload a recipe image
                    </Label>
                    <div className="border-2 border-dashed border-[#d4c4b0] rounded-lg p-8 text-center">
                      <Input
                        id="recipe-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Label
                        htmlFor="recipe-image"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        {isUploading ? (
                          <Loader2 className="h-10 w-10 text-[#8b7b6b] animate-spin" />
                        ) : (
                          <Upload className="h-10 w-10 text-[#8b7b6b]" />
                        )}
                        <span className="mt-2 text-sm text-[#8b7b6b]">
                          {isUploading
                            ? "Processing image..."
                            : "Click to upload or drag and drop"}
                        </span>
                      </Label>
                    </div>

                    {recipeText && (
                      <div className="mt-4 space-y-2">
                        <Label
                          htmlFor="extracted-text"
                          className="text-[#8b7b6b]"
                        >
                          Extracted Text
                        </Label>
                        <Textarea
                          id="extracted-text"
                          value={recipeText}
                          onChange={(e) => setRecipeText(e.target.value)}
                          className="min-h-[150px] border-[#d4c4b0] focus:border-[#8b7b6b] focus:ring-[#8b7b6b]"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <div className="mt-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label
                        htmlFor="utensil-type"
                        className="text-[#8b7b6b] text-lg"
                      >
                        Utensil Type
                      </Label>
                      <Select
                        value={utensilType}
                        onValueChange={setUtensilType}
                      >
                        <SelectTrigger
                          id="utensil-type"
                          className="border-[#d4c4b0]"
                        >
                          <SelectValue placeholder="Select utensil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">
                            US Standard Cups & Spoons
                          </SelectItem>
                          <SelectItem value="metric">
                            Metric Cups & Spoons
                          </SelectItem>
                          <SelectItem value="uk">
                            UK Imperial Cups & Spoons
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-[#8b7b6b]">
                        Different regions use different sized measuring cups and
                        spoons
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="nuts-whole"
                          className="text-[#8b7b6b] text-lg"
                        >
                          Nuts are whole
                        </Label>
                        <Switch
                          id="nuts-whole"
                          checked={nutsAreWhole}
                          onCheckedChange={setNutsAreWhole}
                          className="data-[state=checked]:bg-[#8b7b6b]"
                        />
                      </div>
                      <p className="text-xs text-[#8b7b6b]">
                        Toggle off if your recipe uses chopped nuts (affects
                        density calculations)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="location-input" className="text-[#8b7b6b]">
                      Location (optional)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="location-input"
                        placeholder="City name or zip code"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        className="border-[#d4c4b0]"
                      />
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-[#d4c4b0] text-[#8b7b6b]"
                        onClick={fetchHumidity}
                        disabled={isLoadingHumidity}
                      >
                        {isLoadingHumidity ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CloudRain className="h-4 w-4" />
                        )}
                        Get Humidity
                      </Button>
                    </div>
                    <p className="text-xs text-[#8b7b6b]">
                      Enter your location or leave blank to use automatic
                      detection
                    </p>
                    {humidity !== null && (
                      <div className="p-2 bg-[#f5efe7] rounded border border-[#d4c4b0] text-[#8b7b6b]">
                        Current humidity: {humidity}%
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full bg-[#d4c4b0] text-[#5c4f41] hover:bg-[#c5b5a1] py-6 rounded-full"
                    onClick={handleTextConvert}
                    disabled={isConverting || !recipeText.trim()}
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      "Convert to Grams"
                    )}
                  </Button>

                  {convertedRecipe && (
                    <div className="space-y-4 mt-8">
                      <Label
                        htmlFor="converted-recipe"
                        className="text-[#8b7b6b] text-xl"
                      >
                        Converted Recipe (in grams)
                      </Label>
                      <div className="p-6 rounded-lg bg-[#f5efe7] border border-[#d4c4b0]">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-[#5c4f41]">
                          {convertedRecipe}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#f5efe7]">
        <div className="container mx-auto text-center">
          <div className="bg-[#d4c4b0] rounded-full p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif text-[#5c4f41] mb-4">
              Talk to Our Staff
            </h2>
            <p className="text-[#5c4f41] mb-6">
              Have questions about recipe conversion? Our team is here to help
              you achieve perfect results.
            </p>
            <Button className="bg-[#8b7b6b] text-white hover:bg-[#6d5d4b] rounded-full">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-[#8b7b6b] text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif mb-4">Recipe to Grams</h3>
              <p className="text-sm opacity-80">
                Precise recipe conversion for perfect results every time.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm opacity-80 hover:opacity-100">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm opacity-80 hover:opacity-100">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm opacity-80 hover:opacity-100">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>info@recipetograms.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Newsletter</h4>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-l-full bg-[#7a6a5a] border-[#7a6a5a] text-white placeholder:text-white/60"
                />
                <Button className="rounded-r-full bg-[#d4c4b0] text-[#5c4f41]">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-sm opacity-60 text-center">
            © {new Date().getFullYear()} Recipe to Grams. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
