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
        ManagerAction();
    }
})


// function loadProducts() {
//     connection.query('SELECT * FROM products', function(err, result) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             list = result
//             console.table(result);
//             ManagerAction()
//         }
//     })
// }

function ManagerAction() {
    inquirer
      .prompt([
        {
            name: "action",
            type: "list",
            message: "What do you need to do?",
            choices: [
                'View Products for Sale',
                'View low inventory',
                'Add to Inventory',
                'Add New Product',
                'exit'
              ]
            }  
          ])
          .then(function(answer) {
              switch (answer.action) {
              case 'View Products for Sale':
                ViewProducts();
                break;
        
              case 'View low inventory':
                ViewLowInventory();
                break;
        
              case 'Add to Inventory':
                AddInventory();
                break;
        
              case 'Add New Product':
                AddNewProduct();
                break;  
        
              case 'exit':
                connection.end();
                break;
              }
            });
        }
      


function ViewProducts() {
  connection.query('SELECT * FROM products', function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.table(result);
        ManagerAction()
    }
  })
  console.log('test')
}

function ViewLowInventory() {
  queryStr = 'SELECT * FROM products WHERE stock_quantity < 100';
  connection.query(queryStr, function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        list = result
        console.table(result);
        ManagerAction()
    }
  })
}
           
function AddInventory() {
  connection.query('SELECT * FROM products', function(err, result) {
        console.table(result);
        inquirer.prompt([
          {
            type: 'input',
            name: 'item_id',
            message: 'What product would you like to update? Enter by item id.'
          },
          {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to add?'
          }
        ])
        .then(function(input){
          var newProduct = input.item_id;
          var quantity = input.quantity;
          queryStr = 'SELECT * FROM products WHERE ?';
          console.log('test')
          connection.query(queryStr, {item_id: newProduct}, function(err, result) {
            if (err) {
              console.log(err);
            }
            else {
              console.log(result)
              var productData = result[0];
              console.log('Updating Inventory')
              var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + quantity) + ' WHERE item_id = ' + newProduct;
              console.log('------------')
              console.log(newProduct)
              console.log(productData.stock_quantity + quantity)
              console.log('hi');
              
              // Update the inventory
              connection.query(updateQueryStr, function(err, result) {
                if (err) throw err;
                
                // console.log('Stock count for Item ID ' + newProduct + ' has been updated to ' + (productData.stock_quantity + quantity) + '.');
                console.table(result);
                ManagerAction()
              })
            }
          })
        })
      })
      }
      
      function AddNewProduct() {
  queryStr = 'SELECT * FROM products WHERE stock_quantity < 100';
  connection.query(queryStr, function(err, result) {
    if (err) {
        console.log(err);
    }
    else {
        list = result
        console.table(result);
        ManagerAction()
    }
  })
}
      
             