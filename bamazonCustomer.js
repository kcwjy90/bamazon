//required "requires" and setting up database
var mysql = require("mysql"); 
var inquirer = require("inquirer")
var connection = mysql.createConnection({

  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",

  database: "bamazon"

});


//Checks for Connection
connection.connect(function (err) { 
  if (err) throw err;
  console.log("================ Please Proceed and Make a Purchase =================");
  displayProducts();
});


//Display what the products 
function displayProducts() { 

  connection.query("SELECT * FROM products", function (err, res) {
    console.log("=====================================================================");
    if (err) throw err;
    // Log all results of the SELECT statement
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + "|" + res[i].stock_quantity);
    }
    console.log("=====================================================================");
    userWants();


  })
};


//Inquire user for item name and quantity
function userWants() {
  inquirer
    .prompt([
      {
        name: "chooseId",
        type: "input",
        message: "What is the ID of the product you would like to buy?",
      },
      {
        name: "chooseQuant",
        type: "input",
        message: "How many of the selected item do you like to buy?"
      }

    ])
    .then(function (answer) {

      var itemWanted = answer.chooseId; // Storing the name of the selected item
      var numberWanted = answer.chooseQuant; // Storing the quantity of the selected item
      if (itemWanted < 1 || itemWanted > 10){
        console.log("Invalid ID. Please try again");
        userWants();
      } else {

      //checking to see if the selected item has enough stock. 
      var query = connection.query("SELECT * FROM products WHERE item_id=?", [itemWanted], function (err, res) {
        //When we DON'T have enough in stock
        if (res[0].stock_quantity < parseInt(numberWanted)) {
          console.log("=====================================================================");
          console.log("Insufficient quantity! Please try again");
          userWants();
        } else {
        //When we DO have enough in stock
        console.log("=====================================================================");
          console.log("Thank you very much for your purchase. Your order has been placed.");
          connection.query("UPDATE products SET ? WHERE ?", [
            {
              stock_quantity: res[0].stock_quantity - parseInt(numberWanted)
            },
            {
              item_id: itemWanted
            }

          ], function (err, result) {
            console.log("The total price for your item is $" + res[0].price * parseInt(numberWanted) + ". \nThank you for using Bamazon");
            console.log("=====================================================================");
            console.log("If you want to make your next purchase, simply press upper arrow key :)");

            connection.end();

          })
        }
      
      });
    };
    });

    

}; //end



// var productName;
// var productQuant;
// var productId; //id number user chooses



// connection.connect(function(err){
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId);
//     inqUser();
// });







// function inqUser() {

//   console.log("Selecting all products...\n");
//   connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;
//     // Log all results of the SELECT statement
//     for (var i = 0; i < res.length; i++) {
//       console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + "|" + res[i].stock_quantity);
//     }
//     console.log("-----------------------------------");
//     connection.end();

//     inquirer.prompt({
//         name: "chooseId",
//         type: "input",
//         message: "Which ID of the product would you like to buy?",
//       })
//       .then(function(answer) {
//         var inputID = answer
//         productName = res[inputID.chooseId - 1].product_name;

//         if (inputID.chooseId <= res.length && inputID != 0){
//           // console.log(res[answer.chooseId - 1].product_name);
//           // console.log(res.length);
//           console.log(inputID.chooseId);
//           console.log(productName)
//             inquirer.prompt({
//                 name: "chooseUnit",
//                 type: "input", 
//                 message: "How many units of the product would you like to buy?"
//             })
//             .then(function(answer) {
//                 var inputQuan = answer;
//                 productQuant = inputQuan.chooseUnit;
//                 productId = res[inputID.chooseId - 1];
//                 console.log(productId);

//                 var query = connection.query("SELECT * FROM products WHERE item_id=?", [inputID.chooseId], function(err, res) {
//                   console.log(productQuant);
//                   console.log(inputID.chooseId);


//                 if (productQuant <= productId.stock_quantity && productQuant != 0){

//                           if (productQuant === 1) {
//                             console.log("===========================================================================================");
//                             console.log("Thank you for your order. " + productQuant + " order of "+ productName + " has been placed.");
//                             console.log("The total price for your order is $" + productId.price * productQuant + " Thank you very much.")
//                             console.log("===========================================================================================");
//                             connection.query("UPDATE products SET ? WHERE ?", [
//                               {
//                                 stock_quantity: productId.stock_quantity - parseInt(productQuant)
//                             },
//                             {
//                               item_id: productName
//                             }

//                           ],function(err, result) {

//                             connection.end();

//                             })

//                           } else {
//                             console.log("===========================================================================================");
//                             console.log("Thank you for your order. " + productQuant + " orders of "+ productName + " have been placed.");
//                             console.log("The total price for your order is $" + productId.price * productQuant + " Thank you very much.")
//                             console.log("===========================================================================================");
//                             connection.query("UPDATE products SET ? WHERE ?", [
//                               {
//                                 stock_quantity: productId.stock_quantity - parseInt(productQuant)
//                             },
//                             {
//                               item_id: productName
//                             }

//                           ],function(err, result) {

//                             connection.end();

//                             })
//                           }
//                   } else {
//                     console.log("Insufficient quantity!");
//                   }

//                 });


//               });
//         } else {
//           console.log("Invalid ID");
//         }

//       });

//     });
//   };


// function updateProduct() {
//   var query = connection.query(
//     "UPDATE products SET ? WHERE ?",
//     [
//       {
//         stock_quantity: productQuant
//       },
//       {
//         product_name: productName
//       }
//     ],
//     function(err, res) {
//       console.log(res.affectedRows + " products updated!\n");
//       // Call deleteProduct AFTER the UPDATE completes
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// }



  // function updateProduct() {
  //   var query = connection.query(
  //     "UPDATE products SET ? WHERE ?",
  //     [
  //       {
  //         stock_quantity: productQuant
  //       },
  //       {
  //         product_name: productName
  //       }
  //     ],
  //     function(err, res) {
  //       console.log("products updated!\n");
  //       console.log(productQuant);y
  //       // Call deleteProduct AFTER the UPDATE completes
  //     }
  //   );

  //   // logs the actual query being run

  // }



