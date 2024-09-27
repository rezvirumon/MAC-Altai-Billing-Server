const express = require('express');
const { addCustomer, getCustomers, updateCustomer, deleteCustomer, searchCustomers,  } = require('../controllers/customerController'); // Import all controllers
const router = express.Router();

// Route for adding a new customer
router.post('/add', addCustomer);

// Fetch all customers
router.get('/', getCustomers);

// Route for searching customers
router.get('/search', searchCustomers);

// Route for updating a customer
router.put('/update/:id', updateCustomer);

// Route for deleting a customer
router.delete('/delete/:id', deleteCustomer);



module.exports = router;
