import { codeToHtml } from "https://esm.sh/shiki@3.20.0";

const blocks = document.querySelectorAll("pre code");

for (const block of blocks) {
  const className = block.className;
  // Get language (e.g., "language-js" -> "js")
  const lang = className.replace("language-", "") || "text";

  try {
    const highlightedHtml = await codeToHtml(block.innerText, {
      lang: lang,
      theme: "dracula", // Change theme here
    });

    if (block.parentElement.tagName === "PRE") {
      block.parentElement.outerHTML = highlightedHtml;
    } else {
      block.outerHTML = highlightedHtml;
    }
  } catch (e) {
    console.warn(`Shiki failed to highlight ${lang}:`, e);
  }
}
