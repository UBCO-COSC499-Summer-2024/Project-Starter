// app/frontend/src/utils/generateOMRSheet.js

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const drawCircleWithText = (page, x, y, text, fontSize, drawText = true) => {
  const circleSize = 8;
  page.drawCircle({
    x,
    y,
    size: circleSize / 2,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  if (drawText && text) {
    page.drawText(text, {
      x: x - fontSize / 4,
      y: y - fontSize / 3,
      size: fontSize,
    });
  }
};

const drawEmptyRectangle = (page, x, y, width, height) => {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
};

export const generateDetailedOMRSheet = async (totalQuestions, optionsPerQuestion) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const createIdentificationPage = () => {
    const page = pdfDoc.addPage([600, 900]);
    const { width, height } = page.getSize();
    const fontSize = 6;
    const margin = 40;
    const boxWidth = 10;
    const boxHeight = 10;

    page.setFont(font);
    page.setFontSize(fontSize);

    // Title
    const title = "Student Identification";
    const titleWidth = font.widthOfTextAtSize(title, fontSize);
    page.drawText(title, {
      x: (width - titleWidth) / 2,
      y: height - margin,
    });

    // Student ID Section
    const idLabel = "Student I.D.";
    page.drawText(idLabel, {
      x: margin,
      y: height - margin - 40,
    });

    const idColumns = "0123456789".split("");
    const idYStart = height - margin - 60;
    const idStartX = (width - idColumns.length * 20) / 2;
    idColumns.forEach((col, colIndex) => {
      page.drawText(col, {
        x: idStartX + colIndex * 20 + 10,
        y: idYStart,
      });
      for (let i = 0; i < 10; i++) {
        drawCircleWithText(page, idStartX + colIndex * 20 + 10, idYStart - (i + 1) * 20, String(i), fontSize);
      }
    });

    // Name Sections
    ["First Name", "Last Name"].forEach((nameField, fieldIndex) => {
      const nameYStart = idYStart - 220 - fieldIndex * 300;
      page.drawText(nameField, {
        x: margin,
        y: nameYStart,
      });

      // Draw header (blank space and A-Z)
      const header = ["_", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];
      const headerStartX = (width - header.length * 20) / 2;
      header.forEach((char, charIndex) => {
        page.drawText(char, {
          x: headerStartX + charIndex * 20 + 10,
          y: nameYStart - 20,
        });
      });

      // Draw circles for each row starting with blank and followed by A-Z
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      for (let row = 0; row < 10; row++) {
        const rowYStart = nameYStart - 40 - (row + 1) * 20;

        // Draw empty rectangle for the student to write the letter
        drawEmptyRectangle(page, headerStartX + 10, rowYStart - boxHeight / 2, boxWidth, boxHeight);

        for (let col = 1; col < 27; col++) {  // 26 columns for A-Z
          drawCircleWithText(page, headerStartX + col * 20 + 10, rowYStart, alphabet[col - 1], fontSize);
        }
      }
    });
  };

  const createAnswerPage = (questions, options) => {
    const page = pdfDoc.addPage([600, 900]);
    const { width, height } = page.getSize();
    const fontSize = 6;
    const margin = 40;

    page.setFont(font);
    page.setFontSize(fontSize);

    // Title
    const title = "Exam Answer Sheet";
    const titleWidth = font.widthOfTextAtSize(title, fontSize);
    page.drawText(title, {
      x: (width - titleWidth) / 2,
      y: height - margin,
    });

    const instructions = "Please fill in the entire circle that corresponds to your answer for each question.";
    const instructionsWidth = font.widthOfTextAtSize(instructions, fontSize);
    page.drawText(instructions, {
      x: (width - instructionsWidth) / 2,
      y: height - margin - 20,
    });

    // Answer Section
    const startY = height - margin - 60;
    const columns = 3;
    const rowsPerColumn = 30;
    const colWidth = (width - 2 * margin) / columns;
    const colPadding = (width - columns * colWidth) ; // Calculate padding to center columns
    let currentY = startY;
    let currentX = colPadding; // Start X position adjusted to center columns

    for (let i = 0; i < questions.length; i++) {
      if (i % rowsPerColumn === 0 && i !== 0) {
        currentX += colWidth;
        currentY = startY;
      }

      const questionIndex = questions[i];
      const questionText = `${questionIndex}.`;
      page.drawText(questionText, {
        x: currentX,
        y: currentY - 7.5, // Adjusted for better alignment
      });

      for (let opt = 0; opt < options; opt++) {
        drawCircleWithText(page, currentX + 30 + opt * 20, currentY - 5.5, String.fromCharCode(65 + opt), fontSize); // Adjusted for better alignment
      }

      currentY -= 20;
    }
  };

  createIdentificationPage();

  const totalPages = Math.ceil(totalQuestions / 90); // 30 questions per column * 3 columns per page
  for (let i = 0; i < totalPages; i++) {
    const startQuestion = i * 90 + 1;
    const endQuestion = Math.min(startQuestion + 89, totalQuestions);
    const questions = Array.from({ length: endQuestion - startQuestion + 1 }, (_, k) => startQuestion + k);
    createAnswerPage(questions, optionsPerQuestion);
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
