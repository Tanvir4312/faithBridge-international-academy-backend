/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateAdmitCardPDF = async (
  fromFillupDatas: any,
): Promise<Buffer> => {
  const { student, exam, studentClass } = fromFillupDatas;

  let imageBuffer: Buffer | null = null;
  if (student?.profileImage) {
    try {
      const response = await fetch(student.profileImage);
      if (response.ok) {
        imageBuffer = Buffer.from(await response.arrayBuffer());
      }
    } catch (e) {
      console.error("Student photo load error", e);
    }
  }

  let signatureBuffer: Buffer | null = null;
  try {
    const sigPath = path.join(process.cwd(), "src/assets/signature.png");
    if (fs.existsSync(sigPath)) {
      signatureBuffer = fs.readFileSync(sigPath);
    }
  } catch (e) {
    console.error("Principal signature load error", e);
  }

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (error) => reject(error));

      // --- Main Outer Border ---
      doc.rect(30, 30, 535, 450).lineWidth(2).stroke();

      // --- Header Section ---
      doc.moveDown(1);
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("FAITHBRIDGE INTERNATIONAL ACADEMY", { align: "center" });
      doc
        .fontSize(11)
        .font("Helvetica")
        .text("FaithBridge Road, Dhaka, Bangladesh", { align: "center" });
      doc.moveDown(0.5);
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("ADMIT CARD", { align: "center", underline: true });

      doc.moveDown(2);

      // --- Student Info ---
      const infoTop = doc.y;
      const startX = 60;
      const dataX = 190;
      let currentY = infoTop;

      const labels = [
        { label: "Student Name (En):", value: student.nameEn },
        { label: "Registration No:", value: student.registrationId },
        { label: "Class Roll:", value: student.classRoll },
        { label: "Class:", value: studentClass.name },
        { label: "Examination:", value: exam.name },
        { label: "Year:", value: exam.year },
      ];

      labels.forEach((item) => {
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(item.label, startX, currentY);
        doc
          .font("Helvetica")
          .fontSize(11)
          .text(item.value || "N/A", dataX, currentY);
        currentY += 25;
      });

      // --- Student Photo ---
      if (imageBuffer) {
        doc.image(imageBuffer, 430, infoTop, { width: 100, height: 100 });
      }
      doc.rect(430, infoTop, 100, 100).lineWidth(1).stroke();

      // --- Instructions ---
      doc.y = currentY + 15;
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Instructions for Examinees:", startX);
      doc.moveDown(0.5);
      doc.fontSize(9).font("Helvetica");
      const instructions = [
        "1. Students must bring this Admit Card to the examination hall.",
        "2. Any kind of electronic devices or mobile phones are strictly prohibited.",
        "3. Students should enter the hall at least 15 minutes before the exam starts.",
        "4. No student will be allowed to leave the hall before one hour of the exam.",
      ];
      instructions.forEach((ins) => doc.text(ins, { indent: 15, lineGap: 2 }));

      // --- Signature Section ---
      const signatureY = 430;
      doc.lineWidth(1);

      // Student Signature Line
      doc.moveTo(60, signatureY).lineTo(180, signatureY).stroke();
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Student Signature", 65, signatureY + 8);

      // Principal Signature Image & Line
      if (signatureBuffer) {
        doc.image(signatureBuffer, 420, signatureY - 25, { width: 80 });
      }
      doc.moveTo(410, signatureY).lineTo(530, signatureY).stroke();
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Principal Signature", 415, signatureY + 8);

      // --- Footer ---
      doc
        .fontSize(8)
        .font("Helvetica-Oblique")
        .text(
          "This is an electronically generated admit card issued by the school authority.",
          30,
          460,
          {
            align: "center",
            width: 535,
          },
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
