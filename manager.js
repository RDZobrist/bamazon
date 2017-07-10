const mysql = require('mysql');
const term = require('terminal-kit').terminal;
const inquirer = require('inquirer');
const Item = require('./itemObj');
var lowInvItemArr = [];
var itemq;
const connection = mysql.createConnection({
     host: "localhost",
     port: 3306,
     user: "root",
     password: "lawyer420",
     database: "bamazon"
});

connection.connect(function(err) {
     if (err) throw err;


});

function addProduct() {
     inquirer.prompt([{
          name: "product_name",
          type: "input",
          message: "Enter the name of new product"
     }, {
          name: "price",
          type: "input",
          message: "Enter the price/unit for new product"
     }, {
          name: "quanity",
          type: "input",
          message: "Enter the amount being added to inventory"
     }, {
          name: "department_name",
          type: "input",
          message: "Enter the department for new product"
     }]).then(function(userResponse) {
          var name = userResponse.product_name;
          var price = userResponse.price;
          var quanity = userResponse.quanity;
          var department_name = userResponse.department_name;



          connection.query(
               "INSERT INTO products SET ?", {
                    product_name: name,
                    department_name: department_name,
                    price: price,
                    stock_quanity: quanity
               },
               function(err, res) {

                    console.log(res.affectedRows + " product inserted!\n");
                    setTimeout(function() { getCommand(); }, 3500);
               }
          );

     });
}

function queryProducts() {
     // query db and print all products in store to screen along with price and dept name
     connection.query("SELECT * FROM products", function(err, res) {

          for (var i = 0; i < res.length; i++) {


               console.log("\nid:" + res[i].id +
                    "\n   " + res[i].product_name +
                    " |  $" + res[i].price + " |  Quanity: " +
                    res[i].stock_quanity + " |  Dept:" +
                    res[i].department_name
               );


          }
          term.bold.yellow("-----------------------------------\n\n")
          setTimeout(function() { getCommand(); }, 4000);
     });
};


function getCommand() {
     inquirer.prompt([{
               name: "command",
               type: "list",
               message: "Use the arrow to select the command?",
               choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
          }

     ]).then(function(userResponse) {
          if (userResponse.command === "View Products For Sale") {
               queryProducts();
          } else if (userResponse.command === "View Low Inventory") {
               lowInventory();

          } else if (userResponse.command === "Add to Inventory") {
               increaseInventory();
          } else {
               addProduct();
          }
     });
};

function lowInventory() {


     connection.query("SELECT * FROM products WHERE stock_quanity < 5", function(err, res) {

          term.red.bold("\n\n\tCurrent List of Depleted Inventory\n\t----------------------------------\n\n");

          // loop through results
          for (var i = 0; i < res.length; i++) {
               // construct object with depleted product's information
               let item = res[i].id;
               // push depleted item to array
               lowInvItemArr.push(item)
               console.log("\tid:\t" + res[i].id + " | " + res[i].product_name + "\t| Quanity: " + res[i].stock_quanity);

          }
          setTimeout(function() { getCommand(); }, 4000);
     });

}
// increase inventory 
function increaseInventory() {

     var originalQty;


     connection.query("SELECT * FROM products", function(err, res) {



          // loop through results
          for (var i = 0; i < res.length; i++) {

               term.yellow.bold("\n id: \t\t" + res[i].id + "\n Product name: \t\t" + res[i].product_name + " \n| quanity: \t\t" + res[i].stock_quanity + " \n\n");
               // construct object with depleted product's information
               let item = res[i].id.toString();
               // push depleted item to array
               lowInvItemArr.push(item);
          }
          if (lowInvItemArr[0]) {
               term.blue.bold("\n\n---")
               inquirer.prompt([{
                         name: "id",
                         type: "list",
                         message: "Add inventory to which product?\n\n",
                         choices: lowInvItemArr
                    }, {
                         name: "quanity",
                         type: "input",
                         message: "Enter quanity to be added to current inventory"
                    }

               ]).then(function(userResponse) {

                    var qty = parseInt(userResponse.quanity);
                    var id = userResponse.id;

                    connection.query(
                         "SELECT * FROM products WHERE ?", [{
                              id: id
                         }],
                         function(err, res) {
                              for (var i = 0; i < res.length; i++) {
                                   originalQty = res[i].stock_quanity;

                              }
                              qty = qty + originalQty;

                              // query sql db, update inventory with manager's input 
                              connection.query(
                                   "UPDATE products SET ? WHERE ?", [{
                                        stock_quanity: qty
                                   }, {
                                        id: id
                                   }],
                                   function(err, res) {
                                        console.log("\n" + res.affectedRows + " products updated!\n");
                                        setTimeout(function() { getCommand(); }, 4000);
                                   });
                         });
               });
          };
     });
};

getCommand();
