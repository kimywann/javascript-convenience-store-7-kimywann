import { Console } from "@woowacourse/mission-utils";
import InputView from "./view/InputView.js";
import OutputView from "./view/OutputView.js";
import Store from "./Controller/Store.js";

class App {
  async run() {
    this.printWelcomeMessage();
    const purchaseItems = await this.getPurchaseItems();
    if (!this.isStockAvailable(purchaseItems)) return;

    const receiptItems = this.calculateFinalPrices(purchaseItems);
    const { totalAmount, promotionDiscount, totalQuantity } = this.calculateTotalAmount(receiptItems);

    await this.printReceiptDetails(receiptItems, totalAmount, promotionDiscount, totalQuantity);
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
    return InputView.readItem();  // 불필요한 await 제거
  }

  isStockAvailable(purchaseItems) {
    try {
      this.checkItemQuantity(purchaseItems); // 재고 수량 체크
      return true;
    } catch (error) {
      Console.print(error.message);
      return false;
    }
  }

  checkItemQuantity(purchaseItems) {
    purchaseItems.forEach(({ name, quantity }) => {
      Store.ExceedItemQuantity(name, quantity); // 재고 초과 여부 체크
    });
  }

  calculateFinalPrices(purchaseItems) {
    return purchaseItems.map(item => this.processPurchaseItem(item));
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
    return receiptItems.reduce((acc, { totalPrice, quantity, promotionApplied, name }) => {
      acc.totalAmount += totalPrice;
      acc.totalQuantity += quantity;
      acc.promotionDiscount += this.calculateDiscountForItem(promotionApplied, quantity, name);
      return acc;
    }, { totalAmount: 0, promotionDiscount: 0, totalQuantity: 0 });
  }

  calculateDiscountForItem(promotionApplied, quantity, name) {
    if (promotionApplied === "없음") return 0;
    const product = Store.findItemByName(name);
    return this.calculatePromotionDiscount(promotionApplied, quantity, product);
  }

  calculatePromotionDiscount(promotionApplied, quantity, product) {
    if (promotionApplied === "MD추천상품" || promotionApplied === "반짝할인") {
      const freeItems = Math.floor(quantity / 2);  // 2개 구매 시 1개 무료
      return freeItems * product.price;
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
    OutputView.printReceipt(receiptItems, totalAmount, promotionDiscount, membershipDiscount, finalAmount, totalQuantity);
    OutputView.printGiftItems(receiptItems);
  }
}

export default App;