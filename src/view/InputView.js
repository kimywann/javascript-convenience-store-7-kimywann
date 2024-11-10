import { Console } from '@woowacourse/mission-utils';
import Store from '../Controller/Store.js';

const InputView = {
    async readItem() {
        const input = await Console.readLineAsync("\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n");
        const productArray = input.replace(/\[|\]/g, "").split(",");

        const printItems = Store.getProductsWithTotalPrice(productArray);
        return printItems;
    },

    async readMemberShip() {
            const memberShipInput = await Console.readLineAsync("멤버십 할인을 받으시겠습니까? (Y/N)\n");
            return memberShipInput
    }
}
export default InputView;