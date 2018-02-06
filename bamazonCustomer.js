var mysql      = require('mysql');
var inquirer     = require('inquirer');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  port	   : 3306,
  database : 'bamazon'
});

var inputtedId = [];
var prodName = [];
var deptName = [];
var pricing = [];
var inStock = [];



connection.connect(function(err) {
  if (err) throw err;
  showAllData();
  // connection.end();
});


function showAllData() {
 connection.query("SELECT * FROM products", function(error, results) {
   if(error) throw error;
        for (var i = 0; i < results.length; i++) {
          console.log(
            "Id: " +
              results[i].id +
              " || Product: " +
              results[i].product_name +
              " || Department: " +
              results[i].department_name +
              " || Price: " +
              results[i].price +
              " || Stock: " +
              results[i].stock_quantity              
          );
        };
        userPrompt1();
      });
};

function userPrompt1() {
  inquirer
    .prompt({
      name: "ids",
      type: "input",
      message: "Enter the ID of the item you want: "
    })
    .then(function(answer) {
      connection.query("SELECT * FROM products", function(error, results){
        for (var i = 0; i < results.length; i++){
          if (answer.ids == results[i].id){
            inputtedId.push(results[i].id);
            prodName.push(results[i].product_name);
            deptName.push(results[i].department_name);
            pricing.push(results[i].price);
            inStock.push(results[i].stock_quantity);
          }
        }
          console.log(
            "Id: " +
              inputtedId +
              " || Product: " +
              prodName +
              " || Department: " +
              deptName +
              " || Price: " +
              pricing +
              " || Stock: " +
              inStock              
          );
          userPrompt2();
      }) 
    });
};
     
function userPrompt2() {
  inquirer
    .prompt({
      name: "quantity",
      type: "input",
      message: "How many "+prodName+" do you want to buy? "
    })
    .then(function(answer) {
        var newQuant = 0;
        var quantWanted = answer;
        var updatedQuant = inStock - quantWanted;
        newQuant += updatedQuant
      connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?", [newQuant, inputtedId], function(error, results){
      })

    });
}; 



