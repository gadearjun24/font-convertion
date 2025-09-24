// server.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const mammoth = require("mammoth");
const { Document, Packer, Paragraph, TextRun } = require("docx");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads setup
const upload = multer({ dest: "uploads/" });
const convertedFolder = path.join(__dirname, "uploads/converted");

// ensure converted folder exists
if (!fs.existsSync(convertedFolder)) {
  fs.mkdirSync(convertedFolder, { recursive: true });
}

// Keep these global like your code
var begin = 1; // 0 if starting with kruti dev, 1 if starting with unicode
var legacy_text_var = 'i`"BHkwfe'; // in Kruti Dev
var unicode_text_var = "placeholder"; // in Unicode

// ------------------ Conversion Functions (kept your logic, small safe fixes) ------------------ //
function convert_to_unicode() {
  var array_one = new Array(
    // "(",")",
    "ñ",
    "Q+Z",
    "sas",
    "aa",
    ")Z",
    "ZZ",
    "‘",
    "’",
    "“",
    "”",

    "å",
    "ƒ",
    "„",
    "…",
    "†",
    "‡",
    "ˆ",
    "‰",
    "Š",
    "‹",

    "¶+",
    "d+",
    "[+k",
    "[+",
    "x+",
    "T+",
    "t+",
    "M+",
    "<+",
    "Q+",
    ";+",
    "j+",
    "u+",
    "Ùk",
    "Ù",
    "ä",
    "–",
    "—",
    "é",
    "™",
    "=kk",
    "f=k",

    "à",
    "á",
    "â",
    "ã",
    "ºz",
    "º",
    "í",
    "{k",
    "{",
    "=",
    "«",
    "Nî",
    "Vî",
    "Bî",
    "Mî",
    "<î",
    "|",
    "K",
    "}",
    "J",
    "Vª",
    "Mª",
    "<ªª",
    "Nª",
    "Ø",
    "Ý",
    "nzZ",
    "æ",
    "ç",
    "Á",
    "xz",
    "#",
    ":",

    "v‚",
    "vks",
    "vkS",
    "vk",
    "v",
    "b±",
    "Ã",
    "bZ",
    "b",
    "m",
    "Å",
    ",s",
    ",",
    "_",

    "ô",
    "d",
    "Dk",
    "D",
    "[k",
    "[",
    "x",
    "Xk",
    "X",
    "Ä",
    "?k",
    "?",
    "³",
    "pkS",
    "p",
    "Pk",
    "P",
    "N",
    "t",
    "Tk",
    "T",
    ">",
    "÷",
    "¥",

    "ê",
    "ë",
    "V",
    "B",
    "ì",
    "ï",
    "M+",
    "<+",
    "M",
    "<",
    ".k",
    ".",
    "r",
    "Rk",
    "R",
    "Fk",
    "F",
    ")",
    "n",
    "/k",
    "èk",
    "/",
    "Ë",
    "è",
    "u",
    "Uk",
    "U",

    "i",
    "Ik",
    "I",
    "Q",
    "¶",
    "c",
    "Ck",
    "C",
    "Hk",
    "H",
    "e",
    "Ek",
    "E",
    ";",
    "¸",
    "j",
    "y",
    "Yk",
    "Y",
    "G",
    "o",
    "Ok",
    "O",
    "'k",
    "'",
    '"k',
    '"',
    "l",
    "Lk",
    "L",
    "g",

    "È",
    "z",
    "Ì",
    "Í",
    "Î",
    "Ï",
    "Ñ",
    "Ò",
    "Ó",
    "Ô",
    "Ö",
    "Ø",
    "Ù",
    "Ük",
    "Ü",

    "‚",
    "ks",
    "kS",
    "k",
    "h",
    "q",
    "w",
    "`",
    "s",
    "S",
    "a",
    "¡",
    "%",
    "W",
    "•",
    "·",
    "∙",
    "·",
    "~j",
    "~",
    "\\",
    "+",
    " ः",
    "^",
    "*",
    "Þ",
    "ß",
    "(",
    "¼",
    "½",
    "¿",
    "À",
    "¾",
    "A",
    "-",
    "&",
    "&",
    "Œ",
    "]",
    "~ ",
    "@"
  );

  var array_two = new Array(
    //"¼","½",
    "॰",
    "QZ+",
    "sa",
    "a",
    "र्द्ध",
    "Z",
    '"',
    '"',
    "'",
    "'",

    "०",
    "१",
    "२",
    "३",
    "४",
    "५",
    "६",
    "७",
    "८",
    "९",

    "फ़्",
    "क़",
    "ख़",
    "ख़्",
    "ग़",
    "ज़्",
    "ज़",
    "ड़",
    "ढ़",
    "फ़",
    "य़",
    "ऱ",
    "ऩ", // one-byte nukta varNas
    "त्त",
    "त्त्",
    "क्त",
    "दृ",
    "कृ",
    "न्न",
    "न्न्",
    "=k",
    "f=",

    "ह्न",
    "ह्य",
    "हृ",
    "ह्म",
    "ह्र",
    "ह्",
    "द्द",
    "क्ष",
    "क्ष्",
    "त्र",
    "त्र्",
    "छ्य",
    "ट्य",
    "ठ्य",
    "ड्य",
    "ढ्य",
    "द्य",
    "ज्ञ",
    "द्व",
    "श्र",
    "ट्र",
    "ड्र",
    "ढ्र",
    "छ्र",
    "क्र",
    "फ्र",
    "र्द्र",
    "द्र",
    "प्र",
    "प्र",
    "ग्र",
    "रु",
    "रू",

    "ऑ",
    "ओ",
    "औ",
    "आ",
    "अ",
    "ईं",
    "ई",
    "ई",
    "इ",
    "उ",
    "ऊ",
    "ऐ",
    "ए",
    "ऋ",

    "क्क",
    "क",
    "क",
    "क्",
    "ख",
    "ख्",
    "ग",
    "ग",
    "ग्",
    "घ",
    "घ",
    "घ्",
    "ङ",
    "चै",
    "च",
    "च",
    "च्",
    "छ",
    "ज",
    "ज",
    "ज्",
    "झ",
    "झ्",
    "ञ",

    "ट्ट",
    "ट्ठ",
    "ट",
    "ठ",
    "ड्ड",
    "ड्ढ",
    "ड़",
    "ढ़",
    "ड",
    "ढ",
    "ण",
    "ण्",
    "त",
    "त",
    "त्",
    "थ",
    "थ्",
    "द्ध",
    "द",
    "ध",
    "ध",
    "ध्",
    "ध्",
    "ध्",
    "न",
    "न",
    "न्",

    "प",
    "प",
    "प्",
    "फ",
    "फ्",
    "ब",
    "ब",
    "ब्",
    "भ",
    "भ्",
    "म",
    "म",
    "म्",
    "य",
    "य्",
    "र",
    "ल",
    "ल",
    "ल्",
    "ळ",
    "व",
    "व",
    "व्",
    "श",
    "श्",
    "ष",
    "ष्",
    "स",
    "स",
    "स्",
    "ह",

    "ीं",
    "्र",
    "द्द",
    "ट्ट",
    "ट्ठ",
    "ड्ड",
    "कृ",
    "भ",
    "्य",
    "ड्ढ",
    "झ्",
    "क्र",
    "त्त्",
    "श",
    "श्",

    "ॉ",
    "ो",
    "ौ",
    "ा",
    "ी",
    "ु",
    "ू",
    "ृ",
    "े",
    "ै",
    "ं",
    "ँ",
    "ः",
    "ॅ",
    "ऽ",
    "ऽ",
    "ऽ",
    "ऽ",
    "्र",
    "्",
    "?",
    "़",
    ":",
    "‘",
    "’",
    "“",
    "”",
    ";",
    "(",
    ")",
    "{",
    "}",
    "=",
    "।",
    ".",
    "-",
    "µ",
    "॰",
    ",",
    "् ",
    "/"
  );

  //Corrections for Spelling mistakes (see above under the first Array):
  // "sas","aa","ZZ","=kk","f=k",
  //
  // The following two characters are to be replaced through proper checking of locations:
  // "Z" )
  // "र्" (reph)

  // "f" )
  // "ि"

  var array_one_length = array_one.length;

  var modified_substring = legacy_text_var;

  //****************************************************************************************
  //  Break the long text into small bunches of max. max_text_size  characters each.
  //****************************************************************************************
  var text_size = legacy_text_var.length;

  var processed_text = ""; //blank

  var sthiti1 = 0;
  var sthiti2 = 0;
  var chale_chalo = 1;

  var max_text_size = 6000;

  while (chale_chalo == 1) {
    sthiti1 = sthiti2;

    if (sthiti2 < text_size - max_text_size) {
      sthiti2 += max_text_size;
      while (legacy_text_var.charAt(sthiti2) != " ") {
        sthiti2--;
      }
    } else {
      sthiti2 = text_size;
      chale_chalo = 0;
    }

    var modified_substring = legacy_text_var.substring(sthiti1, sthiti2);

    Replace_Symbols();

    processed_text += modified_substring;

    //****************************************************************************************
    //  Breaking part code over
    //****************************************************************************************
    //  processed_text = processed_text.replace( /mangal/g , "Krutidev010" ) ;

    unicode_text_var = processed_text;
  }

  // --------------------------------------------------

  function Replace_Symbols() {
    //substitute array_two elements in place of corresponding array_one elements

    if (modified_substring != "") {
      // if stringto be converted is non-blank then no need of any processing.
      for (
        input_symbol_idx = 0;
        input_symbol_idx < array_one_length;
        input_symbol_idx++
      ) {
        idx = 0; // index of the symbol being searched for replacement

        while (idx != -1) {
          //whie-00
          modified_substring = modified_substring.replace(
            array_one[input_symbol_idx],
            array_two[input_symbol_idx]
          );
          idx = modified_substring.indexOf(array_one[input_symbol_idx]);
        } // end of while-00 loop
      } // end of for loop

      //**********************************************************************************
      // Code for Replacing five Special glyphs
      //**********************************************************************************

      //**********************************************************************************
      // Code for Glyph1 : ± (reph+anusvAr)
      //**********************************************************************************
      modified_substring = modified_substring.replace(/±/g, "Zं"); // at some places  ì  is  used eg  in "कर्कंधु,पूर्णांक".
      //
      //**********************************************************************************
      // Glyp2: Æ
      // code for replacing "f" with "ि" and correcting its position too. (moving it one position forward)
      //**********************************************************************************

      modified_substring = modified_substring.replace(/Æ/g, "र्f"); // at some places  Æ  is  used eg  in "धार्मिक".

      var position_of_i = modified_substring.indexOf("f");

      while (position_of_i != -1) {
        //while-02
        var charecter_next_to_i = modified_substring.charAt(position_of_i + 1);
        var charecter_to_be_replaced = "f" + charecter_next_to_i;
        modified_substring = modified_substring.replace(
          charecter_to_be_replaced,
          charecter_next_to_i + "ि"
        );
        position_of_i = modified_substring.search(/f/, position_of_i + 1); // search for i ahead of the current position.
      } // end of while-02 loop

      //**********************************************************************************
      // Glyph3 & Glyph4: Ç  É
      // code for replacing "fa" with "िं"  and correcting its position too.(moving it two positions forward)
      //**********************************************************************************

      modified_substring = modified_substring.replace(/Ç/g, "fa"); // at some places  Ç  is  used eg  in "किंकर".
      modified_substring = modified_substring.replace(/É/g, "र्fa"); // at some places  É  is  used eg  in "शर्मिंदा"

      var position_of_i = modified_substring.indexOf("fa");

      while (position_of_i != -1) {
        //while-02
        var charecter_next_to_ip2 = modified_substring.charAt(
          position_of_i + 2
        );
        var charecter_to_be_replaced = "fa" + charecter_next_to_ip2;
        modified_substring = modified_substring.replace(
          charecter_to_be_replaced,
          charecter_next_to_ip2 + "िं"
        );
        position_of_i = modified_substring.search(/fa/, position_of_i + 2); // search for i ahead of the current position.
      } // end of while-02 loop

      //**********************************************************************************
      // Glyph5: Ê
      // code for replacing "h" with "ी"  and correcting its position too.(moving it one positions forward)
      //**********************************************************************************

      modified_substring = modified_substring.replace(/Ê/g, "ीZ"); // at some places  Ê  is  used eg  in "किंकर".

      /*
            var position_of_i = modified_substring.indexOf( "h" )
            
            while ( position_of_i != -1 )  //while-02
            {
            var charecter_next_to_i = modified_substring.charAt( position_of_i + 1 )
            var charecter_to_be_replaced = "h" + charecter_next_to_i
            modified_substring = modified_substring.replace( charecter_to_be_replaced , charecter_next_to_i + "ी" ) 
            position_of_i = modified_substring.search( /h/ , position_of_i + 1 ) // search for i ahead of the current position.
            
            } // end of while-02 loop
            */

      //**********************************************************************************
      // End of Code for Replacing four Special glyphs
      //**********************************************************************************

      // following loop to eliminate 'chhotee ee kee maatraa' on half-letters as a result of above transformation.

      var position_of_wrong_ee = modified_substring.indexOf("ि्");

      while (position_of_wrong_ee != -1) {
        //while-03

        var consonent_next_to_wrong_ee = modified_substring.charAt(
          position_of_wrong_ee + 2
        );
        var charecter_to_be_replaced = "ि्" + consonent_next_to_wrong_ee;
        modified_substring = modified_substring.replace(
          charecter_to_be_replaced,
          "्" + consonent_next_to_wrong_ee + "ि"
        );
        position_of_wrong_ee = modified_substring.search(
          /ि्/,
          position_of_wrong_ee + 2
        ); // search for 'wrong ee' ahead of the current position.
      } // end of while-03 loop

      //**************************************
      //
      //**************************************
      //   alert(modified_substring);
      //**************************************

      // Eliminating reph "Z" and putting 'half - r' at proper position for this.
      set_of_matras = "अ आ इ ई उ ऊ ए ऐ ओ औ ा ि ी ु ू ृ े ै ो ौ ं : ँ ॅ";
      var position_of_R = modified_substring.indexOf("Z");

      while (position_of_R > 0) {
        // while-04
        probable_position_of_half_r = position_of_R - 1;
        var charecter_at_probable_position_of_half_r =
          modified_substring.charAt(probable_position_of_half_r);

        // trying to find non-maatra position left to current O (ie, half -r).

        while (
          set_of_matras.match(charecter_at_probable_position_of_half_r) != null
        ) {
          // while-05

          probable_position_of_half_r = probable_position_of_half_r - 1;
          charecter_at_probable_position_of_half_r = modified_substring.charAt(
            probable_position_of_half_r
          );
        } // end of while-05

        charecter_to_be_replaced = modified_substring.substr(
          probable_position_of_half_r,
          position_of_R - probable_position_of_half_r
        );
        new_replacement_string = "र्" + charecter_to_be_replaced;
        charecter_to_be_replaced = charecter_to_be_replaced + "Z";
        modified_substring = modified_substring.replace(
          charecter_to_be_replaced,
          new_replacement_string
        );
        position_of_R = modified_substring.indexOf("Z");
      } // end of while-04
    } // end of IF  statement  meant to  supress processing of  blank  string.

    //**************************************
    //   alert(modified_substring);
    //**************************************
  } // end of the function  Replace_Symbols
} // end of Kritidev_to_unicode function

function Convert_to_Kritidev_010() {
  var array_one = new Array(
    // ignore all nuktas except in ड़ and ढ़
    "‘",
    "’",
    "“",
    "”",
    "(",
    ")",
    "{",
    "}",
    "=",
    "।",
    "?",
    "-",
    "µ",
    "॰",
    ",",
    ".",
    "् ",
    "०",
    "१",
    "२",
    "३",
    "४",
    "५",
    "६",
    "७",
    "८",
    "९",
    "x",

    "फ़्",
    "क़",
    "ख़",
    "ग़",
    "ज़्",
    "ज़",
    "ड़",
    "ढ़",
    "फ़",
    "य़",
    "ऱ",
    "ऩ", // one-byte nukta varNas
    "त्त्",
    "त्त",
    "क्त",
    "दृ",
    "कृ",

    "ह्न",
    "ह्य",
    "हृ",
    "ह्म",
    "ह्र",
    "ह्",
    "द्द",
    "क्ष्",
    "क्ष",
    "त्र्",
    "त्र",
    "ज्ञ",
    "छ्य",
    "ट्य",
    "ठ्य",
    "ड्य",
    "ढ्य",
    "द्य",
    "द्व",
    "श्र",
    "ट्र",
    "ड्र",
    "ढ्र",
    "छ्र",
    "क्र",
    "फ्र",
    "द्र",
    "प्र",
    "ग्र",
    "रु",
    "रू",
    "्र",

    "ओ",
    "औ",
    "आ",
    "अ",
    "ई",
    "इ",
    "उ",
    "ऊ",
    "ऐ",
    "ए",
    "ऋ",

    "क्",
    "क",
    "क्क",
    "ख्",
    "ख",
    "ग्",
    "ग",
    "घ्",
    "घ",
    "ङ",
    "चै",
    "च्",
    "च",
    "छ",
    "ज्",
    "ज",
    "झ्",
    "झ",
    "ञ",

    "ट्ट",
    "ट्ठ",
    "ट",
    "ठ",
    "ड्ड",
    "ड्ढ",
    "ड",
    "ढ",
    "ण्",
    "ण",
    "त्",
    "त",
    "थ्",
    "थ",
    "द्ध",
    "द",
    "ध्",
    "ध",
    "न्",
    "न",

    "प्",
    "प",
    "फ्",
    "फ",
    "ब्",
    "ब",
    "भ्",
    "भ",
    "म्",
    "म",
    "य्",
    "य",
    "र",
    "ल्",
    "ल",
    "ळ",
    "व्",
    "व",
    "श्",
    "श",
    "ष्",
    "ष",
    "स्",
    "स",
    "ह",

    "ऑ",
    "ॉ",
    "ो",
    "ौ",
    "ा",
    "ी",
    "ु",
    "ू",
    "ृ",
    "े",
    "ै",
    "ं",
    "ँ",
    "ः",
    "ॅ",
    "ऽ",
    "् ",
    "्"
  );

  var array_two = new Array(
    "^",
    "*",
    "Þ",
    "ß",
    "¼",
    "½",
    "¿",
    "À",
    "¾",
    "A",
    "\\",
    "&",
    "&",
    "Œ",
    "]",
    "-",
    "~ ",
    "å",
    "ƒ",
    "„",
    "…",
    "†",
    "‡",
    "ˆ",
    "‰",
    "Š",
    "‹",
    "Û",

    "¶",
    "d",
    "[k",
    "x",
    "T",
    "t",
    "M+",
    "<+",
    "Q",
    ";",
    "j",
    "u",
    "Ù",
    "Ùk",
    "ä",
    "–",
    "—",

    "à",
    "á",
    "â",
    "ã",
    "ºz",
    "º",
    "í",
    "{",
    "{k",
    "«",
    "=",
    "K",
    "Nî",
    "Vî",
    "Bî",
    "Mî",
    "<î",
    "|",
    "}",
    "J",
    "Vª",
    "Mª",
    "<ªª",
    "Nª",
    "Ø",
    "Ý",
    "æ",
    "ç",
    "xz",
    "#",
    ":",
    "z",

    "vks",
    "vkS",
    "vk",
    "v",
    "bZ",
    "b",
    "m",
    "Å",
    ",s",
    ",",
    "_",

    "D",
    "d",
    "ô",
    "[",
    "[k",
    "X",
    "x",
    "?",
    "?k",
    "³",
    "pkS",
    "P",
    "p",
    "N",
    "T",
    "t",
    "÷",
    ">",
    "¥",

    "ê",
    "ë",
    "V",
    "B",
    "ì",
    "ï",
    "M",
    "<",
    ".",
    ".k",
    "R",
    "r",
    "F",
    "Fk",
    ")",
    "n",
    "/",
    "/k",
    "U",
    "u",

    "I",
    "i",
    "¶",
    "Q",
    "C",
    "c",
    "H",
    "Hk",
    "E",
    "e",
    "¸",
    ";",
    "j",
    "Y",
    "y",
    "G",
    "O",
    "o",
    "'",
    "'k",
    '"',
    '"k',
    "L",
    "l",
    "g",

    "v‚",
    "‚",
    "ks",
    "kS",
    "k",
    "h",
    "q",
    "w",
    "`",
    "s",
    "S",
    "a",
    "¡",
    "%",
    "W",
    "·",
    "~ ",
    "~"
  ); // "~j"

  //************************************************************
  //Put "Enter chunk size:" line before "<textarea name= ..." if required to be used.
  //************************************************************
  //Enter chunk size: <input type="text" name="chunksize" value="6000" size="7" maxsize="7" style="text-align:right"><br/><br/>
  //************************************************************
  // The following two characters are to be replaced through proper checking of locations:

  // "र्" (reph)
  // "Z" )

  // "ि"
  // "f" )

  var array_one_length = array_one.length;

  var modified_substring = unicode_text_var;

  //****************************************************************************************
  //  Break the long text into small bunches of max. max_text_size  characters each.
  //****************************************************************************************
  var text_size = unicode_text_var.length;

  var processed_text = ""; //blank

  var sthiti1 = 0;
  var sthiti2 = 0;
  var chale_chalo = 1;

  var max_text_size = 6000;

  //************************************************************
  // var max_text_size = chunksize;
  // alert(max_text_size);
  //************************************************************

  while (chale_chalo == 1) {
    sthiti1 = sthiti2;

    if (sthiti2 < text_size - max_text_size) {
      sthiti2 += max_text_size;
      while (unicode_text_var.charAt(sthiti2) != " ") {
        sthiti2--;
      }
    } else {
      sthiti2 = text_size;
      chale_chalo = 0;
    }

    var modified_substring = unicode_text_var.substring(sthiti1, sthiti2);

    Replace_Symbols();

    processed_text += modified_substring;

    //****************************************************************************************
    //  Breaking part code over
    //****************************************************************************************
    //  processed_text = processed_text.replace( /mangal/g , "Krutidev010" ) ;

    legacy_text_var = processed_text;
  }

  //**************************************************

  function Replace_Symbols() {
    // if string to be converted is non-blank then no need of any processing.
    if (modified_substring != "") {
      // first replace the two-byte nukta_varNa with corresponding one-byte nukta varNas.

      modified_substring = modified_substring.replace(/क़/, "क़");
      modified_substring = modified_substring.replace(/ख़‌/g, "ख़");
      modified_substring = modified_substring.replace(/ग़/g, "ग़");
      modified_substring = modified_substring.replace(/ज़/g, "ज़");
      modified_substring = modified_substring.replace(/ड़/g, "ड़");
      modified_substring = modified_substring.replace(/ढ़/g, "ढ़");
      modified_substring = modified_substring.replace(/ऩ/g, "ऩ");
      modified_substring = modified_substring.replace(/फ़/g, "फ़");
      modified_substring = modified_substring.replace(/य़/g, "य़");
      modified_substring = modified_substring.replace(/ऱ/g, "ऱ");

      // code for replacing "ि" (chhotee ee kii maatraa) with "f"  and correcting its position too.

      var position_of_f = modified_substring.indexOf("ि");
      while (position_of_f != -1) {
        //while-02
        var character_left_to_f = modified_substring.charAt(position_of_f - 1);
        modified_substring = modified_substring.replace(
          character_left_to_f + "ि",
          "f" + character_left_to_f
        );

        position_of_f = position_of_f - 1;

        while (
          (modified_substring.charAt(position_of_f - 1) == "्") &
          (position_of_f != 0)
        ) {
          var string_to_be_replaced =
            modified_substring.charAt(position_of_f - 2) + "्";
          modified_substring = modified_substring.replace(
            string_to_be_replaced + "f",
            "f" + string_to_be_replaced
          );

          position_of_f = position_of_f - 2;
        }
        position_of_f = modified_substring.search(/ि/, position_of_f + 1); // search for f ahead of the current position.
      } // end of while-02 loop
      //************************************************************
      //     modified_substring = modified_substring.replace( /fर्/g , "£"  )  ;
      //************************************************************
      // Eliminating "र्" and putting  Z  at proper position for this.

      set_of_matras = "ािीुूृेैोौं:ँॅ";

      modified_substring += "  "; // add two spaces after the string to avoid UNDEFINED char in the following code.

      var position_of_half_R = modified_substring.indexOf("र्");
      while (position_of_half_R > 0) {
        // while-04
        // "र्"  is two bytes long
        var probable_position_of_Z = position_of_half_R + 2;

        var character_right_to_probable_position_of_Z =
          modified_substring.charAt(probable_position_of_Z + 1);

        // trying to find non-maatra position right to probable_position_of_Z .

        while (
          set_of_matras.indexOf(character_right_to_probable_position_of_Z) != -1
        ) {
          probable_position_of_Z = probable_position_of_Z + 1;
          character_right_to_probable_position_of_Z = modified_substring.charAt(
            probable_position_of_Z + 1
          );
        } // end of while-05

        string_to_be_replaced = modified_substring.substr(
          position_of_half_R + 2,
          probable_position_of_Z - position_of_half_R - 1
        );
        modified_substring = modified_substring.replace(
          "र्" + string_to_be_replaced,
          string_to_be_replaced + "Z"
        );
        position_of_half_R = modified_substring.indexOf("र्");
      } // end of while-04

      modified_substring = modified_substring.substr(
        0,
        modified_substring.length - 2
      );

      //substitute array_two elements in place of corresponding array_one elements

      for (
        input_symbol_idx = 0;
        input_symbol_idx < array_one_length;
        input_symbol_idx++
      ) {
        idx = 0; // index of the symbol being searched for replacement

        while (idx != -1) {
          //whie-00
          modified_substring = modified_substring.replace(
            array_one[input_symbol_idx],
            array_two[input_symbol_idx]
          );
          idx = modified_substring.indexOf(array_one[input_symbol_idx]);
        } // end of while-00 loop
      } // end of for loop
    } // end of IF  statement  meant to  supress processing of  blank  string.
  } // end of the function  Replace_Symbols( )
} // end of Convert_Unicode_to_Krutidev010 function

// API endpoint
app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const inputFile = req.file.path;

    // choose begin from request if provided; otherwise use global begin
    const reqBegin =
      typeof req.body.begin !== "undefined" ? parseInt(req.body.begin) : begin;

    // Extract text from uploaded DOCX
    const { value: extractedText } = await mammoth.extractRawText({
      path: inputFile,
    });

    console.log({ extractedText });

    if (
      typeof extractedText === "undefined" ||
      extractedText.trim().length === 0
    ) {
      // cleanup uploaded file
      // fs.unlinkSync(inputFile);
      console.warn("Warning: extractedText is empty.");
      // don't fail — return empty docx or notify user
    }

    let convertedText;
    let fontName;

    if (reqBegin === 0) {
      legacy_text_var = extractedText;
      console.log({ legacy_text_var });
      convert_to_unicode();
      convertedText = unicode_text_var || "";
      fontName = "Mangal";
    } else {
      unicode_text_var = extractedText;
      Convert_to_Kritidev_010();
      console.log({ legacy_text_var });
      convertedText = legacy_text_var || "";
      fontName = "Kruti Dev 010";
    }

    // Create Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: convertedText,
                  font: "Kruti Dev 055", // 👈 set font
                  size: 40, // 20pt (half-points)
                }),
              ],
            }),
          ],
        },
      ],
    });

    // Save as .docx in uploads/converted
    const outputFileName = `converted_${Date.now()}.docx`;
    const outputPath = path.join(convertedFolder, outputFileName);

    Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync(outputPath, buffer);

      res.json({
        message: "✅ File converted successfully",
        url: `/converted/${outputFileName}`,
        size: buffer.length, // in bytes
      });

      console.log({
        message: "✅ File converted successfully",
        url: `/converted/${outputFileName}`,
        size: buffer.length, // in bytes
      });
    });

   
  } catch (err) {
    console.error("Error in /convert:", err);
    res.status(500).send("Error processing DOCX file.");
  }
});

// Serve converted files statically
app.use("/converted", express.static(convertedFolder));
app.use(express.static(path.join(__dirname, "public", "dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
