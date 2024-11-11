import { Console } from "@woowacourse/mission-utils";
import InputView from "./view/InputView.js";
import OutputView from "./view/OutputView.js";
import Store from "./Controller/Store.js";

class App {
  async run() {
    await this.processSingleTransaction();
    const continueShopping = await this.askForMorePurchases();

    if (!continueShopping) {
      return; // 프로그램 종료
    }
    await this.run();
  }

  async processSingleTransaction() {
    this.printWelcomeMessage();
    const purchaseItems = await this.getPurchaseItems();

    if (!this.isStockAvailable(purchaseItems)) {
      return;
    }

    const receiptItems = this.calculateFinalPrices(purchaseItems);
    const { totalAmount, promotionDiscount, totalQuantity } = this.calculateTotalAmount(receiptItems);

    await this.printReceiptDetails(receiptItems, totalAmount, promotionDiscount, totalQuantity);
  }

  async askForMorePurchases() {
    const answer = await Console.readLineAsync("\n감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n");
    return answer.toUpperCase() === 'Y';
  }

  async printReceiptDetails(receiptItems, totalAmount, promotionDiscount, totalQuantity) {
    this.deductStock(receiptItems);
    const membershipDiscount = await this.getMembershipDiscount();
    const finalAmount = this.calculateFinalAmount(totalAmount, promotionDiscount, membershipDiscount);
    this.printReceipt(receiptItems, totalAmount, promotionDiscount, membershipDiscount, finalAmount, totalQuantity);
  }

  printWelcomeMessage() {
    Console.print("안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n");
    OutputView.printItemList();
  }

  async getPurchaseItems() {
    return InputView.readItem();
  }

  isStockAvailable(purchaseItems) {
    try {
      this.checkItemQuantity(purchaseItems);
      return true;
    } catch (error) {
      Console.print(error.message);
      return false;
    }
  }

  checkItemQuantity(purchaseItems) {
    purchaseItems.forEach(({ name, quantity }) => {
      Store.ExceedItemQuantity(name, quantity);
    });
  }

  calculateFinalPrices(purchaseItems) {
    return purchaseItems.map(item => {
      const product = Store.findItemByName(item.name);
      const promotion = Store.promotions.find(promo => promo.name === product.promotion);

      let promotionApplied = "없음";
      if (promotion && Store.isPromotionActive(promotion)) {
        promotionApplied = product.promotion;
      }

      const totalPrice = Store.calculateTotalPrice(item.name, item.quantity);

      return this.createReceiptItem(item.name, item.quantity, totalPrice, promotionApplied);
    });
  }

  processPurchaseItem({ name, quantity }) {
    const product = Store.findItemByName(name);
    const totalPrice = this.calculateTotalPrice(product, quantity);
    const promotionApplied = this.getPromotionApplied(product);

    return this.createReceiptItem(name, quantity, totalPrice, promotionApplied);
  }

  calculateTotalPrice(product, quantity) {
    return product.price * quantity;
  }

  getPromotionApplied(product) {
    const promotion = Store.promotions.find(promo => promo.name === product.promotion);
    if (promotion) {
      return promotion.name;
    }
    return "없음";
  }

  createReceiptItem(name, quantity, totalPrice, promotionApplied) {
    return {
      name,
      quantity,
      totalPrice,
      promotionApplied
    };
  }

  calculateTotalAmount(receiptItems) {
    return receiptItems.reduce((acc, { quantity, promotionApplied, name }) => {
      const basePrice = Store.findItemByName(name).price * quantity;
      acc.totalAmount += basePrice;
      acc.totalQuantity += quantity;
      acc.promotionDiscount += this.calculateDiscountForItem(promotionApplied, quantity, name);
      return acc;
    }, { totalAmount: 0, promotionDiscount: 0, totalQuantity: 0 });
  }

  calculateDiscountForItem(promotionApplied, quantity, name) {
    if (promotionApplied === "없음") return 0;

    const product = Store.findItemByName(name);
    const promotion = Store.promotions.find(promo => promo.name === promotionApplied);
    if (!promotion || !Store.isPromotionActive(promotion)) {
      return 0;
    }
    return this.calculatePromotionDiscount(promotion, quantity, product);
  }

  calculateMdOrSpecialDiscount(quantity, product) {
    const freeItems = Math.floor(quantity / 2);
    return freeItems * product.price;
  }

  calculateCarbonatedDiscount(quantity, product) {
    const freeItems = Math.floor(quantity / 3);
    return freeItems * product.price;
  }

  calculatePromotionDiscount(promotion, quantity, product) {
    if (promotion.name === "MD추천상품" || promotion.name === "반짝할인") {
      return this.calculateMdOrSpecialDiscount(quantity, product);
    }
    if (promotion.name === "탄산2+1") {
      return this.calculateCarbonatedDiscount(quantity, product);
    }
    return 0;
  }

  deductStock(receiptItems) {
    receiptItems.forEach(({ name, quantity }) => {
      Store.deductQuantity(name, quantity);
    });
  }

  async getMembershipDiscount() {
    return InputView.readMemberShip();
  }

  calculateFinalAmount(totalAmount, promotionDiscount, membershipDiscount) {
    const amountAfterPromotion = totalAmount - promotionDiscount;
    const membershipDiscountAmount = this.calculateMembershipDiscount(amountAfterPromotion, membershipDiscount);
    return amountAfterPromotion - membershipDiscountAmount;
  }

  calculateMembershipDiscount(amount, membershipDiscount) {
    if (membershipDiscount !== 'Y') {
      return 0;
    }
    const discount = 0.30 * amount;
    if (discount > 8000) {
      return 8000;
    }
    return discount;
  }

  printReceipt(receiptItems, totalAmount, promotionDiscount, membershipDiscount, finalAmount, totalQuantity) {
    OutputView.printReceiptHeader();
    OutputView.printProductInfo(receiptItems);
    OutputView.printGiftItems(receiptItems);
    OutputView.printReceiptFooter(totalAmount, promotionDiscount, membershipDiscount, finalAmount, totalQuantity);
  }
}

export default App;