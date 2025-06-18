"use strict"

const fs = require("fs");
const path = require("path");

module.exports = {

    list: (req, res) => {
      const logDirectory = path.join(__dirname, "../../logs");

      fs.readdir(logDirectory, (err, files) => {
        if (err) return res.status(500).json({ message: "Log dizini okunamadı" });

        const logFiles = files.filter((file) => file.endsWith(".log"));
        const allLines = [];
        let remaining = logFiles.length;

        if (remaining === 0) return res.json([]);

        logFiles.forEach((file) => {
          const filePath = path.join(logDirectory, file);

          fs.readFile(filePath, "utf8", (err, data) => {
            if (!err) {
              const lines = data.split("\n").filter(line => line.trim() !== "");
              // lines artık string array, bunu obje array’e çevirebiliriz:
              const parsedLines = lines.map(line => {
                let type = "info";
                if (line.startsWith("[ERROR]")) type = "error";
                else if (line.startsWith("[WARNING]")) type = "warning";

                return { line, type };
              });
              allLines.push(...parsedLines);
            }

            remaining--;

            if (remaining === 0) {
              res.json(allLines);
            }
          });
        });
      });
    },

    deletee: (req, res) => {
        const logDirectory = path.join(__dirname, "../../logs");

        fs.readdir(logDirectory, (err, files) => {
            if (err) return res.status(500).json({ message: "Log dizini okunamadı" });

            const logFiles = files.filter((file) => file.endsWith(".log"));

            let remaining = logFiles.length;

            if (remaining === 0) return res.json({ message: "Silinecek log dosyası yok" });

            logFiles.forEach((file) => {
            const filePath = path.join(logDirectory, file);

            fs.unlink(filePath, (err) => {
                if (err) console.error(`Dosya silinemedi: ${filePath}`, err);

                remaining--;

                if (remaining === 0) {
                res.json({ message: "Tüm log dosyaları silindi" });
                }
            });
            });
        });
    }

}

/*
async function getAllLogsStrings() {
  const output = document.getElementById("logOutput");

  try {
    const response = await fetch("http://localhost:3000/logs/all-strings");
    if (!response.ok) {
      output.textContent = "Loglar okunamadı.";
      return;
    }

    const logLines = await response.json();

    output.innerHTML = "";
    logLines.forEach(line => {
      const div = document.createElement("div");
      div.textContent = line;
      output.appendChild(div);
    });
  } catch (error) {
    output.textContent = "Hata: " + error.message;
  }
}

*/