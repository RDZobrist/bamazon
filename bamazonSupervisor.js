// dependicies
const inquirer = require('inquirer');
const mysql = require('mysql');
const term = require('terminal-kit').terminal;

const Table = require('cli-table');

// instantiate 
var table = new Table({
     head: ['department_id', 'department_name', 'Product Sales', 'Overhead Costs', 'Profit'],
     colWidths: [20,20,20,20,20]
});

console.log("hello");

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


function getCommand() {
     inquirer.prompt([{
          name: "view_dept_sales",
          type: "list",
          message: "What would you like to do?",
          choices: ["View sales by department", "Add a department"]
     }]).then(function(userResponse) {
          if (userResponse.view_dept_sales === "View sales by department") {
               table.push(
                    ['hello', 'hi', 'whats up', 'howdy','hola'], ['cya', 'goodbye', 'adios', 'peace-out','hasta-luaga']
               );
               console.log(table.toString());
          } else if (userResponse.view_dept_sales === "Add a department") {
               addDepartment();

          } else {
               term.red("------boo--------");
          }
     });



};


function viewSales() {
     connection.query("SELECT * FROM products", function(err, res) {

          for (var i = 0; i < res.length; i++) {


          }



          function queryProducts() {
               // query db and print all products in store to screen along with price and dept name


               console.log("id:" + res[i].id +
                    "\n   " + res[i].product_name +
                    " |  $" + res[i].price + " |  Quanity: " +
                    res[i].stock_quanity + " |  Dept:" +
                    res[i].department_name
               );


          }
          term.bold.yellow("-----------------------------------\n\n")
          setTimeout(function() { getCommand(); }, 3500);
     });
};

getCommand();



// table is an Array, so you can `push`, `unshift`, `splice` and friends
