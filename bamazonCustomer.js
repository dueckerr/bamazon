var mysql = require('mysql');
var inquirer = require('inquirer')
require('console.table')

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Bascer!2',
    database: 'bamazon'
})

connection.connect(function (err){
    if (err) {
        console.log(err);
    }
    else {
        loadProducts();
    }
})


function loadProducts() {
    connection.query('SELECT * FROM products', function(err, result) {
        if (err) {
            console.log(err);
        }
        else {
            list = result
            console.table(result);
            CustomerAction()
        }
    })
}

function CustomerAction() {
    inquirer
      .prompt([
        {
            name: "item",
            type: "input",
            message: "What is the item you would like to buy, enter by Item_ID # ?"
          },
          {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"
          }  
        ])
        .then(function(input) {
      
          var item = input.item;
          var quantity = input.quantity;
      
          // Query db to confirm that the given item ID exists in the desired quantity
          var queryStr = 'SELECT * FROM products WHERE ?';
      
          connection.query(queryStr, {item_id: item}, function(err, data) {
            if (err) throw err;
      
            if (data.length === 0) {
              console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
              loadProducts();
      
            } else {
              var productData = data[0];
      
              // If the quantity requested by the user is in stock
              if (quantity <= productData.stock_quantity) {
                console.log('Congratulations, the product you requested is in stock! Placing order!');
      
                // Construct the updating query string
                var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
      
                // Update the inventory
                connection.query(updateQueryStr, function(err, data) {
                  if (err) throw err;
      
                  console.log('Your oder has been placed! Your total is $' + productData.price * quantity);
                  console.log('Thank you for shopping with us!');
                  console.log("\n---------------------------------------------------------------------\n");
      
                  // End the database connection
                  connection.end();
                })
              } else {
                console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
                console.log('Please modify your order.');
                console.log("\n---------------------------------------------------------------------\n");
      
                loadProducts();
              }
            }
          })
        })
      }
      

       
