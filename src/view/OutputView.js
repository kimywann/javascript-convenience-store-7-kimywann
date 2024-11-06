import { Console } from '@woowacourse/mission-utils';
import StoreList from '../StoreList.js';

const OutputView = {
    printProducts() {
        StoreList.products.forEach((product) => {
            const { name, price, quantity, promotion } = product;
            const output = `- ${name} ${price.toLocaleString()}원 ${quantity}개 ${promotion}`;
            
            // TODO: 재고 없음 0 출력 
            Console.print(output);
        // ...
        })
    // ...
    }
}

export default OutputView;