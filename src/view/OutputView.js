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

    printReceipt(products, totalAmount, promotionDiscount, membershipDiscount, finalAmount, totalQuantity) {
    Console.print("==============W 편의점================");
    Console.print("상품명\t\t수량\t\t금액");

    products.forEach((product) => {
        Console.print(`${product.name}\t\t${product.quantity}\t\t${product.totalPrice}`);
    });

    Console.print("=====================================");
    Console.print(`총구매액\t${totalQuantity}\t${totalAmount.toLocaleString()}원`);
    Console.print(`행사할인\t\t\t-${promotionDiscount.toLocaleString()}원`);

    const membershipDiscountText = membershipDiscount === 'Y' ? `-${(0.05 * totalAmount).toLocaleString()}원` : '-0원';
    Console.print(`멤버십할인\t\t\t${membershipDiscountText}`);
    Console.print(`내실돈\t\t\t${finalAmount.toLocaleString()}원`);
    },

    printGiftItems(products) {
        const giftItems = Store.calculateGiftItems(products.map(product => `${product.name}-${product.quantity}`));
        
        if (giftItems.length > 0) {
            Console.print("==============증     정===============");
            giftItems.forEach((gift) => {
            Console.print(`${gift.name}\t\t${gift.quantity}`);
            });
        }
    },
}
export default OutputView;