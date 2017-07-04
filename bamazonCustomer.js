const mysql = require('mysql');
const term = require('terminal-kit').terminal;
const inquirer = require('inquirer');
var choicesArr = [];
var i3;
var id;
var connection = mysql.createConnection({
     host: "localhost",
     port: 3306,
     user: "root",
     password: "lawyer420",
     database: "bamazon"
});

connection.connect(function(err) {
     if (err) throw err;
     console.log("Connected as id " + connection.threadId);
     queryAllProducts();
});
module.exports = connection;
function queryAllProducts() {

     // query db and print all products in store to screen along with price and dept name
     connection.query("SELECT * FROM products", function(err, res) {
          for (var i = 0; i < res.length; i++) {
               console.log("id:" + res[i].id + "\n   " + res[i].product_name + " |  $" + res[i].price + " |  Dept:" + res[i].department_name);
               // each time through loop store product id to variable 'i2'
               var i2 = res[i].id;
               // convert stored value to a string, strore that value in 'i3' variable
               i3 = i2.toString();
               // push string-form id to array
               choicesArr.push(i3);

          }
          term.bold.yellow("-----------------------------------\n\n");

          	timer();
     });

     
     function promptUser() {

          inquirer.prompt([{
                    name: "item",
                    type: "list",
                    message: "Please enter the id of the item you'd like to purchase?",
                    choices: choicesArr
               }

          ]).then(function(userResponse) {

               if (userResponse.item === "1") {
                    checkInventory("1");

               }
               if (userResponse.item === "2") {
                    checkInventory("2");
               }
               if (userResponse.item === "3") {
                    checkInventory("3");
               }
               if (userResponse.item === "4") {

                    checkInventory("4");
               }
               if (userResponse.item === "5") {
                    checkInventory("5");
               }
               if (userResponse.item === "6") {
                    checkInventory("6");
               }
               if (userResponse.item === "7") {
                    checkInventory("7");
               }
               if (userResponse.item === "8") {
                    checkInventory("8");
               }
               if (userResponse.item === "9") {
                    checkInventory("9");
               }
               if (userResponse.item === "10") {
                    checkInventory("10");
               }
               if (userResponse.item === "11") {
                    checkInventory("11");
               }

          });



     }

     function makeSale(id, quanity, price) {
          inquirer.prompt([{
               name: "quanity",
               type: "input",
               message: "Please enter the number of items you'd like to purchase?"


          }]).then(function(userResponse2) {
               var total = price * userResponse2.quanity;
               var quanity2 = quanity - userResponse2.quanity;
               updateInventory(id, quanity2);
               console.log("\tThanks for your purchase.\nReceipt:\nYour total is:\t$" + total);
               setTimeout(function() { queryAllProducts(); }, 2500);
          });
     }

     // update inventory  in mySql db 
     function updateInventory(id, quanity2) {
          connection.query(
               "UPDATE products SET ? WHERE ?", [{
                    stock_quanity: quanity2
               }, {
                    id: id
               }],
               function(err, res) {
                    console.log(res.affectedRows + "updated!\n");

               }
          );
     }


     // query db and check if user selection is currently in stock 
     function checkInventory(id) {

          connection.query("SELECT * FROM products WHERE id=?", [id], function(err, res) {
               var quanity;
               var price;

               for (var i = 0; i < res.length; i++) {

                    if (res[i].stock_quanity >= 1) {
                         price = res[i].price;

                         quanity = res[i].stock_quanity;


                         console.log("id: " + res[i].id + " | " + res[i].product_name + " |  $" + res[i].price);
                    }
                    makeSale(id, quanity, price);
               }
          });
     }

function timer(){
     setTimeout(function() { promptUser(); }, 2500);
	
}


}
