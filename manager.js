const mysql = require('mysql');
const term = require('terminal-kit').terminal;
const inquirer = require('inquirer');



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

function queryProducts() {

     // query db and print all products in store to screen along with price and dept name
     connection.query("SELECT * FROM products", function(err, res) {
          for (var i = 0; i < res.length; i++) {
               console.log("id:" + res[i].id + "\n   " + res[i].product_name + " |  $" + res[i].price + " |  Quanity: " + res[i].stock_quanity + " |  Dept:" + res[i].department_name);
          }
          term.bold.yellow("-----------------------------------\n\n")
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
               console.log("inventory updated");
          } else {
               console.log("added new product to the the story ")
          }
     });
};

function lowInventory() {
     
     connection.query("SELECT * FROM products WHERE stock_quanity < 5", function(err, res) {
          for (var i = 0; i < res.length; i++)
               console.log(res[i].product_name + "\t| id: " + res[i].id + " | Quanity: \t"+ res[i].stock_quanity);
     });
}
getCommand();



