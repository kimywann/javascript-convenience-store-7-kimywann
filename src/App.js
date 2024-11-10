import { Console } from "@woowacourse/mission-utils";
import InputView from "./view/InputView.js";
import OutputView from "./view/OutputView.js";
import Store from "./Controller/Store.js";

class App {
  async run() {
    Console.print("안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n");
    OutputView.printItemList();

    const purchaseItems = await InputView.readItem(); 

    Store.ExceedItemQuantity(purchaseItems);

    // 각 상품의 최종 가격 및 프로모션 혜택을 계산합니다
    const receiptItems = this.calculateFinalPrices(purchaseItems);

    // 재고를 차감합니다
    receiptItems.forEach(({ name, quantity }) => {
      Store.deductQuantity(name, quantity);
    });

    // 영수증 출력
    OutputView.printReceipt(receiptItems);
    }

    // 각 상품의 최종 가격을 계산하는 함수
    calculateFinalPrices(purchaseItems) {
      return purchaseItems.map(({ name, quantity }) => {
        const totalPrice = Store.calculateTotalPrice(name, quantity);
        const promotion = Store.promotions.find(promo => promo.name === Store.findItemByName(name).promotion);
        
        return {
          name,
          quantity,
          totalPrice,
          promotionApplied: promotion ? promotion.name : "없음"
        };
      });
    }
}

export default App;
