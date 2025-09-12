// src/utils/scrollToSection.ts
export const scrollToSection = (id: string, callback?: () => void) => {
  const section = document.getElementById(id);
  if (section) {
    const headerOffset = 70; // height of sticky header
    const elementPosition = section.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    if (callback) callback(); // e.g. close mobile menu
  }
};
