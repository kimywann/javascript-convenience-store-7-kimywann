import { Console } from '@woowacourse/mission-utils';
import Store from '../Controller/Store.js';

const OutputView = {
    printItemList() {
        Store.itemList.forEach((product) => {
            const { name, price, quantity, promotion } = product;

            let quantityText = '';
            if (quantity === '재고 없음' || quantity === 0) {
                quantityText = '재고 없음';
            } else {
                quantityText = `${quantity}개`;
            }

            let promotionText = '';
            if (promotion !== null) {
                promotionText = promotion;
            }

            if (quantityText === '재고 없음') {
                promotionText = '';
            }

            // 출력 형식
            const output = `- ${name} ${price.toLocaleString()}원 ${quantityText} ${promotionText}`;
            Console.print(output);
        });
    },

    printReceipt(products) {
        Console.print("==============W 편의점================");
        Console.print("상품명\t\t수량\t\t금액");

        products.forEach((product) => {
            Console.print(`${product.name}\t\t${product.quantity}\t\t${product.totalPrice}`);
        });
    }
}
export default OutputView;