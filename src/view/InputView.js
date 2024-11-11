import { Console } from '@woowacourse/mission-utils';
import Store from '../Controller/Store.js';

const InputView = {
    async readItem() {
        try {
            const input = await this.readPurchaseInput();
            const items = this.parseItems(input);
            return this.validateAndGetProducts(items);
        } catch (error) {
            Console.print(error.message);
            return this.readItem();
        }
    },

    async readMemberShip() {
        try {
            const input = await this.readMembershipInput();
            this.validateMembershipInput(input);
            return input;
        } catch (error) {
            Console.print(error.message);
            return this.readMemberShip();
        }
    },

    async readPurchaseInput() {
        return Console.readLineAsync("\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n");
    },

    async readMembershipInput() {
        return Console.readLineAsync("멤버십 할인을 받으시겠습니까? (Y/N)\n");
    },

    parseItems(input) {
        if (!this.isValidFormat(input)) {
            throw new Error("[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.");
        }
        return input.replace(/\[|\]/g, "").split(",");
    },

    isValidFormat(input) {
        const regex = /^\[[\w가-힣]+-\d+\](?:,\[[\w가-힣]+-\d+\])*$/;
        return regex.test(input);
    },

    validateAndGetProducts(items) {
        const products = items.map(item => this.parseProductItem(item));
        products.forEach(product => this.validateProduct(product));
        return Store.getProductsWithTotalPrice(products);
    },

    parseProductItem(item) {
        const [name, quantity] = item.trim().split("-");
        if (!name || !quantity) {
            throw new Error("[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.");
        }
        return {
            name,
            quantity: Number(quantity)
        };
    },

    validateProduct(product) {
        if (!Store.hasProduct(product.name)) {
            throw new Error("[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.");
        }
        if (Store.isExceedQuantity(product.name, product.quantity)) {
            throw new Error("[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.");
        }
    },

    isValidQuantity(quantity) {
        return Number.isInteger(quantity) && quantity > 0;
    },

    validateMembershipInput(input) {
        if (input !== 'Y' && input !== 'N') {
            throw new Error("[ERROR] 잘못된 입력입니다. Y 또는 N으로 입력해 주세요.");
        }
    }
};

export default InputView;