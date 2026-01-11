import BillDetails from "../Model/Bill.js";

export const createBill = async (req, res, next) => {
    try {
        const { invoice_no, invoice_date, state, state_code, transport_name, vehicle_number, date_of_supply, pono_date, eway_bill_no, receiver_name, receiver_address, receiver_gstin, receiver_state, receiver_state_code, consignee_name, consignee_address, consignee_gstin, consignee_state, consignee_state_code ,items,totalquantity,total_before_tax,cgst,sgst,igst,cgstamount,sgstamount,igstamount,roundoff,grand_total,grand_total_words} = req.body;
        
      
        const existingBill = await BillDetails.findOne({ invoice_no });
        
        if (!existingBill) {
            const BillItem = new BillDetails({
                invoice_no, invoice_date, state, state_code, transport_name, vehicle_number, date_of_supply, pono_date, eway_bill_no, receiver_name, receiver_address, receiver_gstin, receiver_state, receiver_state_code, consignee_name, consignee_address, consignee_gstin, consignee_state, consignee_state_code,items,totalquantity,total_before_tax,cgst,sgst,igst,cgstamount,sgstamount,igstamount,roundoff,grand_total,grand_total_words
            });
            const savedBilltem = await BillItem.save();
            console.log(savedBilltem);
            if (!savedBilltem) {
                return res.status(500).json({ message: 'Unexpected error occurred' });
            }
            return res.status(201).json({ BillItem: savedBilltem });
        }
        else{
          return res.status(400).json({ message: 'Bill with this invoice number already exists' });
        }
        
    }
    catch (error) {
        return next(error);

    }
};
export const fetchBill = async (req, res, next) => {
    try {
      const Bill = await BillDetails.find();
      res.status(200).json({ Bill  });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  export const fetchAndGenerateInvoiceNumber = async (req, res, next) => {
    try {
        // Fetch the most recent invoice
        const latestBill = await BillDetails.findOne()
            .sort({ _id: -1 }) // Sort by newest document
            .exec();

        // Get current date details
        const today = new Date();
        const currentYear = today.getFullYear(); // e.g., 2025
        const currentMonth = today.getMonth() + 1; // Jan = 0, so +1

        let fyStartYear, fyEndYear;

        // Determine financial year (April to March)
        if (currentMonth < 4) {
            fyStartYear = currentYear - 1;
            fyEndYear = currentYear;
        } else {
            fyStartYear = currentYear;
            fyEndYear = currentYear + 1;
        }

        // Format financial year as (YY-YY)
        const formattedYear = `${fyStartYear.toString().slice(-2)}-${fyEndYear.toString().slice(-2)}`;

        let newBillNo = "001"; // Default for the first invoice

        if (latestBill) {
            const latestInvoiceNo = latestBill.invoice_no; // e.g., "LGC(24-25)0001"
            const yearMatch = latestInvoiceNo.match(/\d{2}-\d{2}/); // Extract (24-25)

            if (yearMatch) {
                const latestYear = yearMatch[0]; // Extracted financial year
                const latestSerialNo = parseInt(latestInvoiceNo.slice(-3), 10); // Extract last 4 digits (serial number)

                // If financial year matches, increment the serial number
                if (latestYear === formattedYear) {
                    newBillNo = (latestSerialNo + 1).toString().padStart(3, "0"); // e.g., "0002"
                }
            }
        }

        // Generate the new invoice number
        const newInvoiceNo = `LPIW/${formattedYear}/${newBillNo}`;

        // Return the invoice number to the frontend
        return res.status(200).json({ invoice_no: newInvoiceNo });
    } catch (error) {
        return next(error);
    }
};

// export const fetchAndGenerateInvoiceNumber = async (req, res, next) => {
//     try {
//         // Fetch the most recent invoice
//         const latestBill = await BillDetails.findOne()
//             .sort({ _id: -1 }) // Sort by newest document
//             .exec();

//         // Get the current year (last two digits)
//         const currentYear = new Date().getFullYear().toString().slice(-2);
        

//         let newBillNo = "0001"; // Default for the first bill
//         if (latestBill) {
//             const latestInvoiceNo = latestBill.invoice_no; // e.g., "LGC240001"
//             const latestYear = latestInvoiceNo.slice(3, 5); // e.g., "24"
//             const latestSerialNo = parseInt(latestInvoiceNo.slice(5)); // e.g., "0001"

//             // If the year matches, increment the bill number
//             if (latestYear === currentYear) {
//                 newBillNo = (latestSerialNo + 1).toString().padStart(4, "0"); // e.g., "0002"
//             }
//         }

//         // Generate the new invoice number
//         const newInvoiceNo = `LGC${currentYear}${newBillNo}`;

//         // Return the invoice number to the frontend
//         return res.status(200).json({ invoice_no: newInvoiceNo });
//     } catch (error) {
//         return next(error);
//     }
// };
export const fetchAndGenerateBillNumber = async (req, res, next) => {
    try {
        // Fetch the most recent bill
        const latestBill = await BillDetails.findOne()
            .sort({ _id: -1 }) // Sort by newest document
            .exec();

        let newBillNo;

        if (latestBill) {
            // Get the last bill number and increment
            const latestSerialNo = parseInt(latestBill.invoice_no); // e.g., "138"
            newBillNo = (latestSerialNo + 1).toString().padStart(3, "0"); // e.g., "139"
        } else {
            // No bills found, start with "001"
            newBillNo = "001";
        }

        // Return the new bill number
        return res.status(200).json({ invoice_no: newBillNo });
    } catch (error) {
        return next(error);
    }
};
export const updateBill = async(req,res,next) =>{
    const invoice = req.params.invoice_no; 
    try {
      const updatedBill = req.body; 
      if (!invoice) {
        console.log(invoice)
        return res.status(400).json({ message: 'Bill ID is required for updating.' });
      }
  
      const existingBill= await BillDetails.findOne({invoice_no:invoice});
      if (!existingBill) {
        return res.status(404).json({ message: 'Bill not found.' });
      }
      const updated = await BillDetails.findOneAndUpdate({invoice_no:invoice}, updatedBill, { new: true });
      return res.status(200).json({ message: 'Bill updated successfully.', updated });
    } catch (error) {
      console.error('Bill updating Ticket:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
  export const deleteBill = async (req, res, next) => {
    const invoice = req.params.invoice_no; // Extract invoice_no from query parameters
    try {
      if (!invoice) {
        return res.status(400).json({ message: 'Invoice number is required for deleting the bill.' });
      }
  
      // Find and delete the bill
      const deletedBill = await BillDetails.findOneAndDelete({ invoice_no: invoice });
  
      if (!deletedBill) {
        return res.status(404).json({ message: 'Bill not found.' });
      }
  
      return res.status(200).json({ message: 'Bill deleted successfully.', deletedBill });
    } catch (error) {
      console.error('Error deleting bill:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
  