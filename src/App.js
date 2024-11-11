import { Console } from "@woowacourse/mission-utils";
import InputView from "./view/InputView.js";
import OutputView from "./view/OutputView.js";
import Store from "./Controller/Store.js";

class App {
  async run() {
    Console.print("안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n");
    OutputView.printItemList();

    const purchaseItems = await InputView.readItem(); 

    // 재고 수량 초과 여부 확인
    try {
      purchaseItems.forEach(({ name, quantity }) => {
        Store.ExceedItemQuantity(name, quantity); // 구매하려는 아이템에 대해 재고 수량 체크
      });
    } catch (error) {
      Console.print(error.message);
      return; // 예외가 발생하면 더 이상 진행하지 않고 종료
    }

    // 각 상품의 최종 가격 및 프로모션 혜택을 계산합니다
    const receiptItems = this.calculateFinalPrices(purchaseItems);

    // 총 구매 금액, 행사할인, 멤버십 할인을 계산
    const { totalAmount, promotionDiscount, totalQuantity } = this.calculateTotalAmount(receiptItems);

    // 재고를 차감합니다
    receiptItems.forEach(({ name, quantity }) => {
      Store.deductQuantity(name, quantity);
    });

    // 멤버십 할인 여부를 확인
    const membershipDiscount = await InputView.readMemberShip();

    // 최종 금액 계산
    const finalAmount = this.calculateFinalAmount(totalAmount, promotionDiscount, membershipDiscount);

    // 영수증 출력
    OutputView.printReceipt(receiptItems, totalAmount, promotionDiscount, membershipDiscount, finalAmount, totalQuantity);
    OutputView.printGiftItems(receiptItems);
  }

  calculateFinalPrices(purchaseItems) {
    return purchaseItems.map(({ name, quantity }) => {
      const product = Store.findItemByName(name);
      const totalPrice = product.price * quantity; // 직접 계산
      const promotion = Store.promotions.find(promo => promo.name === product.promotion);
      
      return {
        name,
        quantity,
        totalPrice,
        promotionApplied: promotion ? promotion.name : "없음"
      };
    });
  }

  calculateTotalAmount(receiptItems) {
    let totalAmount = 0;
    let promotionDiscount = 0;
    let totalQuantity = 0;

    receiptItems.forEach(({ name, quantity, totalPrice, promotionApplied }) => {
        totalAmount += totalPrice;
        totalQuantity += quantity;

        if (promotionApplied !== "없음") {
            const product = Store.findItemByName(name);
            const promotion = Store.promotions.find(promo => promo.name === product.promotion);

            // 1+1 프로모션 적용
            if (promotion && (promotion.name === "MD추천상품" || promotion.name === "반짝할인")) {
                // 2개 구매시 1개 무료 (1+1 프로모션)
                const freeItems = Math.floor(quantity / 2);  // 2개 구매시 1개 무료
                const discountAmount = freeItems * product.price;
                promotionDiscount += discountAmount;
            }
        }
    });

    return { totalAmount, promotionDiscount, totalQuantity };
}

  calculateFinalAmount(totalAmount, promotionDiscount, membershipDiscount) {
    // 프로모션 할인 후 남은 금액 계산
    const amountAfterPromotion = totalAmount - promotionDiscount;

    // 멤버십 할인 금액 계산
    let membershipDiscountAmount = 0;
    if (membershipDiscount === 'Y') {
      membershipDiscountAmount = 0.30 * amountAfterPromotion; // 30% 할인
      if (membershipDiscountAmount > 8000) {
        membershipDiscountAmount = 8000; // 최대 8,000원까지만 할인
      }
    }

    // 최종 금액 계산
    const finalAmount = amountAfterPromotion - membershipDiscountAmount;
    return finalAmount;
  }
}
export default App;