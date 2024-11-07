import Store from "./Store.js";

class Inventory {
    #name
    #quantity

    constructor(name, quantity) {
        this.name = name;
        this.quantity = quantity;
    }
    
    purchaseItem(name, quantity) {
        Store.deductQuantity(name, quantity);
    }
}

export default Inventory;