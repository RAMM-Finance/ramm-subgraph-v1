import { InstrumentDeposit as InstrumentDepositEvent, InstrumentHarvest, InstrumentRemoved, InstrumentTrusted, InstrumentWithdrawal as InstrumentWithdrawal} from "../../generated/Controller/Vault"

import { SyntheticZCBPool as SyntheticZCBPoolContract } from "../../generated/Controller/SyntheticZCBPool"
import { CreditlineInstrument as CreditlineContract} from "../../generated/Controller/CreditlineInstrument"
import { Instrument as GeneralInstrumentContract} from "../../generated/Controller/Instrument"
import { Deposit, PoolInstrument as PoolInstrumentContract, Withdraw } from "../../generated/Controller/PoolInstrument"
import { ERC20 as ERC20Contract } from "../../generated/Controller/ERC20"
import { ERC721 as ERC721Contract } from "../../generated/Controller/ERC721"
import { Vault as VaultContract } from "../../generated/Controller/Vault"
import { dataSource, store } from "@graphprotocol/graph-ts"

import {Address, BigInt} from "@graphprotocol/graph-ts"

import {convertToDecimal} from "../utils/index"
import { BI_18, ZERO_BD, marketManagerContract, ZERO_BI, controllerContract} from "../utils/constants"

import { Vault, Market, CreditlineInstrument, PoolInstrument, GeneralInstrument} from "../../generated/schema"

let vaultContract = VaultContract.bind(dataSource.address())

export function handleInstrumentDeposit(event: InstrumentDepositEvent):void {
    let vault = Vault.load(event.address.toHexString())

    let market = Market.load(event.params.marketId.toString())
    
    if (market && vault) {
        vault.totalInstrumentHoldings = vault.totalInstrumentHoldings.plus(convertToDecimal(event.params.amount, BI_18))
        let underlying = ERC20Contract.bind(Address.fromString(vault.underlying))

        if (market.instrumentType === "Creditline") {
            let instrument = CreditlineInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(underlying.balanceOf(Address.fromString(instrument.id)), BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }
    
                instrument.save()
            }
        } else if (market.instrumentType === "Pool") {
            let instrument = PoolInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(underlying.balanceOf(Address.fromString(instrument.id)), BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }
    
                instrument.save()
            }
        } else if (market.instrumentType === "General") {
            let instrument = GeneralInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(underlying.balanceOf(Address.fromString(instrument.id)), BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }

                instrument.save()
            }
        }
        
        vault.save()
    }
}

export function handleInstrumentWithdrawal(event: InstrumentWithdrawal): void {
    let vault = Vault.load(event.address.toHexString())
    let market = Market.load(event.params.marketId.toString())

    if (market && vault) {
        vault.totalInstrumentHoldings = vault.totalInstrumentHoldings.minus(convertToDecimal(event.params.amount, BI_18))
        let underlying = ERC20Contract.bind(Address.fromString(vault.underlying))
        
        if (market.instrumentType == "CREDITLINE") {
            let instrument = CreditlineInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(underlying.balanceOf(Address.fromString(instrument.id)), BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }
                instrument.save()
            }
        } else if (market.instrumentType == "POOL") {
            let instrument = PoolInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(underlying.balanceOf(Address.fromString(instrument.id)), BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }
                instrument.save()
            }
        } else if (market.instrumentType == "GENERAL") {
            let instrument = GeneralInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(underlying.balanceOf(Address.fromString(instrument.id)), BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }
                instrument.save()
            }
        }
        
        vault.save()
    }
}

// export function handleInstrumentResolve(event: InstrumentResolve): void {
//     let vault = Vault.load(event.address.toHexString())
//     let market = Market.load(event.params.marketId.toString())

//     if (market) {
//         market.prematureResolve = event.params.prematureResolve
//         market.extraGain = convertToDecimal(event.params.extraGain, BI_18)
//         market.totalLoss = convertToDecimal(event.params.totalLoss, BI_18)
//         market.atLoss = event.params.atLoss
//         market.save()
//     }
// }

export function handleInstrumentTrusted(event: InstrumentTrusted): void {
    let vault = Vault.load(event.address.toHexString())
    let market = Market.load(event.params.marketId.toString())

    if (market && vault) {
        if (market.instrumentType === "CREDITLINE") {
            let creditline = CreditlineInstrument.load(event.params.instrument.toHexString())
            if (creditline) {
                creditline.principal = convertToDecimal(event.params.principal, BI_18)
                creditline.expectedYield = convertToDecimal(event.params.expectedYield, BI_18)
                creditline.maturityDate = event.params.maturityDate

                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(creditline.market))
                if (!result.reverted) {
                    creditline.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    creditline.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    creditline.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    creditline.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }

                creditline.save()
            }
        } else if (market.instrumentType === "GENERAL") {
            let generalInstrument = GeneralInstrument.load(event.params.instrument.toHexString())
            if (generalInstrument) {
                generalInstrument.principal = convertToDecimal(event.params.principal, BI_18)
                generalInstrument.expectedYield = convertToDecimal(event.params.expectedYield, BI_18)
                generalInstrument.maturityDate = event.params.maturityDate
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(generalInstrument.market))
                if (!result.reverted) {
                    generalInstrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    generalInstrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    generalInstrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    generalInstrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }
                generalInstrument.save()
            }
        }
    }
}

export function handleInstrumentHarvest(event: InstrumentHarvest): void {
    let instrumentData = vaultContract.getInstrumentData(event.params.instrument)

    let vault = Vault.load(dataSource.address().toHexString())
    if (vault) {
        vault.totalInstrumentHoldings = convertToDecimal(event.params.totalInstrumentHoldings, BI_18)
        vault.save()
    }
    if (instrumentData.instrument_type == 0) {
        let instrument = CreditlineInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(event.params.instrument_balance, BI_18)
                
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }
                instrument.save()
            }
    } else if (instrumentData.instrument_type == 2) {
        let instrument = PoolInstrument.load(event.params.instrument.toHexString())
            if (instrument) {
                instrument.underlyingBalance = convertToDecimal(event.params.instrument_balance, BI_18)
                let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
                if (!result.reverted) {
                    instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                    instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                    instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                    instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
                }
                instrument.save()
            }
    } else {
        let instrument = GeneralInstrument.load(event.params.instrument.toHexString())
        if (instrument) {
            instrument.underlyingBalance = convertToDecimal(event.params.instrument_balance, BI_18)
            let result = controllerContract.try_getInstrumentSnapShot(BigInt.fromString(instrument.market))
            if (!result.reverted) {
                instrument.exposurePercentage = convertToDecimal(result.value.getExposurePercentage(), BI_18)
                instrument.seniorAPR = convertToDecimal(result.value.getSeniorAPR(), BI_18)
                instrument.managerStake = convertToDecimal(result.value.getManagerStake(), BI_18)
                instrument.approvalPrice = convertToDecimal(result.value.getApprovalPrice(), BI_18)
            }
            instrument.save()
        }
    }

}

export function handleInstrumentRemoved(event: InstrumentRemoved): void {
    let market = Market.load(event.params.marketId.toString())
    if (market) {
        // based on the market.instrumetType, we can remove the instrument from the correct entity
        if (market.instrumentType === "CREDITLINE") {
            let creditline = CreditlineInstrument.load(event.params.instrumentAddress.toHexString())
            if (creditline && market.creditlineInstrument) {
                store.remove("CreditlineInstrument", creditline.id)
                market.creditlineInstrument = null
            }
        } else if (market.instrumentType === "POOL") {
            let pool = PoolInstrument.load(event.params.instrumentAddress.toHexString())
            if (pool && market.poolInstrument) {
                store.remove("PoolInstrument", pool.id)
                market.poolInstrument = null
            }
        } else if (market.instrumentType === "GENERAL") {
            let general = GeneralInstrument.load(event.params.instrumentAddress.toHexString())
            if (general && market.generalInstrument) {
                store.remove("GeneralInstrument", general.id)
                market.generalInstrument = null
            }
        }
        market.save()

        let vault = Vault.load(market.vault)
        if (vault) {
            vault.instrumentCount = vault.instrumentCount.minus(BigInt.fromI32(1))
            vault.save()
        }
    }
    
}

// export function handleMaturityDateSet(event: MaturityDateSet): void {
//     // get the market from the marketId field in the event, then get the instrument from the market based on the instrumentType, then update the maturityDate field of that instrument
//     let market = Market.load(event.params.marketId.toString())
//     if (market) {
//         switch (market.instrumentType) {
//             case "Creditline":
//                 let creditline = CreditlineInstrument.load(event.params.instrument.toHexString())
//                 if (creditline) {
//                     creditline.maturityDate = event.params.maturityDate
//                     creditline.save()
//                 }
//                 break
//             case "General":
//                 let general = GeneralInstrument.load(event.params.instrument.toHexString())
//                 if (general) {
//                     general.maturityDate = event.params.maturityDate
//                     general.save()
//                 }
//                 break
//         }
//     }
// }

export function handleDeposit(event: Deposit): void {
    let vault = Vault.load(dataSource.address().toHexString())

    if (vault) {
        vault.totalAssets = convertToDecimal(vaultContract.totalAssets(), BI_18)
        vault.totalSupply = convertToDecimal(vaultContract.totalSupply(), BI_18)
        vault.save()
    }
}

export function handleWithdraw(event: Withdraw): void {
    let vault = Vault.load(dataSource.address().toHexString())

    if (vault) {
        vault.totalAssets = convertToDecimal(vaultContract.totalAssets(), BI_18)
        vault.totalSupply = convertToDecimal(vaultContract.totalSupply(), BI_18)
        vault.save()
    }
}
