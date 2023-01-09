import { AddCollateral as AddCollateralEvent, Borrow as PoolBorrowEvent, CollateralPurchased, Deposit, InterestAdded, NewCollateralAdded, RemoveCollateral as RemoveCollateralEvent, Withdraw } from "../../generated/Controller/PoolInstrument"
import { PoolInstrument, PoolCollateral } from "../../generated/schema"
import { PoolInstrument as PoolInstrumentContract, Withdraw as PoolWithdrawEvent } from "../../generated/Controller/PoolInstrument";
import { ERC20 as ERC20Contract } from "../../generated/Controller/ERC20"
import { ERC721 as ERC721Contract } from "../../generated/Controller/ERC721"
import { dataSource, BigInt } from "@graphprotocol/graph-ts";
import { ADDRESS_ZERO, BI_18, SECONDS_PER_YEAR, ZERO_BD } from "../utils/constants";
import { convertToDecimal } from "../utils/index";
import { Repay as PoolRepayEvent} from "../../generated/Controller/PoolInstrument";


export function handleAddCollateral(event: AddCollateralEvent): void {
    const pool = PoolInstrument.load(dataSource.address().toHexString())
    if (pool) {
        let _id = pool.id.concat("-").concat(event.params.collateral.toHexString()).concat("-").concat(event.params.tokenId.toString());
        let poolCollateral = PoolCollateral.load(_id)
        if (poolCollateral) {
            if (poolCollateral.isERC20) {
                poolCollateral.totalSupplied = poolCollateral.totalSupplied.plus(convertToDecimal(event.params.amount, BI_18))
            } else {
                poolCollateral.owner = event.params.borrower.toHexString()
            }
            poolCollateral.save()
        }
    }
}

export function handleRemoveCollateral(event: RemoveCollateralEvent): void {
    const pool = PoolInstrument.load(dataSource.address().toHexString())
    if (pool) {
        let _id = pool.id.concat("-").concat(event.params.collateral.toHexString()).concat("-").concat(event.params.tokenId.toString());
        let poolCollateral = PoolCollateral.load(_id)
        if (poolCollateral) {
            if (poolCollateral.isERC20) {
                poolCollateral.totalSupplied = poolCollateral.totalSupplied.minus(convertToDecimal(event.params.amount, BI_18))
            } else {
                poolCollateral.owner = event.params.borrower.toHexString()
            }
            poolCollateral.save()
        }
    }
}

export function handleBorrow(event: PoolBorrowEvent): void {
    const pool = PoolInstrument.load(dataSource.address().toHexString())
    if (pool) {
        pool.totalBorrowAssets = pool.totalBorrowAssets.plus(convertToDecimal(event.params._amount, BI_18))
        pool.totalBorrowShares = pool.totalBorrowShares.plus(convertToDecimal(event.params._shares, BI_18))
        pool.totalAvailableAssets = pool.totalAvailableAssets.plus(convertToDecimal(event.params._amount, BI_18))
        pool.save()
    }
}

export function handleDeposit(event: Deposit): void {
    const pool = PoolInstrument.load(dataSource.address().toHexString())
    const poolContract = PoolInstrumentContract.bind(dataSource.address())
    if (pool) {
        pool.totalSupplyShares = convertToDecimal(poolContract.totalSupply(), BI_18);
        pool.totalSupplyAssets = convertToDecimal(poolContract.totalAssets(), BI_18);
        pool.totalAvailableAssets = convertToDecimal(poolContract.totalAssetAvailable(), BI_18);
        pool.save()
    }
}

export function handleInterestAdded(event: InterestAdded): void {
    const pool = PoolInstrument.load(dataSource.address().toHexString())
    if (pool) {
        pool.borrowAPR = convertToDecimal(event.params.newRate, BI_18).times(SECONDS_PER_YEAR)
        pool.totalAvailableAssets = pool.totalAvailableAssets.plus(convertToDecimal(event.params.interestEarned, BI_18))
        pool.totalSupplyAssets = pool.totalSupplyAssets.plus(convertToDecimal(event.params.interestEarned, BI_18))
        pool.totalBorrowAssets = pool.totalBorrowAssets.plus(convertToDecimal(event.params.interestEarned, BI_18))
        pool.save()
    }
}

export function handleRepay(event: PoolRepayEvent): void {
    const pool = PoolInstrument.load(dataSource.address().toHexString())

    if (pool) {
        pool.totalBorrowAssets = pool.totalBorrowAssets.minus(convertToDecimal(event.params.amount, BI_18))
        pool.totalBorrowShares = pool.totalBorrowShares.minus(convertToDecimal(event.params.shares, BI_18))
        pool.save()
    }
}

export function handleWithdraw(event: Withdraw): void {
    const pool = PoolInstrument.load(dataSource.address().toHexString())
    const poolContract = PoolInstrumentContract.bind(dataSource.address())
    if (pool) {
        pool.totalSupplyShares = pool.totalSupplyShares.minus(convertToDecimal(event.params.shares, BI_18))
        pool.totalSupplyAssets = pool.totalSupplyAssets.minus(convertToDecimal(event.params.assets, BI_18))
        pool.totalAvailableAssets = convertToDecimal(poolContract.totalAssetAvailable(), BI_18);
        pool.save()
    }
}

export function handleNewCollateralAdded(event: NewCollateralAdded): void {

    let _id = dataSource.address().toHexString().concat("-").concat(event.params.collateral.toHexString()).concat("-").concat(event.params.tokenId.toString());
    let poolCollateral = new PoolCollateral(_id)

    poolCollateral.pool = dataSource.address().toHexString()
    poolCollateral.maxAmount = convertToDecimal(event.params.maxAmount, BI_18)
    poolCollateral.totalSupplied = ZERO_BD
    poolCollateral.borrowAmount = convertToDecimal(event.params.maxBorrowAmount, BI_18)
    
    if (event.params.isERC20) {
        let contract = ERC20Contract.bind(event.params.collateral)
        poolCollateral.name = contract.name()
        poolCollateral.symbol = contract.symbol()
        poolCollateral.decimals = BigInt.fromI32(contract.decimals())
        poolCollateral.isERC20 = true
        poolCollateral.owner = ADDRESS_ZERO
    } else {
        let contract = ERC721Contract.bind(event.params.collateral)
        poolCollateral.name = contract.name()
        poolCollateral.symbol = contract.symbol()
        poolCollateral.isERC20 = false
        poolCollateral.owner = ADDRESS_ZERO
    }
    poolCollateral.save()
}