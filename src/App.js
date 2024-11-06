import { Console } from "@woowacourse/mission-utils";
import InputView from "./view/InputView.js";
import OutputView from "./view/OutputView.js";

class App {
  async run() {
    Console.print("안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n")
    OutputView.printItemList();
    const purchaseItems = await InputView.readItem(); 
    OutputView.printReceipt(purchaseItems);
  }
}

export default App;
