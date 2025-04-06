import { useEffect } from "react";
import { FaGlobe } from "react-icons/fa";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const GoogleTranslate = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "fr,es,de,hi,zh",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );

      // Apply styles after the widget loads
      setTimeout(() => {
        // Typecast the element to HTMLElement to access the style property
        const targetLanguageDiv = document.querySelector(".goog-te-gadget-simple") as HTMLElement;
        // if (targetLanguageDiv) {
        //   targetLanguageDiv.style.whiteSpace = "nowrap";
        //   targetLanguageDiv.style.height = "30px";
        //   targetLanguageDiv.style.width = "70px";
        //   targetLanguageDiv.style.border = "none";
        //   targetLanguageDiv.style.display = "flex";
        //   targetLanguageDiv.style.alignItems = "center";
        //   targetLanguageDiv.style.justifyContent = "center";
        //   targetLanguageDiv.style.padding = "4px 8px";
        //   targetLanguageDiv.style.borderRadius = "6px";
        //   targetLanguageDiv.style.backgroundColor = "#fff";
        // }
        // setTimeout(() => {
        //   // Get the select dropdown
        //   const selectDropdown = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        //   if (selectDropdown) {
        //     selectDropdown.style.height = "20px";
        //     selectDropdown.style.width = "50px";
        //     selectDropdown.style.borderRadius = "4px";
        //     selectDropdown.style.fontSize = "14px";
        //     selectDropdown.style.padding = "4px";
        //     selectDropdown.style.border = "1px solid #ddd";
        //     selectDropdown.style.backgroundColor = "#f8f8f8";
        //   }
        // }, 1000);

      const translateElement = document.getElementById("google_translate_element");
      if (translateElement) {
        translateElement.style.display = "flex";
        translateElement.style.alignItems = "center";
        translateElement.style.justifyContent = "center";
        translateElement.style.height = "40px";
        translateElement.style.border = "1px solid rgb(224, 190, 190)";
        translateElement.style.borderRadius = "6px";
        translateElement.style.backgroundColor = "rgb(255, 255, 255)";
        translateElement.style.width = "160px";
        translateElement.style.gap = "0px";
        translateElement.style.padding = "0px";
      }

        // Ensure the Google Translate logo aligns properly
        const skipTranslateDiv = document.querySelector(".skiptranslate.goog-te-gadget") as HTMLElement;
      if (skipTranslateDiv) {
        skipTranslateDiv.style.marginTop = "40px";
        skipTranslateDiv.style.border = "none";
      }

      // 3. Style the 'goog-te-gadget-simple' div
      // const targetLanguageDiv = document.querySelector(".goog-te-gadget-simple") as HTMLElement;
      // const targetLanguageDiv = document.getElementById("0.targetLanguage") as HTMLElement;
      if (targetLanguageDiv) {
        targetLanguageDiv.style.whiteSpace = "nowrap";
        targetLanguageDiv.style.height = "30px";
        targetLanguageDiv.style.border = "none";

        // Selecting the last child span inside another span within #0.targetLanguage
        const lastNestedSpan = targetLanguageDiv.querySelector("span span:last-child") as HTMLElement;
        if (lastNestedSpan) {
          lastNestedSpan.style.display = "none"; // Hide it
        }
      }

      // 4. Style the Google Translate icon (img)
      const googleLogo = document.querySelector(".goog-te-gadget-icon") as HTMLImageElement;
      if (googleLogo) {
        googleLogo.style.display = "inline";
        googleLogo.style.border = "none";
      }

      // 5. Style the span inside the widget
      const translateSpan = document.querySelector(".goog-te-gadget span") as HTMLElement;
      if (translateSpan) {
        translateSpan.style.verticalAlign = "middle";
        translateSpan.style.border = "none";
      }

      }, 1000);
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "40px",
        border: "1px solid #e0bebe",
        borderRadius: "6px",
        padding: "4px 10px",
        backgroundColor: "#fff",
        gap: "6px",
        
      }}
    >
      {/* <FaGlobe style={{ fontSize: "20px", color: "#333", verticalAlign: "middle" }} /> */}
    </div>
  );
};

export default GoogleTranslate;
