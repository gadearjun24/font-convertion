const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const AdmZip = require("adm-zip");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

const FONT_PATH = path.join(__dirname, "../fonts/KrutiDev055.ttf");
const FONT_NAME = "Kruti Dev 055";

// Upload single file
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const ext = path.extname(req.file.originalname).toLowerCase();
    let outputPath;

    console.log("Uploaded file:", req.file);

    // if (ext === ".pdf") {
    //   console.log("Converting PDF...");
    //   outputPath = await convertPdf(req.file.path);
    //   console.log("PDF converted:", outputPath);
    //   }

    if (ext === ".docx") {
      outputPath = await convertDocx(req.file.path);
    } else {
      return res.status(400).send("Only PDF and DOCX are supported");
    }

    console.log("Conversion completed. Output file:", outputPath);
    res.json({ url: `/converted/${path.basename(outputPath)}` });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("Conversion failed");
  }
});

// ---------------------- PDF Conversion ----------------------
async function convertPdf(inputPath) {
  const pdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  console.log("PDF loaded for conversion");

  // Register fontkit
  pdfDoc.registerFontkit(fontkit);
  console.log("Fontkit registered");

  // Embed custom font
  const krutiBytes = fs.readFileSync(FONT_PATH);
  const krutiFont = await pdfDoc.embedFont(krutiBytes);
  console.log("Kruti Dev 055 font embedded");
  const pages = pdfDoc.getPages();
  pages.forEach((page) => {
    const { height } = page.getSize();
    page.drawText("Converted to Kruti Dev 055", {
      x: 50,
      y: height - 100,
      size: 18,
      font: krutiFont,
    });
  });
  console.log("Text added to pages");

  const newPdfBytes = await pdfDoc.save();
  console.log("PDF saved with new font");
  const outputPath = path.join(__dirname, "../converted", `${Date.now()}.pdf`);
  console.log("Output path:", outputPath);
  fs.writeFileSync(outputPath, newPdfBytes);

  return outputPath;
}

// ---------------------- DOCX Conversion ----------------------
async function convertDocx(inputPath) {
  const zip = new AdmZip(inputPath);

  const docXml = zip.readAsText("word/document.xml");

  // Replace all font references
  const modifiedXml = docXml.replace(/w:rFonts[^>]+>/g, (match) => {
    return match
      .replace(/w:ascii="[^"]+"/, `w:ascii="${FONT_NAME}"`)
      .replace(/w:hAnsi="[^"]+"/, `w:hAnsi="${FONT_NAME}"`)
      .replace(/w:cs="[^"]+"/, `w:cs="${FONT_NAME}"`);
  });

  zip.updateFile("word/document.xml", Buffer.from(modifiedXml));

  const outputPath = path.join(
    __dirname,
    "../converted",
    `${Date.now()}_kruti.docx`
  );
  zip.writeZip(outputPath);

  return outputPath;
}

module.exports = router;
