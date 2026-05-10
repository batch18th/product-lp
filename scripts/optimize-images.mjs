import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputDir = path.join(root, "public", "products");
const sourceDir = "C:\\Users\\Som\\Downloads\\New folder";

const sources = [
  "71LOz5JwjaL._AC_UL600_SR600,600_.jpg",
  "B1ieKaTDQdL._CLa_2140,2000_61KWeFTH55L.png_0,0,2140,2000+0.0,0.0,2140.0,2000.0_AC_UY1000_.png",
  "il_fullxfull.1981231434_lq9n.jpg",
  "Men-Oversized-Christian-Shirts-God-Faith-Jesus-Religious-T-Shirts-Bible-Verse-Custom-Printed-Acid-Wash-100-Cotton-Organic.jpg",
  "White_Bible_verse_tshirt.png",
];

await fs.mkdir(outputDir, { recursive: true });

await Promise.all(
  sources.map(async (fileName, index) => {
    const input = path.join(sourceDir, fileName);
    const output = path.join(outputDir, `product-${index + 1}.png`);

    await sharp(input)
      .resize({
        width: 1400,
        height: 1400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({ quality: 92, compressionLevel: 8 })
      .toFile(output);
  }),
);

console.log(`Optimized ${sources.length} product images into ${outputDir}`);
