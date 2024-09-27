const Customer = require('../models/Customer'); // Import the Customer model

// Controller to add a customer
const addCustomer = async (req, res) => {
    try {
        const { fullName, mobile, email, connectionDate, deviceName, macAddress, price, addedBy } = req.body;

        // Create a new customer
        const customer = new Customer({
            fullName,
            mobile,
            email,
            connectionDate,
            deviceName,
            macAddress,
            price,
        });

        // Save the customer to the database
        const savedCustomer = await customer.save();

        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Controller to fetch all customers
const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        
        // Calculate remaining days and status for each customer
        customers.forEach((customer) => customer.calculateRemainingDays());
        
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Controller to search customers
const searchCustomers = async (req, res) => {
    try {
        const { query } = req.query; // Extract query from request
        const searchCriteria = {
            $or: [
                { macAddress: query }, // Search by MAC address
                { email: query } // Search by email
            ]
        };

        const customers = await Customer.find(searchCriteria);
        
        // Calculate remaining days and status for each customer if necessary
        customers.forEach((customer) => customer.calculateRemainingDays());

        res.status(200).json(customers);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Controller to update a customer
const updateCustomer = async (req, res) => {
    const { payAmount, connectionDate, updatedBy, fullName, mobile, email, deviceName, macAddress, price, receiverEmail } = req.body; // Destructure all necessary fields

    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                connectionDate,
                updatedBy,
            },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Update other customer details
        Object.assign(customer, { fullName, mobile, email, deviceName, macAddress, price });

        // Update payment amount and add to payment history
        if (payAmount) {
            customer.payAmount = payAmount;
            customer.paymentHistory.push({
                amount: payAmount,
                receiverName: updatedBy,
                receiverEmail, // Ensure this is defined
            });
        }

        // Calculate remaining days and status before saving
        customer.calculateRemainingDays();

        // Save the updated customer data
        await customer.save();

        res.status(200).json(customer);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// Controller to delete a customer
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        await Customer.findByIdAndDelete(id);
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};





module.exports = { addCustomer, getCustomers, updateCustomer, deleteCustomer, searchCustomers, };

