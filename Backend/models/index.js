const mongoose = require("mongoose");
const uri = "mongodb+srv://nileshjha71:30RBzPKvItIU4Mmr@cluster0.jil4r.mongodb.net/Beverage_Marketplace?retryWrites=true&w=majority&appName=Cluster0";

// const uri = 'mongodb://localhost:27017/Beverages2'


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull connected to mongodb")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
    // mongoose.set('debug', true);

}

module.exports = { main };
