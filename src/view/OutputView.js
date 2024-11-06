import { Console } from '@woowacourse/mission-utils';
import StoreList from '../StoreList.js';

const OutputView = {
    productList() {
        StoreList.productsData.forEach((product) => {
            const { name, price, quantity, promotion } = product;
            const output = `- ${name} ${price.toLocaleString()}원 ${quantity}개 ${promotion}`;

            // TODO: 재고 없음 0 출력 
            Console.print(output);
        // ...
        })
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