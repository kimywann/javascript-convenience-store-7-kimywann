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
        products.forEach((product) => this.printProductInfo(product));
        this.printReceiptFooter(totalAmount, promotionDiscount, membershipDiscount, finalAmount, totalQuantity);
    },

    printReceiptHeader() {
        Console.print("==============W 편의점================");
        Console.print("상품명\t\t수량\t\t금액");
    },

    printProductInfo(product) {
        Console.print(`${product.name}\t\t${product.quantity}\t\t${product.totalPrice}`);
    },

    printReceiptFooter(totalAmount, promotionDiscount, membershipDiscount, finalAmount, totalQuantity) {
        Console.print("=====================================");
        Console.print(`총구매액\t${totalQuantity}\t${totalAmount.toLocaleString()}원`);
        Console.print(`행사할인\t\t\t-${promotionDiscount.toLocaleString()}원`);
        this.printMembershipDiscount(totalAmount, membershipDiscount);
        Console.print(`내실돈\t\t\t${finalAmount.toLocaleString()}원`);
    },

    printMembershipDiscount(totalAmount, membershipDiscount) {
        const discount = membershipDiscount === 'Y' ? 0.05 * totalAmount : 0;
        Console.print(`멤버십할인\t\t\t-${discount.toLocaleString()}원`);
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