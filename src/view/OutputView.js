import { Console } from '@woowacourse/mission-utils';
import Store from '../Controller/Store.js';

const OutputView = {
    printItemList() {
        Store.itemList.forEach((product) => {
            const { name, price, quantity, promotion } = product;
            const quantityText = this.getQuantityText(quantity);
            const promotionText = this.getPromotionText(promotion, quantityText);

            const output = this.formatItemOutput(name, price, quantityText, promotionText);
            Console.print(output);
        });
    },

    getQuantityText(quantity) {
        if (quantity === '재고 없음' || quantity === 0) {
            return '재고 없음';
        }
        return `${quantity}개`;
    },

    getPromotionText(promotion, quantityText) {
        if (quantityText === '재고 없음') {
            return '';
        }
        return promotion || '';
    },

    formatItemOutput(name, price, quantityText, promotionText) {
        return `- ${name} ${price.toLocaleString()}원 ${quantityText} ${promotionText}`;
    },

    printReceipt(products, totalAmount, promotionDiscount, membershipDiscount, finalAmount, totalQuantity) {
        this.printReceiptHeader();
        this.printProductInfo(products); // 상품 정보 출력
        this.printGiftItems(products); // 증정 상품 정보 출력
        this.printReceiptFooter(totalAmount, promotionDiscount, membershipDiscount, finalAmount, totalQuantity); // 영수증 하단 출력
    },

    printReceiptHeader() {
        Console.print("==============W 편의점================");
        Console.print("상품명\t\t수량\t\t금액");
    },

    printProductInfo(receiptItems) {
        receiptItems.forEach((product) => {
            if (product.name && product.quantity && product.totalPrice) {
                const totalItemPrice = Store.findItemByName(product.name).price * product.quantity;
                Console.print(
                    `${product.name.padEnd(12)}${product.quantity.toString().padEnd(12)}\t${totalItemPrice.toLocaleString()}`
                );
            }
        });
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

    printReceiptFooter(totalAmount, promotionDiscount, membershipDiscount, finalAmount, totalQuantity) {
        Console.print("=====================================");
        Console.print(`총구매액\t${totalQuantity}\t\t${totalAmount.toLocaleString()}`);
        Console.print(`행사할인\t\t\t-${promotionDiscount.toLocaleString()}`);
        this.printMembershipDiscount(totalAmount, membershipDiscount);
        Console.print(`내실돈\t\t\t\t${finalAmount.toLocaleString()}`);
    },

    printMembershipDiscount(totalAmount, membershipDiscount) {
        let discount = 0;
        if (membershipDiscount === 'Y') {
            discount = 0.3 * totalAmount;
            if (discount > 8000) {
                discount = 8000;
            }
        }
        Console.print(`멤버십할인\t\t\t-${discount.toLocaleString()}`);
    }
}
export default OutputView;