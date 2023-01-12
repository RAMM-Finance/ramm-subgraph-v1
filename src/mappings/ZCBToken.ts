import { Address, dataSource } from "@graphprotocol/graph-ts";
import { ERC20 as ERC20Contract, Transfer } from "../../generated/Controller/ERC20";
import { SyntheticZCBPool as BondPoolContract } from "../../generated/Controller/SyntheticZCBPool";
import { BondPool, Market, ZCBToken } from "../../generated/schema";
import { convertToDecimal } from "../utils";
import { BI_18 } from "../utils/constants";

export function handleTransfer(event: Transfer):void {
    let zcbToken = ZCBToken.load(dataSource.address().toHexString());
    let contract = ERC20Contract.bind(dataSource.address());

    
    if (zcbToken) {
        zcbToken.totalSupply = convertToDecimal(contract.totalSupply(), BI_18)
        zcbToken.save();

        // update bond pool
        let market = Market.load(zcbToken.marketId);

        if (market) {
            let bondPool = BondPool.load(market.bondPool)
            if (bondPool) {
                let bondPoolContract = BondPoolContract.bind(Address.fromString(bondPool.id))
                bondPool.b = convertToDecimal(bondPoolContract.b(), BI_18)
                bondPool.longZCBPrice = convertToDecimal(bondPoolContract.getCurPrice(), BI_18)
                bondPool.discountedReserved = convertToDecimal(bondPoolContract.discountedReserves(), BI_18)
                bondPool.save()
            }
        }
    }
}