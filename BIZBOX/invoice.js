document.addEventListener("DOMContentLoaded", function () {
    const jsPDF = window.jspdf.jsPDF;

    const invoiceForm = document.getElementById("invoiceForm");
    const invoiceItems = document.getElementById("invoiceItems");
    const totalAmountSpan = document.getElementById("totalAmount");

    // Function to update total cost
    function updateTotals() {
        let total = 0;
        document.querySelectorAll("#invoiceItems tr").forEach((row) => {
            const cost = parseFloat(row.querySelector(".item-cost").value) || 0;
            const qty = parseInt(row.querySelector(".item-qty").value) || 0;
            const itemTotal = cost * qty;
            row.querySelector(".item-total").textContent = `$${itemTotal.toFixed(2)}`;
            total += itemTotal;
        });
        totalAmountSpan.textContent = `$${total.toFixed(2)}`;
    }

    // Listen for changes in cost and quantity fields
    invoiceItems.addEventListener("input", updateTotals);

    // Add new item row
    document.getElementById("addItem").addEventListener("click", function () {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" class="form-control item-desc" required></td>
            <td><input type="number" class="form-control item-cost" min="0" step="0.01" required></td>
            <td><input type="number" class="form-control item-qty" min="1" step="1" required></td>
            <td class="item-total">$0.00</td>
        `;
        invoiceItems.appendChild(newRow);
    });

    // Handle invoice generation and PDF creation
    invoiceForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let doc = new jsPDF();
        doc.setFont("helvetica", "bold");

        // Set Lavender Theme for Header
        doc.setFillColor(180, 150, 210);
        doc.rect(0, 0, 210, 40, "F");

        // Header
        doc.setFontSize(28);
        doc.setTextColor(255, 255, 255);
        doc.text("INVOICE", 20, 20);

        // Invoice Details
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Invoice Number: ${document.getElementById("invoiceNumber").value}`, 140, 20);
        doc.text(`Date of Issue: ${document.getElementById("date").value}`, 140, 30);

        // Client Details
        doc.setFontSize(14);
        doc.text("Billed To:", 20, 50);
        doc.setFontSize(12);
        doc.text(`${document.getElementById("clientName").value}`, 20, 58);
        doc.text(`${document.getElementById("clientAddress").value}`, 20, 65);
        doc.text(`${document.getElementById("clientCity").value}, ZIP: ${document.getElementById("clientZip").value}`, 20, 72);

        // Table Headers
        let startY = 90;
        doc.setFillColor(200, 170, 230);
        doc.rect(20, startY, 170, 10, "F");

        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text("Description", 25, startY + 7);
        doc.text("Unit Cost ($)", 100, startY + 7);
        doc.text("Qty", 140, startY + 7);
        doc.text("Amount ($)", 165, startY + 7);

        // Invoice Items
        let yPos = startY + 15;
        let totalAmount = 0;
        doc.setTextColor(0, 0, 0);

        document.querySelectorAll("#invoiceItems tr").forEach(row => {
            let desc = row.querySelector(".item-desc").value.trim();
            let cost = parseFloat(row.querySelector(".item-cost").value) || 0;
            let qty = parseInt(row.querySelector(".item-qty").value) || 0;
            let total = cost * qty;

            // Skip empty rows
            if (desc === "" || cost === 0 || qty === 0) return;

            totalAmount += total;

            doc.text(desc, 25, yPos);
            doc.text(`$${cost.toFixed(2)}`, 100, yPos);
            doc.text(qty.toString(), 140, yPos);
            doc.text(`$${total.toFixed(2)}`, 165, yPos);
            yPos += 10;
        });

        // Total Section
        doc.setFillColor(200, 170, 230);
        doc.rect(120, yPos + 5, 70, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.text("Total Amount:", 125, yPos + 12);
        doc.text(`$${totalAmount.toFixed(2)}`, 165, yPos + 12);

        // Save PDF
        doc.save("invoice.pdf");
    });
});
